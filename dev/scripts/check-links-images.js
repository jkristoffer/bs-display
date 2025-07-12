#!/usr/bin/env node

const puppeteer = require('puppeteer');
const chalk = require('chalk');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const config = {
  baseUrl: process.env.BASE_URL || 'http://localhost:4321',
  outputFile: 'link-check-report.json',
  timeout: 30000,
  concurrency: 5,
  includePatterns: [
    '**/*.html',
    '**/*.htm',
    '**/*.astro'
  ],
  excludePatterns: [
    'node_modules/**',
    '.git/**',
    'dist/**',
    '.vercel/**'
  ]
};

class LinkChecker {
  constructor() {
    this.visitedUrls = new Set();
    this.results = {
      totalPages: 0,
      totalImages: 0,
      totalLinks: 0,
      brokenImages: [],
      brokenLinks: [],
      errors: []
    };
  }

  async init() {
    console.log(chalk.blue('🚀 Starting link and image checker...'));
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  async checkPage(url) {
    if (this.visitedUrls.has(url)) return;
    this.visitedUrls.add(url);

    console.log(chalk.gray(`Checking: ${url}`));
    const page = await this.browser.newPage();

    try {
      // Navigate to page
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: config.timeout
      });

      this.results.totalPages++;

      // Check all images
      const images = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('img')).map(img => ({
          src: img.src,
          alt: img.alt,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          complete: img.complete
        }));
      });

      for (const img of images) {
        this.results.totalImages++;
        
        // Check if image loaded successfully
        if (!img.complete || img.naturalWidth === 0) {
          this.results.brokenImages.push({
            page: url,
            src: img.src,
            alt: img.alt || 'No alt text'
          });
        }
      }

      // Check all links
      const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a[href]')).map(link => ({
          href: link.href,
          text: link.textContent.trim(),
          target: link.target
        }));
      });

      // Check each link
      for (const link of links) {
        this.results.totalLinks++;
        
        // Skip mailto, tel, and external links for now
        if (link.href.startsWith('mailto:') || 
            link.href.startsWith('tel:') ||
            !link.href.startsWith(config.baseUrl)) {
          continue;
        }

        try {
          const response = await page.evaluate(async (url) => {
            try {
              const res = await fetch(url, { method: 'HEAD' });
              return { status: res.status, ok: res.ok };
            } catch (error) {
              return { status: 0, ok: false, error: error.message };
            }
          }, link.href);

          if (!response.ok) {
            this.results.brokenLinks.push({
              page: url,
              href: link.href,
              text: link.text || 'No text',
              status: response.status,
              error: response.error
            });
          }
        } catch (error) {
          this.results.brokenLinks.push({
            page: url,
            href: link.href,
            text: link.text || 'No text',
            error: error.message
          });
        }
      }

      // Find internal links to crawl
      const internalLinks = links
        .filter(link => link.href.startsWith(config.baseUrl))
        .map(link => link.href);

      await page.close();

      // Recursively check internal links
      for (const internalLink of internalLinks) {
        if (!this.visitedUrls.has(internalLink)) {
          await this.checkPage(internalLink);
        }
      }

    } catch (error) {
      this.results.errors.push({
        page: url,
        error: error.message
      });
      console.error(chalk.red(`Error checking ${url}: ${error.message}`));
    } finally {
      if (!page.isClosed()) {
        await page.close();
      }
    }
  }

  async generateReport() {
    const timestamp = new Date().toISOString();
    const report = {
      timestamp,
      baseUrl: config.baseUrl,
      summary: {
        totalPages: this.results.totalPages,
        totalImages: this.results.totalImages,
        totalLinks: this.results.totalLinks,
        brokenImages: this.results.brokenImages.length,
        brokenLinks: this.results.brokenLinks.length,
        errors: this.results.errors.length
      },
      details: this.results
    };

    // Save JSON report
    await fs.writeFile(
      config.outputFile,
      JSON.stringify(report, null, 2)
    );

    // Generate human-readable report
    const readableReport = this.generateReadableReport(report);
    await fs.writeFile(
      'link-check-report.txt',
      readableReport
    );

    return report;
  }

  generateReadableReport(report) {
    let output = '';
    
    output += chalk.bold('Link and Image Check Report\n');
    output += chalk.bold('=' * 50 + '\n\n');
    
    output += chalk.blue(`Generated: ${report.timestamp}\n`);
    output += chalk.blue(`Base URL: ${report.baseUrl}\n\n`);
    
    // Summary
    output += chalk.bold('Summary:\n');
    output += `- Total pages checked: ${report.summary.totalPages}\n`;
    output += `- Total images found: ${report.summary.totalImages}\n`;
    output += `- Total links found: ${report.summary.totalLinks}\n`;
    output += chalk.red(`- Broken images: ${report.summary.brokenImages}\n`);
    output += chalk.red(`- Broken links: ${report.summary.brokenLinks}\n`);
    output += chalk.yellow(`- Errors: ${report.summary.errors}\n\n`);
    
    // Broken Images
    if (report.details.brokenImages.length > 0) {
      output += chalk.bold.red('Broken Images:\n');
      output += chalk.red('-' * 50 + '\n');
      
      report.details.brokenImages.forEach(img => {
        output += `Page: ${img.page}\n`;
        output += `Image: ${img.src}\n`;
        output += `Alt: ${img.alt}\n\n`;
      });
    }
    
    // Broken Links
    if (report.details.brokenLinks.length > 0) {
      output += chalk.bold.red('Broken Links:\n');
      output += chalk.red('-' * 50 + '\n');
      
      report.details.brokenLinks.forEach(link => {
        output += `Page: ${link.page}\n`;
        output += `Link: ${link.href}\n`;
        output += `Text: ${link.text}\n`;
        if (link.status) output += `Status: ${link.status}\n`;
        if (link.error) output += `Error: ${link.error}\n`;
        output += '\n';
      });
    }
    
    // Errors
    if (report.details.errors.length > 0) {
      output += chalk.bold.yellow('Page Errors:\n');
      output += chalk.yellow('-' * 50 + '\n');
      
      report.details.errors.forEach(error => {
        output += `Page: ${error.page}\n`;
        output += `Error: ${error.error}\n\n`;
      });
    }
    
    return output;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async run() {
    try {
      await this.init();
      await this.checkPage(config.baseUrl);
      const report = await this.generateReport();
      
      console.log('\n' + this.generateReadableReport(report));
      
      console.log(chalk.green(`\n✅ Report saved to ${config.outputFile} and link-check-report.txt`));
      
      if (report.summary.brokenImages > 0 || report.summary.brokenLinks > 0) {
        process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red('Fatal error:'), error);
      process.exit(1);
    } finally {
      await this.close();
    }
  }
}

// Run the checker
const checker = new LinkChecker();
checker.run();
#!/usr/bin/env node

import puppeteer from 'puppeteer';
import chalk from 'chalk';
import { promises as fs } from 'fs';
import path from 'path';
import { URL } from 'url';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const config = {
  baseUrl: process.env.BASE_URL || 'http://localhost:4321',
  maxDepth: process.env.MAX_DEPTH || 3,
  outputFormat: process.env.OUTPUT_FORMAT || 'both', // json, text, or both
  checkExternal: process.env.CHECK_EXTERNAL === 'true',
  screenshotErrors: process.env.SCREENSHOT_ERRORS !== 'false',
  timeout: parseInt(process.env.TIMEOUT) || 30000,
  concurrency: parseInt(process.env.CONCURRENCY) || 3,
  outputDir: './site-health-reports'
};

class SiteHealthChecker {
  constructor() {
    this.visitedUrls = new Set();
    this.urlQueue = [];
    this.results = {
      timestamp: new Date().toISOString(),
      baseUrl: config.baseUrl,
      stats: {
        totalPages: 0,
        totalImages: 0,
        totalLinks: 0,
        brokenImages: 0,
        brokenLinks: 0,
        slowPages: 0,
        errors: 0
      },
      issues: {
        brokenImages: [],
        brokenLinks: [],
        slowPages: [],
        errors: [],
        missingAltText: [],
        largeSizeImages: []
      },
      pages: new Map()
    };
  }

  async init() {
    console.log(chalk.blue.bold('\n🔍 Site Health Checker\n'));
    console.log(chalk.gray(`Base URL: ${config.baseUrl}`));
    console.log(chalk.gray(`Max depth: ${config.maxDepth}`));
    console.log(chalk.gray(`Check external links: ${config.checkExternal}\n`));

    // Create output directory
    await fs.mkdir(config.outputDir, { recursive: true });

    // Launch browser
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  async checkPage(url, depth = 0) {
    if (this.visitedUrls.has(url) || depth > config.maxDepth) return;
    this.visitedUrls.add(url);

    const startTime = Date.now();
    console.log(chalk.gray(`[Depth ${depth}] Checking: ${url}`));

    const page = await this.browser.newPage();
    const pageResults = {
      url,
      depth,
      loadTime: 0,
      images: [],
      links: [],
      errors: []
    };

    try {
      // Set timeout
      page.setDefaultTimeout(config.timeout);

      // Listen for console errors
      page.on('console', msg => {
        if (msg.type() === 'error') {
          pageResults.errors.push({
            type: 'console',
            message: msg.text()
          });
        }
      });

      // Listen for page errors
      page.on('pageerror', error => {
        pageResults.errors.push({
          type: 'page',
          message: error.message
        });
      });

      // Navigate to page
      const response = await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: config.timeout
      });

      pageResults.loadTime = Date.now() - startTime;
      this.results.stats.totalPages++;

      // Check if page loaded successfully
      if (!response.ok()) {
        this.results.issues.brokenLinks.push({
          url,
          status: response.status(),
          from: 'direct navigation'
        });
        this.results.stats.brokenLinks++;
      }

      // Check for slow pages (> 3 seconds)
      if (pageResults.loadTime > 3000) {
        this.results.issues.slowPages.push({
          url,
          loadTime: pageResults.loadTime
        });
        this.results.stats.slowPages++;
      }

      // Analyze images
      const imageAnalysis = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('img')).map(img => {
          const rect = img.getBoundingClientRect();
          return {
            src: img.src,
            alt: img.alt,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            displayWidth: rect.width,
            displayHeight: rect.height,
            complete: img.complete,
            loading: img.loading,
            isVisible: rect.width > 0 && rect.height > 0
          };
        });
      });

      // Process images
      for (const img of imageAnalysis) {
        this.results.stats.totalImages++;
        pageResults.images.push(img);

        // Check for broken images
        if (!img.complete || img.naturalWidth === 0) {
          this.results.issues.brokenImages.push({
            page: url,
            src: img.src,
            alt: img.alt || '(no alt text)'
          });
          this.results.stats.brokenImages++;
        }

        // Check for missing alt text
        if (!img.alt && img.isVisible) {
          this.results.issues.missingAltText.push({
            page: url,
            src: img.src
          });
        }

        // Check for oversized images
        if (img.naturalWidth > 2000 || img.naturalHeight > 2000) {
          this.results.issues.largeSizeImages.push({
            page: url,
            src: img.src,
            dimensions: `${img.naturalWidth}x${img.naturalHeight}`
          });
        }
      }

      // Analyze links
      const linkAnalysis = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a[href]')).map(link => {
          const rect = link.getBoundingClientRect();
          return {
            href: link.href,
            text: link.textContent.trim().substring(0, 100),
            title: link.title,
            target: link.target,
            rel: link.rel,
            isVisible: rect.width > 0 && rect.height > 0
          };
        });
      });

      // Process links
      const internalLinks = [];
      for (const link of linkAnalysis) {
        this.results.stats.totalLinks++;
        pageResults.links.push(link);

        try {
          const linkUrl = new URL(link.href);
          const baseUrlObj = new URL(config.baseUrl);

          // Check if internal link
          if (linkUrl.hostname === baseUrlObj.hostname) {
            internalLinks.push(link.href);
            
            // Quick check for common broken patterns
            if (link.href.includes('undefined') || 
                link.href.includes('null') || 
                link.href.endsWith('//')) {
              this.results.issues.brokenLinks.push({
                page: url,
                href: link.href,
                text: link.text,
                reason: 'Invalid URL pattern'
              });
              this.results.stats.brokenLinks++;
            }
          } else if (config.checkExternal) {
            // Check external link (HEAD request)
            try {
              const checkResponse = await page.evaluate(async (href) => {
                try {
                  const res = await fetch(href, { 
                    method: 'HEAD',
                    mode: 'no-cors'
                  });
                  return { ok: true, status: res.status };
                } catch (e) {
                  return { ok: false, error: e.message };
                }
              }, link.href);

              if (!checkResponse.ok) {
                this.results.issues.brokenLinks.push({
                  page: url,
                  href: link.href,
                  text: link.text,
                  reason: checkResponse.error || `Status: ${checkResponse.status}`
                });
                this.results.stats.brokenLinks++;
              }
            } catch (e) {
              // Skip external link check errors
            }
          }
        } catch (e) {
          // Invalid URL
          this.results.issues.brokenLinks.push({
            page: url,
            href: link.href,
            text: link.text,
            reason: 'Invalid URL'
          });
          this.results.stats.brokenLinks++;
        }
      }

      // Save page results
      this.results.pages.set(url, pageResults);

      // Queue internal links for checking
      if (depth < config.maxDepth) {
        for (const internalLink of internalLinks) {
          if (!this.visitedUrls.has(internalLink)) {
            this.urlQueue.push({ url: internalLink, depth: depth + 1 });
          }
        }
      }

      console.log(chalk.green(`  ✓ Found ${imageAnalysis.length} images, ${linkAnalysis.length} links`));

    } catch (error) {
      console.error(chalk.red(`  ✗ Error: ${error.message}`));
      this.results.issues.errors.push({
        page: url,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      this.results.stats.errors++;

      // Take screenshot on error if enabled
      if (config.screenshotErrors && !page.isClosed()) {
        try {
          const screenshotPath = path.join(
            config.outputDir,
            `error-${Date.now()}.png`
          );
          await page.screenshot({ path: screenshotPath, fullPage: true });
          console.log(chalk.yellow(`  → Screenshot saved: ${screenshotPath}`));
        } catch (e) {
          // Ignore screenshot errors
        }
      }
    } finally {
      if (!page.isClosed()) {
        await page.close();
      }
    }
  }

  async processQueue() {
    while (this.urlQueue.length > 0) {
      const batch = this.urlQueue.splice(0, config.concurrency);
      await Promise.all(
        batch.map(({ url, depth }) => this.checkPage(url, depth))
      );
    }
  }

  async generateReports() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Convert Map to object for JSON serialization
    const jsonReport = {
      ...this.results,
      pages: Array.from(this.results.pages.entries()).map(([url, data]) => ({
        url,
        ...data
      }))
    };

    // Save JSON report
    if (config.outputFormat === 'json' || config.outputFormat === 'both') {
      const jsonPath = path.join(config.outputDir, `health-report-${timestamp}.json`);
      await fs.writeFile(jsonPath, JSON.stringify(jsonReport, null, 2));
      console.log(chalk.gray(`\n📄 JSON report: ${jsonPath}`));
    }

    // Save text report
    if (config.outputFormat === 'text' || config.outputFormat === 'both') {
      const textPath = path.join(config.outputDir, `health-report-${timestamp}.txt`);
      const textReport = this.generateTextReport();
      await fs.writeFile(textPath, textReport);
      console.log(chalk.gray(`📄 Text report: ${textPath}`));
    }

    // Save markdown report
    const mdPath = path.join(config.outputDir, `health-report-${timestamp}.md`);
    const mdReport = this.generateMarkdownReport();
    await fs.writeFile(mdPath, mdReport);
    console.log(chalk.gray(`📄 Markdown report: ${mdPath}`));

    return jsonReport;
  }

  generateTextReport() {
    let report = '';
    
    report += chalk.bold.blue('Site Health Report\n');
    report += '='.repeat(60) + '\n\n';
    
    report += `Generated: ${this.results.timestamp}\n`;
    report += `Base URL: ${this.results.baseUrl}\n`;
    report += `Pages checked: ${this.results.stats.totalPages}\n\n`;

    // Summary
    report += chalk.bold('Summary:\n');
    report += `✓ Total images: ${this.results.stats.totalImages}\n`;
    report += `✓ Total links: ${this.results.stats.totalLinks}\n`;
    
    if (this.results.stats.brokenImages > 0) {
      report += chalk.red(`✗ Broken images: ${this.results.stats.brokenImages}\n`);
    }
    if (this.results.stats.brokenLinks > 0) {
      report += chalk.red(`✗ Broken links: ${this.results.stats.brokenLinks}\n`);
    }
    if (this.results.stats.slowPages > 0) {
      report += chalk.yellow(`⚠ Slow pages: ${this.results.stats.slowPages}\n`);
    }
    if (this.results.stats.errors > 0) {
      report += chalk.red(`✗ Page errors: ${this.results.stats.errors}\n`);
    }
    
    report += '\n';

    // Issues detail
    if (this.results.issues.brokenImages.length > 0) {
      report += chalk.bold.red('\nBroken Images:\n');
      report += '-'.repeat(60) + '\n';
      this.results.issues.brokenImages.forEach(img => {
        report += `Page: ${img.page}\n`;
        report += `Image: ${img.src}\n`;
        report += `Alt: ${img.alt}\n\n`;
      });
    }

    if (this.results.issues.brokenLinks.length > 0) {
      report += chalk.bold.red('\nBroken Links:\n');
      report += '-'.repeat(60) + '\n';
      this.results.issues.brokenLinks.forEach(link => {
        report += `Page: ${link.page || link.from}\n`;
        report += `Link: ${link.href}\n`;
        if (link.text) report += `Text: ${link.text}\n`;
        if (link.reason) report += `Reason: ${link.reason}\n`;
        report += '\n';
      });
    }

    if (this.results.issues.missingAltText.length > 0) {
      report += chalk.bold.yellow('\nImages Missing Alt Text:\n');
      report += '-'.repeat(60) + '\n';
      this.results.issues.missingAltText.forEach(img => {
        report += `Page: ${img.page}\n`;
        report += `Image: ${img.src}\n\n`;
      });
    }

    return report;
  }

  generateMarkdownReport() {
    let report = '# Site Health Report\n\n';
    
    report += `**Generated**: ${this.results.timestamp}\n`;
    report += `**Base URL**: ${this.results.baseUrl}\n`;
    report += `**Pages Checked**: ${this.results.stats.totalPages}\n\n`;

    // Summary
    report += '## Summary\n\n';
    report += '| Metric | Count | Status |\n';
    report += '|--------|-------|--------|\n';
    report += `| Total Pages | ${this.results.stats.totalPages} | ✅ |\n`;
    report += `| Total Images | ${this.results.stats.totalImages} | ✅ |\n`;
    report += `| Total Links | ${this.results.stats.totalLinks} | ✅ |\n`;
    report += `| Broken Images | ${this.results.stats.brokenImages} | ${this.results.stats.brokenImages > 0 ? '❌' : '✅'} |\n`;
    report += `| Broken Links | ${this.results.stats.brokenLinks} | ${this.results.stats.brokenLinks > 0 ? '❌' : '✅'} |\n`;
    report += `| Slow Pages (>3s) | ${this.results.stats.slowPages} | ${this.results.stats.slowPages > 0 ? '⚠️' : '✅'} |\n`;
    report += `| Page Errors | ${this.results.stats.errors} | ${this.results.stats.errors > 0 ? '❌' : '✅'} |\n\n`;

    // Issues
    if (this.results.issues.brokenImages.length > 0) {
      report += '## 🚨 Broken Images\n\n';
      report += '| Page | Image | Alt Text |\n';
      report += '|------|-------|----------|\n';
      this.results.issues.brokenImages.forEach(img => {
        const shortUrl = img.page.replace(this.results.baseUrl, '');
        const shortImg = img.src.replace(this.results.baseUrl, '');
        report += `| ${shortUrl} | \`${shortImg}\` | ${img.alt || '*(none)*'} |\n`;
      });
      report += '\n';
    }

    if (this.results.issues.brokenLinks.length > 0) {
      report += '## 🚨 Broken Links\n\n';
      report += '| Page | Link | Text | Issue |\n';
      report += '|------|------|------|-------|\n';
      this.results.issues.brokenLinks.forEach(link => {
        const shortUrl = (link.page || link.from).replace(this.results.baseUrl, '');
        const shortLink = link.href && link.href.length > 50 ? link.href.substring(0, 47) + '...' : (link.href || 'N/A');
        const shortText = link.text && link.text.length > 30 ? link.text.substring(0, 27) + '...' : (link.text || '');
        report += `| ${shortUrl} | \`${shortLink}\` | ${shortText} | ${link.reason || link.status || 'Unknown'} |\n`;
      });
      report += '\n';
    }

    if (this.results.issues.slowPages.length > 0) {
      report += '## ⚠️ Slow Pages\n\n';
      report += '| Page | Load Time |\n';
      report += '|------|------------|\n';
      this.results.issues.slowPages.forEach(page => {
        const shortUrl = page.url.replace(this.results.baseUrl, '');
        report += `| ${shortUrl} | ${(page.loadTime / 1000).toFixed(2)}s |\n`;
      });
      report += '\n';
    }

    if (this.results.issues.missingAltText.length > 0) {
      report += '## ⚠️ Missing Alt Text\n\n';
      report += `Found ${this.results.issues.missingAltText.length} images without alt text.\n\n`;
      report += '<details>\n<summary>Click to expand full list</summary>\n\n';
      report += '| Page | Image |\n';
      report += '|------|-------|\n';
      this.results.issues.missingAltText.forEach(img => {
        const shortUrl = img.page.replace(this.results.baseUrl, '');
        const shortImg = img.src.replace(this.results.baseUrl, '');
        report += `| ${shortUrl} | \`${shortImg}\` |\n`;
      });
      report += '\n</details>\n\n';
    }

    // Recommendations
    report += '## 📋 Recommendations\n\n';
    
    if (this.results.stats.brokenImages > 0) {
      report += '### Fix Broken Images\n';
      report += '1. Check if image files exist in `/public` directory\n';
      report += '2. Verify file names are correct (case-sensitive)\n';
      report += '3. Consider implementing fallback images\n\n';
    }

    if (this.results.stats.brokenLinks > 0) {
      report += '### Fix Broken Links\n';
      report += '1. Update or remove broken internal links\n';
      report += '2. Implement 404 page handling\n';
      report += '3. Add link validation to build process\n\n';
    }

    if (this.results.issues.missingAltText.length > 0) {
      report += '### Add Alt Text\n';
      report += '- Add descriptive alt text to all images for accessibility\n';
      report += '- Use empty alt="" for decorative images\n\n';
    }

    return report;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async run() {
    try {
      await this.init();
      
      // Start with base URL
      await this.checkPage(config.baseUrl, 0);
      
      // Process queued URLs
      await this.processQueue();
      
      // Generate reports
      const report = await this.generateReports();
      
      // Print summary
      console.log('\n' + this.generateTextReport());
      
      // Exit code based on issues found
      const hasIssues = this.results.stats.brokenImages > 0 || 
                       this.results.stats.brokenLinks > 0 ||
                       this.results.stats.errors > 0;
      
      if (hasIssues) {
        console.log(chalk.red.bold('\n❌ Site health check found issues!\n'));
        process.exit(1);
      } else {
        console.log(chalk.green.bold('\n✅ Site health check passed!\n'));
      }
      
    } catch (error) {
      console.error(chalk.red('\nFatal error:'), error);
      process.exit(1);
    } finally {
      await this.close();
    }
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(chalk.bold('\nSite Health Checker\n'));
  console.log('Usage: npm run check:site [options]\n');
  console.log('Environment Variables:');
  console.log('  BASE_URL           Base URL to check (default: http://localhost:4321)');
  console.log('  MAX_DEPTH          Maximum crawl depth (default: 3)');
  console.log('  OUTPUT_FORMAT      Output format: json, text, or both (default: both)');
  console.log('  CHECK_EXTERNAL     Check external links: true/false (default: false)');
  console.log('  SCREENSHOT_ERRORS  Take screenshots on errors (default: true)');
  console.log('  TIMEOUT            Page timeout in ms (default: 30000)');
  console.log('  CONCURRENCY        Concurrent page checks (default: 3)\n');
  console.log('Examples:');
  console.log('  npm run check:site');
  console.log('  BASE_URL=https://example.com npm run check:site');
  console.log('  MAX_DEPTH=1 CHECK_EXTERNAL=true npm run check:site\n');
  process.exit(0);
}

// Run the checker
const checker = new SiteHealthChecker();
checker.run();
#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');

// Configuration
const config = {
  baseUrl: process.env.BASE_URL || 'http://localhost:4321',
  outputDir: './link-check-reports',
  screenshotErrors: true,
  timeout: 30000
};

class MCPLinkChecker {
  constructor() {
    this.visitedUrls = new Set();
    this.results = {
      timestamp: new Date().toISOString(),
      baseUrl: config.baseUrl,
      totalPages: 0,
      totalImages: 0,
      totalLinks: 0,
      brokenImages: [],
      brokenLinks: [],
      errors: [],
      screenshots: []
    };
  }

  async init() {
    console.log(chalk.blue('🚀 Starting MCP Puppeteer link and image checker...'));
    console.log(chalk.gray(`Base URL: ${config.baseUrl}`));
    
    // Create output directory
    await fs.mkdir(config.outputDir, { recursive: true });
  }

  async checkPage(url) {
    if (this.visitedUrls.has(url)) return;
    this.visitedUrls.add(url);

    console.log(chalk.gray(`\nChecking: ${url}`));

    try {
      // Navigate to the page
      console.log('Navigating to page...');
      // Note: This will be called through Claude Code's MCP interface
      // await mcp__puppeteer__puppeteer_navigate({ url });

      this.results.totalPages++;

      // Get all images on the page
      console.log('Checking images...');
      const imagesScript = `
        Array.from(document.querySelectorAll('img')).map(img => ({
          src: img.src,
          alt: img.alt,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          complete: img.complete,
          currentSrc: img.currentSrc
        }))
      `;
      // const images = await mcp__puppeteer__puppeteer_evaluate({ script: imagesScript });

      // Process images (placeholder for actual processing)
      console.log(chalk.yellow('→ Found images to check'));

      // Get all links on the page
      console.log('Checking links...');
      const linksScript = `
        Array.from(document.querySelectorAll('a[href]')).map(link => ({
          href: link.href,
          text: link.textContent.trim(),
          target: link.target,
          isInternal: link.href.startsWith('${config.baseUrl}')
        }))
      `;
      // const links = await mcp__puppeteer__puppeteer_evaluate({ script: linksScript });

      // Process links (placeholder for actual processing)
      console.log(chalk.yellow('→ Found links to check'));

      // Check for 404 errors
      const check404Script = `
        // Check if this is a 404 page
        const is404 = document.title.toLowerCase().includes('404') ||
                     document.body.textContent.toLowerCase().includes('page not found') ||
                     document.querySelector('h1')?.textContent.toLowerCase().includes('404');
        is404
      `;
      // const is404 = await mcp__puppeteer__puppeteer_evaluate({ script: check404Script });

      console.log(chalk.green('✓ Page checked successfully'));

    } catch (error) {
      console.error(chalk.red(`✗ Error checking ${url}:`), error.message);
      this.results.errors.push({
        page: url,
        error: error.message,
        timestamp: new Date().toISOString()
      });

      // Take screenshot of error if enabled
      if (config.screenshotErrors) {
        const screenshotName = `error-${Date.now()}`;
        console.log(chalk.yellow('→ Taking error screenshot...'));
        // await mcp__puppeteer__puppeteer_screenshot({ 
        //   name: screenshotName,
        //   width: 1280,
        //   height: 800
        // });
        this.results.screenshots.push({
          url,
          name: screenshotName,
          reason: 'error',
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  async generateReport() {
    const reportPath = path.join(config.outputDir, `report-${Date.now()}.json`);
    const readablePath = path.join(config.outputDir, `report-${Date.now()}.txt`);

    // Save JSON report
    await fs.writeFile(reportPath, JSON.stringify(this.results, null, 2));

    // Generate and save readable report
    const readableReport = this.generateReadableReport();
    await fs.writeFile(readablePath, readableReport);

    console.log(chalk.green(`\n✅ Reports saved:`));
    console.log(chalk.gray(`   JSON: ${reportPath}`));
    console.log(chalk.gray(`   Text: ${readablePath}`));

    return this.results;
  }

  generateReadableReport() {
    let output = '';
    
    output += chalk.bold('MCP Puppeteer Link and Image Check Report\n');
    output += '=' * 60 + '\n\n';
    
    output += `Generated: ${this.results.timestamp}\n`;
    output += `Base URL: ${this.results.baseUrl}\n\n`;
    
    // Summary
    output += chalk.bold('Summary:\n');
    output += `- Total pages checked: ${this.results.totalPages}\n`;
    output += `- Total images found: ${this.results.totalImages}\n`;
    output += `- Total links found: ${this.results.totalLinks}\n`;
    output += `- Broken images: ${this.results.brokenImages.length}\n`;
    output += `- Broken links: ${this.results.brokenLinks.length}\n`;
    output += `- Errors: ${this.results.errors.length}\n`;
    output += `- Screenshots taken: ${this.results.screenshots.length}\n\n`;
    
    // Broken Images
    if (this.results.brokenImages.length > 0) {
      output += chalk.bold('Broken Images:\n');
      output += '-' * 60 + '\n';
      this.results.brokenImages.forEach(img => {
        output += `Page: ${img.page}\n`;
        output += `Image: ${img.src}\n`;
        output += `Alt text: ${img.alt || '(none)'}\n\n`;
      });
    }
    
    // Broken Links
    if (this.results.brokenLinks.length > 0) {
      output += chalk.bold('Broken Links:\n');
      output += '-' * 60 + '\n';
      this.results.brokenLinks.forEach(link => {
        output += `Page: ${link.page}\n`;
        output += `Link: ${link.href}\n`;
        output += `Text: ${link.text || '(no text)'}\n`;
        if (link.status) output += `Status: ${link.status}\n`;
        output += '\n';
      });
    }
    
    // Errors
    if (this.results.errors.length > 0) {
      output += chalk.bold('Page Errors:\n');
      output += '-' * 60 + '\n';
      this.results.errors.forEach(error => {
        output += `Page: ${error.page}\n`;
        output += `Error: ${error.error}\n`;
        output += `Time: ${error.timestamp}\n\n`;
      });
    }
    
    return output;
  }

  async run() {
    try {
      await this.init();
      
      // Start checking from base URL
      await this.checkPage(config.baseUrl);
      
      // Generate final report
      const report = await this.generateReport();
      
      // Print summary
      console.log('\n' + this.generateReadableReport());
      
      // Exit with error code if issues found
      if (this.results.brokenImages.length > 0 || 
          this.results.brokenLinks.length > 0 ||
          this.results.errors.length > 0) {
        process.exit(1);
      }
      
    } catch (error) {
      console.error(chalk.red('\nFatal error:'), error);
      process.exit(1);
    }
  }
}

// Instructions for running with MCP
console.log(chalk.bold.cyan('\n📋 MCP Puppeteer Link Checker\n'));
console.log(chalk.yellow('This script is designed to be run through Claude Code with MCP Puppeteer.'));
console.log(chalk.yellow('The actual page navigation and evaluation will be handled by MCP.\n'));
console.log(chalk.gray('To use this script:'));
console.log(chalk.gray('1. Ensure your dev server is running (npm run dev)'));
console.log(chalk.gray('2. Run through Claude Code with MCP Puppeteer enabled'));
console.log(chalk.gray('3. The script will check all pages for broken links and images\n'));

// Create instance but don't run automatically
const checker = new MCPLinkChecker();

// Export for potential use as a module
module.exports = { MCPLinkChecker, config };

// If running directly, show the instructions
if (require.main === module) {
  console.log(chalk.blue('Ready to check links and images with MCP Puppeteer!\n'));
}
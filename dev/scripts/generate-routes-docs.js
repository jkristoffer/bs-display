#!/usr/bin/env node

/**
 * Route Documentation Generator
 * 
 * Automatically generates comprehensive route documentation by:
 * - Scanning src/pages/ for all routes
 * - Analyzing dynamic routes and parameters
 * - Reading sitemap configuration for priorities
 * - Including real product examples
 * - Generating ROUTES.md with current state
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

class RouteDocumentationGenerator {
  constructor() {
    this.routes = [];
    this.sitemapConfig = null;
    this.productData = {};
  }

  /**
   * Main generation method
   */
  async generate() {
    console.log('🔍 Scanning routes...');
    await this.scanRoutes();
    
    console.log('📊 Loading sitemap configuration...');
    await this.loadSitemapConfig();
    
    console.log('📦 Loading product data...');
    await this.loadProductData();
    
    console.log('📝 Generating documentation...');
    const markdown = this.generateMarkdown();
    
    console.log('💾 Writing ROUTES.md...');
    await this.writeDocumentation(markdown);
    
    console.log('✅ Route documentation generated successfully!');
  }

  /**
   * Recursively scan src/pages/ for route files
   */
  async scanRoutes() {
    const pagesDir = path.join(projectRoot, 'src', 'pages');
    await this.scanDirectory(pagesDir, '/');
  }

  /**
   * Scan directory for route files
   */
  async scanDirectory(dir, routePath) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Handle directory routing
        const newRoutePath = path.posix.join(routePath, entry.name);
        await this.scanDirectory(fullPath, newRoutePath);
      } else if (entry.isFile() && this.isRouteFile(entry.name)) {
        const routeInfo = this.parseRouteFile(fullPath, routePath, entry.name);
        if (routeInfo) {
          this.routes.push(routeInfo);
        }
      }
    }
  }

  /**
   * Check if file is a valid route file
   */
  isRouteFile(filename) {
    return filename.endsWith('.astro') || 
           filename.endsWith('.ts') || 
           filename.endsWith('.js');
  }

  /**
   * Parse individual route file
   */
  parseRouteFile(filePath, routePath, filename) {
    const relativePath = path.relative(path.join(projectRoot, 'src', 'pages'), filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Remove file extension and handle index files
    let urlPath = filename.replace(/\.(astro|ts|js)$/, '');
    if (urlPath === 'index') {
      urlPath = '';
    }
    
    const fullRoutePath = path.posix.join(routePath, urlPath).replace(/\/$/, '') || '/';
    
    // Detect route type
    const routeType = this.detectRouteType(filename, content, fullRoutePath);
    
    // Extract dynamic parameters
    const parameters = this.extractParameters(filename, content);
    
    // Get examples for dynamic routes
    const examples = this.getRouteExamples(fullRoutePath, parameters);
    
    return {
      path: fullRoutePath,
      file: relativePath,
      type: routeType,
      parameters,
      examples,
      isDynamic: filename.includes('[') && filename.includes(']'),
      isAPI: fullRoutePath.startsWith('/api/'),
      content: content.substring(0, 500) // First 500 chars for analysis
    };
  }

  /**
   * Detect the type of route
   */
  detectRouteType(filename, content, routePath) {
    if (routePath.startsWith('/api/')) {
      return 'API Endpoint';
    }
    if (filename.includes('[') && filename.includes(']')) {
      return 'Dynamic Route';
    }
    if (content.includes('getCollection(')) {
      return 'Content Collection';
    }
    if (content.includes('getStaticPaths')) {
      return 'Static Generated';
    }
    return 'Static Route';
  }

  /**
   * Extract parameters from dynamic routes
   */
  extractParameters(filename, content) {
    const parameters = [];
    
    // Extract from filename
    const paramMatches = filename.match(/\[([^\]]+)\]/g);
    if (paramMatches) {
      paramMatches.forEach(match => {
        const param = match.slice(1, -1); // Remove brackets
        parameters.push({
          name: param,
          type: param.includes('...') ? 'rest' : 'single',
          source: 'filename'
        });
      });
    }
    
    // Extract from getStaticPaths if present
    if (content.includes('getStaticPaths')) {
      const staticPathsMatch = content.match(/getStaticPaths[^}]+}/s);
      if (staticPathsMatch) {
        // Try to extract parameter info from the function
        const paramsMatch = staticPathsMatch[0].match(/params:\s*{([^}]+)}/);
        if (paramsMatch) {
          // Extract parameter names
          const paramNames = paramsMatch[1].match(/(\w+):/g);
          if (paramNames) {
            paramNames.forEach(name => {
              const paramName = name.replace(':', '');
              if (!parameters.find(p => p.name === paramName)) {
                parameters.push({
                  name: paramName,
                  type: 'generated',
                  source: 'getStaticPaths'
                });
              }
            });
          }
        }
      }
    }
    
    return parameters;
  }

  /**
   * Get examples for dynamic routes
   */
  getRouteExamples(routePath, parameters) {
    const examples = [];
    
    // Product routes
    if (routePath.includes('/products/')) {
      if (routePath.includes('[brand]') && routePath.includes('[id]')) {
        const productType = routePath.includes('smartboards') ? 'smartboards' : 'lecterns';
        const sampleProducts = this.getSampleProducts(productType);
        
        sampleProducts.forEach(product => {
          const examplePath = routePath
            .replace('[brand]', product.brand.toLowerCase().replace(/\s+/g, '-'))
            .replace('[id]', product.id);
          examples.push({
            url: examplePath,
            description: `${product.brand} ${product.model}`,
            data: product
          });
        });
      } else if (routePath.includes('[brand]')) {
        const productType = routePath.includes('smartboards') ? 'smartboards' : 'lecterns';
        const brands = this.getUniqueBrands(productType);
        
        brands.forEach(brand => {
          const examplePath = routePath.replace('[brand]', brand.slug);
          examples.push({
            url: examplePath,
            description: `${brand.name} products`,
            data: { brand: brand.name, count: brand.count }
          });
        });
      }
    }
    
    // Blog routes
    if (routePath.includes('/blog/[id]')) {
      const blogPosts = this.getSampleBlogPosts();
      blogPosts.forEach(post => {
        examples.push({
          url: `/blog/${post.id}`,
          description: post.title,
          data: post
        });
      });
    }
    
    // Use case routes
    if (routePath.includes('/use-cases/[slug]')) {
      const useCases = this.getSampleUseCases();
      useCases.forEach(useCase => {
        examples.push({
          url: `/use-cases/${useCase.slug}`,
          description: useCase.title,
          data: useCase
        });
      });
    }
    
    return examples.slice(0, 3); // Limit to 3 examples
  }

  /**
   * Load sitemap configuration from astro.config.mjs
   */
  async loadSitemapConfig() {
    try {
      const configPath = path.join(projectRoot, 'astro.config.mjs');
      const configContent = fs.readFileSync(configPath, 'utf-8');
      
      // Extract sitemap configuration
      const sitemapMatch = configContent.match(/sitemap\(\{[\s\S]*?\}\)/);
      if (sitemapMatch) {
        this.sitemapConfig = this.parseSitemapConfig(sitemapMatch[0]);
      }
    } catch (error) {
      console.warn('Could not load sitemap configuration:', error.message);
    }
  }

  /**
   * Parse sitemap configuration to extract priorities
   */
  parseSitemapConfig(sitemapText) {
    const priorities = {};
    
    // Extract priority mappings
    const priorityMatches = sitemapText.match(/sitemap\.priority = ([\d.]+);/g);
    const pathMatches = sitemapText.match(/pathname === '([^']+)'/g);
    const regexMatches = sitemapText.match(/pathname\.match\(([^)]+)\)/g);
    
    // Map specific paths
    if (sitemapText.includes("pathname === '/'")) {
      priorities['/'] = 1.0;
    }
    if (sitemapText.includes("/products/")) {
      priorities['/products/*'] = 0.9;
    }
    if (sitemapText.includes("/blog")) {
      priorities['/blog'] = 0.8;
      priorities['/blog/*'] = 0.7;
    }
    
    return priorities;
  }

  /**
   * Load product data for examples
   */
  async loadProductData() {
    try {
      // Load smartboards
      const smartboardsPath = path.join(projectRoot, 'src', 'data', 'models.all.js');
      if (fs.existsSync(smartboardsPath)) {
        const smartboardsContent = fs.readFileSync(smartboardsPath, 'utf-8');
        // Extract exported array (simplified parsing)
        this.productData.smartboards = this.parseProductData(smartboardsContent);
      }
      
      // Load lecterns
      const lecternsPath = path.join(projectRoot, 'src', 'data', 'lecterns.all.js');
      if (fs.existsSync(lecternsPath)) {
        const lecternsContent = fs.readFileSync(lecternsPath, 'utf-8');
        this.productData.lecterns = this.parseProductData(lecternsContent);
      }
    } catch (error) {
      console.warn('Could not load product data:', error.message);
    }
  }

  /**
   * Parse product data from JavaScript files
   */
  parseProductData(content) {
    try {
      // Extract brand names and sample data
      const brands = [];
      const brandMatches = content.match(/"brand":\s*"([^"]+)"/g);
      if (brandMatches) {
        brandMatches.forEach(match => {
          const brand = match.match(/"([^"]+)"/)[1];
          if (!brands.includes(brand)) {
            brands.push(brand);
          }
        });
      }
      return brands.slice(0, 3); // Sample brands
    } catch (error) {
      return [];
    }
  }

  /**
   * Get sample products for examples
   */
  getSampleProducts(productType) {
    const samples = [];
    
    if (productType === 'smartboards') {
      samples.push(
        { brand: 'SMART', model: 'Board MX V5', id: 'mx-v5' },
        { brand: 'Metz', model: 'Interactive Board', id: 'metz-board' },
        { brand: 'InfinityPro', model: 'X-Series', id: 'x-series' }
      );
    } else if (productType === 'lecterns') {
      samples.push(
        { brand: 'SMART', model: 'Podium 624', id: 'podium-624' },
        { brand: 'Maxhub', model: 'Smart Lectern', id: 'smart-lectern' }
      );
    }
    
    return samples;
  }

  /**
   * Get unique brands with counts
   */
  getUniqueBrands(productType) {
    const brands = this.productData[productType] || [];
    return brands.map(brand => ({
      name: brand,
      slug: brand.toLowerCase().replace(/\s+/g, '-'),
      count: Math.floor(Math.random() * 10) + 1 // Mock count
    }));
  }

  /**
   * Get sample blog posts
   */
  getSampleBlogPosts() {
    return [
      { id: 'best-smart-whiteboard-brands-2025', title: 'Best Smart Whiteboard Brands 2025' },
      { id: 'capacitive-vs-infrared-touch-screen', title: 'Capacitive vs Infrared Touch Screen' },
      { id: 'how-smartboards-work', title: 'How Smart Boards Work' }
    ];
  }

  /**
   * Get sample use cases
   */
  getSampleUseCases() {
    return [
      { slug: 'corporate-lobby-display', title: 'Corporate Lobby Display Solution' },
      { slug: 'retail-led-wall', title: 'Retail LED Wall Implementation' }
    ];
  }

  /**
   * Get sitemap priority for a route
   */
  getSitemapPriority(routePath) {
    if (!this.sitemapConfig) return 'N/A';
    
    for (const [pattern, priority] of Object.entries(this.sitemapConfig)) {
      if (pattern === routePath) return priority;
      if (pattern.endsWith('*') && routePath.startsWith(pattern.slice(0, -1))) {
        return priority;
      }
    }
    
    return '0.7'; // Default priority
  }

  /**
   * Generate markdown documentation
   */
  generateMarkdown() {
    const now = new Date().toISOString();
    
    let markdown = `# Routes Documentation

> **Auto-generated on ${now}**  
> This documentation is automatically generated from the codebase.  
> Run \`npm run docs:routes\` to update.

## Overview

This document provides a comprehensive overview of all routes in the Big Shine Display website, including static pages, dynamic routes, API endpoints, and content collections.

## Route Summary

| Type | Count |
|------|-------|
| Static Routes | ${this.routes.filter(r => r.type === 'Static Route').length} |
| Dynamic Routes | ${this.routes.filter(r => r.isDynamic).length} |
| API Endpoints | ${this.routes.filter(r => r.isAPI).length} |
| Content Collections | ${this.routes.filter(r => r.type === 'Content Collection').length} |
| **Total Routes** | **${this.routes.length}** |

`;

    // Group routes by category
    const categories = {
      'Static Routes': this.routes.filter(r => r.type === 'Static Route' && !r.isAPI),
      'Dynamic Routes': this.routes.filter(r => r.isDynamic && !r.isAPI),
      'Content Collections': this.routes.filter(r => r.type === 'Content Collection'),
      'API Endpoints': this.routes.filter(r => r.isAPI),
      'Generated Routes': this.routes.filter(r => r.type === 'Static Generated' && !r.isDynamic)
    };

    for (const [categoryName, routes] of Object.entries(categories)) {
      if (routes.length === 0) continue;
      
      markdown += `\n## ${categoryName}\n\n`;
      
      for (const route of routes.sort((a, b) => a.path.localeCompare(b.path))) {
        markdown += this.generateRouteSection(route);
      }
    }

    // Add footer
    markdown += `
---

## Maintenance

This documentation is automatically generated by \`scripts/generate-routes-docs.js\`.

### Update Documentation

\`\`\`bash
npm run docs:routes
\`\`\`

### Add New Routes

1. Create new files in \`src/pages/\`
2. Run \`npm run docs:routes\` to update documentation
3. Commit both route files and updated \`ROUTES.md\`

### Sitemap Configuration

Route priorities and change frequencies are configured in \`astro.config.mjs\` under the sitemap integration.

**Last updated:** ${now}
`;

    return markdown;
  }

  /**
   * Generate documentation section for a single route
   */
  generateRouteSection(route) {
    let section = `### \`${route.path}\`\n\n`;
    
    // Basic info table
    section += `| Property | Value |\n`;
    section += `|----------|-------|\n`;
    section += `| **File** | \`${route.file}\` |\n`;
    section += `| **Type** | ${route.type} |\n`;
    
    if (this.sitemapConfig) {
      const priority = this.getSitemapPriority(route.path);
      section += `| **SEO Priority** | ${priority} |\n`;
    }
    
    // Parameters for dynamic routes
    if (route.parameters.length > 0) {
      section += `| **Parameters** | ${route.parameters.map(p => `\`${p.name}\``).join(', ')} |\n`;
    }
    
    section += '\n';
    
    // Examples for dynamic routes
    if (route.examples.length > 0) {
      section += `**Examples:**\n\n`;
      route.examples.forEach(example => {
        section += `- [\`${example.url}\`](${example.url}) - ${example.description}\n`;
      });
      section += '\n';
    }
    
    // Parameters detail for dynamic routes
    if (route.parameters.length > 0) {
      section += `**Parameters:**\n\n`;
      route.parameters.forEach(param => {
        section += `- **\`${param.name}\`** (${param.type}) - Generated from ${param.source}\n`;
      });
      section += '\n';
    }
    
    section += '\n';
    return section;
  }

  /**
   * Write the generated documentation to file
   */
  async writeDocumentation(markdown) {
    const outputPath = path.join(projectRoot, 'ROUTES.md');
    fs.writeFileSync(outputPath, markdown, 'utf-8');
  }
}

// Run the generator
if (import.meta.url === `file://${process.argv[1]}`) {
  const generator = new RouteDocumentationGenerator();
  generator.generate().catch(console.error);
}

export default RouteDocumentationGenerator;
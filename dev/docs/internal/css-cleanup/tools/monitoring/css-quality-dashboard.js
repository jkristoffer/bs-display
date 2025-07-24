#!/usr/bin/env node

/**
 * CSS Quality Dashboard
 * Monitors CSS architecture health and provides quality metrics
 * 
 * Usage: node css-quality-dashboard.js [--format=json|html] [--output=file.html]
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Configuration
const CONFIG = {
  cssFiles: ['src/**/*.scss', 'src/**/*.css'],
  ignorePatterns: ['**/node_modules/**', '**/dist/**', '**/build/**'],
  thresholds: {
    maxBundleSize: 150000, // 150KB
    maxUnusedVariables: 20,  // 20% unused variables
    maxHardcodedValues: 10,  // 10 hardcoded values
    minCssModuleAdoption: 90, // 90% CSS modules
    maxInlineStyles: 5       // 5 inline styles
  }
};

// Quality metrics
const metrics = {
  bundleSize: 0,
  variableCount: 0,
  unusedVariables: 0,
  hardcodedValues: 0,
  cssModuleFiles: 0,
  totalCssFiles: 0,
  inlineStyles: 0,
  duplicateRules: 0,
  qualityScore: 0,
  lastUpdated: new Date().toISOString()
};

// Issue tracking
const issues = {
  critical: [],
  warning: [],
  info: []
};

/**
 * Analyze bundle size from dist directory
 */
function analyzeBundleSize() {
  const distPath = path.join(process.cwd(), 'dist');
  
  if (!fs.existsSync(distPath)) {
    issues.warning.push({
      type: 'bundle',
      message: 'Dist directory not found - run build first',
      file: null
    });
    return;
  }
  
  try {
    const cssFiles = fs.readdirSync(distPath)
      .filter(file => file.endsWith('.css'))
      .map(file => path.join(distPath, file));
    
    metrics.bundleSize = cssFiles.reduce((total, file) => {
      const stats = fs.statSync(file);
      return total + stats.size;
    }, 0);
    
    // Check against threshold
    if (metrics.bundleSize > CONFIG.thresholds.maxBundleSize) {
      issues.critical.push({
        type: 'bundle',
        message: `Bundle size ${(metrics.bundleSize / 1024).toFixed(1)}KB exceeds threshold ${(CONFIG.thresholds.maxBundleSize / 1024).toFixed(1)}KB`,
        file: null
      });
    }
    
  } catch (error) {
    issues.warning.push({
      type: 'bundle',
      message: `Error analyzing bundle size: ${error.message}`,
      file: null
    });
  }
}

/**
 * Analyze CSS variables usage
 */
async function analyzeVariables() {
  const files = await glob(CONFIG.cssFiles, { ignore: CONFIG.ignorePatterns });
  const variables = new Set();
  const variableUsage = new Map();
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Find variable definitions
      const definitions = content.match(/\$[a-zA-Z0-9-_]+\s*:/g);
      if (definitions) {
        definitions.forEach(def => {
          const varName = def.replace(/\s*:.*/, '');
          variables.add(varName);
          if (!variableUsage.has(varName)) {
            variableUsage.set(varName, { defined: [], used: [] });
          }
          variableUsage.get(varName).defined.push(file);
        });
      }
      
      // Find variable usage
      const usages = content.match(/\$[a-zA-Z0-9-_]+(?!\s*:)/g);
      if (usages) {
        usages.forEach(usage => {
          if (!variableUsage.has(usage)) {
            variableUsage.set(usage, { defined: [], used: [] });
          }
          variableUsage.get(usage).used.push(file);
        });
      }
      
    } catch (error) {
      issues.warning.push({
        type: 'variables',
        message: `Error reading file: ${error.message}`,
        file
      });
    }
  }
  
  metrics.variableCount = variables.size;
  
  // Find unused variables
  const unused = Array.from(variableUsage.entries())
    .filter(([varName, usage]) => usage.defined.length > 0 && usage.used.length === 0)
    .map(([varName]) => varName);
  
  metrics.unusedVariables = unused.length;
  
  const unusedPercentage = (metrics.unusedVariables / metrics.variableCount) * 100;
  if (unusedPercentage > CONFIG.thresholds.maxUnusedVariables) {
    issues.warning.push({
      type: 'variables',
      message: `${unusedPercentage.toFixed(1)}% unused variables (${metrics.unusedVariables}/${metrics.variableCount})`,
      file: null
    });
  }
  
  // Report specific unused variables
  unused.slice(0, 10).forEach(varName => {
    issues.info.push({
      type: 'variables',
      message: `Unused variable: ${varName}`,
      file: variableUsage.get(varName).defined[0]
    });
  });
}

/**
 * Find hardcoded values
 */
async function analyzeHardcodedValues() {
  const files = await glob(CONFIG.cssFiles, { ignore: CONFIG.ignorePatterns });
  let hardcodedCount = 0;
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Skip variable definition file
      if (file.includes('variables.scss')) continue;
      
      // Find hardcoded colors
      const colors = content.match(/#[0-9a-fA-F]{3,6}|rgb\\([^)]+\\)|rgba\\([^)]+\\)/g);
      if (colors) {
        hardcodedCount += colors.length;
        colors.slice(0, 3).forEach(color => {
          issues.warning.push({
            type: 'hardcoded',
            message: `Hardcoded color: ${color}`,
            file
          });
        });
      }
      
      // Find hardcoded sizes
      const sizes = content.match(/\\b[0-9]+px\\b/g);
      if (sizes) {
        hardcodedCount += sizes.length;
        sizes.slice(0, 3).forEach(size => {
          issues.warning.push({
            type: 'hardcoded',
            message: `Hardcoded size: ${size}`,
            file
          });
        });
      }
      
    } catch (error) {
      issues.warning.push({
        type: 'hardcoded',
        message: `Error reading file: ${error.message}`,
        file
      });
    }
  }
  
  metrics.hardcodedValues = hardcodedCount;
  
  if (hardcodedCount > CONFIG.thresholds.maxHardcodedValues) {
    issues.critical.push({
      type: 'hardcoded',
      message: `${hardcodedCount} hardcoded values found (threshold: ${CONFIG.thresholds.maxHardcodedValues})`,
      file: null
    });
  }
}

/**
 * Analyze CSS Modules adoption
 */
async function analyzeCssModules() {
  const allFiles = await glob(['src/**/*.scss', 'src/**/*.css'], { ignore: CONFIG.ignorePatterns });
  const moduleFiles = await glob(['src/**/*.module.scss', 'src/**/*.module.css'], { ignore: CONFIG.ignorePatterns });
  
  metrics.totalCssFiles = allFiles.length;
  metrics.cssModuleFiles = moduleFiles.length;
  
  const adoptionPercentage = (metrics.cssModuleFiles / metrics.totalCssFiles) * 100;
  
  if (adoptionPercentage < CONFIG.thresholds.minCssModuleAdoption) {
    issues.warning.push({
      type: 'modules',
      message: `CSS Modules adoption ${adoptionPercentage.toFixed(1)}% below threshold ${CONFIG.thresholds.minCssModuleAdoption}%`,
      file: null
    });
  }
}

/**
 * Find inline styles in components
 */
async function analyzeInlineStyles() {
  const files = await glob(['src/**/*.tsx', 'src/**/*.jsx'], { ignore: CONFIG.ignorePatterns });
  let inlineCount = 0;
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const inlineStyles = content.match(/style\\s*=\\s*\\{\\{[^}]+\\}\\}/g);
      
      if (inlineStyles) {
        inlineCount += inlineStyles.length;
        issues.warning.push({
          type: 'inline',
          message: `${inlineStyles.length} inline style${inlineStyles.length > 1 ? 's' : ''} found`,
          file
        });
      }
      
    } catch (error) {
      issues.warning.push({
        type: 'inline',
        message: `Error reading file: ${error.message}`,
        file
      });
    }
  }
  
  metrics.inlineStyles = inlineCount;
  
  if (inlineCount > CONFIG.thresholds.maxInlineStyles) {
    issues.critical.push({
      type: 'inline',
      message: `${inlineCount} inline styles found (threshold: ${CONFIG.thresholds.maxInlineStyles})`,
      file: null
    });
  }
}

/**
 * Calculate overall quality score
 */
function calculateQualityScore() {
  let score = 100;
  
  // Bundle size impact (0-25 points)
  const bundlePenalty = Math.min(25, (metrics.bundleSize / CONFIG.thresholds.maxBundleSize) * 25);
  score -= bundlePenalty;
  
  // Unused variables impact (0-20 points)
  const unusedPenalty = Math.min(20, (metrics.unusedVariables / metrics.variableCount) * 100 * 0.2);
  score -= unusedPenalty;
  
  // Hardcoded values impact (0-20 points)
  const hardcodedPenalty = Math.min(20, (metrics.hardcodedValues / CONFIG.thresholds.maxHardcodedValues) * 20);
  score -= hardcodedPenalty;
  
  // CSS Modules adoption impact (0-20 points)
  const moduleBonus = (metrics.cssModuleFiles / metrics.totalCssFiles) * 20;
  score = score - 20 + moduleBonus;
  
  // Inline styles impact (0-15 points)
  const inlinePenalty = Math.min(15, (metrics.inlineStyles / CONFIG.thresholds.maxInlineStyles) * 15);
  score -= inlinePenalty;
  
  metrics.qualityScore = Math.max(0, Math.round(score));
}

/**
 * Generate HTML report
 */
function generateHtmlReport() {
  const getScoreColor = (score) => {
    if (score >= 85) return '#28a745';
    if (score >= 70) return '#ffc107';
    return '#dc3545';
  };
  
  const getIssueIcon = (type) => {
    switch (type) {
      case 'critical': return '🔴';
      case 'warning': return '🟡';
      default: return 'ℹ️';
    }
  };
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Quality Dashboard</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f8f9fa; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; }
        .score { font-size: 3em; font-weight: bold; color: ${getScoreColor(metrics.qualityScore)}; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .metric-value { font-size: 2em; font-weight: bold; color: #007bff; }
        .metric-label { color: #6c757d; margin-top: 5px; }
        .issues { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .issue { padding: 10px; margin: 5px 0; border-radius: 4px; background: #f8f9fa; }
        .issue.critical { border-left: 4px solid #dc3545; }
        .issue.warning { border-left: 4px solid #ffc107; }
        .issue.info { border-left: 4px solid #17a2b8; }
        .file-path { font-family: monospace; font-size: 0.9em; color: #6c757d; }
        .timestamp { text-align: center; color: #6c757d; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>CSS Quality Dashboard</h1>
            <div class="score">${metrics.qualityScore}</div>
            <div>Overall Quality Score</div>
        </div>
        
        <div class="metrics">
            <div class="metric">
                <div class="metric-value">${(metrics.bundleSize / 1024).toFixed(1)}KB</div>
                <div class="metric-label">Bundle Size</div>
            </div>
            <div class="metric">
                <div class="metric-value">${metrics.variableCount}</div>
                <div class="metric-label">CSS Variables</div>
            </div>
            <div class="metric">
                <div class="metric-value">${metrics.unusedVariables}</div>
                <div class="metric-label">Unused Variables</div>
            </div>
            <div class="metric">
                <div class="metric-value">${metrics.hardcodedValues}</div>
                <div class="metric-label">Hardcoded Values</div>
            </div>
            <div class="metric">
                <div class="metric-value">${((metrics.cssModuleFiles / metrics.totalCssFiles) * 100).toFixed(1)}%</div>
                <div class="metric-label">CSS Modules Adoption</div>
            </div>
            <div class="metric">
                <div class="metric-value">${metrics.inlineStyles}</div>
                <div class="metric-label">Inline Styles</div>
            </div>
        </div>
        
        <div class="issues">
            <h2>Issues Found</h2>
            ${[...issues.critical, ...issues.warning, ...issues.info].map(issue => `
                <div class="issue ${issue.type === 'bundle' || issue.type === 'hardcoded' ? 'critical' : issue.type === 'variables' || issue.type === 'modules' || issue.type === 'inline' ? 'warning' : 'info'}">
                    ${getIssueIcon(issue.type === 'bundle' || issue.type === 'hardcoded' ? 'critical' : 'warning')} ${issue.message}
                    ${issue.file ? `<div class="file-path">${issue.file}</div>` : ''}
                </div>
            `).join('')}
            ${[...issues.critical, ...issues.warning, ...issues.info].length === 0 ? '<div class="issue info">🎉 No issues found! Your CSS is in great shape.</div>' : ''}
        </div>
        
        <div class="timestamp">
            Last updated: ${new Date(metrics.lastUpdated).toLocaleString()}
        </div>
    </div>
</body>
</html>`;
}

/**
 * Main analysis function
 */
async function runAnalysis() {
  console.log('🔍 Analyzing CSS quality...');
  
  try {
    await analyzeBundleSize();
    await analyzeVariables();
    await analyzeHardcodedValues();
    await analyzeCssModules();
    await analyzeInlineStyles();
    calculateQualityScore();
    
    console.log('✅ Analysis complete');
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    process.exit(1);
  }
}

/**
 * Output results
 */
function outputResults() {
  const args = process.argv.slice(2);
  const format = args.find(arg => arg.startsWith('--format='))?.split('=')[1] || 'console';
  const output = args.find(arg => arg.startsWith('--output='))?.split('=')[1];
  
  if (format === 'json') {
    const result = { metrics, issues };
    if (output) {
      fs.writeFileSync(output, JSON.stringify(result, null, 2));
      console.log(`📄 JSON report saved to ${output}`);
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
  } else if (format === 'html') {
    const html = generateHtmlReport();
    const filename = output || 'css-quality-report.html';
    fs.writeFileSync(filename, html);
    console.log(`📊 HTML report saved to ${filename}`);
  } else {
    // Console output
    console.log('\\n📊 CSS Quality Report');
    console.log('======================');
    console.log(`Quality Score: ${metrics.qualityScore}/100`);
    console.log(`Bundle Size: ${(metrics.bundleSize / 1024).toFixed(1)}KB`);
    console.log(`Variables: ${metrics.variableCount} (${metrics.unusedVariables} unused)`);
    console.log(`Hardcoded Values: ${metrics.hardcodedValues}`);
    console.log(`CSS Modules: ${((metrics.cssModuleFiles / metrics.totalCssFiles) * 100).toFixed(1)}%`);
    console.log(`Inline Styles: ${metrics.inlineStyles}`);
    
    if (issues.critical.length > 0) {
      console.log('\\n🔴 Critical Issues:');
      issues.critical.forEach(issue => console.log(`   ${issue.message}`));
    }
    
    if (issues.warning.length > 0) {
      console.log('\\n🟡 Warnings:');
      issues.warning.slice(0, 10).forEach(issue => console.log(`   ${issue.message}`));
      if (issues.warning.length > 10) {
        console.log(`   ... and ${issues.warning.length - 10} more warnings`);
      }
    }
  }
}

// Run the analysis
runAnalysis().then(outputResults).catch(console.error);
#!/usr/bin/env node

/**
 * CSS Quality Checker - Comprehensive SCSS/CSS Analysis Tool
 * 
 * Analyzes CSS/SCSS files for:
 * - Selector complexity and performance
 * - Nesting depth and best practices  
 * - SCSS variable usage and patterns
 * - Duplicate declarations and rules
 * - Performance and maintainability issues
 * 
 * Usage:
 *   node scripts/css-quality-checker.js --file src/components/Nav.module.scss
 *   node scripts/css-quality-checker.js --batch src/components/
 */

import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CSSQualityAnalyzer {
  constructor(options = {}) {
    this.options = {
      outputFormat: options.outputFormat || 'detailed',
      projectAware: options.projectAware !== false, // Default to true
      thresholds: {
        excellent: options.excellent || 90,
        good: options.good || 80,
        acceptable: options.acceptable || 70,
        failing: options.failing || 60
      },
      ...options
    };
    
    // Initialize project configuration
    this.projectConfig = null;
    this.configLoaded = false;

    this.results = {
      selectorComplexity: { score: 0, issues: [], recommendations: [] },
      nestingDepth: { score: 0, issues: [], recommendations: [] },
      variableUsage: { score: 0, issues: [], recommendations: [] },
      duplicates: { score: 0, issues: [], recommendations: [] },
      performance: { score: 0, issues: [], recommendations: [] },
      maintainability: { score: 0, issues: [], recommendations: [] },
      projectCompliance: { score: 0, issues: [], recommendations: [] },
      overallScore: 0,
      files: [],
      metadata: {
        timestamp: new Date().toISOString(),
        analyzer: 'css-quality-checker',
        projectAware: this.options.projectAware,
        projectConfig: null
      }
    };
  }

  async loadProjectConfiguration() {
    this.configLoaded = true;
    
    try {
      const configPath = path.join(__dirname, '../config/css-quality-project-config.json');
      const configContent = await fs.readFile(configPath, 'utf-8');
      this.projectConfig = JSON.parse(configContent);
      
      // Update thresholds from project config if available
      if (this.projectConfig.qualityThresholds) {
        this.options.thresholds = { ...this.options.thresholds, ...this.projectConfig.qualityThresholds };
      }
      
      // Update metadata with project configuration info
      this.results.metadata.projectConfig = this.projectConfig.projectName;
      
      if (this.options.outputFormat !== 'json' && this.options.outputFormat !== 'minimal') {
        console.log(`✅ Loaded project configuration: ${this.projectConfig.projectName}`);
      }
    } catch (error) {
      if (this.options.outputFormat !== 'json' && this.options.outputFormat !== 'minimal') {
        console.log('⚠️  No project configuration found, using generic CSS rules');
      }
      this.projectConfig = null;
    }
  }

  async analyzeFile(filePath) {
    // Load project configuration if needed
    if (this.options.projectAware && !this.configLoaded) {
      await this.loadProjectConfiguration();
    }
    
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const fileExtension = path.extname(filePath);
      
      if (!fileExtension.match(/\.(s?css|module\.(s?css))$/)) {
        return null;
      }

      if (this.options.outputFormat !== 'json' && this.options.outputFormat !== 'minimal') {
        console.log(`🎨 Analyzing CSS: ${filePath}`);
      }
      
      const fileResult = {
        path: filePath,
        extension: fileExtension,
        score: 0,
        isScssModule: filePath.includes('.module.'),
        isScss: fileExtension.includes('scss')
      };

      // Core analysis categories
      fileResult.selectorComplexity = this.analyzeSelectorComplexity(content);
      fileResult.nestingDepth = this.analyzeNestingDepth(content);
      fileResult.variableUsage = this.analyzeVariableUsage(content);
      fileResult.duplicates = this.analyzeDuplicates(content);
      fileResult.performance = this.analyzePerformance(content);
      fileResult.maintainability = this.analyzeMaintainability(content, filePath);
      
      // Project-aware analysis
      if (this.options.projectAware && this.projectConfig) {
        fileResult.projectCompliance = this.analyzeProjectCompliance(content, filePath);
      }

      // Calculate file score
      fileResult.score = this.calculateFileScore(fileResult);
      this.results.files.push(fileResult);
      
      return fileResult;
    } catch (error) {
      console.error(`❌ Error analyzing CSS ${filePath}:`, error.message);
      return null;
    }
  }

  analyzeSelectorComplexity(content) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Extract selectors (basic regex approach)
    const selectorMatches = content.match(/^[^{]*(?=\s*{)/gm) || [];
    const selectors = selectorMatches
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('//') && !s.startsWith('/*'))
      .filter(s => !s.includes('@')); // Filter out @media, @keyframes, etc.

    // Analyze selector complexity
    let complexSelectors = 0;
    let veryComplexSelectors = 0;
    let universalSelectors = 0;
    let deepSelectors = 0;

    selectors.forEach(selector => {
      // Count descendant selectors
      const parts = selector.split(/\s+/).filter(p => p.trim());
      const complexity = parts.length;

      if (complexity > 4) {
        veryComplexSelectors++;
        issues.push(`Very complex selector (${complexity} parts): ${selector.substring(0, 50)}...`);
      } else if (complexity > 3) {
        complexSelectors++;
      }

      // Check for universal selectors
      if (selector.includes('*')) {
        universalSelectors++;
        issues.push(`Universal selector detected: ${selector}`);
      }

      // Check for deep nesting indicators
      if (selector.includes('>') && selector.split('>').length > 3) {
        deepSelectors++;
        issues.push(`Deep child selector: ${selector}`);
      }
    });

    // Scoring
    if (veryComplexSelectors > 0) {
      score -= veryComplexSelectors * 15;
      recommendations.push('Break down complex selectors into simpler, more specific ones');
    }
    if (complexSelectors > 5) {
      score -= 10;
      recommendations.push('Consider reducing selector complexity for better performance');
    }
    if (universalSelectors > 0) {
      score -= universalSelectors * 25;
      recommendations.push('Avoid universal selectors (*) for better performance');
    }
    if (deepSelectors > 0) {
      score -= deepSelectors * 20;
      recommendations.push('Avoid deep child selectors (>) - prefer flatter structure');
    }

    return { 
      score: Math.max(0, score), 
      issues, 
      recommendations,
      metrics: {
        totalSelectors: selectors.length,
        complexSelectors,
        veryComplexSelectors,
        universalSelectors,
        deepSelectors
      }
    };
  }

  analyzeNestingDepth(content) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Analyze nesting depth (simplified approach)
    const lines = content.split('\n');
    let currentDepth = 0;
    let maxDepth = 0;
    let deepNestingCount = 0;
    let veryDeepNestingCount = 0;

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Skip comments and empty lines
      if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*')) return;
      
      // Count opening braces
      const openBraces = (line.match(/{/g) || []).length;
      const closeBraces = (line.match(/}/g) || []).length;
      
      currentDepth += openBraces - closeBraces;
      maxDepth = Math.max(maxDepth, currentDepth);
      
      if (currentDepth > 4) {
        veryDeepNestingCount++;
        if (veryDeepNestingCount <= 3) { // Limit issue reporting
          issues.push(`Very deep nesting (${currentDepth} levels) at line ${index + 1}`);
        }
      } else if (currentDepth > 3) {
        deepNestingCount++;
      }
    });

    // Scoring
    if (maxDepth > 5) {
      score -= 30;
      issues.push(`Maximum nesting depth: ${maxDepth} levels (recommended: ≤4)`);
      recommendations.push('Reduce nesting depth using BEM methodology or component composition');
    } else if (maxDepth > 4) {
      score -= 15;
      recommendations.push('Consider reducing nesting depth for better maintainability');
    }

    if (veryDeepNestingCount > 10) {
      score -= 20;
      recommendations.push('Excessive deep nesting detected - refactor to flatter structure');
    }

    return { 
      score: Math.max(0, score), 
      issues, 
      recommendations,
      metrics: {
        maxDepth,
        deepNestingCount,
        veryDeepNestingCount
      }
    };
  }

  analyzeVariableUsage(content) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Find SCSS variables
    const variableDefinitions = content.match(/\$[\w-]+\s*:/g) || [];
    const variableUsages = content.match(/\$[\w-]+/g) || [];
    const hardcodedColors = content.match(/#[0-9a-fA-F]{3,8}|rgb\(|rgba\(|hsl\(|hsla\(/g) || [];
    const hardcodedSizes = content.match(/\d+px(?!\s*;?\s*\/\/.*var)/g) || [];

    // CSS custom properties (modern variables)
    const cssVariables = content.match(/--[\w-]+/g) || [];
    
    const definedVars = new Set(variableDefinitions.map(v => v.split(':')[0].trim()));
    const usedVars = new Set(variableUsages);
    
    // Check variable usage patterns
    const unusedVars = [...definedVars].filter(v => !usedVars.has(v));
    const variableUsageRatio = definedVars.size > 0 ? usedVars.size / definedVars.size : 0;

    // Scoring
    if (hardcodedColors.length > 5) {
      score -= 20;
      issues.push(`${hardcodedColors.length} hardcoded colors found`);
      recommendations.push('Use CSS custom properties or SCSS variables for colors');
    }

    if (hardcodedSizes.length > 10) {
      score -= 15;
      issues.push(`${hardcodedSizes.length} hardcoded sizes found`);
      recommendations.push('Use spacing/sizing variables for consistent design system');
    }

    if (unusedVars.length > 0) {
      score -= unusedVars.length * 5;
      issues.push(`${unusedVars.length} unused variables detected`);
      recommendations.push('Remove unused SCSS variables to reduce bundle size');
    }

    if (definedVars.size === 0 && (hardcodedColors.length > 3 || hardcodedSizes.length > 5)) {
      score -= 25;
      issues.push('No SCSS variables used despite hardcoded values');
      recommendations.push('Implement SCSS variables for maintainable design system');
    }

    // Bonus for CSS custom properties
    if (cssVariables.length > 5) {
      score += 5;
    }

    return { 
      score: Math.max(0, Math.min(100, score)), 
      issues, 
      recommendations,
      metrics: {
        variableDefinitions: definedVars.size,
        variableUsages: usedVars.size,
        unusedVariables: unusedVars.length,
        hardcodedColors: hardcodedColors.length,
        hardcodedSizes: hardcodedSizes.length,
        cssVariables: cssVariables.length,
        variableUsageRatio
      }
    };
  }

  analyzeDuplicates(content) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Extract property declarations
    const declarations = content.match(/[\w-]+\s*:\s*[^;]+;/g) || [];
    const declarationMap = new Map();
    
    declarations.forEach(decl => {
      const [property, value] = decl.split(':').map(s => s.trim());
      const key = `${property}:${value}`;
      
      if (declarationMap.has(key)) {
        declarationMap.set(key, declarationMap.get(key) + 1);
      } else {
        declarationMap.set(key, 1);
      }
    });

    // Find duplicates
    const duplicates = [...declarationMap.entries()].filter(([, count]) => count > 1);
    
    if (duplicates.length > 0) {
      score -= duplicates.length * 10;
      duplicates.slice(0, 5).forEach(([decl, count]) => {
        issues.push(`Duplicate declaration (${count}x): ${decl.substring(0, 50)}...`);
      });
      recommendations.push('Extract common declarations into reusable classes or mixins');
    }

    // Check for similar color values
    const colors = content.match(/#[0-9a-fA-F]{3,8}/g) || [];
    const colorCounts = {};
    colors.forEach(color => {
      colorCounts[color] = (colorCounts[color] || 0) + 1;
    });
    
    const similarColors = Object.entries(colorCounts).filter(([, count]) => count > 2);
    if (similarColors.length > 3) {
      score -= 15;
      issues.push(`${similarColors.length} colors used multiple times`);
      recommendations.push('Consolidate similar colors into CSS custom properties');
    }

    return { 
      score: Math.max(0, score), 
      issues, 
      recommendations,
      metrics: {
        totalDeclarations: declarations.length,
        duplicateDeclarations: duplicates.length,
        uniqueColors: Object.keys(colorCounts).length,
        repeatedColors: similarColors.length
      }
    };
  }

  analyzePerformance(content) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Check for performance issues
    const expensiveSelectors = content.match(/\*[^{]*{|\[[^=]*\*=|\[[^=]*\$=/g) || [];
    const importantDeclarations = content.match(/!important/g) || [];
    const longAnimations = content.match(/animation[^;]*[5-9]\d*s|animation[^;]*[1-9]\d+s/g) || [];
    
    // Vendor prefix analysis
    const vendorPrefixes = content.match(/-webkit-|-moz-|-ms-|-o-/g) || [];
    const modernProperties = content.match(/backdrop-filter|grid-template|mask-/g) || [];

    // Scoring
    if (expensiveSelectors.length > 0) {
      score -= expensiveSelectors.length * 20;
      issues.push(`${expensiveSelectors.length} potentially expensive selectors detected`);
      recommendations.push('Avoid attribute selectors with wildcards and universal selectors');
    }

    if (importantDeclarations.length > 3) {
      score -= importantDeclarations.length * 8;
      issues.push(`${importantDeclarations.length} !important declarations found`);
      recommendations.push('Reduce !important usage by improving selector specificity');
    }

    if (longAnimations.length > 0) {
      score -= 10;
      issues.push(`${longAnimations.length} long animations (>5s) detected`);
      recommendations.push('Consider shorter animation durations for better UX');
    }

    // Bonus for modern CSS usage
    if (modernProperties.length > 0) {
      score += 5;
    }

    // Check for unnecessary vendor prefixes
    if (vendorPrefixes.length > 10) {
      score -= 5;
      recommendations.push('Review vendor prefixes - autoprefixer may handle these automatically');
    }

    return { 
      score: Math.max(0, Math.min(100, score)), 
      issues, 
      recommendations,
      metrics: {
        expensiveSelectors: expensiveSelectors.length,
        importantDeclarations: importantDeclarations.length,
        longAnimations: longAnimations.length,
        vendorPrefixes: vendorPrefixes.length,
        modernProperties: modernProperties.length
      }
    };
  }

  analyzeMaintainability(content, filePath) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // File size analysis
    const fileSize = content.length;
    const lines = content.split('\n').length;
    
    // Comment analysis
    const comments = content.match(/\/\*[\s\S]*?\*\/|\/\/.*$/gm) || [];
    const commentRatio = comments.join('').length / content.length;

    // BEM naming convention check (for SCSS modules)
    const classSelectors = content.match(/\.[\w-]+/g) || [];
    const bemCompliant = classSelectors.filter(cls => 
      cls.match(/^\.[\w-]+(__[\w-]+)?(--[\w-]+)?$/)
    );
    const bemRatio = classSelectors.length > 0 ? bemCompliant.length / classSelectors.length : 1;

    // Media queries organization
    const mediaQueries = content.match(/@media[^{]*{/g) || [];
    const mobileFirst = content.match(/@media[^{]*min-width[^{]*{/g) || [];
    const mobileFirstRatio = mediaQueries.length > 0 ? mobileFirst.length / mediaQueries.length : 1;

    // Scoring
    if (fileSize > 50000) { // >50KB
      score -= 20;
      issues.push(`Large file size: ${Math.round(fileSize / 1024)}KB`);
      recommendations.push('Consider splitting large CSS files into smaller modules');
    } else if (fileSize > 30000) { // >30KB
      score -= 10;
      recommendations.push('Monitor file size - consider modularization for maintainability');
    }

    if (lines > 1000) {
      score -= 15;
      issues.push(`High line count: ${lines} lines`);
      recommendations.push('Break down large stylesheets into smaller, focused files');
    }

    if (commentRatio < 0.05 && lines > 200) {
      score -= 10;
      issues.push('Low comment ratio for large file');
      recommendations.push('Add comments to explain complex styles and design decisions');
    }

    if (filePath.includes('.module.') && bemRatio < 0.7) {
      score -= 15;
      issues.push(`Low BEM compliance: ${Math.round(bemRatio * 100)}%`);
      recommendations.push('Use BEM naming convention for CSS modules');
    }

    if (mediaQueries.length > 5 && mobileFirstRatio < 0.6) {
      score -= 10;
      issues.push('Consider mobile-first approach for better responsive design');
      recommendations.push('Use min-width media queries for mobile-first responsive design');
    }

    return { 
      score: Math.max(0, score), 
      issues, 
      recommendations,
      metrics: {
        fileSize,
        lines,
        commentRatio,
        bemCompliant: bemCompliant.length,
        totalClasses: classSelectors.length,
        bemRatio,
        mediaQueries: mediaQueries.length,
        mobileFirstRatio
      }
    };
  }

  analyzeProjectCompliance(content, filePath) {
    if (!this.projectConfig) return { score: 100, issues: [], recommendations: [], metrics: {} };

    const issues = [];
    const recommendations = [];
    let score = 100;
    let bonusPoints = 0;

    // Check for preferred patterns (bonus points)
    if (this.projectConfig.preferredPatterns) {
      Object.entries(this.projectConfig.preferredPatterns).forEach(([patternName, config]) => {
        if (config.patterns) {
          config.patterns.forEach(pattern => {
            const regex = new RegExp(pattern, 'g');
            const matches = content.match(regex) || [];
            if (matches.length > 0) {
              bonusPoints += Math.min(config.score, matches.length * 2);
            }
          });
        }
      });
    }

    // Check for discouraged patterns (penalties)
    if (this.projectConfig.discouragedPatterns) {
      Object.entries(this.projectConfig.discouragedPatterns).forEach(([patternName, config]) => {
        if (config.patterns) {
          config.patterns.forEach(pattern => {
            const regex = new RegExp(pattern, 'g');
            const matches = content.match(regex) || [];
            if (matches.length > 0) {
              const penalty = config.penalty || 10;
              score -= penalty;
              issues.push(`${matches.length} instances of ${patternName} found`);
              if (config.description) {
                recommendations.push(config.description);
              }
            }
          });
        }
      });
    }

    // SCSS Module compliance for .module.scss files
    if (filePath.includes('.module.scss') && this.projectConfig.componentStandards?.scssModules) {
      const standards = this.projectConfig.componentStandards.scssModules;
      
      // Check BEM compliance
      const classSelectors = content.match(/\.[a-zA-Z][\w-]*/g) || [];
      const bemCompliant = classSelectors.filter(cls => 
        cls.match(/^\.[\w-]+(__[\w-]+)?(--[\w-]+)?$/)
      );
      const bemRatio = classSelectors.length > 0 ? bemCompliant.length / classSelectors.length : 1;
      
      if (bemRatio < standards.bemCompliance) {
        score -= 15;
        issues.push(`BEM compliance below standard: ${Math.round(bemRatio * 100)}% (required: ${Math.round(standards.bemCompliance * 100)}%)`);
        recommendations.push('Use BEM naming convention: .componentName__element--modifier');
      } else {
        bonusPoints += 10; // Bonus for good BEM compliance
      }
    }

    // Check for modern gradient system usage
    const gradientClasses = content.match(/gradient-bg-|gradient-text-|glass-|animate-/g) || [];
    if (gradientClasses.length > 0) {
      bonusPoints += Math.min(15, gradientClasses.length * 2);
    }

    // Check for CSS custom properties usage
    const cssVariables = content.match(/var\(--[\w-]+\)/g) || [];
    if (cssVariables.length > 0) {
      bonusPoints += Math.min(10, cssVariables.length);
    }

    // Apply bonus points
    score = Math.min(100, score + bonusPoints);

    return {
      score: Math.max(0, score),
      issues,
      recommendations,
      metrics: {
        bonusPoints,
        gradientSystemUsage: gradientClasses.length,
        cssVariableUsage: cssVariables.length,
        projectPatternCompliance: score >= 70
      }
    };
  }

  calculateFileScore(fileResult) {
    let categories = ['selectorComplexity', 'nestingDepth', 'variableUsage', 'duplicates', 'performance', 'maintainability'];
    let weights = {
      selectorComplexity: 0.20,
      nestingDepth: 0.15,
      variableUsage: 0.15,
      duplicates: 0.15,
      performance: 0.20,
      maintainability: 0.15
    };
    
    // Use project-specific weights if available
    if (this.projectConfig?.scoring?.weights) {
      weights = { ...weights, ...this.projectConfig.scoring.weights };
    }
    
    // Add project compliance if available
    if (fileResult.projectCompliance) {
      categories.push('projectCompliance');
      weights.projectCompliance = 0.10;
      // Adjust other weights proportionally
      const adjustment = 0.90;
      Object.keys(weights).forEach(key => {
        if (key !== 'projectCompliance') {
          weights[key] *= adjustment;
        }
      });
    }

    let totalScore = 0;
    let totalWeight = 0;

    categories.forEach(category => {
      if (fileResult[category] && fileResult[category].score !== undefined) {
        const weight = weights[category];
        totalScore += fileResult[category].score * weight;
        totalWeight += weight;
      }
    });

    return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
  }

  generateReport() {
    const totalFiles = this.results.files.length;
    const averageScore = totalFiles > 0 
      ? Math.round(this.results.files.reduce((sum, file) => sum + file.score, 0) / totalFiles)
      : 0;

    this.results.overallScore = averageScore;

    if (this.options.outputFormat === 'json') {
      return this.generateJSONReport();
    } else if (this.options.outputFormat === 'minimal') {
      return this.generateMinimalReport();
    }

    // Standard detailed report
    console.log('\n🎨 CSS QUALITY REPORT');
    console.log('='.repeat(50));
    console.log(`📁 Files Analyzed: ${totalFiles}`);
    console.log(`🎯 Overall Score: ${averageScore}/100`);
    console.log(`📈 Grade: ${this.getGrade(averageScore)}`);
    console.log();

    // Score breakdown
    let categories = ['selectorComplexity', 'nestingDepth', 'variableUsage', 'duplicates', 'performance', 'maintainability'];
    
    // Add project compliance if any file has it
    if (this.results.files.some(f => f.projectCompliance)) {
      categories.push('projectCompliance');
    }
    categories.forEach(category => {
      const scores = this.results.files
        .map(f => f[category]?.score)
        .filter(s => s !== undefined);
      
      if (scores.length > 0) {
        const avgScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
        console.log(`${this.getCategoryEmoji(category)} ${this.formatCategory(category)}: ${avgScore}/100`);
      }
    });

    console.log('\n📋 DETAILED ANALYSIS');
    console.log('-'.repeat(30));

    this.results.files.forEach(file => {
      console.log(`\n🎨 ${file.path}`);
      console.log(`   Score: ${file.score}/100`);
      
      const allIssues = [
        ...file.selectorComplexity.issues,
        ...file.nestingDepth.issues,
        ...file.variableUsage.issues,
        ...file.duplicates.issues,
        ...file.performance.issues,
        ...file.maintainability.issues,
        ...(file.projectCompliance ? file.projectCompliance.issues : [])
      ].slice(0, 3); // Top 3 issues

      if (allIssues.length > 0) {
        console.log('   Issues:');
        allIssues.forEach(issue => console.log(`   ❌ ${issue}`));
      }
    });

    console.log('\n🎯 RECOMMENDATIONS');
    console.log('-'.repeat(20));

    const allRecommendations = this.results.files.flatMap(file => [
      ...file.selectorComplexity.recommendations,
      ...file.nestingDepth.recommendations,
      ...file.variableUsage.recommendations,
      ...file.duplicates.recommendations,
      ...file.performance.recommendations,
      ...file.maintainability.recommendations,
      ...(file.projectCompliance ? file.projectCompliance.recommendations : [])
    ]);

    // Get top recommendations by frequency
    const recommendationCounts = {};
    allRecommendations.forEach(rec => {
      recommendationCounts[rec] = (recommendationCounts[rec] || 0) + 1;
    });

    Object.entries(recommendationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([rec, count]) => {
        console.log(`💡 ${rec} (${count} files)`);
      });

    return this.results;
  }

  generateJSONReport() {
    const jsonReport = {
      summary: {
        overallScore: this.results.overallScore,
        grade: this.getGrade(this.results.overallScore),
        filesAnalyzed: this.results.files.length,
        status: this.getStatus(this.results.overallScore),
        timestamp: this.results.metadata.timestamp
      },
      metadata: this.results.metadata,
      categories: {
        selectorComplexity: this.getCategoryAverage('selectorComplexity'),
        nestingDepth: this.getCategoryAverage('nestingDepth'),
        variableUsage: this.getCategoryAverage('variableUsage'),
        duplicates: this.getCategoryAverage('duplicates'),
        performance: this.getCategoryAverage('performance'),
        maintainability: this.getCategoryAverage('maintainability'),
        ...(this.results.files.some(f => f.projectCompliance) && {
          projectCompliance: this.getCategoryAverage('projectCompliance')
        })
      },
      issues: this.getTopIssues(),
      recommendations: this.getTopRecommendations(),
      files: this.results.files.map(file => ({
        path: file.path,
        score: file.score,
        issues: this.getFileIssues(file).slice(0, 3)
      }))
    };

    console.log(JSON.stringify(jsonReport, null, 2));
    return jsonReport;
  }

  generateMinimalReport() {
    const score = this.results.overallScore;
    const status = this.getStatus(score);
    const topIssues = this.getTopIssues().slice(0, 3);
    
    console.log(`CSS_SCORE: ${score}/100`);
    console.log(`CSS_STATUS: ${status}`);
    console.log(`CSS_GRADE: ${this.getGrade(score)}`);
    
    if (topIssues.length > 0) {
      console.log(`CSS_ISSUES: ${topIssues.join('; ')}`);
    }
    
    return { score, status, grade: this.getGrade(score), issues: topIssues };
  }

  getCategoryAverage(category) {
    const scores = this.results.files
      .map(f => f[category]?.score)
      .filter(s => s !== undefined);
    
    return scores.length > 0 
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
      : 0;
  }

  getTopIssues() {
    const allIssues = this.results.files.flatMap(file => [
      ...file.selectorComplexity.issues,
      ...file.nestingDepth.issues,
      ...file.variableUsage.issues,
      ...file.duplicates.issues,
      ...file.performance.issues,
      ...file.maintainability.issues,
      ...(file.projectCompliance ? file.projectCompliance.issues : [])
    ]);

    const issueCounts = {};
    allIssues.forEach(issue => {
      issueCounts[issue] = (issueCounts[issue] || 0) + 1;
    });

    return Object.entries(issueCounts)
      .sort(([,a], [,b]) => b - a)
      .map(([issue]) => issue);
  }

  getTopRecommendations() {
    const allRecommendations = this.results.files.flatMap(file => [
      ...file.selectorComplexity.recommendations,
      ...file.nestingDepth.recommendations,
      ...file.variableUsage.recommendations,
      ...file.duplicates.recommendations,
      ...file.performance.recommendations,
      ...file.maintainability.recommendations,
      ...(file.projectCompliance ? file.projectCompliance.recommendations : [])
    ]);

    return [...new Set(allRecommendations)];
  }

  getFileIssues(file) {
    return [
      ...file.selectorComplexity.issues,
      ...file.nestingDepth.issues,
      ...file.variableUsage.issues,
      ...file.duplicates.issues,
      ...file.performance.issues,
      ...file.maintainability.issues,
      ...(file.projectCompliance ? file.projectCompliance.issues : [])
    ];
  }

  getCategoryEmoji(category) {
    const emojis = {
      selectorComplexity: '🎯',
      nestingDepth: '📐',
      variableUsage: '🔧',
      duplicates: '🔄',
      performance: '⚡',
      maintainability: '🔨',
      projectCompliance: '✅'
    };
    return emojis[category] || '📊';
  }

  formatCategory(category) {
    const names = {
      selectorComplexity: 'Selector Complexity',
      nestingDepth: 'Nesting Depth',
      variableUsage: 'Variable Usage',
      duplicates: 'Duplicates',
      performance: 'Performance',
      maintainability: 'Maintainability',
      projectCompliance: 'Project Standards'
    };
    return names[category] || category;
  }

  getGrade(score) {
    if (score >= 90) return 'A (Excellent)';
    if (score >= 80) return 'B (Good)';
    if (score >= 70) return 'C (Satisfactory)';
    if (score >= 60) return 'D (Needs Improvement)';
    return 'F (Major Issues)';
  }

  getStatus(score) {
    const thresholds = this.options.thresholds;
    
    if (score >= thresholds.excellent) return 'EXCELLENT';
    if (score >= thresholds.good) return 'GOOD';
    if (score >= thresholds.acceptable) return 'ACCEPTABLE';
    if (score >= thresholds.failing) return 'NEEDS_WORK';
    return 'FAILING';
  }

  async analyzeBatch(directory) {
    try {
      const files = await this.getAllFiles(directory);
      const cssFiles = files.filter(file => file.match(/\.(s?css|module\.(s?css))$/));

      console.log(`🎨 Analyzing ${cssFiles.length} CSS files in ${directory}`);

      for (const file of cssFiles) {
        await this.analyzeFile(file);
      }

      return this.generateReport();
    } catch (error) {
      console.error('❌ Error analyzing CSS batch:', error.message);
      throw error;
    }
  }

  async getAllFiles(dir) {
    const files = [];
    const items = await fs.readdir(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
        files.push(...await this.getAllFiles(fullPath));
      } else if (item.isFile()) {
        files.push(fullPath);
      }
    }

    return files;
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  
  const options = {
    outputFormat: getArgValue(args, '--format') || 'detailed',
    projectAware: !args.includes('--no-project-config'), // Default to true unless disabled
    excellent: parseInt(getArgValue(args, '--threshold-excellent')) || 90,
    good: parseInt(getArgValue(args, '--threshold-good')) || 80,
    acceptable: parseInt(getArgValue(args, '--threshold-acceptable')) || 70,
    failing: parseInt(getArgValue(args, '--threshold-failing')) || 60
  };

  const analyzer = new CSSQualityAnalyzer(options);

  try {
    if (args.includes('--file')) {
      const fileIndex = args.indexOf('--file') + 1;
      const filePath = args[fileIndex];
      if (!filePath) throw new Error('File path required');
      
      await analyzer.analyzeFile(filePath);
      analyzer.generateReport();
    }
    else if (args.includes('--batch')) {
      const batchIndex = args.indexOf('--batch') + 1;
      const directory = args[batchIndex] || 'src/';
      
      await analyzer.analyzeBatch(directory);
    }
    else {
      console.log(`
🎨 CSS Quality Checker - SCSS/CSS Analysis Tool (Project-Aware)

Usage:
  node scripts/css-quality-checker.js --file <path>     Analyze single CSS/SCSS file
  node scripts/css-quality-checker.js --batch [dir]    Analyze directory (default: src/)

Options:
  --format <detailed|json|minimal>    Output format (default: detailed)
  --no-project-config                 Disable project-specific rules (use generic CSS rules)
  --threshold-failing <score>         Custom failing threshold (default: 60)

Project-Aware Features:
  ✅ Validates against project style guide (SCSS modules + gradient system)
  ✅ Bonus points for modern gradient utilities and design tokens
  ✅ BEM naming convention validation for .module.scss files
  ✅ Project-specific pattern recommendations
  ✅ Enhanced scoring based on project standards

Examples:
  # Analyze single file with project-specific rules
  node scripts/css-quality-checker.js --file src/components/Nav.module.scss
  
  # Analyze directory with JSON output
  node scripts/css-quality-checker.js --batch src/components/ --format json
  
  # Generic CSS analysis (no project config)
  node scripts/css-quality-checker.js --file styles.scss --no-project-config
  
  # Minimal output for CI/CD
  node scripts/css-quality-checker.js --file styles.scss --format minimal
      `);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

function getArgValue(args, flag) {
  const index = args.indexOf(flag);
  return index !== -1 && index + 1 < args.length ? args[index + 1] : null;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default CSSQualityAnalyzer;
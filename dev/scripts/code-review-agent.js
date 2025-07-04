#!/usr/bin/env node

// DEPRECATION WARNING
console.warn(`
⚠️  DEPRECATION WARNING: Direct script usage is deprecated!
   Please use: npm run code:review -- --file [path]
   This direct script will be removed in next major version.
   Continuing in 3 seconds...
`);

// Give user time to see warning
await new Promise(resolve => setTimeout(resolve, 3000));

/**
 * Code Review Agent - Automated Standards Compliance Checker
 * 
 * This agent analyzes code files to ensure compliance with:
 * - Functional Programming Standards
 * - Project Development Standards
 * - TypeScript Best Practices
 * - React Component Patterns
 * 
 * Usage:
 *   node scripts/code-review-agent.js --file src/components/MyComponent.tsx
 *   node scripts/code-review-agent.js --pr 123
 *   node scripts/code-review-agent.js --batch src/components/
 */

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

class CodeReviewAgent {
  constructor(options = {}) {
    this.options = {
      aiMode: options.aiMode || false,
      agentId: options.agentId || null,
      taskId: options.taskId || null,
      outputFormat: options.outputFormat || 'detailed', // 'detailed', 'json', 'minimal'
      thresholds: {
        excellent: (options.thresholds && options.thresholds.excellent) || 90,
        good: (options.thresholds && options.thresholds.good) || 80,
        acceptable: (options.thresholds && options.thresholds.acceptable) || 70,
        failing: (options.thresholds && options.thresholds.failing) || 60
      },
      ...options
    };

    this.results = {
      functionalProgramming: { score: 0, issues: [], recommendations: [] },
      projectStandards: { score: 0, issues: [], recommendations: [] },
      typeScript: { score: 0, issues: [], recommendations: [] },
      reactPatterns: { score: 0, issues: [], recommendations: [] },
      security: { score: 0, issues: [], recommendations: [] },
      performance: { score: 0, issues: [], recommendations: [] },
      overallScore: 0,
      files: [],
      metadata: {
        agentId: this.options.agentId,
        taskId: this.options.taskId,
        timestamp: new Date().toISOString(),
        analysisMode: this.options.aiMode ? 'ai-generated' : 'human-written'
      }
    };
  }

  async analyzeFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const fileExtension = path.extname(filePath);
      
      if (this.options.outputFormat !== 'json' && this.options.outputFormat !== 'minimal') {
        console.log(`🔍 Analyzing: ${filePath}`);
      }
      
      const fileResult = {
        path: filePath,
        extension: fileExtension,
        functionalProgramming: this.checkFunctionalProgramming(content, filePath),
        projectStandards: this.checkProjectStandards(content, filePath),
        typeScript: this.checkTypeScript(content, filePath),
        reactPatterns: this.checkReactPatterns(content, filePath),
        security: this.checkSecurity(content, filePath),
        performance: this.checkPerformance(content, filePath),
        score: 0
      };

      // Calculate file score
      fileResult.score = this.calculateFileScore(fileResult);
      this.results.files.push(fileResult);
      
      return fileResult;
    } catch (error) {
      console.error(`❌ Error analyzing ${filePath}:`, error.message);
      return null;
    }
  }

  checkFunctionalProgramming(content, filePath) {
    const checks = {
      score: 100,
      issues: [],
      recommendations: [],
      patterns: {
        pureFunctions: this.checkPureFunctions(content),
        immutability: this.checkImmutability(content),
        functionComposition: this.checkFunctionComposition(content),
        sideEffects: this.checkSideEffects(content),
        arrayMethods: this.checkArrayMethods(content)
      }
    };

    // Aggregate scores from pattern checks
    const patternScores = Object.values(checks.patterns).map(p => p.score);
    checks.score = Math.round(patternScores.reduce((sum, score) => sum + score, 0) / patternScores.length);

    // Collect all issues and recommendations
    Object.values(checks.patterns).forEach(pattern => {
      checks.issues.push(...pattern.issues);
      checks.recommendations.push(...pattern.recommendations);
    });

    return checks;
  }

  checkPureFunctions(content) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Check for global variable mutations
    const globalMutations = content.match(/^\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*=(?!=)/gm);
    if (globalMutations && globalMutations.length > 0) {
      score -= 20;
      issues.push('Global variable mutations detected');
      recommendations.push('Avoid global variable mutations - use local variables or function parameters');
    }

    // Check for console.log/alert in functions (side effects)
    const sideEffectCalls = content.match(/(console\.(log|error|warn)|alert|confirm)\s*\(/g);
    if (sideEffectCalls && sideEffectCalls.length > 3) {
      score -= 10;
      issues.push('Excessive console statements detected');
      recommendations.push('Minimize console statements - consider using a logger or removing debug code');
    }

    // Check for Math.random() or Date.now() (non-deterministic)
    const nonDeterministic = content.match(/(Math\.random|Date\.now|new Date\(\))/g);
    if (nonDeterministic) {
      score -= 15;
      issues.push('Non-deterministic functions detected');
      recommendations.push('Pass random values or dates as parameters to maintain function purity');
    }

    return { score: Math.max(0, score), issues, recommendations };
  }

  checkImmutability(content) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Check for direct array mutations
    const arrayMutations = content.match(/\.(push|pop|shift|unshift|splice|sort|reverse)\s*\(/g);
    if (arrayMutations) {
      score -= 25;
      issues.push(`Array mutation methods detected: ${arrayMutations.join(', ')}`);
      recommendations.push('Use immutable array methods: [...array, newItem], array.filter(), array.map()');
    }

    // Check for Object.assign on first parameter
    const objectAssign = content.match(/Object\.assign\s*\(\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*,/g);
    if (objectAssign) {
      score -= 20;
      issues.push('Object.assign mutation detected');
      recommendations.push('Use spread operator instead: { ...object, ...updates }');
    }

    // Check for let usage where const could be used
    const letUsage = content.match(/^\s*let\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=/gm);
    if (letUsage && letUsage.length > 2) {
      score -= 10;
      issues.push('Excessive let usage detected');
      recommendations.push('Use const when variables are not reassigned');
    }

    // Check for proper spread operator usage
    const spreadUsage = content.match(/\.\.\.[a-zA-Z_$]/g);
    if (!spreadUsage || spreadUsage.length === 0) {
      score -= 15;
      issues.push('No spread operator usage detected');
      recommendations.push('Use spread operator for immutable updates: { ...obj, prop: value }');
    }

    return { score: Math.max(0, score), issues, recommendations };
  }

  checkFunctionComposition(content) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Check for long functions (>50 lines)
    const functions = content.match(/(?:function\s+\w+|const\s+\w+\s*=\s*(?:\([^)]*\)\s*=>|\([^)]*\)\s*:\s*[^=]*=>)|\w+\s*\([^)]*\)\s*{)[\s\S]*?(?=(?:function\s+\w+|const\s+\w+\s*=\s*(?:\([^)]*\)\s*=>|\([^)]*\)\s*:\s*[^=]*=>)|\w+\s*\([^)]*\)\s*{)|$)/g);
    if (functions) {
      const longFunctions = functions.filter(fn => fn.split('\n').length > 50);
      if (longFunctions.length > 0) {
        score -= 20;
        issues.push(`${longFunctions.length} functions exceed 50 lines`);
        recommendations.push('Break large functions into smaller, composable functions');
      }
    }

    // Check for arrow function usage
    const arrowFunctions = content.match(/=>\s*[{(]/g);
    const regularFunctions = content.match(/function\s+\w+/g);
    if (regularFunctions && (!arrowFunctions || arrowFunctions.length < regularFunctions.length)) {
      score -= 15;
      issues.push('Prefer arrow functions for functional style');
      recommendations.push('Use arrow functions: const fn = (param) => result');
    }

    // Check for higher-order function usage
    const higherOrderPatterns = content.match(/\.(map|filter|reduce|forEach|find|some|every)\s*\(/g);
    if (!higherOrderPatterns || higherOrderPatterns.length < 2) {
      score -= 10;
      issues.push('Limited higher-order function usage');
      recommendations.push('Use array methods like map, filter, reduce for data transformations');
    }

    return { score: Math.max(0, score), issues, recommendations };
  }

  checkSideEffects(content) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Check for DOM manipulation outside of React
    const domManipulation = content.match(/(document\.|window\.|localStorage\.|sessionStorage\.)/g);
    if (domManipulation) {
      score -= 20;
      issues.push('Direct DOM/storage manipulation detected');
      recommendations.push('Use React hooks (useEffect, useRef) for side effects');
    }

    // Check for async operations without proper error handling
    const asyncWithoutCatch = content.match(/await\s+[^;]+(?!.*\.catch)/g);
    if (asyncWithoutCatch && asyncWithoutCatch.length > 2) {
      score -= 15;
      issues.push('Async operations without error handling');
      recommendations.push('Wrap async operations in try-catch blocks');
    }

    return { score: Math.max(0, score), issues, recommendations };
  }

  checkArrayMethods(content) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Check for imperative loops where functional methods could be used
    const forLoops = content.match(/for\s*\([^)]*\)\s*{/g);
    if (forLoops && forLoops.length > 1) {
      score -= 25;
      issues.push('Imperative for loops detected');
      recommendations.push('Replace for loops with map, filter, reduce where appropriate');
    }

    // Check for forEach where map/filter might be better
    const forEach = content.match(/\.forEach\s*\(/g);
    if (forEach && forEach.length > 2) {
      score -= 10;
      issues.push('Excessive forEach usage');
      recommendations.push('Use map for transformations, filter for selections');
    }

    return { score: Math.max(0, score), issues, recommendations };
  }

  checkProjectStandards(content, filePath) {
    const checks = {
      score: 100,
      issues: [],
      recommendations: [],
      patterns: {
        fileNaming: this.checkFileNaming(filePath),
        imports: this.checkImports(content),
        exports: this.checkExports(content),
        styling: this.checkStyling(content, filePath)
      }
    };

    const patternScores = Object.values(checks.patterns).map(p => p.score);
    checks.score = Math.round(patternScores.reduce((sum, score) => sum + score, 0) / patternScores.length);

    Object.values(checks.patterns).forEach(pattern => {
      checks.issues.push(...pattern.issues);
      checks.recommendations.push(...pattern.recommendations);
    });

    return checks;
  }

  checkFileNaming(filePath) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    const fileName = path.basename(filePath);
    const dirName = path.basename(path.dirname(filePath));

    // Check for PascalCase component files
    if (filePath.includes('/components/') && !fileName.match(/^[A-Z][a-zA-Z0-9]*\.(tsx|jsx)$/)) {
      score -= 20;
      issues.push('Component files should use PascalCase');
      recommendations.push('Name component files with PascalCase: MyComponent.tsx');
    }

    // Check for camelCase utility files
    if (filePath.includes('/utils/') && !fileName.match(/^[a-z][a-zA-Z0-9]*\.(ts|js)$/)) {
      score -= 15;
      issues.push('Utility files should use camelCase');
      recommendations.push('Name utility files with camelCase: myUtility.ts');
    }

    // Check for SCSS module naming
    if (fileName.endsWith('.scss') && !fileName.includes('.module.') && filePath.includes('/components/')) {
      score -= 10;
      issues.push('Component styles should use SCSS modules');
      recommendations.push('Use SCSS modules: Component.module.scss');
    }

    return { score: Math.max(0, score), issues, recommendations };
  }

  checkImports(content) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Check for relative imports going up multiple levels
    const deepRelativeImports = content.match(/import.*from\s+['"](\.\.\/){3,}/g);
    if (deepRelativeImports) {
      score -= 15;
      issues.push('Deep relative imports detected');
      recommendations.push('Use path aliases from tsconfig for cleaner imports');
    }

    // Check for missing React import in TSX files
    if (content.includes('JSX.Element') || content.includes('<')) {
      const reactImport = content.match(/import.*React.*from\s+['"]react['"]/);
      if (!reactImport) {
        score -= 10;
        issues.push('Missing React import in JSX file');
        recommendations.push('Import React: import React from "react"');
      }
    }

    return { score: Math.max(0, score), issues, recommendations };
  }

  checkExports(content) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Check for default exports in components
    const hasDefaultExport = content.match(/export\s+default/);
    const hasNamedExports = content.match(/export\s+(?:const|function|class)/);

    if (!hasDefaultExport && !hasNamedExports) {
      score -= 25;
      issues.push('No exports detected');
      recommendations.push('Components should have default exports');
    }

    return { score: Math.max(0, score), issues, recommendations };
  }

  checkStyling(content, filePath) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Check for inline styles in components
    const inlineStyles = content.match(/style\s*=\s*{{/g);
    if (inlineStyles && inlineStyles.length > 2) {
      score -= 15;
      issues.push('Excessive inline styles detected');
      recommendations.push('Use SCSS modules for component styling');
    }

    // Check for SCSS module import if file is component
    if (filePath.includes('/components/') && content.includes('className') && !content.match(/import.*styles.*from.*\.module\.scss/)) {
      score -= 20;
      issues.push('Missing SCSS module import');
      recommendations.push('Import SCSS module: import styles from "./Component.module.scss"');
    }

    return { score: Math.max(0, score), issues, recommendations };
  }

  checkTypeScript(content, filePath) {
    const checks = {
      score: 100,
      issues: [],
      recommendations: [],
      patterns: {
        typeAnnotations: this.checkTypeAnnotations(content),
        interfaces: this.checkInterfaces(content),
        generics: this.checkGenerics(content),
        anyUsage: this.checkAnyUsage(content)
      }
    };

    const patternScores = Object.values(checks.patterns).map(p => p.score);
    checks.score = Math.round(patternScores.reduce((sum, score) => sum + score, 0) / patternScores.length);

    Object.values(checks.patterns).forEach(pattern => {
      checks.issues.push(...pattern.issues);
      checks.recommendations.push(...pattern.recommendations);
    });

    return checks;
  }

  checkTypeAnnotations(content) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Check for untyped function parameters
    const untypedParams = content.match(/\([^:)]*\)\s*=>/g);
    if (untypedParams && untypedParams.length > 2) {
      score -= 20;
      issues.push('Untyped function parameters detected');
      recommendations.push('Add type annotations to function parameters');
    }

    // Check for missing return type annotations
    const functionsWithoutReturnType = content.match(/(?:function\s+\w+|const\s+\w+\s*=)\s*\([^)]*\)(?!\s*:\s*[A-Za-z])/g);
    if (functionsWithoutReturnType && functionsWithoutReturnType.length > 1) {
      score -= 15;
      issues.push('Missing return type annotations');
      recommendations.push('Add return type annotations to functions');
    }

    return { score: Math.max(0, score), issues, recommendations };
  }

  checkInterfaces(content) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Check for object types instead of interfaces
    const objectTypes = content.match(/:\s*{\s*[^}]+\s*}/g);
    if (objectTypes && objectTypes.length > 2) {
      score -= 10;
      issues.push('Consider using interfaces for complex object types');
      recommendations.push('Define interfaces for reusable object types');
    }

    return { score: Math.max(0, score), issues, recommendations };
  }

  checkGenerics(content) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Check for potential generic usage
    const repeatedTypes = content.match(/:\s*(string|number|boolean)\[\]/g);
    if (repeatedTypes && repeatedTypes.length > 3) {
      score -= 10;
      issues.push('Consider using generics for reusable type patterns');
      recommendations.push('Use generic types for flexible, reusable functions');
    }

    return { score: Math.max(0, score), issues, recommendations };
  }

  checkAnyUsage(content) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Check for any type usage
    const anyUsage = content.match(/:\s*any(?!\w)/g);
    if (anyUsage) {
      score -= 30;
      issues.push(`'any' type usage detected (${anyUsage.length} occurrences)`);
      recommendations.push('Replace any with specific types or unknown');
    }

    return { score: Math.max(0, score), issues, recommendations };
  }

  checkReactPatterns(content, filePath) {
    if (!filePath.match(/\.(tsx|jsx)$/)) {
      return { score: 100, issues: [], recommendations: [] };
    }

    const checks = {
      score: 100,
      issues: [],
      recommendations: [],
      patterns: {
        functionalComponents: this.checkFunctionalComponents(content),
        hooks: this.checkHooks(content),
        props: this.checkProps(content),
        memoization: this.checkMemoization(content)
      }
    };

    const patternScores = Object.values(checks.patterns).map(p => p.score);
    checks.score = Math.round(patternScores.reduce((sum, score) => sum + score, 0) / patternScores.length);

    Object.values(checks.patterns).forEach(pattern => {
      checks.issues.push(...pattern.issues);
      checks.recommendations.push(...pattern.recommendations);
    });

    return checks;
  }

  checkFunctionalComponents(content) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Check for class components
    const classComponents = content.match(/class\s+\w+\s+extends\s+React\.Component/g);
    if (classComponents) {
      score -= 30;
      issues.push('Class components detected');
      recommendations.push('Use functional components with hooks instead');
    }

    // Check for React.FC usage
    const reactFC = content.match(/React\.FC\s*</g);
    if (reactFC) {
      score += 10; // Bonus for explicit typing
    }

    return { score: Math.max(0, score), issues, recommendations };
  }

  checkHooks(content) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Check for hooks in conditional statements
    const conditionalHooks = content.match(/if\s*\([^)]*\)\s*{[^}]*use[A-Z]/g);
    if (conditionalHooks) {
      score -= 25;
      issues.push('Hooks called conditionally');
      recommendations.push('Always call hooks at the top level of components');
    }

    // Check for missing dependency arrays
    const effectsWithoutDeps = content.match(/useEffect\s*\([^,)]+\)\s*(?!,)/g);
    if (effectsWithoutDeps) {
      score -= 15;
      issues.push('useEffect without dependency array');
      recommendations.push('Always provide dependency array to useEffect');
    }

    return { score: Math.max(0, score), issues, recommendations };
  }

  checkProps(content) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Check for prop drilling (more than 3 levels)
    const propPassing = content.match(/\w+\s*=\s*{\s*\w+\s*}/g);
    if (propPassing && propPassing.length > 5) {
      score -= 10;
      issues.push('Potential prop drilling detected');
      recommendations.push('Consider using context or state management for deeply nested props');
    }

    return { score: Math.max(0, score), issues, recommendations };
  }

  checkMemoization(content) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Check for React.memo usage on components
    const memoUsage = content.match(/React\.memo\s*\(/g);
    const componentExports = content.match(/export\s+default\s+\w+/g);
    
    if (componentExports && !memoUsage) {
      score -= 10;
      issues.push('Consider using React.memo for performance optimization');
      recommendations.push('Wrap components in React.memo to prevent unnecessary re-renders');
    }

    // Check for missing useCallback/useMemo
    const functionProps = content.match(/const\s+handle\w+\s*=/g);
    const useCallback = content.match(/useCallback\s*\(/g);
    
    if (functionProps && functionProps.length > 1 && (!useCallback || useCallback.length === 0)) {
      score -= 15;
      issues.push('Consider using useCallback for event handlers');
      recommendations.push('Wrap event handlers in useCallback to prevent re-renders');
    }

    return { score: Math.max(0, score), issues, recommendations };
  }

  calculateFileScore(fileResult) {
    const weights = {
      functionalProgramming: 0.4,
      projectStandards: 0.2,
      typeScript: 0.2,
      reactPatterns: 0.2
    };

    let totalScore = 0;
    let totalWeight = 0;

    Object.entries(weights).forEach(([category, weight]) => {
      if (fileResult[category] && fileResult[category].score !== undefined) {
        totalScore += fileResult[category].score * weight;
        totalWeight += weight;
      }
    });

    return Math.round(totalScore / totalWeight);
  }

  generateReport() {
    const totalFiles = this.results.files.length;
    const averageScore = totalFiles > 0 
      ? Math.round(this.results.files.reduce((sum, file) => sum + file.score, 0) / totalFiles)
      : 0;

    this.results.overallScore = averageScore;

    // AI-optimized output formats
    if (this.options.outputFormat === 'json') {
      return this.generateJSONReport();
    } else if (this.options.outputFormat === 'minimal') {
      return this.generateMinimalReport();
    } else if (this.options.aiMode) {
      return this.generateAIReport();
    }

    // Standard detailed report
    console.log('\n📊 CODE REVIEW REPORT');
    console.log('='.repeat(50));
    console.log(`📁 Files Analyzed: ${totalFiles}`);
    console.log(`🎯 Overall Score: ${averageScore}/100`);
    console.log(`📈 Grade: ${this.getGrade(averageScore)}`);
    
    if (this.results.metadata.agentId) {
      console.log(`🤖 Agent ID: ${this.results.metadata.agentId}`);
    }
    if (this.results.metadata.taskId) {
      console.log(`📋 Task ID: ${this.results.metadata.taskId}`);
    }
    console.log();

    // Score breakdown
    const categories = ['functionalProgramming', 'projectStandards', 'typeScript', 'reactPatterns'];
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
      console.log(`\n📄 ${file.path}`);
      console.log(`   Score: ${file.score}/100`);
      
      const allIssues = [
        ...file.functionalProgramming.issues,
        ...file.projectStandards.issues,
        ...file.typeScript.issues,
        ...file.reactPatterns.issues
      ].slice(0, 3); // Top 3 issues

      if (allIssues.length > 0) {
        console.log('   Issues:');
        allIssues.forEach(issue => console.log(`   ❌ ${issue}`));
      }
    });

    console.log('\n🎯 RECOMMENDATIONS');
    console.log('-'.repeat(20));

    const allRecommendations = this.results.files.flatMap(file => [
      ...file.functionalProgramming.recommendations,
      ...file.projectStandards.recommendations,
      ...file.typeScript.recommendations,
      ...file.reactPatterns.recommendations
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
    // Clean JSON output for programmatic access
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
        functionalProgramming: this.getCategoryAverage('functionalProgramming'),
        projectStandards: this.getCategoryAverage('projectStandards'),
        typeScript: this.getCategoryAverage('typeScript'),
        reactPatterns: this.getCategoryAverage('reactPatterns')
      },
      issues: this.getTopIssues(),
      recommendations: this.getTopRecommendations(),
      files: this.results.files.map(file => ({
        path: file.path,
        score: file.score,
        issues: this.getFileIssues(file).slice(0, 3) // Top 3 issues per file
      }))
    };

    console.log(JSON.stringify(jsonReport, null, 2));
    return jsonReport;
  }

  generateMinimalReport() {
    // Minimal output for AI consumption
    const score = this.results.overallScore;
    const status = this.getStatus(score);
    const topIssues = this.getTopIssues().slice(0, 3);
    
    console.log(`SCORE: ${score}/100`);
    console.log(`STATUS: ${status}`);
    console.log(`GRADE: ${this.getGrade(score)}`);
    
    if (topIssues.length > 0) {
      console.log(`TOP_ISSUES: ${topIssues.join('; ')}`);
    }
    
    return { score, status, grade: this.getGrade(score), issues: topIssues };
  }

  generateAIReport() {
    // AI-optimized report with learning focus
    const score = this.results.overallScore;
    const totalFiles = this.results.files.length;
    
    console.log('\n🤖 AI CODE REVIEW FEEDBACK');
    console.log('='.repeat(40));
    console.log(`📊 Overall Quality: ${score}/100 (${this.getGrade(score)})`);
    console.log(`📁 Files Analyzed: ${totalFiles}`);
    
    if (this.results.metadata.agentId) {
      console.log(`🤖 Agent: ${this.results.metadata.agentId}`);
    }
    
    // AI-specific guidance
    if (score < this.options.thresholds.acceptable) {
      console.log('\n❌ REQUIRES REFACTORING');
      console.log('The generated code needs significant improvements before it meets project standards.');
    } else if (score < this.options.thresholds.good) {
      console.log('\n⚠️ NEEDS IMPROVEMENT');
      console.log('Code is functional but should be refactored to follow functional programming principles.');
    } else {
      console.log('\n✅ MEETS STANDARDS');
      console.log('Code follows functional programming principles and project standards.');
    }

    // Learning feedback for AI
    console.log('\n📚 KEY LEARNING POINTS:');
    const topRecommendations = this.getTopRecommendations().slice(0, 5);
    topRecommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });

    // Pattern improvement suggestions
    console.log('\n🎯 FUNCTIONAL PROGRAMMING FOCUS:');
    const fpScore = this.getCategoryAverage('functionalProgramming');
    if (fpScore < 75) {
      console.log('- Emphasize pure functions (no side effects)');
      console.log('- Use immutable data patterns (spread operators)');
      console.log('- Prefer function composition over imperative code');
      console.log('- Use array methods (map, filter, reduce) instead of loops');
    } else {
      console.log('- Functional programming patterns are well implemented');
      console.log('- Continue using these patterns in future code generation');
    }

    return this.results;
  }

  getStatus(score) {
    // Fallback thresholds if options are not properly set
    const thresholds = this.options?.thresholds || {
      excellent: 90,
      good: 80,
      acceptable: 70,
      failing: 60
    };
    
    if (score >= thresholds.excellent) return 'EXCELLENT';
    if (score >= thresholds.good) return 'GOOD';
    if (score >= thresholds.acceptable) return 'ACCEPTABLE';
    if (score >= thresholds.failing) return 'NEEDS_WORK';
    return 'FAILING';
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
      ...file.functionalProgramming.issues,
      ...file.projectStandards.issues,
      ...file.typeScript.issues,
      ...file.reactPatterns.issues
    ]);

    // Count issue frequency
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
      ...file.functionalProgramming.recommendations,
      ...file.projectStandards.recommendations,
      ...file.typeScript.recommendations,
      ...file.reactPatterns.recommendations
    ]);

    // Remove duplicates and return top recommendations
    return [...new Set(allRecommendations)];
  }

  getFileIssues(file) {
    return [
      ...file.functionalProgramming.issues,
      ...file.projectStandards.issues,
      ...file.typeScript.issues,
      ...file.reactPatterns.issues
    ];
  }

  getCategoryEmoji(category) {
    const emojis = {
      functionalProgramming: '⚡',
      projectStandards: '📏',
      typeScript: '🔷',
      reactPatterns: '⚛️'
    };
    return emojis[category] || '📊';
  }

  formatCategory(category) {
    const names = {
      functionalProgramming: 'Functional Programming',
      projectStandards: 'Project Standards',
      typeScript: 'TypeScript',
      reactPatterns: 'React Patterns'
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

  async analyzePR(prNumber) {
    try {
      // Get changed files from PR
      const changedFiles = execSync(`gh pr diff ${prNumber} --name-only`)
        .toString()
        .trim()
        .split('\n')
        .filter(file => file.match(/\.(ts|tsx|js|jsx)$/));

      console.log(`🔍 Analyzing PR #${prNumber} - ${changedFiles.length} files`);

      for (const file of changedFiles) {
        await this.analyzeFile(file);
      }

      return this.generateReport();
    } catch (error) {
      console.error('❌ Error analyzing PR:', error.message);
      throw error;
    }
  }

  async analyzeBatch(directory) {
    try {
      const files = await this.getAllFiles(directory);
      const codeFiles = files.filter(file => file.match(/\.(ts|tsx|js|jsx)$/));

      console.log(`🔍 Analyzing ${codeFiles.length} files in ${directory}`);

      for (const file of codeFiles) {
        await this.analyzeFile(file);
      }

      return this.generateReport();
    } catch (error) {
      console.error('❌ Error analyzing batch:', error.message);
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
  
  // Parse AI orchestrator options
  const options = {
    aiMode: args.includes('--ai-mode'),
    agentId: getArgValue(args, '--agent-id'),
    taskId: getArgValue(args, '--task-id'),
    outputFormat: getArgValue(args, '--format') || 'detailed',
    thresholds: {
      excellent: parseInt(getArgValue(args, '--threshold-excellent')) || 90,
      good: parseInt(getArgValue(args, '--threshold-good')) || 80,
      acceptable: parseInt(getArgValue(args, '--threshold-acceptable')) || 70,
      failing: parseInt(getArgValue(args, '--threshold-failing')) || 60
    }
  };

  const agent = new CodeReviewAgent(options);

  try {
    if (args.includes('--file')) {
      const fileIndex = args.indexOf('--file') + 1;
      const filePath = args[fileIndex];
      if (!filePath) throw new Error('File path required');
      
      await agent.analyzeFile(filePath);
      const results = agent.generateReport();
      
      // Exit with error code for failing scores (AI orchestrator integration)
      if (options.aiMode && results.overallScore < options.thresholds.failing) {
        process.exit(1);
      }
    }
    else if (args.includes('--pr')) {
      const prIndex = args.indexOf('--pr') + 1;
      const prNumber = args[prIndex];
      if (!prNumber) throw new Error('PR number required');
      
      await agent.analyzePR(prNumber);
    }
    else if (args.includes('--batch')) {
      const batchIndex = args.indexOf('--batch') + 1;
      const directory = args[batchIndex] || 'src/';
      
      await agent.analyzeBatch(directory);
    }
    else {
      console.log(`
🤖 Code Review Agent - Standards Compliance Checker

Basic Usage:
  node scripts/code-review-agent.js --file <path>     Analyze single file
  node scripts/code-review-agent.js --pr <number>    Analyze PR changes
  node scripts/code-review-agent.js --batch [dir]    Analyze directory (default: src/)

AI Orchestrator Options:
  --ai-mode                           Enable AI-optimized output and error codes
  --agent-id <id>                     Track which AI agent generated the code
  --task-id <id>                      Associate analysis with specific task
  --format <detailed|json|minimal>    Output format (default: detailed)
  --threshold-failing <score>         Custom failing threshold (default: 60)

Examples:
  # Basic file analysis
  node scripts/code-review-agent.js --file src/components/MyComponent.tsx
  
  # AI agent workflow
  node scripts/code-review-agent.js --file src/components/NewComponent.tsx --ai-mode --agent-id "claude-dev-1" --task-id "create-product-card" --format json
  
  # Minimal output for programmatic use
  node scripts/code-review-agent.js --file src/utils/helper.ts --format minimal
  
  # Custom thresholds
  node scripts/code-review-agent.js --batch src/components/ --threshold-failing 70
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

export default CodeReviewAgent;
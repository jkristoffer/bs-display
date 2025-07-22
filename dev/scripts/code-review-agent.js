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
import fsSync from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { Project, SyntaxKind } from 'ts-morph';

class CodeReviewAgent {
  constructor(options = {}) {
    // Load configuration
    this.config = this.loadConfiguration();
    
    this.options = {
      aiMode: options.aiMode || false,
      agentId: options.agentId || null,
      taskId: options.taskId || null,
      outputFormat: options.outputFormat || this.config.reporting?.format || 'detailed',
      thresholds: {
        excellent: (options.thresholds && options.thresholds.excellent) || this.config.thresholds?.excellent || 90,
        good: (options.thresholds && options.thresholds.good) || this.config.thresholds?.good || 80,
        acceptable: (options.thresholds && options.thresholds.acceptable) || this.config.thresholds?.acceptable || 70,
        failing: (options.thresholds && options.thresholds.failing) || this.config.thresholds?.failing || 60
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

    // Initialize TypeScript project for AST analysis
    this.project = new Project({
      compilerOptions: {
        target: 'ES2020',
        module: 'ESNext',
        jsx: 'react-jsx',
        allowJs: true,
        skipLibCheck: true
      }
    });
  }

  // AST Utility Methods
  getSourceFileAST(filePath, content) {
    try {
      // Clean up any existing source file
      const existingFile = this.project.getSourceFile(filePath);
      if (existingFile) {
        this.project.removeSourceFile(existingFile);
      }
      
      return this.project.createSourceFile(filePath, content, { overwrite: true });
    } catch (error) {
      // Fallback to basic AST if TypeScript parsing fails
      return null;
    }
  }

  // McCabe Cyclomatic Complexity Calculator
  calculateCyclomaticComplexity(functionNode) {
    let complexity = 1; // Base complexity

    const decisionNodes = [
      SyntaxKind.IfStatement,
      SyntaxKind.WhileStatement,
      SyntaxKind.ForStatement,
      SyntaxKind.ForInStatement,
      SyntaxKind.ForOfStatement,
      SyntaxKind.DoWhileStatement,
      SyntaxKind.SwitchStatement,
      SyntaxKind.CaseClause,
      SyntaxKind.ConditionalExpression, // ternary operator
      SyntaxKind.CatchClause,
      SyntaxKind.BinaryExpression // for && and ||
    ];

    functionNode.forEachDescendant((node) => {
      if (decisionNodes.includes(node.getKind())) {
        // Special handling for binary expressions (&&, ||)
        if (node.getKind() === SyntaxKind.BinaryExpression) {
          const operator = node.getOperatorToken().getKind();
          if (operator === SyntaxKind.AmpersandAmpersandToken || 
              operator === SyntaxKind.BarBarToken) {
            complexity++;
          }
        } else {
          complexity++;
        }
      }
    });

    return complexity;
  }

  // Complexity Classification
  getComplexityGrade(complexity) {
    if (complexity <= 5) return { grade: 'Simple', score: 100 };
    if (complexity <= 10) return { grade: 'Moderate', score: 80 };
    if (complexity <= 15) return { grade: 'Complex', score: 60 };
    if (complexity <= 20) return { grade: 'Very Complex', score: 40 };
    return { grade: 'Extremely Complex', score: 20 };
  }

  // Extract all functions from AST
  extractFunctions(sourceFile) {
    const functions = [];
    
    if (!sourceFile) return functions;

    sourceFile.forEachDescendant((node) => {
      if (node.getKind() === SyntaxKind.FunctionDeclaration ||
          node.getKind() === SyntaxKind.FunctionExpression ||
          node.getKind() === SyntaxKind.ArrowFunction ||
          node.getKind() === SyntaxKind.MethodDeclaration) {
        
        const startLine = node.getStartLineNumber();
        const endLine = node.getEndLineNumber();
        const lineCount = endLine - startLine + 1;
        const complexity = this.calculateCyclomaticComplexity(node);
        const complexityGrade = this.getComplexityGrade(complexity);
        
        let name = 'anonymous';
        if (node.getKind() === SyntaxKind.FunctionDeclaration) {
          name = node.getName() || 'anonymous';
        } else if (node.getKind() === SyntaxKind.MethodDeclaration) {
          name = node.getName();
        } else if (node.getParent()?.getKind() === SyntaxKind.VariableDeclaration) {
          name = node.getParent().getName();
        }

        functions.push({
          name,
          lineCount,
          complexity,
          complexityGrade: complexityGrade.grade,
          complexityScore: complexityGrade.score,
          startLine,
          endLine,
          nodeKind: node.getKindName()
        });
      }
    });

    return functions;
  }

  loadConfiguration() {
    const configPaths = [
      path.join(process.cwd(), '.codereview.json'),
      path.join(process.cwd(), '.codereview.js'),
      path.join(process.cwd(), 'codereview.config.json'),
      path.join(process.cwd(), 'codereview.config.js')
    ];

    for (const configPath of configPaths) {
      try {
        const configData = fsSync.readFileSync(configPath, 'utf-8');
        const config = JSON.parse(configData);
        
        if (this.options && this.options.outputFormat !== 'json' && this.options.outputFormat !== 'minimal') {
          console.log(`📋 Loaded configuration from: ${configPath}`);
        }
        
        return config;
      } catch (error) {
        // Continue to next config file
      }
    }

    // Return default configuration if no config file found
    return {
      rules: {
        functionalProgramming: { enabled: true, weight: 0.25 },
        projectStandards: { enabled: true, weight: 0.15 },
        typeScript: { enabled: true, weight: 0.15 },
        reactPatterns: { enabled: true, weight: 0.15 },
        security: { enabled: true, weight: 0.20 },
        performance: { enabled: true, weight: 0.10 }
      },
      thresholds: {
        excellent: 90,
        good: 80,
        acceptable: 70,
        failing: 60
      }
    };
  }

  isRuleEnabled(ruleName) {
    return this.config.rules?.[ruleName]?.enabled !== false;
  }

  getRuleWeight(ruleName) {
    return this.config.rules?.[ruleName]?.weight || 0.1;
  }

  getRuleCustomSettings(ruleName) {
    return this.config.rules?.[ruleName]?.custom || {};
  }

  shouldIgnoreFile(filePath) {
    if (!this.config.ignore) return false;
    
    const ignorePatterns = this.config.ignore;
    const relativePath = path.relative(process.cwd(), filePath);
    
    return ignorePatterns.some(pattern => {
      // Simple glob pattern matching
      const regexPattern = pattern
        .replace(/\*\*/g, '.*')
        .replace(/\*/g, '[^/]*')
        .replace(/\?/g, '.');
      
      return new RegExp(regexPattern).test(relativePath);
    });
  }

  async analyzeFile(filePath) {
    try {
      // Check if file should be ignored
      if (this.shouldIgnoreFile(filePath)) {
        if (this.options.outputFormat !== 'json' && this.options.outputFormat !== 'minimal') {
          console.log(`⏭️  Skipping ignored file: ${filePath}`);
        }
        return null;
      }

      const content = await fs.readFile(filePath, 'utf-8');
      const fileExtension = path.extname(filePath);
      
      if (this.options.outputFormat !== 'json' && this.options.outputFormat !== 'minimal') {
        console.log(`🔍 Analyzing: ${filePath}`);
      }
      
      const fileResult = {
        path: filePath,
        extension: fileExtension,
        score: 0
      };

      // Only run enabled checks
      if (this.isRuleEnabled('functionalProgramming')) {
        fileResult.functionalProgramming = this.checkFunctionalProgramming(content, filePath);
      }
      if (this.isRuleEnabled('projectStandards')) {
        fileResult.projectStandards = this.checkProjectStandards(content, filePath);
      }
      if (this.isRuleEnabled('typeScript')) {
        fileResult.typeScript = this.checkTypeScript(content, filePath);
      }
      if (this.isRuleEnabled('reactPatterns')) {
        fileResult.reactPatterns = this.checkReactPatterns(content, filePath);
      }
      if (this.isRuleEnabled('security')) {
        fileResult.security = this.checkSecurity(content, filePath);
      }
      if (this.isRuleEnabled('performance')) {
        fileResult.performance = this.checkPerformance(content, filePath);
      }

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
        functionComposition: this.checkFunctionComposition(content, filePath),
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

  checkFunctionComposition(content, filePath) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Get AST-based function analysis
    const sourceFile = this.getSourceFileAST(filePath, content);
    const functions = this.extractFunctions(sourceFile);

    // AST-based complexity analysis
    if (functions.length > 0) {
      const complexFunctions = functions.filter(fn => fn.complexity > 10);
      const veryComplexFunctions = functions.filter(fn => fn.complexity > 15);
      const longFunctions = functions.filter(fn => fn.lineCount > 50);

      // Cyclomatic complexity scoring
      if (veryComplexFunctions.length > 0) {
        score -= 30;
        issues.push(`${veryComplexFunctions.length} functions have very high complexity (>15)`);
        recommendations.push('Refactor complex functions using smaller, focused functions');
      } else if (complexFunctions.length > 0) {
        score -= 20;
        issues.push(`${complexFunctions.length} functions have high complexity (>10)`);
        recommendations.push('Consider breaking down complex functions into smaller parts');
      }

      // Function length analysis
      if (longFunctions.length > 0) {
        score -= 15;
        issues.push(`${longFunctions.length} functions exceed 50 lines`);
        recommendations.push('Break large functions into smaller, composable functions');
      }

      // Add detailed complexity breakdown to issues for very complex functions
      veryComplexFunctions.forEach(fn => {
        issues.push(`Function '${fn.name}' has complexity ${fn.complexity} (${fn.complexityGrade})`);
      });
    }

    // Fallback to regex analysis if AST fails
    if (!sourceFile) {
      const regexFunctions = content.match(/(?:function\s+\w+|const\s+\w+\s*=\s*(?:\([^)]*\)\s*=>|\([^)]*\)\s*:\s*[^=]*=>)|\w+\s*\([^)]*\)\s*{)[\s\S]*?(?=(?:function\s+\w+|const\s+\w+\s*=\s*(?:\([^)]*\)\s*=>|\([^)]*\)\s*:\s*[^=]*=>)|\w+\s*\([^)]*\)\s*{)|$)/g);
      if (regexFunctions) {
        const longFunctions = regexFunctions.filter(fn => fn.split('\n').length > 50);
        if (longFunctions.length > 0) {
          score -= 20;
          issues.push(`${longFunctions.length} functions exceed 50 lines (regex analysis)`);
          recommendations.push('Break large functions into smaller, composable functions');
        }
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

    return { score: Math.max(0, score), issues, recommendations, functions };
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

  checkSecurity(content, filePath) {
    const checks = {
      score: 100,
      issues: [],
      recommendations: [],
      patterns: {
        xssVulnerabilities: this.checkXSSVulnerabilities(content),
        secretsExposure: this.checkSecretsExposure(content),
        unsafePatterns: this.checkUnsafePatterns(content),
        inputValidation: this.checkInputValidation(content),
        authenticationIssues: this.checkAuthenticationIssues(content)
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

  checkXSSVulnerabilities(content) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Check for dangerouslySetInnerHTML usage
    const dangerousHTML = content.match(/dangerouslySetInnerHTML\s*=\s*{/g);
    if (dangerousHTML) {
      score -= 30;
      issues.push('Potential XSS vulnerability: dangerouslySetInnerHTML usage detected');
      recommendations.push('Avoid dangerouslySetInnerHTML - use sanitization libraries or secure alternatives');
    }

    // Check for unescaped user input in JSX
    const directUserInput = content.match(/{\s*[a-zA-Z_$][a-zA-Z0-9_$]*\.(innerHTML|outerHTML)\s*}/g);
    if (directUserInput) {
      score -= 25;
      issues.push('Direct HTML injection detected in JSX');
      recommendations.push('Sanitize HTML content before rendering');
    }

    // Check for eval() usage
    const evalUsage = content.match(/eval\s*\(/g);
    if (evalUsage) {
      score -= 40;
      issues.push('Critical: eval() usage detected');
      recommendations.push('Never use eval() - use safe alternatives like JSON.parse()');
    }

    // Check for Function constructor
    const functionConstructor = content.match(/new\s+Function\s*\(/g);
    if (functionConstructor) {
      score -= 35;
      issues.push('Function constructor usage detected');
      recommendations.push('Avoid Function constructor - use proper function declarations');
    }

    return { score: Math.max(0, score), issues, recommendations };
  }

  checkSecretsExposure(content) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Check for hardcoded API keys
    const apiKeyPatterns = [
      /(?:api[_-]?key|apikey)\s*[:=]\s*['"][a-zA-Z0-9_-]{20,}['"]/gi,
      /(?:secret|token|password)\s*[:=]\s*['"][a-zA-Z0-9_-]{16,}['"]/gi,
      /(?:aws[_-]?access[_-]?key|access[_-]?key[_-]?id)\s*[:=]\s*['"][A-Z0-9]{16,}['"]/gi
    ];

    apiKeyPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        score -= 50;
        issues.push(`Potential hardcoded credentials detected: ${matches.length} instances`);
        recommendations.push('Move sensitive credentials to environment variables');
      }
    });

    // Check for console.log with sensitive data
    const consoleSecrets = content.match(/console\.log\([^)]*(?:password|token|secret|key|auth)[^)]*\)/gi);
    if (consoleSecrets) {
      score -= 20;
      issues.push('Console logging of sensitive data detected');
      recommendations.push('Remove console.log statements containing sensitive information');
    }

    // Check for localStorage/sessionStorage with sensitive data
    const storageSecrets = content.match(/(?:localStorage|sessionStorage)\.(?:setItem|getItem)\([^)]*(?:password|token|secret|key|auth)[^)]*\)/gi);
    if (storageSecrets) {
      score -= 25;
      issues.push('Browser storage of sensitive data detected');
      recommendations.push('Use secure storage mechanisms or avoid storing sensitive data client-side');
    }

    return { score: Math.max(0, score), issues, recommendations };
  }

  checkUnsafePatterns(content) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Check for document.write usage
    const documentWrite = content.match(/document\.write\s*\(/g);
    if (documentWrite) {
      score -= 30;
      issues.push('Unsafe document.write usage detected');
      recommendations.push('Use modern DOM manipulation methods instead of document.write');
    }

    // Check for innerHTML with user input
    const innerHTML = content.match(/innerHTML\s*=\s*[^'"]/g);
    if (innerHTML) {
      score -= 25;
      issues.push('Potential innerHTML injection vulnerability');
      recommendations.push('Use textContent or secure DOM methods instead of innerHTML');
    }

    // Check for window.open with user input
    const windowOpen = content.match(/window\.open\s*\([^)]*[a-zA-Z_$][a-zA-Z0-9_$]*[^)]*\)/g);
    if (windowOpen) {
      score -= 20;
      issues.push('Potential window.open with user input detected');
      recommendations.push('Validate and sanitize URLs before using window.open');
    }

    // Check for postMessage without origin validation
    const postMessage = content.match(/postMessage\s*\([^)]*\)/g);
    const originValidation = content.match(/\.origin\s*===\s*['"][^'"]*['"]/g);
    if (postMessage && !originValidation) {
      score -= 30;
      issues.push('postMessage without origin validation detected');
      recommendations.push('Always validate message origin in postMessage handlers');
    }

    return { score: Math.max(0, score), issues, recommendations };
  }

  checkInputValidation(content) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Check for direct form input usage without validation
    const formInputs = content.match(/(?:input|textarea|select).*value\s*=\s*{[^}]*}/g);
    const validationPatterns = content.match(/(?:validate|sanitize|clean|escape)/gi);
    
    if (formInputs && formInputs.length > 2 && (!validationPatterns || validationPatterns.length === 0)) {
      score -= 20;
      issues.push('Form inputs without apparent validation detected');
      recommendations.push('Implement input validation and sanitization for all form fields');
    }

    // Check for SQL-like string concatenation
    const sqlLike = content.match(/['"][^'"]*\s*\+\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*\+\s*['"][^'"]*/g);
    if (sqlLike) {
      score -= 25;
      issues.push('Potential SQL injection pattern detected');
      recommendations.push('Use parameterized queries or prepared statements');
    }

    return { score: Math.max(0, score), issues, recommendations };
  }

  checkAuthenticationIssues(content) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Check for weak session management
    const sessionManagement = content.match(/(?:sessionStorage|localStorage)\.setItem\([^)]*(?:session|auth|token)[^)]*\)/gi);
    if (sessionManagement) {
      score -= 15;
      issues.push('Client-side session management detected');
      recommendations.push('Consider server-side session management for better security');
    }

    // Check for authentication bypass patterns
    const authBypass = content.match(/if\s*\([^)]*(?:admin|auth|login)[^)]*\)\s*{[^}]*return\s+true/gi);
    if (authBypass) {
      score -= 40;
      issues.push('Potential authentication bypass pattern detected');
      recommendations.push('Implement proper authentication checks on server-side');
    }

    return { score: Math.max(0, score), issues, recommendations };
  }

  checkPerformance(content, filePath) {
    const checks = {
      score: 100,
      issues: [],
      recommendations: [],
      patterns: {
        reactPerformance: this.checkReactPerformance(content),
        memoryLeaks: this.checkMemoryLeaks(content),
        expensiveOperations: this.checkExpensiveOperations(content),
        bundleSize: this.checkBundleSize(content, filePath)
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

  checkReactPerformance(content) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Check for missing React.memo on components
    const componentExports = content.match(/export\s+(?:default\s+)?(?:function|const)\s+[A-Z][a-zA-Z0-9]*/g);
    const memoUsage = content.match(/React\.memo\s*\(/g);
    
    if (componentExports && componentExports.length > 0 && !memoUsage) {
      score -= 15;
      issues.push('Components without React.memo detected');
      recommendations.push('Consider wrapping components in React.memo to prevent unnecessary re-renders');
    }

    // Check for inline object/array creation in JSX
    const inlineObjects = content.match(/(?:style|className)\s*=\s*{{\s*[^}]+\s*}}/g);
    if (inlineObjects && inlineObjects.length > 3) {
      score -= 20;
      issues.push('Excessive inline object creation in JSX');
      recommendations.push('Extract inline objects to avoid re-creation on every render');
    }

    // Check for missing useCallback on event handlers
    const eventHandlers = content.match(/(?:onClick|onChange|onSubmit|onFocus|onBlur)\s*=\s*{[^}]*}/g);
    const useCallbackUsage = content.match(/useCallback\s*\(/g);
    
    if (eventHandlers && eventHandlers.length > 2 && !useCallbackUsage) {
      score -= 25;
      issues.push('Event handlers without useCallback detected');
      recommendations.push('Wrap event handlers in useCallback to prevent child re-renders');
    }

    // Check for missing useMemo on expensive calculations
    const expensiveCalcs = content.match(/(?:filter|map|sort|reduce)\s*\([^)]*\)(?:\s*\.(?:filter|map|sort|reduce)\s*\([^)]*\)){2,}/g);
    const useMemoUsage = content.match(/useMemo\s*\(/g);
    
    if (expensiveCalcs && !useMemoUsage) {
      score -= 20;
      issues.push('Expensive calculations without useMemo detected');
      recommendations.push('Wrap expensive calculations in useMemo');
    }

    return { score: Math.max(0, score), issues, recommendations };
  }

  checkMemoryLeaks(content) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Check for missing cleanup in useEffect
    const effectsWithListeners = content.match(/useEffect\s*\([^,]*(?:addEventListener|setInterval|setTimeout)/g);
    const effectsWithCleanup = content.match(/useEffect\s*\([^}]*return\s*\([^)]*\)\s*=>/g);
    
    if (effectsWithListeners && !effectsWithCleanup) {
      score -= 30;
      issues.push('useEffect with event listeners missing cleanup');
      recommendations.push('Always cleanup event listeners, timers, and subscriptions in useEffect');
    }

    // Check for global variable assignments
    const globalAssignments = content.match(/window\.[a-zA-Z_$][a-zA-Z0-9_$]*\s*=/g);
    if (globalAssignments) {
      score -= 20;
      issues.push('Global variable assignments detected');
      recommendations.push('Avoid global variable assignments that can cause memory leaks');
    }

    return { score: Math.max(0, score), issues, recommendations };
  }

  checkExpensiveOperations(content) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Check for nested loops
    const nestedLoops = content.match(/for\s*\([^)]*\)\s*{[^}]*for\s*\([^)]*\)\s*{/g);
    if (nestedLoops) {
      score -= 25;
      issues.push('Nested loops detected - O(n²) complexity');
      recommendations.push('Consider optimizing nested loops or using more efficient algorithms');
    }

    // Check for inefficient array operations
    const inefficientArrayOps = content.match(/\.(?:find|filter|some|every)\s*\([^)]*\)(?:\s*\.(?:find|filter|some|every)\s*\([^)]*\)){2,}/g);
    if (inefficientArrayOps) {
      score -= 20;
      issues.push('Chained array operations detected');
      recommendations.push('Consider combining array operations or using more efficient methods');
    }

    return { score: Math.max(0, score), issues, recommendations };
  }

  checkBundleSize(content, filePath) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Check for large imports
    const largeLibraryImports = content.match(/import\s+.*\s+from\s+['"](?:moment|lodash|rxjs|chart\.js|three)['"];?/g);
    if (largeLibraryImports) {
      score -= 15;
      issues.push('Large library imports detected');
      recommendations.push('Consider using tree-shaking or lighter alternatives');
    }

    // Check for unused imports
    const imports = content.match(/import\s+(?:{[^}]*}|\*\s+as\s+\w+|\w+)\s+from\s+['"][^'"]*['"];?/g);
    if (imports) {
      imports.forEach(importStatement => {
        const importName = importStatement.match(/import\s+({[^}]*}|\*\s+as\s+(\w+)|(\w+))/)?.[1];
        if (importName && !content.includes(importName.replace(/[{}]/g, ''))) {
          score -= 5;
          issues.push(`Potentially unused import: ${importName}`);
          recommendations.push('Remove unused imports to reduce bundle size');
        }
      });
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
    let totalScore = 0;
    let totalWeight = 0;

    const categories = ['functionalProgramming', 'projectStandards', 'typeScript', 'reactPatterns', 'security', 'performance'];
    
    categories.forEach(category => {
      if (fileResult[category] && fileResult[category].score !== undefined && this.isRuleEnabled(category)) {
        const weight = this.getRuleWeight(category);
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
    const categories = ['functionalProgramming', 'projectStandards', 'typeScript', 'reactPatterns', 'security', 'performance'];
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
        ...file.reactPatterns.issues,
        ...file.security.issues,
        ...file.performance.issues
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
      ...file.reactPatterns.recommendations,
      ...file.security.recommendations,
      ...file.performance.recommendations
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
        reactPatterns: this.getCategoryAverage('reactPatterns'),
        security: this.getCategoryAverage('security'),
        performance: this.getCategoryAverage('performance')
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
      ...file.reactPatterns.issues,
      ...file.security.issues,
      ...file.performance.issues
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
      ...file.reactPatterns.recommendations,
      ...file.security.recommendations,
      ...file.performance.recommendations
    ]);

    // Remove duplicates and return top recommendations
    return [...new Set(allRecommendations)];
  }

  getFileIssues(file) {
    return [
      ...file.functionalProgramming.issues,
      ...file.projectStandards.issues,
      ...file.typeScript.issues,
      ...file.reactPatterns.issues,
      ...file.security.issues,
      ...file.performance.issues
    ];
  }

  getCategoryEmoji(category) {
    const emojis = {
      functionalProgramming: '⚡',
      projectStandards: '📏',
      typeScript: '🔷',
      reactPatterns: '⚛️',
      security: '🔒',
      performance: '⚡'
    };
    return emojis[category] || '📊';
  }

  formatCategory(category) {
    const names = {
      functionalProgramming: 'Functional Programming',
      projectStandards: 'Project Standards',
      typeScript: 'TypeScript',
      reactPatterns: 'React Patterns',
      security: 'Security',
      performance: 'Performance'
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
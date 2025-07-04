#!/usr/bin/env node

/**
 * Configuration Generator for Code Review Agent
 * 
 * Generates a .codereview.json configuration file with project-specific settings
 * Usage: node scripts/generate-codereview-config.js [--interactive]
 */

import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';

class ConfigGenerator {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async generateConfig(interactive = false) {
    console.log('🛠️  Generating Code Review Configuration');
    console.log('=====================================\n');

    let config;
    
    if (interactive) {
      config = await this.interactiveConfig();
    } else {
      config = this.getDefaultConfig();
      console.log('📋 Using default configuration settings');
    }

    const configPath = path.join(process.cwd(), '.codereview.json');
    
    try {
      await fs.writeFile(configPath, JSON.stringify(config, null, 2));
      console.log(`✅ Configuration saved to: ${configPath}`);
      console.log('\n🎯 Next steps:');
      console.log('- Run: npm run code:review -- --file [path] to test');
      console.log('- Customize rules in .codereview.json as needed');
      console.log('- Add .codereview.json to version control');
    } catch (error) {
      console.error(`❌ Error saving configuration: ${error.message}`);
    }

    this.rl.close();
  }

  async interactiveConfig() {
    const config = this.getDefaultConfig();
    
    console.log('🔧 Interactive Configuration Setup\n');
    
    // Ask about rule weights
    const weights = await this.askForWeights();
    Object.keys(config.rules).forEach(rule => {
      config.rules[rule].weight = weights[rule] || config.rules[rule].weight;
    });

    // Ask about thresholds
    config.thresholds = await this.askForThresholds();

    // Ask about ignore patterns
    const additionalIgnores = await this.askForIgnorePatterns();
    config.ignore.push(...additionalIgnores);

    return config;
  }

  async askForWeights() {
    console.log('🎯 Rule Weights (should sum to 1.0):');
    const weights = {};
    
    weights.functionalProgramming = parseFloat(await this.question('Functional Programming weight (0.25): ') || '0.25');
    weights.security = parseFloat(await this.question('Security weight (0.20): ') || '0.20');
    weights.projectStandards = parseFloat(await this.question('Project Standards weight (0.15): ') || '0.15');
    weights.typeScript = parseFloat(await this.question('TypeScript weight (0.15): ') || '0.15');
    weights.reactPatterns = parseFloat(await this.question('React Patterns weight (0.15): ') || '0.15');
    weights.performance = parseFloat(await this.question('Performance weight (0.10): ') || '0.10');
    
    const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
    if (Math.abs(total - 1.0) > 0.01) {
      console.log(`⚠️  Warning: Weights sum to ${total.toFixed(2)}, not 1.0`);
    }
    
    return weights;
  }

  async askForThresholds() {
    console.log('\n📊 Score Thresholds:');
    return {
      excellent: parseInt(await this.question('Excellent threshold (90): ') || '90'),
      good: parseInt(await this.question('Good threshold (80): ') || '80'),
      acceptable: parseInt(await this.question('Acceptable threshold (70): ') || '70'),
      failing: parseInt(await this.question('Failing threshold (60): ') || '60')
    };
  }

  async askForIgnorePatterns() {
    console.log('\n🚫 Additional Ignore Patterns:');
    const patterns = [];
    const pattern = await this.question('Additional ignore pattern (press enter to skip): ');
    if (pattern.trim()) {
      patterns.push(pattern.trim());
    }
    return patterns;
  }

  question(query) {
    return new Promise(resolve => {
      this.rl.question(query, resolve);
    });
  }

  getDefaultConfig() {
    return {
      "version": "1.0.0",
      "rules": {
        "functionalProgramming": {
          "enabled": true,
          "weight": 0.25,
          "custom": {
            "maxFunctionLength": 50,
            "allowConsole": false,
            "enforceImmutability": true,
            "requireArrowFunctions": true,
            "maxNestedDepth": 3
          }
        },
        "projectStandards": {
          "enabled": true,
          "weight": 0.15,
          "custom": {
            "enforceFileNaming": true,
            "requireScssModules": true,
            "maxImportDepth": 3
          }
        },
        "typeScript": {
          "enabled": true,
          "weight": 0.15,
          "custom": {
            "requireTypeAnnotations": true,
            "allowAny": false,
            "requireReturnTypes": true,
            "preferInterfaces": true
          }
        },
        "reactPatterns": {
          "enabled": true,
          "weight": 0.15,
          "custom": {
            "requireMemo": true,
            "requireCallback": true,
            "maxPropsDepth": 3,
            "enforceHooksRules": true
          }
        },
        "security": {
          "enabled": true,
          "weight": 0.20,
          "custom": {
            "checkXss": true,
            "checkSecrets": true,
            "checkInputValidation": true,
            "checkAuthentication": true,
            "strictMode": true
          }
        },
        "performance": {
          "enabled": true,
          "weight": 0.10,
          "custom": {
            "checkMemoryLeaks": true,
            "checkExpensiveOps": true,
            "checkBundleSize": true,
            "reactOptimization": true
          }
        }
      },
      "ignore": [
        "**/*.test.tsx",
        "**/*.spec.ts",
        "**/*.d.ts",
        "**/node_modules/**",
        "**/dist/**",
        "**/build/**"
      ],
      "severity": {
        "error": [
          "eval-usage",
          "hardcoded-secrets",
          "xss-vulnerabilities",
          "authentication-bypass"
        ],
        "warning": [
          "missing-types",
          "long-functions",
          "unused-imports",
          "missing-memo"
        ],
        "info": [
          "prefer-arrow-functions",
          "consider-optimization"
        ]
      },
      "thresholds": {
        "excellent": 90,
        "good": 80,
        "acceptable": 70,
        "failing": 60
      },
      "reporting": {
        "format": "detailed",
        "includeMetrics": true,
        "showRecommendations": true,
        "maxIssuesPerFile": 5,
        "maxRecommendations": 10
      }
    };
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const interactive = args.includes('--interactive') || args.includes('-i');
  
  const generator = new ConfigGenerator();
  await generator.generateConfig(interactive);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default ConfigGenerator;
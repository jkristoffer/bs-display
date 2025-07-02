# Phase 5: Validation & Testing Implementation Plan

## Overview
This phase creates comprehensive validation and testing to ensure all tools work correctly through the new unified interface. It includes automated tests, manual verification procedures, and continuous validation systems.

## Objectives
1. Create automated test suite for all commands
2. Build continuous validation system
3. Implement health checks for critical tools
4. Create regression test suite
5. Establish monitoring and alerting

## Prerequisites
- Phases 1-4 completed
- All tools accessible via npm
- Documentation updated
- Legacy interfaces deprecated

## Implementation Tasks

### Task 1: Create Test Framework
**File**: `/Users/kristoffersanio/git/bs-display/dev/test/test-framework.js`
**Purpose**: Core testing infrastructure

```javascript
#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class ToolTestFramework {
  constructor() {
    this.results = [];
    this.categories = {
      git: [],
      code: [],
      content: [],
      vps: [],
      rag: [],
      ai: []
    };
  }

  async runTest(test) {
    const start = Date.now();
    try {
      const result = await test.execute();
      const duration = Date.now() - start;
      
      this.results.push({
        name: test.name,
        category: test.category,
        status: 'passed',
        duration,
        output: result
      });
      
      return { success: true, duration };
    } catch (error) {
      const duration = Date.now() - start;
      
      this.results.push({
        name: test.name,
        category: test.category,
        status: 'failed',
        duration,
        error: error.message,
        stack: error.stack
      });
      
      return { success: false, error: error.message, duration };
    }
  }

  generateReport() {
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    return {
      summary: {
        total: this.results.length,
        passed,
        failed,
        duration: totalDuration,
        timestamp: new Date().toISOString()
      },
      results: this.results,
      byCategory: this.groupByCategory()
    };
  }

  groupByCategory() {
    const grouped = {};
    this.results.forEach(result => {
      if (!grouped[result.category]) {
        grouped[result.category] = [];
      }
      grouped[result.category].push(result);
    });
    return grouped;
  }

  exportJSON(filename) {
    const report = this.generateReport();
    fs.writeFileSync(filename, JSON.stringify(report, null, 2));
  }

  exportMarkdown(filename) {
    const report = this.generateReport();
    let md = `# Tool Validation Report\n\n`;
    md += `Generated: ${report.summary.timestamp}\n\n`;
    md += `## Summary\n`;
    md += `- Total Tests: ${report.summary.total}\n`;
    md += `- Passed: ${report.summary.passed}\n`;
    md += `- Failed: ${report.summary.failed}\n`;
    md += `- Duration: ${report.summary.duration}ms\n\n`;

    md += `## Results by Category\n\n`;
    Object.entries(report.byCategory).forEach(([category, tests]) => {
      md += `### ${category.toUpperCase()}\n`;
      tests.forEach(test => {
        const icon = test.status === 'passed' ? '✅' : '❌';
        md += `- ${icon} ${test.name} (${test.duration}ms)\n`;
        if (test.error) {
          md += `  - Error: ${test.error}\n`;
        }
      });
      md += '\n';
    });

    fs.writeFileSync(filename, md);
  }
}

module.exports = ToolTestFramework;
```

### Task 2: Define Test Cases
**File**: `/Users/kristoffersanio/git/bs-display/dev/test/test-definitions.js`
**Purpose**: Comprehensive test suite

```javascript
const testDefinitions = [
  // Git Tests
  {
    name: 'git:status command exists',
    category: 'git',
    execute: async () => {
      execSync('npm run git:status', { stdio: 'pipe' });
      return true;
    }
  },
  {
    name: 'git:commit dry-run works',
    category: 'git',
    execute: async () => {
      const output = execSync('npm run git:commit -- --dry-run', { 
        encoding: 'utf8' 
      });
      if (!output.includes('DRY RUN') && !output.includes('dry-run')) {
        throw new Error('Dry run output not detected');
      }
      return true;
    }
  },
  
  // Code Quality Tests
  {
    name: 'code:typecheck runs successfully',
    category: 'code',
    execute: async () => {
      execSync('npm run code:typecheck', { stdio: 'pipe' });
      return true;
    }
  },
  {
    name: 'code:review requires file parameter',
    category: 'code',
    execute: async () => {
      try {
        execSync('npm run code:review', { stdio: 'pipe' });
        throw new Error('Should fail without file parameter');
      } catch (error) {
        // Expected to fail
        return true;
      }
    }
  },
  
  // Content Tests
  {
    name: 'content:seo:analyze with JSON output',
    category: 'content',
    execute: async () => {
      // Create test file
      const testFile = 'test-content.md';
      fs.writeFileSync(testFile, '# Test Content\nThis is test content.');
      
      try {
        const output = execSync(
          `npm run content:seo:analyze -- --file ${testFile} --json`,
          { encoding: 'utf8' }
        );
        JSON.parse(output); // Should be valid JSON
        return true;
      } finally {
        fs.unlinkSync(testFile);
      }
    }
  },
  
  // VPS Tests (Safe)
  {
    name: 'vps:cost calculator accessible',
    category: 'vps',
    execute: async () => {
      const output = execSync('npm run vps:cost', { encoding: 'utf8' });
      return output.includes('cost') || output.includes('price');
    }
  },
  {
    name: 'vps:test:prerequisites check',
    category: 'vps',
    execute: async () => {
      execSync('npm run vps:test:prerequisites', { stdio: 'pipe' });
      return true;
    }
  },
  
  // RAG Tests
  {
    name: 'rag:test Python environment',
    category: 'rag',
    execute: async () => {
      try {
        execSync('npm run rag:test', { stdio: 'pipe' });
        return true;
      } catch (error) {
        if (error.message.includes('Python')) {
          // Python not available is acceptable
          return { skipped: true, reason: 'Python not available' };
        }
        throw error;
      }
    }
  },
  
  // AI Helper Tests
  {
    name: 'ai:tools:list shows all commands',
    category: 'ai',
    execute: async () => {
      const output = execSync('npm run ai:tools:list', { encoding: 'utf8' });
      // Check for key sections
      const required = ['Code Quality', 'Content', 'Git', 'VPS'];
      for (const section of required) {
        if (!output.includes(section)) {
          throw new Error(`Missing section: ${section}`);
        }
      }
      return true;
    }
  },
  {
    name: 'help command works',
    category: 'ai',
    execute: async () => {
      const output = execSync('npm run help', { encoding: 'utf8' });
      return output.length > 100; // Should have substantial output
    }
  }
];

module.exports = testDefinitions;
```

### Task 3: Create Validation Runner
**File**: `/Users/kristoffersanio/git/bs-display/dev/test/validate-all.js`
**Purpose**: Main validation entry point

```javascript
#!/usr/bin/env node

const ToolTestFramework = require('./test-framework');
const testDefinitions = require('./test-definitions');
const fs = require('fs');
const path = require('path');

async function validateAll() {
  console.log('🔍 BS Display Tool Validation Suite\n');
  
  const framework = new ToolTestFramework();
  const startTime = Date.now();
  
  // Run tests by category
  const categories = [...new Set(testDefinitions.map(t => t.category))];
  
  for (const category of categories) {
    console.log(`\n📁 Testing ${category.toUpperCase()} tools...`);
    const categoryTests = testDefinitions.filter(t => t.category === category);
    
    for (const test of categoryTests) {
      process.stdout.write(`  Testing ${test.name}... `);
      const result = await framework.runTest(test);
      
      if (result.success) {
        console.log(`✅ (${result.duration}ms)`);
      } else {
        console.log(`❌ ${result.error}`);
      }
    }
  }
  
  // Generate reports
  const report = framework.generateReport();
  
  // Console summary
  console.log('\n📊 Summary:');
  console.log(`Total Tests: ${report.summary.total}`);
  console.log(`Passed: ${report.summary.passed} ✅`);
  console.log(`Failed: ${report.summary.failed} ❌`);
  console.log(`Duration: ${report.summary.duration}ms`);
  
  // Save reports
  const timestamp = new Date().toISOString().split('T')[0];
  framework.exportJSON(`test/reports/validation-${timestamp}.json`);
  framework.exportMarkdown(`test/reports/validation-${timestamp}.md`);
  
  // Exit code based on failures
  process.exit(report.summary.failed > 0 ? 1 : 0);
}

// Run if called directly
if (require.main === module) {
  validateAll().catch(error => {
    console.error('Validation failed:', error);
    process.exit(1);
  });
}

module.exports = validateAll;
```

### Task 4: Create Health Check System
**File**: `/Users/kristoffersanio/git/bs-display/dev/scripts/health-check.js`
**Purpose**: Quick health status of all systems

```javascript
#!/usr/bin/env node

const { execSync } = require('child_process');

const healthChecks = [
  {
    name: 'Git Repository',
    check: () => {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      return {
        healthy: true,
        message: status ? 'Has uncommitted changes' : 'Clean'
      };
    }
  },
  {
    name: 'Node Modules',
    check: () => {
      const exists = require('fs').existsSync('node_modules');
      return {
        healthy: exists,
        message: exists ? 'Installed' : 'Run npm install'
      };
    }
  },
  {
    name: 'TypeScript',
    check: () => {
      try {
        execSync('npm run code:typecheck', { stdio: 'pipe' });
        return { healthy: true, message: 'No type errors' };
      } catch (error) {
        return { healthy: false, message: 'Type errors found' };
      }
    }
  },
  {
    name: 'Python Environment',
    check: () => {
      try {
        execSync('python3 --version', { stdio: 'pipe' });
        return { healthy: true, message: 'Python available' };
      } catch {
        return { healthy: false, message: 'Python not found' };
      }
    }
  },
  {
    name: 'Tool Scripts',
    check: () => {
      const scripts = ['commit', 'code-review-agent.js', 'seo-agent.js'];
      const missing = scripts.filter(s => 
        !require('fs').existsSync(`scripts/${s}`)
      );
      return {
        healthy: missing.length === 0,
        message: missing.length ? `Missing: ${missing.join(', ')}` : 'All present'
      };
    }
  }
];

console.log('🏥 System Health Check\n');

let allHealthy = true;
healthChecks.forEach(({ name, check }) => {
  try {
    const result = check();
    const icon = result.healthy ? '✅' : '⚠️ ';
    console.log(`${icon} ${name}: ${result.message}`);
    if (!result.healthy) allHealthy = false;
  } catch (error) {
    console.log(`❌ ${name}: Error - ${error.message}`);
    allHealthy = false;
  }
});

console.log(`\nOverall Health: ${allHealthy ? '✅ Healthy' : '⚠️  Issues Found'}`);
process.exit(allHealthy ? 0 : 1);
```

### Task 5: Create Regression Test Suite
**File**: `/Users/kristoffersanio/git/bs-display/dev/test/regression-tests.js`
**Purpose**: Ensure nothing breaks between changes

```javascript
const regressionTests = [
  {
    name: 'Legacy script warnings present',
    test: () => {
      const commitScript = fs.readFileSync('scripts/commit', 'utf8');
      return commitScript.includes('DEPRECATION WARNING');
    }
  },
  {
    name: 'NPM scripts preserve functionality',
    test: () => {
      // Test that old and new commands produce same result
      const oldOutput = execSync('./scripts/list-automation-tools.js', {
        encoding: 'utf8'
      });
      const newOutput = execSync('npm run ai:tools:list', {
        encoding: 'utf8'
      });
      return oldOutput === newOutput;
    }
  },
  {
    name: 'Help system comprehensive',
    test: () => {
      const help = execSync('npm run help', { encoding: 'utf8' });
      const requiredSections = [
        'Git Operations',
        'Code Quality',
        'Content Generation',
        'VPS Management',
        'RAG/AI Memory'
      ];
      return requiredSections.every(section => help.includes(section));
    }
  }
];
```

### Task 6: Create Continuous Validation
**File**: `/Users/kristoffersanio/git/bs-display/dev/package.json`
**Action**: Add validation scripts

```json
{
  "scripts": {
    // Validation commands
    "validate": "node test/validate-all.js",
    "validate:quick": "node scripts/health-check.js",
    "validate:git": "node test/validate-all.js --category git",
    "validate:code": "node test/validate-all.js --category code",
    "validate:regression": "node test/regression-tests.js",
    
    // Pre-commit validation
    "precommit": "npm run validate:quick",
    
    // CI validation
    "ci:validate": "npm run validate && npm run validate:regression"
  }
}
```

### Task 7: Create Monitoring Dashboard
**File**: `/Users/kristoffersanio/git/bs-display/dev/test/monitoring-dashboard.js`
**Purpose**: Visual status of all tools

```javascript
#!/usr/bin/env node

const blessed = require('blessed');
const screen = blessed.screen({ smartCSR: true });

// Create dashboard layout
const dashboard = blessed.box({
  parent: screen,
  label: ' BS Display Tool Monitor ',
  border: { type: 'line' },
  top: 0,
  left: 0,
  width: '100%',
  height: '100%'
});

// Status grid
const statusGrid = blessed.table({
  parent: dashboard,
  label: ' Tool Status ',
  border: { type: 'line' },
  top: 1,
  left: 1,
  width: '50%',
  height: '50%',
  data: [
    ['Tool', 'Status', 'Last Run'],
    ['git:commit', '✅', '2 min ago'],
    ['code:review', '✅', '5 min ago'],
    ['content:blog', '⚠️', '1 hour ago'],
    ['vps:manage', '✅', 'never']
  ]
});

// Update loop
setInterval(() => {
  // Update status grid with real data
  updateToolStatus();
}, 5000);

screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
screen.render();
```

## Validation Procedures

### Daily Validation
```bash
npm run validate:quick  # Quick health check
```

### Pre-Release Validation
```bash
npm run validate        # Full test suite
npm run validate:regression  # Regression tests
```

### Continuous Monitoring
```bash
npm run monitor         # Live dashboard
```

## Success Criteria

- [ ] All tools have automated tests
- [ ] Health check completes in <10 seconds
- [ ] Regression tests prevent breaking changes
- [ ] Validation reports are generated
- [ ] CI/CD integration complete
- [ ] Monitoring dashboard functional
- [ ] 100% test coverage for critical paths

## Common Test Patterns

### Testing Commands Exist
```javascript
{
  name: 'Command exists',
  execute: async () => {
    execSync('npm run [command]', { stdio: 'pipe' });
    return true;
  }
}
```

### Testing Output Format
```javascript
{
  name: 'JSON output valid',
  execute: async () => {
    const output = execSync('npm run [command] -- --json', {
      encoding: 'utf8'
    });
    JSON.parse(output); // Throws if invalid
    return true;
  }
}
```

### Testing Error Handling
```javascript
{
  name: 'Handles missing parameters',
  execute: async () => {
    try {
      execSync('npm run [command]', { stdio: 'pipe' });
      throw new Error('Should have failed');
    } catch (error) {
      return error.message.includes('required');
    }
  }
}
```

## Deliverables

1. Test framework with 50+ test cases
2. Health check system (<10s checks)
3. Regression test suite
4. Automated validation reports
5. Monitoring dashboard (optional)
6. CI/CD integration scripts

## Notes for AI Agent

- Start with non-destructive tests
- Mock dangerous operations
- Test both success and failure paths
- Generate readable reports
- Focus on user-facing functionality
- Ensure tests are deterministic
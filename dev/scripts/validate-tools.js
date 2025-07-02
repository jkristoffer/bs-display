#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync } from 'fs';

const validations = [
  {
    name: 'Git Commands',
    tests: [
      { 
        cmd: 'npm run git:status', 
        expect: 'exit-zero',
        description: 'git:status command works'
      },
      { 
        cmd: 'npm run git:commit:ai -- --dry-run', 
        expect: 'contains:DRY RUN',
        description: 'git:commit dry-run works'
      },
      {
        cmd: 'npm run help:git',
        expect: 'contains:commit',
        description: 'git help available'
      }
    ]
  },
  {
    name: 'Code Quality',
    tests: [
      { 
        cmd: 'npm run help:code', 
        expect: 'contains:review',
        description: 'code help available'
      },
      {
        cmd: 'node scripts/help-system.js code:review',
        expect: 'contains:file',
        description: 'code:review help detailed'
      }
    ]
  },
  {
    name: 'Content Tools',
    tests: [
      {
        cmd: 'npm run help:content',
        expect: 'contains:blog',
        description: 'content help available'
      },
      {
        cmd: 'npm run content:blog:generate -- --dry-run',
        expect: 'contains:DRY RUN',
        description: 'blog generation dry-run works'
      }
    ]
  },
  {
    name: 'VPS Tools',
    tests: [
      {
        cmd: 'npm run help:vps',
        expect: 'contains:manage',
        description: 'VPS help available'
      },
      {
        cmd: 'npm run vps:test:prerequisites',
        expect: 'exit-zero',
        description: 'VPS prerequisites check works'
      }
    ]
  },
  {
    name: 'RAG Tools',
    tests: [
      {
        cmd: 'npm run help:rag',
        expect: 'contains:query',
        description: 'RAG help available'
      }
    ]
  },
  {
    name: 'AI Helpers',
    tests: [
      {
        cmd: 'npm run ai:tools:list',
        expect: 'contains:Code Quality',
        description: 'AI tools list works'
      },
      {
        cmd: 'npm run help',
        expect: 'contains:Command Help System',
        description: 'General help works'
      },
      {
        cmd: 'node scripts/help-system.js',
        expect: 'contains:Command Help System',
        description: 'Help system works'
      }
    ]
  },
  {
    name: 'JSON Output',
    tests: [
      {
        cmd: 'echo " M test.txt" | node scripts/json-formatter.js --type=gitStatus',
        expect: 'contains:"type": "git-status"',
        description: 'JSON formatter works'
      },
      {
        cmd: 'node scripts/ai-wrapper.js echo test --dry-run --json',
        expect: 'contains:"mode": "dry-run"',
        description: 'AI wrapper JSON output works'
      }
    ]
  },
  {
    name: 'Verbose Mode',
    tests: [
      {
        cmd: './scripts/verbose-wrapper.sh echo test --verbose',
        expect: 'contains:[VERBOSE]',
        description: 'Verbose wrapper works'
      }
    ]
  }
];

// Parse command line arguments
const args = process.argv.slice(2);
const categoryFilter = args[0];

// Function to run a single test
async function runTest(test) {
  try {
    const output = execSync(test.cmd, { 
      encoding: 'utf8',
      timeout: 30000 // 30 second timeout
    });
    
    // Check expectations
    if (test.expect === 'exit-zero') {
      return { success: true, output: 'Command completed successfully' };
    } else if (test.expect.startsWith('contains:')) {
      const searchTerm = test.expect.replace('contains:', '');
      if (output.includes(searchTerm)) {
        return { success: true, output: `Found: ${searchTerm}` };
      } else {
        return { 
          success: false, 
          output: `Expected to find: ${searchTerm}`,
          actualOutput: output.substring(0, 200) + '...'
        };
      }
    } else {
      return { success: true, output: 'Test completed' };
    }
  } catch (error) {
    return { 
      success: false, 
      output: error.message,
      stderr: error.stderr ? error.stderr.toString() : undefined
    };
  }
}

// Main validation function
async function runValidation() {
  console.log('🔍 BS Display Tool Validation');
  console.log('===============================\n');
  
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  
  // Filter categories if specified
  let categoriesToTest = validations;
  if (categoryFilter) {
    categoriesToTest = validations.filter(cat => 
      cat.name.toLowerCase().includes(categoryFilter.toLowerCase())
    );
    
    if (categoriesToTest.length === 0) {
      console.log(`❌ No categories match: ${categoryFilter}`);
      console.log('Available categories:', validations.map(v => v.name).join(', '));
      process.exit(1);
    }
  }
  
  // Run tests by category
  for (const category of categoriesToTest) {
    console.log(`\n📁 Testing ${category.name}...`);
    
    for (const test of category.tests) {
      totalTests++;
      process.stdout.write(`  ${test.description}... `);
      
      const result = await runTest(test);
      
      if (result.success) {
        console.log(`✅ (${result.output})`);
        passedTests++;
      } else {
        console.log(`❌`);
        console.log(`    Error: ${result.output}`);
        if (result.actualOutput) {
          console.log(`    Output: ${result.actualOutput}`);
        }
        failedTests++;
      }
    }
  }
  
  // Summary
  console.log('\n📊 Validation Summary:');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests} ✅`);
  console.log(`Failed: ${failedTests} ❌`);
  console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  // Exit with appropriate code
  process.exit(failedTests > 0 ? 1 : 0);
}

// File existence checks
function validateFiles() {
  const requiredFiles = [
    'scripts/ai-wrapper.js',
    'scripts/json-formatter.js',
    'scripts/verbose-wrapper.sh',
    'scripts/help-system.js',
    'scripts/ai-wrappers/git-commit-wrapper.sh'
  ];
  
  console.log('📂 Checking required files...');
  let allExist = true;
  
  requiredFiles.forEach(file => {
    if (existsSync(file)) {
      console.log(`  ✅ ${file}`);
    } else {
      console.log(`  ❌ ${file} (missing)`);
      allExist = false;
    }
  });
  
  if (!allExist) {
    console.log('\n❌ Some required files are missing. Please complete Phase 2 setup.');
    process.exit(1);
  }
  
  console.log('  All required files present ✅\n');
}

// Run validation
validateFiles();
runValidation().catch(error => {
  console.error('Validation failed:', error);
  process.exit(1);
});
#!/usr/bin/env node

import { existsSync } from 'fs';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

console.log('🧹 Validating Legacy Cleanup...\n');

const checks = [
  {
    name: 'Slash Commands Removed',
    test: () => !existsSync(`${process.env.HOME}/.claude/commands/fastcommit.md`),
    fix: 'rm ~/.claude/commands/fastcommit.md'
  },
  {
    name: 'Deprecation Notice Created',
    test: () => existsSync(`${process.env.HOME}/.claude/commands/DEPRECATED.md`),
    fix: 'Create deprecation notice file'
  },
  {
    name: 'Deprecation Warnings Added',
    test: () => {
      const commit = readFileSync('scripts/commit', 'utf8');
      return commit.includes('DEPRECATION WARNING');
    },
    fix: 'Add deprecation warning to scripts/commit'
  },
  {
    name: 'Old Docs Archived',
    test: () => existsSync('docs/archive/') && 
              !existsSync('BLOG_AUTOMATION_README.md') &&
              !existsSync('CODE_REVIEW_AGENT.md') &&
              !existsSync('SEO_QUICK_REFERENCE.md'),
    fix: 'Move old documentation to docs/archive/'
  },
  {
    name: 'Package.json Cleaned',
    test: () => {
      const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
      return !pkg.scripts['tools'] && !pkg.scripts['tools:code-review'];
    },
    fix: 'Remove tools:* scripts from package.json'
  },
  {
    name: 'New Interface Working',
    test: () => {
      try {
        execSync('npm run help', { stdio: 'pipe' });
        return true;
      } catch {
        return false;
      }
    },
    fix: 'Ensure new npm interface is working'
  },
  {
    name: 'AI Features Available',
    test: () => {
      try {
        const output = execSync('npm run git:commit:ai -- --dry-run', { 
          encoding: 'utf8', 
          stdio: 'pipe' 
        });
        return output.includes('DRY RUN');
      } catch {
        return false;
      }
    },
    fix: 'Ensure AI-enhanced commands work'
  },
  {
    name: 'Validation Framework Works',
    test: () => {
      try {
        execSync('npm run ai:validate:git', { stdio: 'pipe' });
        return true;
      } catch {
        return false;
      }
    },
    fix: 'Ensure validation framework is working'
  }
];

let passed = 0;
const results = [];

for (const check of checks) {
  try {
    const success = check.test();
    results.push({
      name: check.name,
      status: success ? 'passed' : 'failed',
      fix: check.fix
    });
    
    if (success) {
      console.log(`✅ ${check.name}`);
      passed++;
    } else {
      console.log(`❌ ${check.name}`);
      console.log(`   Fix: ${check.fix}`);
    }
  } catch (error) {
    console.log(`❌ ${check.name} - Error: ${error.message}`);
    results.push({
      name: check.name,
      status: 'error',
      error: error.message,
      fix: check.fix
    });
  }
}

console.log(`\n📊 Cleanup Validation Summary:`);
console.log(`✅ Passed: ${passed}/${checks.length}`);
console.log(`❌ Failed: ${checks.length - passed}/${checks.length}`);

if (passed === checks.length) {
  console.log('\n🎉 Legacy cleanup completed successfully!');
  console.log('\nNext steps:');
  console.log('- All tools now use unified npm interface');
  console.log('- AI-enhanced features available');
  console.log('- Old interfaces properly deprecated');
  console.log('- Documentation updated');
} else {
  console.log('\n⚠️  Some cleanup items need attention.');
  console.log('Run the suggested fixes and re-validate.');
}

// Export results for other tools to use
const jsonResults = {
  timestamp: new Date().toISOString(),
  total: checks.length,
  passed: passed,
  failed: checks.length - passed,
  results: results
};

// Save results
if (process.argv.includes('--save')) {
  const fs = await import('fs');
  fs.writeFileSync('cleanup-validation-results.json', JSON.stringify(jsonResults, null, 2));
  console.log('\n💾 Results saved to cleanup-validation-results.json');
}

// Exit with appropriate code
process.exit(passed === checks.length ? 0 : 1);
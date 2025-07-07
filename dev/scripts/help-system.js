#!/usr/bin/env node

const helpDatabase = {
  'git:commit': {
    description: 'Create an intelligent git commit with conventional format',
    usage: 'npm run git:commit [-- --dry-run] [-- --verbose]',
    options: {
      '--dry-run': 'Preview what would be committed without executing',
      '--verbose': 'Show detailed execution logs'
    },
    examples: [
      'npm run git:commit',
      'npm run git:commit -- --dry-run',
      'npm run git:commit -- --verbose'
    ],
    category: 'git'
  },
  'git:status': {
    description: 'Show repository status in short format',
    usage: 'npm run git:status [-- --json]',
    options: {
      '--json': 'Output results as JSON'
    },
    examples: [
      'npm run git:status',
      'npm run git:status -- --json'
    ],
    category: 'git'
  },
  'code:review': {
    description: 'Enhanced code analysis with security & performance auditing',
    usage: 'npm run code:review -- --file [path] | --batch [dir] [options]',
    options: {
      '--file': 'Analyze single file',
      '--batch': 'Analyze directory recursively', 
      '--format': 'Output format: detailed, json, minimal (default: detailed)',
      '--ai-mode': 'Enhanced mode for AI workflow integration',
      '--agent-id': 'Track which AI agent generated the code',
      '--task-id': 'Associate analysis with specific task',
      '--threshold-failing': 'Custom failing threshold (default: 60)'
    },
    examples: [
      'npm run code:review -- --file src/components/Auth.tsx',
      'npm run code:review -- --batch src/components/ --format json',
      'npm run code:review -- --file component.tsx --ai-mode --agent-id "claude-sonnet"'
    ],
    category: 'code'
  },
  'code:review:config': {
    description: 'Generate .codereview.json configuration file',
    usage: 'npm run code:review:config [-- --interactive]',
    options: {
      '--interactive': 'Interactive configuration setup'
    },
    examples: [
      'npm run code:review:config',
      'npm run code:review:config:interactive'
    ],
    category: 'code'
  },
  'code:typecheck': {
    description: 'Run TypeScript type checking',
    usage: 'npm run code:typecheck [-- --json]',
    options: {
      '--json': 'Output results as JSON'
    },
    examples: [
      'npm run code:typecheck',
      'npm run code:typecheck -- --json'
    ],
    category: 'code'
  },
  'content:blog:generate': {
    description: 'Generate SEO-optimized blog post from content queue',
    usage: 'npm run content:blog:generate [-- --topic "topic"] [-- --dry-run]',
    options: {
      '--topic': 'Specify blog topic manually',
      '--dry-run': 'Preview what would be generated',
      '--verbose': 'Show detailed generation process'
    },
    examples: [
      'npm run content:blog:generate',
      'npm run content:blog:generate -- --topic "AI in Education"',
      'npm run content:blog:generate -- --dry-run'
    ],
    category: 'content'
  },
  'content:seo:analyze': {
    description: 'Analyze content for SEO optimization',
    usage: 'npm run content:seo:analyze -- --file [path] [--json]',
    options: {
      '--file': 'Specify file to analyze (required)',
      '--json': 'Output results as JSON',
      '--format': 'Specify output format'
    },
    examples: [
      'npm run content:seo:analyze -- --file src/content/blog/post.md',
      'npm run content:seo:analyze -- --file src/content/blog/post.md --json'
    ],
    category: 'content'
  },
  'data:validate': {
    description: 'Validate JSON schemas and product data',
    usage: 'npm run data:validate [target] [-- --file path]',
    options: {
      'target': 'Validation target: all, maxhub, file',
      '--file': 'Specific file to validate'
    },
    examples: [
      'npm run data:validate',
      'npm run data:validate:maxhub',
      'npm run data:validate:file -- --file product.json'
    ],
    category: 'data'
  },
  'ai:validate': {
    description: 'Validate all tools are working correctly',
    usage: 'npm run ai:validate [category]',
    options: {
      'category': 'Test specific category (git, code, content, vps, rag)'
    },
    examples: [
      'npm run ai:validate',
      'npm run ai:validate git',
      'npm run ai:validate code'
    ],
    category: 'ai'
  },
  'help': {
    description: 'Show available commands and tools',
    usage: 'npm run help [command]',
    options: {
      'command': 'Get detailed help for specific command'
    },
    examples: [
      'npm run help',
      'npm run help git:commit',
      'npm run help code:review'
    ],
    category: 'help'
  }
};

// Get command line arguments
const args = process.argv.slice(2);
const command = args[0];

function showGeneralHelp() {
  console.log(`
🤖 BS Display - Command Help System
===================================

Usage: npm run help [command]

Available Categories:
  git:*         Version control operations
  code:*        Code quality and review
  content:*     Content generation and SEO
  dev:*         Development tools
  data:*        Data validation and schemas
  ai:*          AI-specific helpers

Common Commands:
  npm run help git:commit      - Get help for git commit
  npm run help code:review     - Get help for code review
  npm run help data:validate   - Get help for data validation
  npm run git:status           - Check repository status
  npm run ai:validate:all      - Validate all tools

Moved Tools (now in separate repositories):
  VPS Tools:    /Users/kristoffersanio/git/bs-vps-tools/
  RAG System:   /Users/kristoffersanio/git/bs-rag-tools/
  Forge Dev:    /Users/kristoffersanio/git/bs-forge-dev/
  MCP Servers:  /Users/kristoffersanio/git/bs-mcp-servers/

AI-Friendly Features:
  --dry-run     Preview commands without executing
  --json        Machine-readable output
  --verbose     Detailed execution logs
  --help        Command-specific help

Examples:
  npm run git:commit -- --dry-run
  npm run code:review -- --file src/test.js --json
  npm run vps:spinup -- --dry-run
`);
}

function showCommandHelp(cmd) {
  const help = helpDatabase[cmd];
  
  if (!help) {
    console.log(`❌ No help available for command: ${cmd}`);
    console.log('\nAvailable commands:');
    Object.keys(helpDatabase).forEach(key => {
      console.log(`  ${key}`);
    });
    return;
  }

  console.log(`
📋 ${cmd}
${'='.repeat(cmd.length + 3)}

Description: ${help.description}

Usage: ${help.usage}

Options:
${Object.entries(help.options || {}).map(([opt, desc]) => `  ${opt.padEnd(15)} ${desc}`).join('\n')}

Examples:
${help.examples.map(ex => `  ${ex}`).join('\n')}

Category: ${help.category}
`);
}

function showCategoryHelp(category) {
  const commands = Object.entries(helpDatabase).filter(([_, help]) => help.category === category);
  
  if (commands.length === 0) {
    console.log(`❌ No commands found in category: ${category}`);
    return;
  }

  console.log(`\n📁 ${category.toUpperCase()} Commands\n${'='.repeat(category.length + 10)}`);
  
  commands.forEach(([cmd, help]) => {
    console.log(`\n${cmd}`);
    console.log(`  ${help.description}`);
    console.log(`  Usage: ${help.usage}`);
  });
}

// Main logic
if (!command) {
  showGeneralHelp();
} else if (helpDatabase[command]) {
  showCommandHelp(command);
} else {
  // Check if it's a category
  const categories = ['git', 'code', 'content', 'dev', 'data', 'ai', 'help'];
  if (categories.includes(command)) {
    showCategoryHelp(command);
  } else {
    console.log(`❌ Unknown command or category: ${command}`);
    showGeneralHelp();
  }
}
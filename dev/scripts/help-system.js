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
    description: 'Analyze code for functional programming compliance',
    usage: 'npm run code:review -- --file [path] [--json]',
    options: {
      '--file': 'Specify file to review (required)',
      '--json': 'Output results as JSON',
      '--ai-mode': 'Enhanced mode for AI agents'
    },
    examples: [
      'npm run code:review -- --file src/components/Button.tsx',
      'npm run code:review -- --file src/components/Button.tsx --json'
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
  'vps:spinup': {
    description: 'Create new VPS instance with automatic provisioning',
    usage: 'npm run vps:spinup [session-name] [-- --dry-run]',
    options: {
      '--dry-run': 'Preview VPS creation without executing',
      '--region': 'Specify region (default: sgp1)',
      '--size': 'Specify droplet size (default: s-1vcpu-1gb)'
    },
    examples: [
      'npm run vps:spinup',
      'npm run vps:spinup test-session',
      'npm run vps:spinup -- --dry-run'
    ],
    category: 'vps'
  },
  'vps:cleanup': {
    description: 'Clean up VPS resources and droplets',
    usage: 'npm run vps:cleanup [-- --dry-run] [-- --force]',
    options: {
      '--dry-run': 'Preview cleanup without executing',
      '--force': 'Skip confirmation prompts'
    },
    examples: [
      'npm run vps:cleanup',
      'npm run vps:cleanup -- --dry-run',
      'npm run vps:cleanup -- --force'
    ],
    category: 'vps'
  },
  'rag:query': {
    description: 'Query project knowledge base using RAG system',
    usage: 'npm run rag:query -- "your question"',
    options: {
      '--verbose': 'Show detailed query process',
      '--local': 'Use local model instead of API'
    },
    examples: [
      'npm run rag:query -- "How does ProductCard component work?"',
      'npm run rag:query -- "Debug image 404 errors" --verbose'
    ],
    category: 'rag'
  },
  'rag:clean': {
    description: 'Clean RAG database and vector embeddings',
    usage: 'npm run rag:clean [-- --dry-run]',
    options: {
      '--dry-run': 'Preview cleanup without executing'
    },
    examples: [
      'npm run rag:clean',
      'npm run rag:clean -- --dry-run'
    ],
    category: 'rag'
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
  vps:*         VPS management
  rag:*         RAG/AI memory operations
  ai:*          AI-specific helpers

Common Commands:
  npm run help git:commit      - Get help for git commit
  npm run help code:review     - Get help for code review
  npm run help vps:spinup      - Get help for VPS creation
  npm run git:status           - Check repository status
  npm run ai:validate          - Validate all tools

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
  const categories = ['git', 'code', 'content', 'dev', 'vps', 'rag', 'ai', 'help'];
  if (categories.includes(command)) {
    showCategoryHelp(command);
  } else {
    console.log(`❌ Unknown command or category: ${command}`);
    showGeneralHelp();
  }
}
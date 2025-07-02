# Phase 2: AI-Specific Enhancements Implementation Plan

## Overview
This phase adds AI-friendly features to all tools, making them more predictable, debuggable, and parseable for AI agents. Key features include dry-run mode, JSON output, verbose logging, and integrated help.

## Objectives
1. Add `--dry-run` support to all destructive operations
2. Implement `--json` output for machine-readable results
3. Add `--verbose` mode for detailed execution logs
4. Create contextual help for each command
5. Build tool validation framework

## Prerequisites
- Phase 1 completed (all npm scripts mapped)
- Understanding of which operations are destructive
- Access to create new wrapper scripts

## Implementation Tasks

### Task 1: Create Universal Wrapper Script
**File**: `/Users/kristoffersanio/git/bs-display/dev/scripts/ai-wrapper.js`
**Purpose**: Intercept commands to add AI features

```javascript
#!/usr/bin/env node

const { spawn } = require('child_process');
const args = process.argv.slice(2);

// Parse AI-specific flags
const dryRun = args.includes('--dry-run');
const jsonOutput = args.includes('--json');
const verbose = args.includes('--verbose');
const help = args.includes('--help');

// Remove AI flags before passing to actual command
const cleanArgs = args.filter(arg => 
  !['--dry-run', '--json', '--verbose', '--help'].includes(arg)
);

// Get the actual command to run
const command = cleanArgs[0];
const commandArgs = cleanArgs.slice(1);

// Implement dry-run
if (dryRun) {
  console.log(JSON.stringify({
    mode: 'dry-run',
    command: command,
    args: commandArgs,
    wouldExecute: true
  }, null, 2));
  process.exit(0);
}

// Add more implementation...
```

**Key Features**:
- Intercepts all commands
- Parses AI-specific flags
- Handles dry-run simulation
- Formats output as JSON if requested

### Task 2: Implement Dry-Run for Destructive Operations
**Files**: Create wrapper scripts for destructive operations
**Location**: `/Users/kristoffersanio/git/bs-display/dev/scripts/ai-wrappers/`

**Destructive Operations to Wrap**:
1. `git:commit` - Would create a commit
2. `git:push` - Would push to remote
3. `vps:cleanup` - Would delete resources
4. `vps:spinup` - Would create resources
5. `rag:clean` - Would delete data
6. `content:blog:generate` - Would create files

**Example Wrapper** (`scripts/ai-wrappers/git-commit-wrapper.sh`):
```bash
#!/bin/bash

# Check for dry-run flag
if [[ "$*" == *"--dry-run"* ]]; then
  echo "DRY RUN: Would execute git commit"
  echo "Files that would be committed:"
  git status --short
  echo "Commit message would be generated based on changes"
  exit 0
fi

# Execute actual command
./scripts/commit "$@"
```

### Task 3: Add JSON Output Support
**File**: `/Users/kristoffersanio/git/bs-display/dev/scripts/json-formatter.js`
**Purpose**: Convert command output to JSON

```javascript
#!/usr/bin/env node

const formatter = {
  gitStatus: (output) => {
    const lines = output.split('\n').filter(l => l);
    return {
      files: lines.map(line => ({
        status: line.substring(0, 2).trim(),
        file: line.substring(3)
      })),
      count: lines.length
    };
  },
  
  codeReview: (output) => {
    // Parse code review output into structured format
    return {
      passed: output.includes('PASS'),
      issues: [], // Extract issues
      score: 0    // Extract score
    };
  }
};

// Usage: command | node scripts/json-formatter.js --type gitStatus
```

**Integration**: Update npm scripts to support JSON:
```json
"git:status:json": "git status --short | node scripts/json-formatter.js --type gitStatus"
```

### Task 4: Implement Verbose Mode
**File**: `/Users/kristoffersanio/git/bs-display/dev/scripts/verbose-wrapper.sh`
**Purpose**: Add detailed logging to any command

```bash
#!/bin/bash

VERBOSE=false
COMMAND=""
ARGS=()

# Parse arguments
for arg in "$@"; do
  if [[ "$arg" == "--verbose" ]]; then
    VERBOSE=true
  else
    if [[ -z "$COMMAND" ]]; then
      COMMAND="$arg"
    else
      ARGS+=("$arg")
    fi
  fi
done

if [[ "$VERBOSE" == true ]]; then
  echo "[VERBOSE] Starting execution at $(date)"
  echo "[VERBOSE] Command: $COMMAND"
  echo "[VERBOSE] Arguments: ${ARGS[@]}"
  echo "[VERBOSE] Working directory: $(pwd)"
  echo "[VERBOSE] Environment: NODE_ENV=$NODE_ENV"
  echo "[VERBOSE] ---"
fi

# Execute with verbose output
if [[ "$VERBOSE" == true ]]; then
  $COMMAND "${ARGS[@]}" 2>&1 | while IFS= read -r line; do
    echo "[$(date +%H:%M:%S)] $line"
  done
  EXIT_CODE=${PIPESTATUS[0]}
  echo "[VERBOSE] Exit code: $EXIT_CODE"
  exit $EXIT_CODE
else
  $COMMAND "${ARGS[@]}"
fi
```

### Task 5: Create Contextual Help System
**File**: `/Users/kristoffersanio/git/bs-display/dev/scripts/help-system.js`
**Purpose**: Provide detailed help for each command

```javascript
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
    ]
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
    ]
  }
  // Add more commands...
};
```

### Task 6: Build Validation Framework
**File**: `/Users/kristoffersanio/git/bs-display/dev/scripts/validate-tools.js`
**Purpose**: Test all tools are working correctly

```javascript
#!/usr/bin/env node

const { execSync } = require('child_process');

const validations = [
  {
    name: 'Git Commands',
    tests: [
      { cmd: 'npm run git:status', expect: 'exit-zero' },
      { cmd: 'npm run git:commit -- --dry-run', expect: 'contains:DRY RUN' }
    ]
  },
  {
    name: 'Code Quality',
    tests: [
      { cmd: 'npm run code:typecheck', expect: 'exit-zero' },
      { cmd: 'npm run help:code', expect: 'contains:review' }
    ]
  }
];

// Run validations
validations.forEach(category => {
  console.log(`\nValidating ${category.name}...`);
  category.tests.forEach(test => {
    try {
      const output = execSync(test.cmd, { encoding: 'utf8' });
      // Check expectations
      console.log(`✓ ${test.cmd}`);
    } catch (error) {
      console.log(`✗ ${test.cmd} - ${error.message}`);
    }
  });
});
```

### Task 7: Update NPM Scripts with AI Features
**File**: `/Users/kristoffersanio/git/bs-display/dev/package.json`
**Action**: Add AI-enhanced versions of commands

```json
{
  "scripts": {
    // Original commands remain unchanged
    "git:commit": "./scripts/commit",
    
    // AI-enhanced versions
    "git:commit:ai": "node scripts/ai-wrapper.js ./scripts/commit",
    "code:review:ai": "node scripts/ai-wrapper.js node scripts/code-review-agent.js",
    
    // Validation commands
    "ai:validate": "node scripts/validate-tools.js",
    "ai:validate:git": "node scripts/validate-tools.js --category git",
    "ai:validate:dry": "npm run git:commit -- --dry-run && npm run vps:cleanup -- --dry-run",
    
    // Help commands
    "help:command": "node scripts/help-system.js"
  }
}
```

## Implementation Order

1. **Create wrapper scripts** - Start with universal wrapper
2. **Implement dry-run** - Focus on destructive operations first
3. **Add JSON formatters** - For commonly used commands
4. **Build help system** - Document as you go
5. **Create validators** - Test each feature
6. **Update package.json** - Add AI-enhanced commands

## Validation Steps

1. **Test Dry-Run**:
   ```bash
   npm run git:commit -- --dry-run
   # Should preview without executing
   ```

2. **Test JSON Output**:
   ```bash
   npm run git:status -- --json
   # Should return valid JSON
   ```

3. **Test Verbose Mode**:
   ```bash
   npm run code:review -- --file test.js --verbose
   # Should show detailed logs
   ```

4. **Test Help System**:
   ```bash
   npm run help:command git:commit
   # Should show detailed help
   ```

## Success Criteria

- [ ] All destructive operations support --dry-run
- [ ] Common commands support --json output
- [ ] All commands support --verbose mode
- [ ] Help available for every command
- [ ] Validation suite passes 100%
- [ ] AI agents can predict and use features

## Deliverables

1. Universal AI wrapper script
2. Dry-run wrappers for destructive operations
3. JSON formatters for common commands
4. Help system with full command documentation
5. Validation suite that tests all features
6. Updated package.json with AI-enhanced commands

## Notes for AI Agent

- Preserve backward compatibility - don't break existing commands
- AI features are opt-in through flags
- Focus on most-used commands first
- Make error messages AI-friendly (structured, clear)
- Test each feature in isolation before integration
- Document any environment requirements
# Phase 3: Documentation Update Implementation Plan

## Overview
This phase updates all documentation to reflect the new unified tool interface, removes false claims about MCP integration, and creates clear, AI-friendly documentation that matches reality.

## Objectives
1. Update CLAUDE.md to remove false MCP claims and document real tools
2. Create comprehensive command reference
3. Add troubleshooting guides for common issues
4. Ensure all examples use the new npm interface
5. Make documentation scannable by AI agents

## Prerequisites
- Phase 1 completed (all tools mapped to npm)
- Phase 2 completed (AI enhancements added)
- Full understanding of what actually works
- List of deprecated features to remove

## Implementation Tasks

### Task 1: Audit and Fix CLAUDE.md
**File**: `/Users/kristoffersanio/git/bs-display/dev/CLAUDE.md`
**Action**: Remove false claims and update to reality

**Items to Remove**:
```markdown
## ⚡ MCP INTEGRATION (ACTIVE!)  ← FALSE, REMOVE THIS SECTION
**Native automation tools available directly in Claude Code via Model Context Protocol.**
```

**Replace With**:
```markdown
## ⚡ UNIFIED TOOL INTERFACE

**All project tools accessible through consistent npm commands.**

### Quick Access
```bash
npm run help                    # See all available commands
npm run git:commit             # Intelligent git commits
npm run code:review -- --file [path]  # Automated code review
npm run content:blog:generate  # AI blog post generation
npm run vps:manage            # VPS infrastructure management
npm run rag:query             # AI memory system
```

### No Slash Commands
Previous `/commit` slash commands have been deprecated. Use `npm run git:commit` instead.
```

### Task 2: Create Command Reference
**File**: `/Users/kristoffersanio/git/bs-display/dev/COMMAND_REFERENCE.md`
**Purpose**: Complete reference for all commands

```markdown
# BS Display Command Reference

## Overview
All tools in this project are accessible through npm scripts using the pattern:
```bash
npm run [category]:[subcategory]:[action] -- [options]
```

## Git Operations

### git:commit
Create intelligent commit with conventional format.
```bash
npm run git:commit              # Standard commit
npm run git:commit -- --dry-run # Preview without committing
npm run git:commit -- --verbose # Detailed logging
```

### git:status
Show repository status.
```bash
npm run git:status              # Human readable
npm run git:status -- --json    # Machine readable
```

### git:push
Push commits to remote.
```bash
npm run git:push                # Push to origin/main
npm run git:push -- --dry-run   # Preview push
```

## Code Quality Tools

### code:review
Analyze code for functional programming compliance.
```bash
npm run code:review -- --file src/components/Button.tsx
npm run code:review -- --file src/components/Button.tsx --json
npm run code:review -- --batch src/components/
```

### code:lint
Run ESLint on codebase.
```bash
npm run code:lint               # Check for issues
npm run code:lint:fix           # Auto-fix issues
```

### code:typecheck
Run TypeScript type checking.
```bash
npm run code:typecheck          # Full type check
npm run code:typecheck -- --json # JSON output
```

## Content Generation

### content:blog:generate
Generate SEO-optimized blog post.
```bash
npm run content:blog:generate   # Interactive generation
npm run content:blog:generate -- --topic "AI in Education"
```

### content:seo:analyze
Analyze content for SEO.
```bash
npm run content:seo:analyze -- --file src/content/blog/post.md
npm run content:seo:analyze -- --file src/content/blog/post.md --json
```

## VPS Management

### vps:spinup
Create new VPS instance.
```bash
npm run vps:spinup              # Standard spinup
npm run vps:spinup:quick        # No-wait spinup
npm run vps:spinup -- --dry-run # Preview creation
```

### vps:cleanup
Clean up VPS resources.
```bash
npm run vps:cleanup             # Interactive cleanup
npm run vps:cleanup -- --force  # Force cleanup
npm run vps:cleanup -- --dry-run # Preview cleanup
```

## RAG/AI Memory

### rag:query
Query project knowledge base.
```bash
npm run rag:query -- "How does ProductCard work?"
npm run rag:query -- "Debug image 404 errors" --verbose
```

### rag:clean
Clean RAG database.
```bash
npm run rag:clean               # Clean all data
npm run rag:clean -- --dry-run  # Preview cleanup
```

## AI Helper Commands

### ai:validate
Validate all tools are working.
```bash
npm run ai:validate             # Test all tools
npm run ai:validate:git         # Test git tools only
npm run ai:validate:dry         # Test dry-run mode
```

### help
Get help on available commands.
```bash
npm run help                    # List all commands
npm run help:git                # Git-specific help
npm run help:command git:commit # Detailed command help
```
```

### Task 3: Create AI-Specific Documentation
**File**: `/Users/kristoffersanio/git/bs-display/dev/AI_DEVELOPER_GUIDE.md`
**Purpose**: Guide for AI agents using the tools

```markdown
# AI Developer Guide

## Quick Start for AI Agents

1. **Always start with**: `npm run help`
2. **Check status**: `npm run git:status`
3. **Validate tools**: `npm run ai:validate`

## Command Patterns

All commands follow predictable patterns:

```bash
npm run [category]:[action]              # Basic command
npm run [category]:[action] -- --dry-run # Preview mode
npm run [category]:[action] -- --json    # JSON output
npm run [category]:[action] -- --verbose # Detailed logs
```

## Best Practices for AI

### 1. Always Use Dry-Run First
For any destructive operation, preview first:
```bash
npm run git:commit -- --dry-run
npm run vps:cleanup -- --dry-run
```

### 2. Request JSON Output
For parsing results:
```bash
npm run git:status -- --json
npm run code:review -- --file test.js --json
```

### 3. Use Verbose Mode When Debugging
```bash
npm run vps:spinup -- --verbose
npm run rag:query -- "debug issue" --verbose
```

## Common Workflows

### Making Code Changes
1. Check status: `npm run git:status`
2. Review code: `npm run code:review -- --file [changed-file]`
3. Run quality checks: `npm run code:quality:all`
4. Commit changes: `npm run git:commit`
5. Push to remote: `npm run git:push`

### Content Creation
1. Generate blog: `npm run content:blog:generate`
2. Analyze SEO: `npm run content:seo:analyze -- --file [blog-file]`
3. Optimize: `npm run content:seo:optimize -- --file [blog-file]`
4. Commit: `npm run git:commit`

### VPS Management
1. Check prerequisites: `npm run vps:test:prerequisites`
2. Dry run: `npm run vps:spinup -- --dry-run`
3. Create VPS: `npm run vps:spinup`
4. Check costs: `npm run vps:cost`
5. Cleanup: `npm run vps:cleanup`

## Error Handling

### Permission Denied
```bash
# If you see: Permission denied: ./scripts/commit
# Run: chmod +x scripts/commit
# Then retry the command
```

### Python Not Found
```bash
# For RAG commands, ensure Python is available
# Setup: npm run rag:setup
```

### Command Not Found
```bash
# Always check available commands first
npm run help
npm run help:[category]
```

## Environment Variables

Some tools require environment variables:
- `GEMINI_API_KEY` - For RAG queries
- `DO_API_TOKEN` - For VPS management
- `GITHUB_TOKEN` - For GitHub operations

## Output Formats

### Standard Output
Human-readable format for terminal display.

### JSON Output (--json flag)
```json
{
  "status": "success",
  "data": {...},
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Verbose Output (--verbose flag)
```
[VERBOSE] Starting execution at Mon Jan 1 00:00:00 PST 2024
[VERBOSE] Command: git status
[VERBOSE] Working directory: /Users/name/project
[00:00:01] Executing git status...
[00:00:01] On branch main
[VERBOSE] Exit code: 0
```
```

### Task 4: Update Error Messages
**File**: Create error message standards
**Location**: `/Users/kristoffersanio/git/bs-display/dev/scripts/error-messages.js`

```javascript
const errorMessages = {
  PERMISSION_DENIED: {
    code: 'EPERM',
    message: 'Permission denied',
    solution: 'Run: chmod +x [file]',
    aiHint: 'File needs executable permissions'
  },
  COMMAND_NOT_FOUND: {
    code: 'ENOENT',
    message: 'Command not found',
    solution: 'Check npm run help for available commands',
    aiHint: 'Command may not be mapped to npm script'
  },
  MISSING_DEPENDENCY: {
    code: 'EDEP',
    message: 'Missing dependency',
    solution: 'Run: npm install',
    aiHint: 'Package.json dependencies not installed'
  },
  PYTHON_NOT_FOUND: {
    code: 'EPYTHON',
    message: 'Python interpreter not found',
    solution: 'Install Python 3.x or run: npm run rag:setup',
    aiHint: 'RAG tools require Python environment'
  }
};

// Format errors for AI consumption
function formatError(error) {
  const known = errorMessages[error.code];
  if (known) {
    return {
      error: known.code,
      message: known.message,
      solution: known.solution,
      aiHint: known.aiHint,
      original: error.message
    };
  }
  return {
    error: 'UNKNOWN',
    message: error.message,
    solution: 'Check npm run help or documentation',
    aiHint: 'Unhandled error type'
  };
}
```

### Task 5: Create Migration Guide
**File**: `/Users/kristoffersanio/git/bs-display/dev/MIGRATION_GUIDE.md`
**Purpose**: Help users transition from old interfaces

```markdown
# Migration Guide: Old Commands to New

## Slash Commands (Deprecated)
```
OLD: /commit
NEW: npm run git:commit

OLD: /code-review --file [path]
NEW: npm run code:review -- --file [path]
```

## Direct Script Usage (Deprecated)
```
OLD: ./scripts/commit
NEW: npm run git:commit

OLD: node scripts/code-review-agent.js --file [path]
NEW: npm run code:review -- --file [path]

OLD: ./vps-scripts/spin-up.sh
NEW: npm run vps:spinup
```

## NPM Scripts (Updated Names)
```
OLD: npm run tools:code-review
NEW: npm run code:review

OLD: npm run tools:blog-generate
NEW: npm run content:blog:generate

OLD: npm run tools:seo-analyze
NEW: npm run content:seo:analyze
```

## Why Migrate?
1. **Consistency** - Single interface for all tools
2. **Discoverability** - npm run help shows everything
3. **AI-Friendly** - Predictable patterns
4. **Maintenance** - Easier to update and test

## Automatic Migration Script
Run this to update your muscle memory:
```bash
# Create aliases for old commands (temporary)
echo "alias /commit='npm run git:commit'" >> ~/.bashrc
echo "alias code-review='npm run code:review --'" >> ~/.bashrc
```
```

### Task 6: Update README References
**Files**: Search and update all README files
**Action**: Replace old command references

**Search for patterns**:
- `/commit` → `npm run git:commit`
- `./scripts/` → `npm run [appropriate:command]`
- `node scripts/` → `npm run [appropriate:command]`
- MCP references → Remove or update

## Validation Steps

1. **Documentation Accuracy**:
   - Every command in docs must work
   - No references to non-existent features
   - All examples tested and working

2. **Cross-Reference Check**:
   - COMMAND_REFERENCE.md matches package.json
   - Help text matches actual behavior
   - Error messages match error codes

3. **AI Readability**:
   - Clear section headers
   - Consistent code block formatting
   - Predictable structure

## Success Criteria

- [ ] CLAUDE.md updated with no false claims
- [ ] Complete command reference created
- [ ] AI developer guide published
- [ ] Error messages standardized
- [ ] Migration guide helps transition
- [ ] All READMEs updated
- [ ] Documentation validates against reality

## Deliverables

1. Updated CLAUDE.md (reality-based)
2. COMMAND_REFERENCE.md (complete tool listing)
3. AI_DEVELOPER_GUIDE.md (AI-specific guidance)
4. MIGRATION_GUIDE.md (transition help)
5. Standardized error messages
6. Updated README files

## Notes for AI Agent

- Remove ALL mentions of MCP unless actually implemented
- Test every command example before documenting
- Use consistent formatting for code blocks
- Include both success and error examples
- Make documentation scannable (clear headers)
- Focus on working features only
# Phase 4: Legacy Cleanup Implementation Plan

## Overview
This phase removes deprecated interfaces, adds warnings to direct script usage, and ensures users transition smoothly to the new unified npm interface. The cleanup is done carefully to avoid breaking existing workflows.

## Objectives
1. Remove broken slash commands
2. Add deprecation notices to direct script usage
3. Create transition period with warnings
4. Archive old documentation
5. Clean up conflicting interfaces

## Prerequisites
- Phases 1-3 completed
- New npm interface fully functional
- Documentation updated
- All users notified of changes

## Implementation Tasks

### Task 1: Remove Slash Commands
**Location**: `~/.claude/commands/`
**Action**: Remove deprecated slash command files

```bash
# Commands to execute
rm ~/.claude/commands/fastcommit.md

# Verify removal
ls -la ~/.claude/commands/
# Should no longer show fastcommit.md
```

**Create Notification**:
```markdown
# ~/.claude/commands/DEPRECATED.md
---
description: "Slash commands have been deprecated"
---

# Deprecated Commands

All slash commands have been moved to npm scripts:
- /commit → npm run git:commit
- /code-review → npm run code:review

See MIGRATION_GUIDE.md for details.
```

### Task 2: Add Deprecation Warnings to Scripts
**Location**: `/scripts/` directory
**Action**: Add deprecation notice to each script

**Template for Script Headers**:
```bash
#!/bin/bash
# Add this to the top of each script after shebang

echo "⚠️  DEPRECATION WARNING: Direct script usage is deprecated!"
echo "   Please use: npm run git:commit"
echo "   This direct script will be removed in next major version."
echo "   Continuing in 3 seconds..."
sleep 3

# Original script content continues...
```

**Scripts to Update**:
1. `scripts/commit`
2. `scripts/code-review-agent.js`
3. `scripts/generate-blog-post.js`
4. `scripts/seo-agent.js`
5. All other directly executable scripts

**JavaScript Template**:
```javascript
#!/usr/bin/env node

console.warn(`
⚠️  DEPRECATION WARNING: Direct script usage is deprecated!
   Please use: npm run code:review -- --file [path]
   This direct script will be removed in next major version.
   Continuing in 3 seconds...
`);

// Give user time to see warning
setTimeout(() => {
  // Original script content
}, 3000);
```

### Task 3: Create Wrapper Scripts
**Location**: `/scripts/deprecated-wrappers/`
**Purpose**: Redirect old commands to new interface

```bash
#!/bin/bash
# scripts/deprecated-wrappers/commit-redirect.sh

echo "⚠️  The './scripts/commit' command is deprecated!"
echo "   Redirecting to: npm run git:commit"
echo ""
npm run git:commit "$@"
```

**Then update original**:
```bash
# scripts/commit
#!/bin/bash
exec ./scripts/deprecated-wrappers/commit-redirect.sh "$@"
```

### Task 4: Archive Old Documentation
**Action**: Move outdated docs to archive folder

```bash
# Create archive directory
mkdir -p docs/archive

# Move old documentation
mv BLOG_AUTOMATION_README.md docs/archive/
mv CODE_REVIEW_AGENT.md docs/archive/
mv SEO_QUICK_REFERENCE.md docs/archive/

# Add archive notice
echo "# Archived Documentation

These documents are outdated. See current documentation:
- COMMAND_REFERENCE.md
- AI_DEVELOPER_GUIDE.md
- MIGRATION_GUIDE.md" > docs/archive/README.md
```

### Task 5: Clean Package.json
**File**: `/Users/kristoffersanio/git/bs-display/dev/package.json`
**Action**: Remove old script aliases

```json
{
  "scripts": {
    // Remove these old patterns
    // "tools:code-review": "...",
    // "tools:blog-generate": "...",
    // "tools:seo-analyze": "...",
    
    // Keep only new consistent patterns
    "code:review": "node scripts/code-review-agent.js",
    "content:blog:generate": "node scripts/generate-blog-post.js",
    "content:seo:analyze": "node scripts/seo-agent.js"
  }
}
```

### Task 6: Create Cleanup Validation Script
**File**: `/Users/kristoffersanio/git/bs-display/dev/scripts/validate-cleanup.js`
**Purpose**: Ensure cleanup is complete

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Validating Legacy Cleanup...\n');

const checks = [
  {
    name: 'Slash Commands Removed',
    test: () => !fs.existsSync(`${process.env.HOME}/.claude/commands/fastcommit.md`),
    fix: 'rm ~/.claude/commands/fastcommit.md'
  },
  {
    name: 'Deprecation Warnings Added',
    test: () => {
      const commit = fs.readFileSync('scripts/commit', 'utf8');
      return commit.includes('DEPRECATION WARNING');
    },
    fix: 'Add deprecation warning to scripts/commit'
  },
  {
    name: 'Old Docs Archived',
    test: () => fs.existsSync('docs/archive/') && 
              !fs.existsSync('BLOG_AUTOMATION_README.md'),
    fix: 'Move old documentation to docs/archive/'
  },
  {
    name: 'Package.json Cleaned',
    test: () => {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return !pkg.scripts['tools:code-review'];
    },
    fix: 'Remove tools:* scripts from package.json'
  }
];

let passed = 0;
checks.forEach(check => {
  try {
    if (check.test()) {
      console.log(`✅ ${check.name}`);
      passed++;
    } else {
      console.log(`❌ ${check.name}`);
      console.log(`   Fix: ${check.fix}`);
    }
  } catch (error) {
    console.log(`❌ ${check.name} - Error: ${error.message}`);
  }
});

console.log(`\n${passed}/${checks.length} checks passed`);
process.exit(passed === checks.length ? 0 : 1);
```

### Task 7: Create Transition Timeline
**File**: `/Users/kristoffersanio/git/bs-display/dev/DEPRECATION_TIMELINE.md`
**Purpose**: Communicate removal schedule

```markdown
# Deprecation Timeline

## Phase 1: Soft Deprecation (Current)
- ✅ Deprecation warnings added to all scripts
- ✅ New npm interface available
- ✅ Documentation updated
- Old interfaces still work with warnings

## Phase 2: Hard Deprecation (In 30 days)
- Direct script execution will fail with error
- Only npm commands will work
- Clear error messages guide to new commands

## Phase 3: Removal (In 60 days)
- Old scripts moved to archive/
- Only npm interface remains
- Clean, consistent interface

## Affected Commands

### Immediate Action Required
- `/commit` → `npm run git:commit`
- Direct script execution → npm scripts

### Grace Period (30 days)
- `./scripts/*` will show warnings
- `node scripts/*` will show warnings

### For AI Agents
After Phase 3, only use:
- `npm run [category]:[action]`
- No direct script paths
- No slash commands
```

## Implementation Order

1. **Backup First** - Create backups before any deletions
2. **Add Warnings** - Deprecation notices to all scripts
3. **Remove Slash Commands** - Clean ~/.claude/commands/
4. **Archive Documentation** - Move old docs to archive/
5. **Clean package.json** - Remove duplicate scripts
6. **Validate** - Run cleanup validation
7. **Communicate** - Update all team members

## Rollback Plan

If issues arise:
```bash
# Restore from git
git checkout HEAD~1 -- scripts/
git checkout HEAD~1 -- package.json

# Restore slash commands from backup
cp ~/.claude/commands.backup/* ~/.claude/commands/
```

## Success Criteria

- [ ] No slash commands in ~/.claude/commands/
- [ ] All scripts show deprecation warnings
- [ ] Old documentation archived
- [ ] Package.json has no duplicate scripts
- [ ] Validation script passes 100%
- [ ] No functionality lost
- [ ] Clear migration path documented

## Common Issues & Solutions

1. **User Muscle Memory**
   - Solution: Shell aliases during transition
   ```bash
   alias commit='npm run git:commit'
   ```

2. **CI/CD Scripts**
   - Solution: Update CI/CD configs to use npm
   - Search for: `./scripts/` or `node scripts/`

3. **Documentation Links**
   - Solution: Redirects or update links
   - Old: `/CODE_REVIEW_AGENT.md`
   - New: `/COMMAND_REFERENCE.md#code-review`

## Deliverables

1. Deprecation warnings in all scripts
2. Cleaned ~/.claude/commands/ directory  
3. Archived old documentation
4. Cleaned package.json
5. Validation script confirming cleanup
6. Deprecation timeline communicated

## Notes for AI Agent

- ALWAYS add deprecation warnings before removing
- Test each change to ensure nothing breaks
- Keep backups of everything deleted
- Provide clear migration path in errors
- Don't remove functionality, only interfaces
- Be patient - give users time to transition
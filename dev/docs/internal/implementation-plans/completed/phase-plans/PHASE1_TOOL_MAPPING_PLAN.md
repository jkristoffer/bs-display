# Phase 1: Complete Tool Mapping Implementation Plan

## Overview
This phase creates npm script wrappers for ALL existing tools in the project, establishing a single, consistent interface for AI agents to access any functionality.

## Objectives
1. Create npm scripts for all 30+ tools across scripts/, vps-scripts/, and rag/ directories
2. Ensure consistent naming convention: `npm run [category]:[subcategory]:[action]`
3. Preserve all existing functionality while adding the new interface
4. Make all scripts discoverable through package.json

## Prerequisites
- Read access to package.json
- Understanding of existing tool locations
- No breaking changes to existing tools

## Implementation Tasks

### Task 1: Update package.json with Git Operations
**File**: `/Users/kristoffersanio/git/bs-display/dev/package.json`
**Action**: Add git-related npm scripts

```json
"git:commit": "./scripts/commit",
"git:status": "git status --short",
"git:push": "git push origin main",
"git:pull": "git pull origin main",
"git:log": "git log --oneline -10"
```

**Validation**: 
- Ensure `./scripts/commit` has executable permissions
- Test each command works as expected

### Task 2: Add Code Quality Scripts
**File**: `/Users/kristoffersanio/git/bs-display/dev/package.json`
**Action**: Map all code review and quality tools

```json
"code:review": "node scripts/code-review-agent.js",
"code:review:api": "node scripts/code-review-api-simple.js --port 3001",
"code:review:full": "node scripts/code-review-api.js",
"code:lint": "eslint \"src/**/*.{js,jsx,ts,tsx,astro}\"",
"code:lint:fix": "eslint \"src/**/*.{js,jsx,ts,tsx,astro}\" --fix",
"code:typecheck": "astro check",
"code:quality:all": "npm run code:lint && npm run code:typecheck"
```

**Notes**: 
- Preserve existing `lint` and `lint:fix` scripts for backward compatibility
- The `:all` suffix indicates composite commands

### Task 3: Map Content & SEO Tools
**File**: `/Users/kristoffersanio/git/bs-display/dev/package.json`
**Action**: Create content generation and SEO analysis scripts

```json
"content:blog:generate": "node scripts/generate-blog-post.js",
"content:seo:analyze": "node scripts/seo-agent.js",
"content:seo:optimize": "node scripts/seo-optimizer.js",
"content:seo:cli": "node scripts/claude-seo.js",
"content:seo:review": "npm run content:seo:cli -- seo-review",
"content:seo:auto": "npm run content:seo:cli -- seo-auto-optimize"
```

**Important**: The `--` in npm scripts passes additional arguments

### Task 4: Development Tools Mapping
**File**: `/Users/kristoffersanio/git/bs-display/dev/package.json`
**Action**: Map development and build tools

```json
"dev:server": "astro dev",
"dev:server:expose": "astro dev --host",
"dev:build": "npm run optimize:images && astro build",
"dev:build:fast": "astro build",
"dev:preview": "astro preview",
"dev:images:optimize": "node scripts/optimize-images.js",
"dev:docs:routes": "node scripts/generate-routes-docs.js"
```

**Preserve**: Keep existing `dev`, `build`, etc. for compatibility

### Task 5: VPS Management Scripts
**File**: `/Users/kristoffersanio/git/bs-display/dev/package.json`
**Action**: Map all VPS management tools

```json
"vps:manage": "./vps-scripts/manage.sh",
"vps:spinup": "./vps-scripts/spin-up.sh",
"vps:spinup:quick": "./vps-scripts/spin-up-no-wait.sh",
"vps:cleanup": "./vps-scripts/cleanup.sh",
"vps:cost": "./vps-scripts/cost-calculator.sh",
"vps:snapshot:create": "./vps-scripts/create-base-snapshot.sh",
"vps:snapshot:update": "./vps-scripts/update-snapshot.sh",
"vps:snapshot:from-droplet": "./vps-scripts/create-snapshot-from-droplet.sh",
"vps:provision": "./vps-scripts/provision-base.sh",
"vps:test:minimal": "./vps-scripts/create-minimal-test.sh",
"vps:test:prerequisites": "./vps-scripts/test-prerequisites.sh",
"vps:test:dryrun": "./vps-scripts/test-dry-run.sh"
```

**Prerequisites Check**: Ensure all .sh files have executable permissions

### Task 6: RAG/AI Memory Tools
**File**: `/Users/kristoffersanio/git/bs-display/dev/package.json`
**Action**: Map RAG and AI memory tools

```json
"rag:query": "./rag/gemini_rag_wrapper.sh",
"rag:query:local": "cd rag && python gemini_rag_cli_local.py",
"rag:clean": "./rag/gemini_rag_clean.sh",
"rag:helper": "./rag/rag-helper.sh",
"rag:test": "cd rag && python test_gemini_free.py",
"rag:setup": "cd rag && pip install -r requirements.txt",
"rag:setup:local": "cd rag && pip install -r requirements_local.txt"
```

**Environment Note**: RAG tools require Python environment

### Task 7: AI Helper Scripts
**File**: `/Users/kristoffersanio/git/bs-display/dev/package.json`
**Action**: Add AI-specific helper commands

```json
"ai:performance": "node scripts/agent-performance-tracker.js --summary",
"ai:performance:log": "node scripts/agent-performance-tracker.js --log",
"ai:tools:list": "node scripts/list-automation-tools.js",
"ai:context": "cat CLAUDE.md",
"ai:plan": "cat AI_TOOL_CONSOLIDATION_PLAN.md",
"ai:validate": "echo 'Validating all tools...' && npm run help"
```

### Task 8: Update Help System
**File**: `/Users/kristoffersanio/git/bs-display/dev/package.json`
**Action**: Ensure help command maps correctly

```json
"help": "npm run ai:tools:list",
"help:git": "echo 'Git commands: commit, status, push, pull, log'",
"help:code": "echo 'Code quality: review, lint, typecheck'",
"help:content": "echo 'Content tools: blog:generate, seo:analyze, seo:optimize'",
"help:vps": "echo 'VPS tools: manage, spinup, cleanup, cost, snapshot:*'",
"help:rag": "echo 'RAG tools: query, clean, test, setup'"
```

## Validation Steps

1. **Syntax Validation**: Run `npm run` to ensure no JSON syntax errors
2. **Permission Check**: Verify all .sh scripts are executable:
   ```bash
   chmod +x scripts/commit
   chmod +x vps-scripts/*.sh
   chmod +x rag/*.sh
   ```
3. **Path Validation**: Ensure all referenced files exist
4. **Test Core Commands**:
   ```bash
   npm run help
   npm run git:status
   npm run code:typecheck
   ```

## Success Criteria

- [ ] All 30+ tools have npm script wrappers
- [ ] Naming convention is consistent across all scripts
- [ ] No existing functionality is broken
- [ ] `npm run help` shows all available commands
- [ ] All scripts are executable and paths are correct

## Common Issues & Solutions

1. **Permission Denied**: Add executable permissions with `chmod +x`
2. **File Not Found**: Check paths are relative to project root
3. **Command Too Long**: Break into multiple npm scripts
4. **Python Not Found**: RAG commands need Python environment

## Example Implementation

When implementing, the AI agent should:

1. Read current package.json
2. Add new scripts in alphabetical order within each category
3. Preserve all existing scripts
4. Test each new script after adding
5. Commit with message: "feat(npm): add unified tool interface for [category]"

## Deliverables

1. Updated package.json with all tool mappings
2. Validation report showing all commands work
3. Any permission fixes needed for scripts
4. List of any tools that couldn't be mapped

## Notes for AI Agent

- DO NOT remove any existing npm scripts
- DO NOT modify the tools themselves, only create npm wrappers
- If a tool requires arguments, document in help text
- Use relative paths from project root
- Group related commands using `:` separator
- Test each command after adding to ensure it works
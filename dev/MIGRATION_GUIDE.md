# Migration Guide: Old Commands to New

## Overview
This guide helps you transition from the old tool interfaces to the new unified npm-based system.

---

## Slash Commands (Deprecated)

All slash commands have been removed. Use npm scripts instead:

```bash
# OLD: Slash commands (no longer work)
/commit
/code-review --file [path]
/seo-analyze --file [path]
/blog-generate

# NEW: Unified npm interface
npm run git:commit
npm run code:review -- --file [path]
npm run content:seo:analyze -- --file [path]
npm run content:blog:generate
```

---

## Direct Script Usage (Deprecated)

Direct script execution now shows deprecation warnings. Use npm scripts:

```bash
# OLD: Direct script execution (deprecated)
./scripts/commit
node scripts/code-review-agent.js --file [path]
./vps-scripts/spin-up.sh
./rag/gemini_rag_wrapper.sh "query"

# NEW: Unified npm interface
npm run git:commit
npm run code:review -- --file [path]
npm run vps:spinup
npm run rag:query -- "query"
```

---

## NPM Scripts (Updated Names)

Old npm script names have been updated for consistency:

```bash
# OLD: tools: prefix
npm run tools                   # Use: npm run help
npm run tools:code-review       # Use: npm run code:review
npm run tools:blog-generate     # Use: npm run content:blog:generate
npm run tools:seo-analyze       # Use: npm run content:seo:analyze
npm run tools:performance       # Use: npm run ai:performance

# OLD: inconsistent development commands
npm run dev                     # Use: npm run dev:server
npm run build                   # Use: npm run dev:build
npm run check                   # Use: npm run code:typecheck
npm run preview                 # Use: npm run dev:preview
```

---

## Complete Migration Map

### Git Operations
```bash
# OLD → NEW
./scripts/commit                    → npm run git:commit
git status --short                  → npm run git:status
git push origin main                → npm run git:push
git pull origin main                → npm run git:pull
git log --oneline -10               → npm run git:log
```

### Code Quality
```bash
# OLD → NEW
npm run tools:code-review           → npm run code:review
eslint "src/**/*.{js,tsx}"          → npm run code:lint
npm run check                       → npm run code:typecheck
npm run lint:fix                    → npm run code:lint:fix
```

### Content & SEO
```bash
# OLD → NEW
npm run tools:blog-generate         → npm run content:blog:generate
npm run tools:seo-analyze           → npm run content:seo:analyze
npm run tools:seo-optimize          → npm run content:seo:optimize
node scripts/claude-seo.js          → npm run content:seo:cli
```

### Development
```bash
# OLD → NEW
npm run dev                         → npm run dev:server
astro dev --host                    → npm run dev:server:expose
npm run build                       → npm run dev:build
astro build                         → npm run dev:build:fast
npm run preview                     → npm run dev:preview
node scripts/optimize-images.js     → npm run dev:images:optimize
```

### VPS Management
```bash
# OLD → NEW
./vps-scripts/manage.sh             → npm run vps:manage
./vps-scripts/spin-up.sh            → npm run vps:spinup
./vps-scripts/cleanup.sh            → npm run vps:cleanup
./vps-scripts/cost-calculator.sh    → npm run vps:cost
./vps-scripts/test-prerequisites.sh → npm run vps:test:prerequisites
```

### RAG Operations
```bash
# OLD → NEW
./rag/gemini_rag_wrapper.sh "query" → npm run rag:query -- "query"
./rag/gemini_rag_clean.sh           → npm run rag:clean
cd rag && python test_gemini_free.py → npm run rag:test
cd rag && pip install -r requirements.txt → npm run rag:setup
```

### Help & Tools
```bash
# OLD → NEW
npm run tools                       → npm run help
node scripts/list-automation-tools.js → npm run ai:tools:list
npm run tools:performance           → npm run ai:performance
```

---

## New AI-Enhanced Features

The new system includes AI-friendly features not available in old commands:

### Dry-Run Mode
Preview destructive operations safely:
```bash
npm run git:commit:ai -- --dry-run
npm run vps:cleanup:ai -- --dry-run
npm run content:blog:ai -- --dry-run
npm run rag:clean:ai -- --dry-run
```

### JSON Output
Get machine-readable results:
```bash
npm run git:status:json
npm run code:review -- --file test.js --json
npm run content:seo:analyze -- --file blog.md --json
```

### Verbose Mode
Detailed execution logs for debugging:
```bash
./scripts/verbose-wrapper.sh [command] --verbose
node scripts/ai-wrapper.js [command] --verbose
```

### Contextual Help
Get help for any command:
```bash
npm run help                    # General help
npm run help git:commit         # Specific command help
npm run help git                # Category help
```

---

## Migration Strategies

### Immediate Migration
Update your muscle memory with shell aliases:
```bash
# Add to ~/.bashrc or ~/.zshrc
alias commit='npm run git:commit'
alias code-review='npm run code:review --'
alias blog-generate='npm run content:blog:generate'
alias dev-server='npm run dev:server'
```

### Gradual Migration
The old commands still work but show deprecation warnings:
```bash
# These still work but are deprecated:
./scripts/commit                # Shows warning, then works
npm run tools:code-review       # Shows warning, then works
npm run dev                     # Shows warning, then works
```

### Script Migration
Update any automation scripts:
```bash
#!/bin/bash
# OLD automation script
./scripts/commit
npm run tools:code-review -- --file src/new-feature.tsx
npm run build

# NEW automation script  
npm run git:commit
npm run code:review -- --file src/new-feature.tsx
npm run dev:build
```

---

## Benefits of Migration

### 1. Consistency
Single interface for all tools:
```bash
npm run [category]:[action]     # Always the same pattern
```

### 2. Discoverability
```bash
npm run help                    # See everything available
npm run                         # List all npm scripts
```

### 3. AI-Friendly
Predictable patterns AI agents can learn:
```bash
npm run [category]:[action] -- --dry-run    # Preview
npm run [category]:[action] -- --json       # Structured output
npm run [category]:[action] -- --verbose    # Debug logs
```

### 4. Better Error Handling
```bash
# New error system provides helpful guidance
npm run git:commit
# Error: Permission denied
# Solution: Run: chmod +x scripts/commit
# AI Hint: File needs executable permissions
```

### 5. Validation
```bash
npm run ai:validate:all         # Test all tools work
npm run ai:validate:git         # Test specific category
```

---

## Common Migration Issues

### Issue: Command Not Found
```bash
# Error: npm run tools:code-review command not found
# Solution: Use new name
npm run code:review
```

### Issue: Permission Denied
```bash
# Error: Permission denied: ./scripts/commit
# Solution: Fix permissions
chmod +x scripts/commit
npm run git:commit
```

### Issue: Missing Arguments
```bash
# Error: File parameter required
# Old: npm run tools:code-review src/test.js
# New: npm run code:review -- --file src/test.js
```

### Issue: Python Not Found
```bash
# Error: Python interpreter not found
# Solution: Setup RAG environment
npm run rag:setup
```

---

## Verification Steps

After migration, verify everything works:

```bash
# 1. Test basic commands
npm run help
npm run git:status
npm run code:typecheck

# 2. Test AI features
npm run git:commit:ai -- --dry-run
npm run ai:validate:all

# 3. Test categories
npm run help:git
npm run help:code
npm run help:content

# 4. Test error handling
npm run git:commit:ai -- --json
node scripts/error-messages.js help EPERM
```

---

## Rollback Plan

If you need to use old commands temporarily:

```bash
# Slash commands: No longer available
# Direct scripts: Still work with warnings
./scripts/commit                # Works but deprecated

# Old npm scripts: Still available
npm run tools                   # Still works
npm run dev                     # Still works
npm run check                   # Still works
```

---

## Timeline

- **Phase 1** (Current): New interface available, old shows warnings
- **Phase 2** (30 days): Old interface fails with helpful errors  
- **Phase 3** (60 days): Old interface removed completely

---

## Getting Help

If you encounter issues during migration:

```bash
# General help
npm run help

# Specific command help
npm run help [command]

# Error diagnosis
node scripts/error-messages.js detect [error-output]

# Tool validation
npm run ai:validate:all

# Documentation
cat AI_DEVELOPER_GUIDE.md
cat COMMAND_REFERENCE.md
```

---

## Migration Checklist

- [ ] Update shell aliases to new commands
- [ ] Update automation scripts to use npm interface
- [ ] Test all commonly used commands
- [ ] Update documentation and READMEs
- [ ] Train team on new command patterns
- [ ] Verify AI tools work with new interface
- [ ] Remove old command references from configs

---

**Remember**: The new unified interface is designed to be predictable and AI-friendly. When in doubt, start with `npm run help` and use the consistent `[category]:[action]` pattern.
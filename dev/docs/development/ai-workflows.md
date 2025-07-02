# AI Developer Guide

## Quick Start for AI Agents

1. **Always start with**: `npm run help`
2. **Check status**: `npm run git:status`
3. **Validate tools**: `npm run ai:validate`

---

## Command Patterns

All commands follow predictable patterns:

```bash
npm run [category]:[action]              # Basic command
npm run [category]:[action] -- --dry-run # Preview mode
npm run [category]:[action] -- --json    # JSON output
npm run [category]:[action] -- --verbose # Detailed logs
```

### Categories
- **git:*** - Version control operations
- **code:*** - Code quality and review
- **content:*** - Content generation and SEO
- **dev:*** - Development tools
- **vps:*** - VPS management
- **rag:*** - RAG/AI memory operations
- **ai:*** - AI-specific helpers

---

## Best Practices for AI

### 1. Always Use Dry-Run First
For any destructive operation, preview first:
```bash
npm run git:commit:ai -- --dry-run
npm run vps:cleanup:ai -- --dry-run
npm run content:blog:ai -- --dry-run
npm run rag:clean:ai -- --dry-run
```

### 2. Request JSON Output
For parsing results:
```bash
npm run git:status:json
npm run code:review -- --file test.js --json
npm run content:seo:analyze -- --file blog.md --json
```

### 3. Use Verbose Mode When Debugging
```bash
./scripts/verbose-wrapper.sh npm run vps:spinup --verbose
node scripts/ai-wrapper.js echo "test" --verbose
```

### 4. Validate Before Proceeding
```bash
npm run ai:validate:all         # Test everything
npm run ai:validate:git         # Test git tools only
npm run ai:validate:dry         # Test dry-run mode
```

---

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
2. Dry run: `npm run vps:spinup:ai -- --dry-run`
3. Create VPS: `npm run vps:spinup`
4. Check costs: `npm run vps:cost`
5. Cleanup: `npm run vps:cleanup:ai -- --dry-run`

### RAG Operations
1. Query knowledge: `npm run rag:query -- "How does X work?"`
2. Test system: `npm run rag:test`
3. Clean if needed: `npm run rag:clean:ai -- --dry-run`
4. Setup environment: `npm run rag:setup`

---

## Error Handling

### Permission Denied
```bash
# If you see: Permission denied: ./scripts/commit
# Fix: chmod +x scripts/commit
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

### TypeScript Errors
```bash
# Check for type errors
npm run code:typecheck

# Fix common issues
npm run code:lint:fix
```

### Build Failures
```bash
# Try fast build first
npm run dev:build:fast

# Check for detailed errors
./scripts/verbose-wrapper.sh npm run dev:build --verbose
```

---

## Environment Variables

Some tools require environment variables:
- `GEMINI_API_KEY` - For RAG queries
- `DO_API_TOKEN` - For VPS management  
- `GITHUB_TOKEN` - For GitHub operations
- `NODE_ENV` - Development environment

---

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

---

## AI-Specific Features

### Universal AI Wrapper
Use for any command with AI features:
```bash
node scripts/ai-wrapper.js [command] [args] [--flags]

# Examples:
node scripts/ai-wrapper.js echo "test" --dry-run
node scripts/ai-wrapper.js npm run build --verbose --json
```

### Smart Help System
Context-aware help for any command:
```bash
npm run help                    # General help
npm run help git:commit         # Specific command help
npm run help git                # Category help
node scripts/help-system.js     # Direct help system
```

### Validation Framework
Comprehensive testing of all tools:
```bash
npm run ai:validate:all         # Test everything
npm run ai:validate git         # Test category
node scripts/validate-tools.js  # Direct validation
```

### JSON Formatter
Convert any output to structured JSON:
```bash
echo "output" | node scripts/json-formatter.js --type=generic
git status --short | node scripts/json-formatter.js --type=gitStatus
```

---

## Troubleshooting Guide

### Tool Not Working
1. `npm run ai:validate:[category]` - Test the category
2. `npm run help [command]` - Check command syntax
3. `node scripts/validate-tools.js [category]` - Detailed testing

### Unexpected Output
1. Add `--verbose` flag for detailed logs
2. Use `--json` flag for structured output
3. Check `npm run help [command]` for correct usage

### Permission Issues
1. Check file permissions: `ls -la scripts/`
2. Fix permissions: `chmod +x scripts/*.sh`
3. Validate: `npm run ai:validate:all`

### Environment Issues
1. Check Node.js version: `node --version`
2. Check Python: `python3 --version`
3. Check dependencies: `npm list`

---

## Performance Tips

### Faster Execution
```bash
# Skip image optimization
npm run dev:build:fast

# Quick validation
npm run ai:validate:git

# Parallel operations (when safe)
npm run git:status & npm run code:typecheck
```

### Better Debugging
```bash
# Detailed logs
./scripts/verbose-wrapper.sh [command] --verbose

# JSON for parsing
[command] -- --json

# Test before executing
[command] -- --dry-run
```

### Resource Management
```bash
# Check VPS costs before creating
npm run vps:cost

# Clean RAG data when full
npm run rag:clean:ai -- --dry-run

# Monitor performance
npm run ai:performance
```

---

## Integration Patterns

### CI/CD Integration
```yaml
# Example GitHub Action
- name: Validate Tools
  run: npm run ai:validate:all

- name: Code Review
  run: npm run code:review -- --file ${{ matrix.file }} --json

- name: Build Check
  run: npm run dev:build:fast
```

### Script Integration
```bash
#!/bin/bash
# Automated workflow script

# Validate environment
npm run ai:validate:all || exit 1

# Make changes
npm run code:review -- --file src/new-feature.tsx
npm run code:quality:all

# Deploy
npm run git:commit
npm run git:push
```

### API Integration
```javascript
// Using JSON output in code
const { execSync } = require('child_process');

const status = JSON.parse(
  execSync('npm run git:status:json', { encoding: 'utf8' })
);

if (status.hasChanges) {
  console.log(`Found ${status.count} changed files`);
}
```

---

## Advanced Usage

### Custom Wrappers
Create project-specific wrappers:
```bash
# Custom validation script
#!/bin/bash
npm run ai:validate:git
npm run ai:validate:code
npm run code:quality:all
```

### Batch Operations
```bash
# Review multiple files
for file in src/components/*.tsx; do
  npm run code:review -- --file "$file" --json
done

# Multiple dry-runs
npm run git:commit:ai -- --dry-run
npm run vps:cleanup:ai -- --dry-run
npm run content:blog:ai -- --dry-run
```

### Monitoring Integration
```bash
# Performance tracking
npm run ai:performance:log >> metrics.json

# Health checks
npm run ai:validate:all && echo "✅ All systems operational"
```

---

## Quick Reference Cards

### Daily Commands
```bash
npm run help                    # Start here
npm run git:status              # Check changes
npm run git:commit              # Save changes
npm run dev:server              # Start development
npm run code:typecheck          # Check types
```

### Emergency Commands  
```bash
npm run ai:validate:all         # Test everything
npm run help                    # Get help
npm run code:quality:all        # Fix code issues
npm run dev:build:fast          # Quick build test
```

### AI-Specific Commands
```bash
[any-command] -- --dry-run      # Preview first
[any-command] -- --json         # Get JSON output
[any-command] -- --verbose      # Debug logs
npm run help [command]          # Get command help
```

---

**Remember**: This unified interface makes every tool predictable and AI-friendly. When in doubt, start with `npm run help` and use `--dry-run` for safety.
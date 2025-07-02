# AI-First Tool Consolidation Plan

## Project Vision
Create a single, consistent npm-based interface for ALL project tools that is optimized for AI assistant usage.

## Complete Tool Inventory

### 1. Scripts Directory (/scripts/)
- **commit** - Fast git commit with conventional commits
- **agent-performance-tracker.js** - Track AI agent performance metrics
- **claude-seo.js** - SEO CLI interface
- **code-review-agent.js** - Automated code review for functional programming
- **code-review-api-simple.js** - HTTP API for code review
- **code-review-api.js** - Full code review API
- **generate-blog-post.js** - AI-powered blog generation
- **generate-routes-docs.js** - Auto-generate route documentation
- **list-automation-tools.js** - List all available tools
- **optimize-images.js** - Image optimization
- **seo-agent.js** - SEO analysis tool
- **seo-optimizer.js** - Auto-optimize content for SEO

### 2. VPS Scripts Directory (/vps-scripts/)
- **cleanup.sh** - Clean up VPS resources
- **cost-calculator.sh** - Calculate VPS costs
- **create-base-snapshot.sh** - Create base VPS snapshot
- **create-minimal-test.sh** - Create minimal test environment
- **create-snapshot-from-droplet.sh** - Snapshot existing droplet
- **manage.sh** - General VPS management
- **provision-base.sh** - Provision base VPS
- **spin-up-no-wait.sh** - Quick VPS spin up
- **spin-up.sh** - Standard VPS spin up
- **test-dry-run.sh** - Test without actual provisioning
- **test-prerequisites.sh** - Check prerequisites
- **update-snapshot.sh** - Update existing snapshot

### 3. RAG Directory (/rag/)
- **gemini_rag_cli.py** - Gemini RAG CLI interface
- **gemini_rag_cli_local.py** - Local Gemini RAG
- **gemini_rag_wrapper.sh** - Shell wrapper for Gemini
- **gemini_rag_clean.sh** - Clean RAG data
- **rag-helper.sh** - RAG helper utilities
- **test_gemini_free.py** - Test Gemini free tier

### 4. NPM Scripts (package.json)
- Various dev, build, and tool commands already defined

### 5. Slash Commands (~/.claude/commands/)
- **fastcommit.md** - Broken slash command (to be removed)

## Unified Interface Design

### Naming Convention
```bash
npm run [category]:[subcategory]:[action] -- [options]
```

### Categories
```bash
git:*         # Version control operations
code:*        # Code quality and review
content:*     # Content generation and SEO
dev:*         # Development tools
vps:*         # VPS management
rag:*         # RAG/AI memory operations
ai:*          # AI-specific helpers
help          # Discovery and documentation
```

## Implementation Plan

### Phase 1: Complete Tool Mapping
Create npm scripts for ALL existing tools:

```json
{
  "scripts": {
    // Git Operations
    "git:commit": "./scripts/commit",
    "git:status": "git status",
    "git:push": "git push origin main",
    
    // Code Quality
    "code:review": "node scripts/code-review-agent.js",
    "code:review:api": "node scripts/code-review-api-simple.js --port 3001",
    "code:lint": "eslint src/",
    "code:typecheck": "astro check",
    "code:quality:all": "npm run code:lint && npm run code:typecheck",
    
    // Content & SEO
    "content:blog:generate": "node scripts/generate-blog-post.js",
    "content:seo:analyze": "node scripts/seo-agent.js",
    "content:seo:optimize": "node scripts/seo-optimizer.js",
    "content:seo:cli": "node scripts/claude-seo.js",
    
    // Development
    "dev:server": "astro dev",
    "dev:build": "astro build",
    "dev:preview": "astro preview",
    "dev:images:optimize": "node scripts/optimize-images.js",
    "dev:docs:routes": "node scripts/generate-routes-docs.js",
    
    // VPS Management
    "vps:manage": "./vps-scripts/manage.sh",
    "vps:spinup": "./vps-scripts/spin-up.sh",
    "vps:spinup:quick": "./vps-scripts/spin-up-no-wait.sh",
    "vps:cleanup": "./vps-scripts/cleanup.sh",
    "vps:cost": "./vps-scripts/cost-calculator.sh",
    "vps:snapshot:create": "./vps-scripts/create-base-snapshot.sh",
    "vps:snapshot:update": "./vps-scripts/update-snapshot.sh",
    "vps:test:prerequisites": "./vps-scripts/test-prerequisites.sh",
    "vps:test:dryrun": "./vps-scripts/test-dry-run.sh",
    
    // RAG/AI Memory
    "rag:query": "./rag/gemini_rag_wrapper.sh",
    "rag:query:local": "cd rag && python gemini_rag_cli_local.py",
    "rag:clean": "./rag/gemini_rag_clean.sh",
    "rag:helper": "./rag/rag-helper.sh",
    "rag:test": "cd rag && python test_gemini_free.py",
    
    // AI Helpers
    "ai:performance": "node scripts/agent-performance-tracker.js --summary",
    "ai:tools:list": "node scripts/list-automation-tools.js",
    "ai:validate": "npm run ai:validate:impl",
    "ai:validate:impl": "echo 'Validating all tools...' && npm run help",
    
    // Help System
    "help": "npm run ai:tools:list"
  }
}
```

### Phase 2: AI-Specific Enhancements

1. **Dry Run Support**
   - Add `--dry-run` flag to all destructive operations
   - Preview what would happen without execution

2. **JSON Output**
   - Add `--json` flag for machine-readable output
   - Helps AI parse results

3. **Verbose Mode**
   - Add `--verbose` for detailed execution logs
   - Aids in debugging

4. **Help Integration**
   - `npm run help [command]` for specific help
   - Auto-generated from script headers

### Phase 3: Documentation Update

Update CLAUDE.md to reflect reality:
- Remove false MCP claims
- Document only the npm interface
- Include examples for each category
- Add troubleshooting guide

### Phase 4: Legacy Cleanup

1. Remove `~/.claude/commands/fastcommit.md`
2. Add deprecation notices to direct script usage
3. Update all documentation references
4. Archive old interfaces

### Phase 5: Validation & Testing

Create comprehensive test suite:
```bash
npm run ai:validate:all  # Test every single command
npm run ai:validate:git  # Test git category
npm run ai:validate:vps  # Test VPS category
```

## Success Criteria

1. ✅ Single npm interface for ALL tools
2. ✅ No conflicting command systems
3. ✅ 100% tool discoverability via `npm run help`
4. ✅ Consistent naming pattern AI can predict
5. ✅ All tools validated and working
6. ✅ Documentation matches reality
7. ✅ AI can use any tool without confusion

## Timeline

- Day 1: Complete tool audit ✓
- Day 2-3: Implement npm wrappers
- Day 4: Add AI enhancements
- Day 5: Update documentation
- Day 6: Remove legacy systems
- Day 7: Final validation

## Notes

- VPS scripts need executable permissions
- RAG tools require Python environment
- Some tools may need environment variables
- Consider adding `.env` support for configuration

This plan ensures EVERY tool in the project is accessible through a single, predictable interface optimized for AI usage.
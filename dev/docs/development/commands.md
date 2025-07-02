# BS Display Command Reference

## Overview
All tools in this project are accessible through npm scripts using the pattern:
```bash
npm run [category]:[subcategory]:[action] -- [options]
```

---

## Git Operations

### git:commit
Create intelligent commit with conventional format.
```bash
npm run git:commit              # Standard commit
npm run git:commit:ai -- --dry-run # Preview without committing
npm run git:commit:ai -- --verbose # Detailed logging
npm run git:commit:ai -- --json    # JSON output
```

### git:status
Show repository status.
```bash
npm run git:status              # Human readable
npm run git:status:json         # Machine readable JSON
```

### git:push
Push commits to remote.
```bash
npm run git:push                # Push to origin/main
```

### git:pull
Pull changes from remote.
```bash
npm run git:pull                # Pull from origin/main
```

### git:log
Show recent commit history.
```bash
npm run git:log                 # Last 10 commits, one line each
```

---

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

### code:quality:all
Run all quality checks.
```bash
npm run code:quality:all        # Lint + TypeScript check
```

---

## Content Generation

### content:blog:generate
Generate SEO-optimized blog post.
```bash
npm run content:blog:generate   # Interactive generation
npm run content:blog:ai -- --topic "AI in Education"
npm run content:blog:ai -- --dry-run
```

### content:seo:analyze
Analyze content for SEO.
```bash
npm run content:seo:analyze -- --file src/content/blog/post.md
npm run content:seo:analyze -- --file src/content/blog/post.md --json
```

### content:seo:optimize
Auto-optimize content for SEO.
```bash
npm run content:seo:optimize -- --file src/content/blog/post.md
npm run content:seo:optimize -- --file src/content/blog/post.md --backup
```

### content:seo:cli
CLI interface for SEO operations.
```bash
npm run content:seo:cli -- review --file blog.md
npm run content:seo:cli -- optimize --file blog.md
```

### content:seo:review
Review content for SEO quality.
```bash
npm run content:seo:review      # Review using CLI
```

### content:seo:auto
Auto-optimize content.
```bash
npm run content:seo:auto        # Auto-optimize using CLI
```

---

## Development Tools

### dev:server
Start development server.
```bash
npm run dev:server              # Standard server
npm run dev:server:expose       # Accessible externally
```

### dev:build
Build for production.
```bash
npm run dev:build               # Full build with image optimization
npm run dev:build:fast          # Skip image optimization
```

### dev:preview
Preview production build.
```bash
npm run dev:preview             # Preview built site
```

### dev:images:optimize
Optimize images for web.
```bash
npm run dev:images:optimize     # Optimize all images
```

### dev:docs:routes
Generate route documentation.
```bash
npm run dev:docs:routes         # Auto-generate route docs
```

---

## VPS Management

### vps:manage
General VPS management interface.
```bash
npm run vps:manage              # Interactive management
```

### vps:spinup
Create new VPS instance.
```bash
npm run vps:spinup              # Standard spinup
npm run vps:spinup:quick        # No-wait spinup
npm run vps:spinup:ai -- --dry-run # Preview creation
```

### vps:cleanup
Clean up VPS resources.
```bash
npm run vps:cleanup             # Interactive cleanup
npm run vps:cleanup:ai -- --force  # Force cleanup
npm run vps:cleanup:ai -- --dry-run # Preview cleanup
```

### vps:cost
Calculate VPS costs.
```bash
npm run vps:cost                # Show cost breakdown
```

### vps:snapshot
Manage VPS snapshots.
```bash
npm run vps:snapshot:create     # Create new snapshot
npm run vps:snapshot:update     # Update existing snapshot
npm run vps:snapshot:from-droplet # Create from existing droplet
```

### vps:provision
Provision base VPS.
```bash
npm run vps:provision           # Provision base configuration
```

### vps:test
Test VPS operations.
```bash
npm run vps:test:minimal        # Create minimal test environment
npm run vps:test:prerequisites  # Check prerequisites
npm run vps:test:dryrun         # Test without actual provisioning
```

---

## RAG/AI Memory

### rag:query
Query project knowledge base.
```bash
npm run rag:query -- "How does ProductCard work?"
npm run rag:query -- "Debug image 404 errors" --verbose
```

### rag:query:local
Use local model for queries.
```bash
npm run rag:query:local         # Local Gemini RAG
```

### rag:clean
Clean RAG database.
```bash
npm run rag:clean               # Clean all data
npm run rag:clean:ai -- --dry-run  # Preview cleanup
```

### rag:helper
RAG helper utilities.
```bash
npm run rag:helper              # Helper utilities
```

### rag:test
Test RAG system.
```bash
npm run rag:test                # Test Gemini free tier
```

### rag:setup
Setup RAG environment.
```bash
npm run rag:setup               # Install requirements
npm run rag:setup:local         # Setup local requirements
```

---

## AI Helper Commands

### ai:performance
Track AI agent performance.
```bash
npm run ai:performance          # Summary view
npm run ai:performance:log      # Detailed logging
```

### ai:tools:list
List all automation tools.
```bash
npm run ai:tools:list           # Complete tools overview
```

### ai:context
Show project context.
```bash
npm run ai:context              # Display CLAUDE.md
```

### ai:plan
Show consolidation plan.
```bash
npm run ai:plan                 # Display consolidation plan
```

### ai:validate
Validate all tools.
```bash
npm run ai:validate             # Basic validation
npm run ai:validate:all         # Comprehensive validation
npm run ai:validate:git         # Test git tools only
npm run ai:validate:code        # Test code tools only
npm run ai:validate:dry         # Test dry-run mode
```

---

## Help System

### help
Get help on available commands.
```bash
npm run help                    # General help
npm run help:git                # Git-specific help
npm run help:code               # Code-specific help
npm run help:content            # Content-specific help
npm run help:vps                # VPS-specific help
npm run help:rag                # RAG-specific help
npm run help:command git:commit # Detailed command help
```

---

## Legacy Commands (Deprecated)

These commands still work but are deprecated:
```bash
# Old tools: prefix - use new category: prefix instead
npm run tools                   # Use: npm run help
npm run tools:code-review       # Use: npm run code:review
npm run tools:blog-generate     # Use: npm run content:blog:generate
npm run tools:seo-analyze       # Use: npm run content:seo:analyze

# Old development commands - use new dev: prefix
npm run dev                     # Use: npm run dev:server
npm run build                   # Use: npm run dev:build
npm run check                   # Use: npm run code:typecheck
npm run preview                 # Use: npm run dev:preview
```

---

## AI-Enhanced Features

### Dry-Run Mode
Preview destructive operations:
```bash
npm run git:commit:ai -- --dry-run
npm run vps:cleanup:ai -- --dry-run
npm run content:blog:ai -- --dry-run
npm run rag:clean:ai -- --dry-run
```

### JSON Output
Machine-readable results:
```bash
npm run git:status:json
npm run code:review -- --file test.js --json
npm run content:seo:analyze -- --file blog.md --json
```

### Verbose Mode
Detailed execution logs:
```bash
./scripts/verbose-wrapper.sh [command] --verbose
node scripts/ai-wrapper.js [command] --verbose
```

### Universal Wrapper
Use AI wrapper for any command:
```bash
node scripts/ai-wrapper.js [command] [args] [--dry-run|--json|--verbose]
```

---

## Quick Reference

### Most Common Commands
```bash
npm run help                    # See all commands
npm run git:status              # Check repository
npm run git:commit              # Create commit
npm run code:review -- --file [file] # Review code
npm run content:blog:generate   # Generate blog
npm run dev:server              # Start development
npm run ai:validate             # Test all tools
```

### Emergency Commands
```bash
npm run help                    # If lost, start here
npm run ai:tools:list           # See all automation tools
npm run ai:validate:all         # Test everything
npm run code:typecheck          # Check TypeScript
npm run dev:build               # Verify build works
```

### AI-Friendly Patterns
```bash
# Always test before executing
[command] -- --dry-run

# Get structured output
[command] -- --json

# Debug with detailed logs
./scripts/verbose-wrapper.sh [command] --verbose

# Get help for any command
npm run help [command]
```
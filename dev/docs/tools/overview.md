# Tools Overview

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

## Unified Interface Design

All project tools are accessible through consistent npm commands for optimal AI assistant usage.

### Quick Access Commands
```bash
npm run help                    # See all available commands
npm run git:commit             # Intelligent git commits
npm run code:review -- --file [path]  # Automated code review
npm run content:blog:generate  # AI blog post generation
npm run vps:manage            # VPS infrastructure management
npm run rag:query             # AI memory system
npm run mcp:pdf:setup         # Setup PDF analyzer MCP server
```

### Tool Categories
- **Code Quality**: Code review, performance tracking
- **Content & SEO**: Blog generation, SEO optimization
- **Infrastructure**: VPS management, deployment
- **AI Systems**: RAG queries, MCP servers
- **Development**: Build tools, type checking

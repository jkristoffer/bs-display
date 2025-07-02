# Daily Commands

## Quick Access Commands

```bash
npm run help                    # See all available commands
npm run git:commit             # Intelligent git commits
npm run code:review -- --file [path]  # Automated code review
npm run content:blog:generate  # AI blog post generation
npm run vps:manage            # VPS infrastructure management
npm run rag:query             # AI memory system
npm run mcp:pdf:setup         # Setup PDF analyzer MCP server
```

## AI-Enhanced Features

```bash
# Dry-run any destructive operation
npm run git:commit:ai -- --dry-run
npm run vps:cleanup:ai -- --dry-run

# JSON output for parsing
npm run git:status:json
npm run code:review -- --file test.js --json

# Verbose logging for debugging
./scripts/verbose-wrapper.sh [command] --verbose

# Contextual help
npm run help git:commit
npm run help code:review
```

## RAG Project Memory Commands

```bash
# Project-aware queries with full context
npm run rag:query -- "How does the ProductCard component work?"
npm run rag:query -- "Images are 404ing on product pages"
npm run rag:query -- "Quiz component for functional programming standards"
npm run rag:query -- "How should I implement user authentication?"

# Project maintenance
npm run rag:setup      # Initial setup (one-time)
npm run rag:clean      # Clean and re-ingest after major changes
```

## Development Commands

```bash
npm run dev:server        # Start development server
npm run dev:server:expose # Start server accessible externally
npm run dev:build         # Build for production
npm run code:typecheck    # TypeScript checking
npm run dev:preview       # Preview production build
```

## Code Quality Commands

```bash
# Essential code review (run after every change)
npm run code:review -- --file [file]

# Full directory analysis
npm run code:review -- --batch src/components/

# Performance tracking
npm run ai:performance
```

## Content & SEO Commands

```bash
# Analyze blog post SEO
npm run content:seo:analyze -- --file src/content/blog/[post].md

# Auto-optimize content
npm run content:seo:optimize -- --file src/content/blog/[post].md

# Generate new blog post
npm run content:blog:generate
```

## Emergency Commands

```bash
# Check all automation tools
npm run help

# Essential Tools List
npm run ai:tools:list    # Show detailed automation tools
```

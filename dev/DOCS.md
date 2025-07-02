# 📚 Big Shine Display Documentation Hub

*Last Updated: 2025-07-02*

> **Purpose**: Central navigation for all project documentation. Start here!

## 🚀 Quick Start

### Daily Development
```bash
npm run dev:server              # Start development server
npm run dev:build               # Build for production
npm run code:typecheck          # TypeScript checking
npm run dev:preview             # Preview production build
```

### AI Development Workflow
1. **Planning**: Review task requirements and use TodoWrite for complex tasks
2. **Implementation**: Follow [AI Development Guide](./CLAUDE.md) patterns
3. **Quality Check**: `npm run code:review -- --file [file]`
4. **Documentation**: Update relevant docs as needed

## 🗺️ Documentation Map

### Core Documentation
- **[AI Development Guide](./CLAUDE.md)** - Comprehensive guide for AI assistants (primary development tool)
- **[Command Reference](./COMMAND_REFERENCE.md)** - Complete unified npm command interface
- **[Architecture Overview](./CLAUDE.md#architecture-overview)** - System design and patterns
- **[Development Standards](./src/development-standards/)** - Component, styling, and naming conventions

### AI-Powered Development
- **[RAG Project Memory Guide](./docs/RAG_PROJECT_MEMORY_GUIDE.md)** - Comprehensive RAG system documentation  
- **[RAG Quick Reference](./docs/RAG_QUICK_REFERENCE.md)** - Daily usage commands and examples
- **[AI Development Guide](./CLAUDE.md)** - Core AI assistant patterns and workflows

### Development Tools
- **[Routes Documentation](./ROUTES.md)** - Auto-generated route documentation
  - Update: `npm run dev:docs:routes`

### Specialized Guides
- **[Quiz System](./src/components/quiz/CLAUDE.md)** - Interactive quiz implementation
- **[VPS Deployment](./vps-scripts/README.md)** - Server management and deployment
- **[MCP Setup Guide](./MCP_SETUP_GUIDE.md)** - Model Context Protocol configuration

### Project Management
- **[Content Queue](./content-queue.json)** - Scheduled blog posts and content planning
- **[Agent Performance](./agent-performance.json)** - AI agent metrics tracking

## 🎯 Common Tasks

### Adding New Features
1. Check [Component Standards](./src/development-standards/standards/component-standards.md)
2. Review similar existing components
3. Implement with TypeScript and SCSS modules
4. Run code review: `npm run code:review -- --file [file]`

### Content Management
```bash
# SEO Analysis
npm run content:seo:analyze -- --file src/content/blog/[post].md

# Auto-optimize
npm run content:seo:optimize -- --file src/content/blog/[post].md

# Generate new blog post
npm run content:blog:generate
```

### Code Quality
```bash
# Single file review
npm run code:review -- --file [file]

# Run all quality checks
npm run code:quality:all

# Performance tracking
npm run ai:performance
```

### Git Operations
```bash
# Check repository status
npm run git:status

# Create intelligent commit
npm run git:commit

# Push to remote
npm run git:push
```

### RAG/AI Memory
```bash
# Query project knowledge
npm run rag:query -- "How does ProductCard work?"

# Clean RAG database
npm run rag:clean

# Test RAG system
npm run rag:test
```

## 📊 Project Status

### Current Priorities
1. TypeScript migration (7 JSX files remaining)
2. Component organization consistency
3. Asset consolidation strategy
4. Documentation centralization ✓

### Active Systems
- ✅ Unified command interface (category:action pattern)
- ✅ Automated code review enforcement
- ✅ RAG project memory system
- ✅ VPS management automation
- ✅ Content generation pipeline

## 🔧 Configuration Files

### Key Config Locations
- **TypeScript**: `tsconfig.json`
- **Astro**: `astro.config.mjs`
- **ESLint**: `eslint.config.mjs`
- **Package Scripts**: `package.json`

### Environment Setup
```bash
# Required Node version: 18+
# No environment variables required for development
# Production uses Vercel environment
```

## 📋 Quick Command Reference

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

### Help System
```bash
npm run help                    # General help
npm run help:git                # Git-specific help
npm run help:code               # Code-specific help
npm run help:content            # Content-specific help
npm run help:vps                # VPS-specific help
npm run help:rag                # RAG-specific help
```

## 🔄 Migration from Legacy Commands

### Deprecated Commands (Still Work)
```bash
# Old commands → New unified commands
npm run dev                     # Use: npm run dev:server
npm run build                   # Use: npm run dev:build
npm run check                   # Use: npm run code:typecheck
npm run preview                 # Use: npm run dev:preview
npm run tools                   # Use: npm run help
npm run tools:code-review       # Use: npm run code:review
npm run tools:blog-generate     # Use: npm run content:blog:generate
npm run tools:seo-analyze       # Use: npm run content:seo:analyze
```

## 📝 Documentation Guidelines

### When to Update Docs
- New features or tools added
- Workflow changes
- Configuration updates
- Discovered gotchas or tips

### Documentation Standards
- Keep it practical and actionable
- Include examples and commands
- Update dates when modified
- Link to detailed guides

## 🆘 Troubleshooting

### Common Issues
1. **TypeScript errors**: Run `npm run code:typecheck`
2. **Build failures**: Check console for specific errors
3. **Image optimization**: Run `npm run dev:images:optimize`
4. **Route 404s**: Update routes with `npm run dev:docs:routes`

### Getting Help
- Check specific tool documentation
- Review error messages carefully
- Git history often reveals solutions
- AI assistant can help debug most issues
- Use `npm run help [command]` for specific command help

### AI-Enhanced Features
```bash
# Preview destructive operations
[command] -- --dry-run

# Get structured output
[command] -- --json

# Debug with detailed logs
./scripts/verbose-wrapper.sh [command] --verbose
```

---

*Remember: This is your personal command center. Customize it as needed!*

**Key Changes from Legacy System:**
- All commands now use unified `category:action` pattern
- Deprecated `tools:*` commands replaced with proper categories
- Links updated to current documentation (not archived files)
- Complete command reference available in [COMMAND_REFERENCE.md](./COMMAND_REFERENCE.md)
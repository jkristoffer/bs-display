# 📚 Big Shine Display Documentation Hub

*Last Updated: 2025-06-29*

> **Purpose**: Central navigation for all project documentation. Start here!

## 🚀 Quick Start

### Daily Development
```bash
npm run dev              # Start development server
npm run build           # Build for production
npm run check           # TypeScript checking
npm run preview         # Preview production build
```

### AI Development Workflow
1. **Planning**: Review task requirements and use TodoWrite for complex tasks
2. **Implementation**: Follow [AI Development Guide](./CLAUDE.md) patterns
3. **Quality Check**: `npm run tools:code-review -- --file [file]`
4. **Documentation**: Update relevant docs as needed

## 🗺️ Documentation Map

### Core Documentation
- **[AI Development Guide](./CLAUDE.md)** - Comprehensive guide for AI assistants (primary development tool)
- **[Architecture Overview](./CLAUDE.md#architecture-overview)** - System design and patterns
- **[Development Standards](/src/development-standards/)** - Component, styling, and naming conventions

### AI-Powered Development
- **[RAG Project Memory Guide](./docs/RAG_PROJECT_MEMORY_GUIDE.md)** - Comprehensive RAG system documentation  
- **[RAG Quick Reference](./docs/RAG_QUICK_REFERENCE.md)** - Daily usage commands and examples
- **[AI Development Guide](./CLAUDE.md)** - Core AI assistant patterns and workflows

### Development Tools
- **[Code Review Agent](./CODE_REVIEW_AGENT.md)** - Automated code quality enforcement
  - Quick check: `npm run tools:code-review -- --file [file]`
- **[SEO Optimization](./SEO_QUICK_REFERENCE.md)** - Content analysis and optimization
  - Analysis: `npm run tools:seo-analyze -- --file [file]`
- **[Blog Automation](./BLOG_AUTOMATION_README.md)** - Automated content generation system
  - Generate: `npm run tools:blog-generate`
- **[Routes Documentation](./ROUTES.md)** - Auto-generated route documentation
  - Update: `npm run docs:routes`

### Specialized Guides
- **[Quiz System](/src/components/quiz/CLAUDE.md)** - Interactive quiz implementation
- **[VPS Deployment](/vps-scripts/README.md)** - Server management and deployment

### Project Management
- **[Content Queue](./content-queue.json)** - Scheduled blog posts and content planning
- **[Agent Performance](./agent-performance.json)** - AI agent metrics tracking

## 🎯 Common Tasks

### Adding New Features
1. Check [Component Standards](/src/development-standards/standards/component-standards.md)
2. Review similar existing components
3. Implement with TypeScript and SCSS modules
4. Run code review: `node scripts/code-review-agent.js --file [file]`

### Content Management
```bash
# SEO Analysis
npm run tools:seo-analyze -- --file src/content/blog/[post].md

# Auto-optimize
npm run tools:seo-optimize -- --file src/content/blog/[post].md

# Generate new blog post
npm run tools:blog-generate
```

### Code Quality
```bash
# Single file review
npm run tools:code-review -- --file [file]

# Performance tracking
npm run tools:performance

# View all automation tools
npm run tools
```

## 📊 Project Status

### Current Priorities
1. TypeScript migration (7 JSX files remaining)
2. Component organization consistency
3. Asset consolidation strategy
4. Documentation centralization ✓

### Active Systems
- ✅ Automated blog generation (every 3 days)
- ✅ Code review enforcement (PR blocking <60)
- ✅ SEO optimization pipeline
- ✅ Route documentation auto-generation

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
1. **TypeScript errors**: Run `npm run check`
2. **Build failures**: Check console for specific errors
3. **Image optimization**: Run `node scripts/optimize-images.js`
4. **Route 404s**: Update routes with `npm run docs:routes`

### Getting Help
- Check specific tool documentation
- Review error messages carefully
- Git history often reveals solutions
- AI assistant can help debug most issues

---

*Remember: This is your personal command center. Customize it as needed!*
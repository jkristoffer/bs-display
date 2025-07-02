# Quick Start Guide

**Get up and running with the BS Display development environment in minutes.**

This section provides the fastest path to productive development, whether you're new to the project or returning after a break.

---

## 🚀 Immediate Start

### **Prerequisites**
- Node.js 18+ and npm
- Git configured with your credentials
- Code editor (VS Code recommended)

### **Get Running (2 minutes)**
```bash
# Clone and setup
git clone [repository-url]
cd bs-display/dev
npm install

# Start development
npm run dev:server
# → http://localhost:4321

# See all available commands
npm run help
```

---

## 📋 Essential Commands

### **Daily Development**
```bash
npm run dev:server          # Start development server
npm run dev:build           # Build for production
npm run code:typecheck      # TypeScript validation
npm run git:commit          # Intelligent commit workflow
```

### **Code Quality**
```bash
npm run code:review -- --file [path]  # Review specific file
npm run code:review -- --batch src/   # Review entire directory
```

### **Content & AI Tools**
```bash
npm run rag:query -- "your question"  # Project memory queries
npm run content:blog:generate          # AI blog generation
npm run help                          # Show all commands
```

---

## 🗂️ Project Structure

### **Key Directories**
```
src/
├── components/     # React & Astro UI components
├── pages/         # Route definitions
├── data/          # Product data and schemas
├── content/       # Blog posts and use cases
└── styles/        # Global SCSS

docs/              # Documentation (you are here)
scripts/           # Automation tools
forge/             # AI development automation
```

### **Important Files**
- `CLAUDE.md` - AI development guide and project instructions
- `package.json` - Available npm scripts and dependencies
- `astro.config.mjs` - Astro framework configuration
- `tsconfig.json` - TypeScript configuration

---

## 🎯 Development Workflow

### **1. Understanding the Codebase**
```bash
# Use AI project memory for context
npm run rag:query -- "How does the product catalog work?"
npm run rag:query -- "Component architecture patterns"
npm run rag:query -- "Where is authentication implemented?"
```

### **2. Making Changes**
```bash
# Before coding - check current state
npm run git:status:json

# During development - continuous validation
npm run code:typecheck
npm run code:review -- --file src/components/YourComponent.tsx

# After changes - intelligent commit
npm run git:commit
```

### **3. Quality Assurance**
```bash
# Build verification
npm run dev:build

# Full codebase review
npm run code:review -- --batch src/

# Type checking
npm run code:typecheck
```

---

## 🏗️ Architecture Overview

### **Technology Stack**
- **Frontend**: Astro 5.x + React 19 + TypeScript
- **Styling**: SCSS modules with design system
- **Data**: JSON-based product catalog
- **Content**: Markdown with Astro collections
- **Deployment**: Vercel with automatic optimization

### **Key Patterns**
- **Functional Programming** - Pure functions, immutability
- **Component Composition** - Reusable UI building blocks
- **Static Generation** - Pre-rendered for performance
- **Type Safety** - TypeScript throughout

### **Data Flow**
```
JSON Data → TypeScript Interfaces → React Components → Astro Pages
```

---

## 🔧 Common Tasks

### **Adding New Components**
1. Create component in appropriate `/src/components/` subdirectory
2. Follow naming conventions (PascalCase)
3. Use TypeScript with proper interfaces
4. Create SCSS module for styling
5. Export via index.ts
6. Run code review: `npm run code:review -- --file [path]`

### **Working with Product Data**
1. Product data located in `/src/data/models.[brand].json`
2. Schema definitions in `/src/data/schema.*.json`
3. Import from `/src/data/models.all.js`
4. TypeScript interfaces in `/src/types/product.ts`

### **Creating Content**
1. Blog posts go in `/src/content/blog/` as markdown
2. Use frontmatter for metadata
3. Run SEO analysis: `npm run content:seo:analyze -- --file [path]`
4. Generate content: `npm run content:blog:generate`

---

## 🆘 Troubleshooting

### **Common Issues**

#### **Build Failures**
```bash
# Check TypeScript errors
npm run code:typecheck

# Fast build (skip image optimization)
npm run dev:build:fast

# Clean build
rm -rf dist/ && npm run dev:build
```

#### **Import Errors**
- Check file naming conventions (kebab-case for files, PascalCase for components)
- Verify import paths are correct
- Ensure exports are properly defined

#### **Tool Issues**
```bash
# Verify tool availability
npm run help

# Check specific tool status
npm run ai:tools:list

# Emergency recovery
npm run rag:query -- "tool troubleshooting help"
```

### **Getting Help**
- **AI Project Memory**: `npm run rag:query -- "your question"`
- **Code Review**: `npm run code:review -- --file [problematic-file]`
- **Documentation**: Check `/docs/` for detailed guides
- **Emergency**: See `/docs/emergency-procedures.md`

---

## 📚 Next Steps

### **For New Developers**
1. **[Project Overview](./project-overview.md)** - Deep dive into architecture
2. **[Development Setup](./development-setup.md)** - Advanced configuration
3. **[First Contribution](./first-contribution.md)** - Guided first task

### **For Regular Contributors**
1. **[Development Guide](../development/README.md)** - Daily workflows
2. **[Standards](../development/standards/README.md)** - Code quality guidelines
3. **[Tools](../tools/README.md)** - Automation and productivity

### **For System Understanding**
1. **[Specialized Systems](../specialized/README.md)** - Forge, RAG, VPS, MCP
2. **[Internal Documentation](../internal/README.md)** - Architecture and planning
3. **[Migration Guide](../migration/README.md)** - System transitions

---

**Ready to contribute? Start with your first task and use the AI tools to accelerate your development workflow.**

*Last updated: 2025-07-02*
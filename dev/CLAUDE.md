# CLAUDE.md

**AI Development Guide for Claude Code** - This file provides essential guidance for AI assistants working in this repository.

---

## 🚨 CRITICAL FIRST - AI Development Rules

**These rules must be followed for every task:**

1. **Always verify context first** - Use Glob/LS tools before coding to confirm files exist
2. **Follow functional programming** - Pure functions, immutability, composition ([Standards](/src/development-standards/functional-programming.md))
3. **Run code review agent** - After generating code: `npm run tools:code-review -- --file [file]`
4. **Use TodoWrite tool** - For complex tasks requiring planning and tracking

---

## ⚡ MCP INTEGRATION (ACTIVE!)

**Native automation tools available directly in Claude Code via Model Context Protocol.**

### **Quick MCP Commands**
```bash
# Available as native Claude Code tools:
/commit                    # Intelligent git commits
/code-review --file [path] # Automated code review
/seo-analyze --file [path] # SEO analysis for content
/blog-generate             # AI blog post generation
/type-check               # TypeScript validation  
/build                    # Production build
/dev-server              # Start development server
/performance-check       # Performance analysis
```

### **MCP Setup Status**
- ✅ **Auto-configured**: Works immediately in this project directory
- ✅ **Team-ready**: Configuration checked into version control  
- ✅ **Fully tested**: All 8 automation tools verified and working
- ✅ **Secure**: Project-scoped with approval prompts

### **Learn More**
- **[MCP Setup Guide](./MCP_SETUP_GUIDE.md)** - Complete configuration details
- **[Verification Script](./verify-mcp-setup.js)** - Test MCP functionality

---

## 🧠 RAG PROJECT MEMORY

**Transform from stateless AI to project-aware assistant with comprehensive codebase memory.**

### **Quick Commands**
```bash
# Project-aware queries with full context
/gemini "How does the ProductCard component work?"
/debug "Images are 404ing on product pages"
/review "Quiz component for functional programming standards"  
/architect "How should I implement user authentication?"

# Project maintenance
/gemini-context     # Initial setup (one-time)
/gemini-update      # Re-ingest after major changes
```

### **Learn More**
- **[RAG System Guide](./docs/RAG_PROJECT_MEMORY_GUIDE.md)** - Complete documentation
- **[RAG Quick Reference](./docs/RAG_QUICK_REFERENCE.md)** - Daily usage examples

---

## 🆘 EMERGENCY QUICK ACCESS

### **Automation Failures**
```bash
# Code review agent issues
npm run tools:code-review -- --file test.js

# SEO system failures  
npm run tools:seo-analyze -- --file src/content/blog/[post].md

# Blog generation problems
npm run tools:blog-generate

# Check all automation tools
npm run tools
```

### **Path Issues**
- **Development Standards**: `/src/development-standards/standards/`
- **Components**: `/src/components/`
- **Product Data**: `/src/data/models.[brand].json`
- **Automation Scripts**: `/scripts/`

### **Context Problems**
- **File not found**: Use Glob tool with pattern matching
- **Import errors**: Check `/src/development-standards/standards/file-naming.md`
- **Type errors**: Run `npm run check` for Astro type checking

### **Full Emergency Procedures**: [EMERGENCY_PROCEDURES.md](./EMERGENCY_PROCEDURES.md)

---

## 🤝 HUMAN-AI COLLABORATION MODEL

### **Human Responsibilities**
- **Strategic Decisions**: Architecture choices, business logic, user experience
- **Acceptance Criteria**: Define what "done" looks like
- **Final Verification**: Review implementation against requirements
- **Code Review**: Approve changes affecting core functionality

### **AI Responsibilities**
- **Implementation**: Write code, create components, implement features  
- **Documentation**: Generate inline docs, update relevant files
- **Debugging**: Identify and fix implementation issues
- **Quality Assurance**: Run code review agent, ensure standards compliance

### **Development Velocity Targets**
- **Simple tasks**: 30-60 minutes (single component changes)
- **Medium tasks**: 2-4 hours (multiple components, some integration)
- **Complex tasks**: 4+ hours (architectural changes, multiple sessions)

### **Task Communication Patterns**

#### **Effective Task Requests**
```markdown
// ✅ Good: Specific and actionable
"Add hover zoom to ProductImage component with 2x magnification that follows cursor position"

// ❌ Poor: Vague and unclear  
"Make images better"

// ✅ Good: Clear acceptance criteria
- [ ] Image zooms to 2x scale on hover
- [ ] Zoom follows mouse cursor position  
- [ ] Zoom resets when mouse leaves image area
- [ ] Works on desktop and mobile devices
```

#### **Complexity Indicators**
- **Simple**: Single component change, clear requirements, 30min-2hrs
- **Medium**: Multiple related changes, some integration, 2-6hrs
- **Complex**: Cross-cutting changes, architectural decisions, 6+ hrs or multiple sessions

---

## 🔄 DEVELOPMENT WORKFLOW

### **For Simple Tasks (30min-2hrs)**
1. **Understand**: Clarify requirements and acceptance criteria
2. **Verify**: Check imports, dependencies, existing patterns using Glob/LS tools
3. **Implement**: Write code following functional programming standards
4. **Validate**: Test functionality and run code review agent

### **For Complex Tasks (Multi-session/6+ hrs)**
1. **Plan**: Break into logical phases, use TodoWrite for tracking progress
2. **Implement Incrementally**: Complete phases one at a time
3. **Verify Each Phase**: Ensure stability before moving forward
4. **Document**: Summarize progress and architectural decisions made

### **Quality Gates**
```bash
# After implementing any code changes
npm run tools:code-review -- --file [modified-file]

# Before considering task complete
npm run check          # TypeScript validation
npm run build          # Ensure build succeeds
```

### **Error Recovery Patterns**

#### **TypeScript Errors**
1. Run `npm run check` to see specific errors
2. Check `/src/development-standards/standards/component-standards.md` for patterns
3. Verify imports match file naming conventions

#### **Build Failures**
1. Check console output for specific errors
2. Run `npm run build:fast` to skip image optimization
3. Verify all imports use correct paths and extensions

#### **Context Confusion**
1. Use Glob tool to find files: `*.tsx`, `**/*.astro`
2. Use LS tool to explore directory structure
3. Reference [EMERGENCY_PROCEDURES.md](./EMERGENCY_PROCEDURES.md)

---

## 📁 PROJECT CONTEXT

### **Architecture Overview**
This is an **Astro-based e-commerce platform** for interactive displays and smartboards.

**Core Technologies**: Astro 5.x, React 19, TypeScript, SCSS, Vercel
**Key Features**: Product quiz, dynamic filtering, buying guides, automated content generation

### **File Structure (AI Navigation)**
```
src/
├── components/         # React & Astro UI components
│   ├── common/        # Reusable elements (Nav, Footer, SEO)
│   ├── home/          # Homepage sections
│   ├── products/      # Product catalog & filtering  
│   ├── quiz/          # Interactive recommendation engine
│   └── blog/          # Content components
├── data/              # Product data organized by brand
│   ├── models.*.json  # Product specifications by brand
│   └── models.all.js  # Centralized exports
├── content/           # Blog posts and use cases (Astro collections)
├── pages/             # Route definitions and API endpoints
└── styles/            # Global SCSS variables and mixins
```

### **Component Patterns**
- **Astro components** (.astro) for layout and static content
- **React components** (.tsx) for interactive features  
- **SCSS modules** for component-scoped styling
- **TypeScript** throughout with strict functional programming

### **Data Organization**
- **Product data**: JSON files in `/src/data/models.[brand].json`
- **Content collections**: Blog posts in `/src/content/blog/`
- **Dynamic routes**: Auto-generated from data structure
- **Centralized exports**: Import from `/src/data/models.all.js`

### **Development Standards Reference**
- **Component Standards**: `/src/development-standards/standards/component-standards.md`
- **Styling Patterns**: `/src/development-standards/standards/styling-patterns.md`  
- **File Naming**: `/src/development-standards/standards/file-naming.md`
- **Functional Programming**: `/src/development-standards/functional-programming.md`

---

## 🛠️ TOOL INTEGRATION

### **Code Quality**
```bash
# Essential code review (run after every change)
npm run tools:code-review -- --file [file]

# Full directory analysis
npm run tools:code-review -- --batch src/components/

# Performance tracking
npm run tools:performance
```

### **Content & SEO**
```bash
# Analyze blog post SEO
npm run tools:seo-analyze -- --file src/content/blog/[post].md

# Auto-optimize content
npm run tools:seo-optimize -- --file src/content/blog/[post].md

# Generate new blog post
npm run tools:blog-generate
```

### **Development Commands**
```bash
npm run dev              # Start development server
npm run dev:expose       # Start server accessible externally
npm run build            # Build for production
npm run check            # TypeScript checking
npm run preview          # Preview production build
```

### **Essential Tools List**
```bash
npm run tools            # Show all available automation tools
```

---

## ⚡ COMMON DEVELOPMENT PATTERNS

### **Adding New Products**
1. Add JSON data to appropriate `/src/data/models.[brand].json` file
2. Update imports in `/src/data/models.all.js`
3. Product pages auto-generate from dynamic routes

### **Creating New Components**
1. Follow standards in `/src/development-standards/standards/component-standards.md`
2. Use TypeScript (.tsx) with functional programming patterns
3. Create SCSS module for styling
4. Export via index.ts file
5. Run code review agent on completion

### **Working with Content**
1. Blog posts go in `/src/content/blog/` as markdown files
2. Use Astro content collections for structured data
3. Run SEO analysis on content before publishing
4. Follow content quality standards

### **Testing Changes**
1. Run `npm run dev` to test locally
2. Use `npm run build` to verify production build
3. Run `npm run check` for TypeScript validation
4. Use code review agent for quality assurance

---

## 📚 DETAILED DOCUMENTATION REFERENCES

### **For Comprehensive Information**
- **README.md** - Project overview, installation, architecture
- **DOCS.md** - Daily development commands and navigation
- **EMERGENCY_PROCEDURES.md** - System recovery and troubleshooting

### **For Specialized Systems**
- **CODE_REVIEW_AGENT.md** - Automated quality enforcement details
- **BLOG_AUTOMATION_README.md** - Content generation and SEO pipeline
- **SEO_QUICK_REFERENCE.md** - SEO optimization commands

### **For Development Standards**
- **Component Standards** - `/src/development-standards/standards/component-standards.md`
- **Functional Programming** - `/src/development-standards/functional-programming.md`
- **Styling Patterns** - `/src/development-standards/standards/styling-patterns.md`
- **File Naming** - `/src/development-standards/standards/file-naming.md`

---

## 🎯 AI-SPECIFIC BEST PRACTICES

### **Context Management**
- **Always verify file existence** before coding
- **Use progressive disclosure** - start with simple patterns
- **Reference standards** rather than duplicating patterns
- **Ask clarifying questions** when requirements are ambiguous

### **Implementation Approach**
- **Start with TypeScript interfaces** for clear contracts
- **Write pure functions first** then compose larger functionality
- **Use existing patterns** from similar components
- **Test incrementally** rather than implementing entire features

### **Quality Assurance**
- **Run code review agent** after every code generation
- **Verify functional programming compliance** 
- **Check TypeScript compilation** before finalizing
- **Validate against acceptance criteria**

### **Communication**
- **Show incremental progress** for complex changes
- **Reference specific files and line numbers** when discussing code
- **Document architectural decisions** for future AI assistants
- **Use TodoWrite** for task planning and progress tracking

---

**Remember**: This project emphasizes **human-AI collaboration** where AI handles implementation while humans guide strategy and verify results. Focus on **functional programming principles**, **quality automation**, and **clear communication patterns** for optimal development velocity.
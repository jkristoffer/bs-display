# CLAUDE.md

**AI Development Guide for Claude Code** - This file provides essential guidance for AI assistants working in this repository.

---

## 🚨 CRITICAL FIRST - AI Development Rules

**These rules must be followed for every task:**

1. **Always verify context first** - Use Glob/LS tools before coding to confirm files exist
2. **Follow functional programming** - Pure functions, immutability, composition ([Standards](./docs/development/standards/development-standards/functional-programming.md))
3. **Run code review agent** - After generating code: `npm run code:review -- --file [file]`
4. **Use TodoWrite tool** - For complex tasks requiring planning and tracking

---

## ⚡ UNIFIED TOOL INTERFACE

**All project tools accessible through consistent npm commands.**

### **Quick Access**
```bash
npm run help                    # See all available commands
npm run ai:do <intent> [params] # Primary entry point for AI-driven tasks
```

This project utilizes a unified `npm run` command interface. For a comprehensive, machine-readable list of all available intents and their parameters, use `npm run ai:do list-intents`.

---

## 🤖 AI-FIRST ARCHITECTURE & TOOLING

This project is built on AI-First principles, providing structured, machine-readable interfaces for enhanced AI collaboration and autonomy. Key components include `ai-config.json` (centralized AI configuration), `ai-intents.json` (high-level intent mapping), `component-manifest.json` (programmatic UI inventory), and `.ai-events.log` (structured action logging). All AI-First documentation adheres to `ai-doc-schema.json` for consistent machine-readability.

For detailed, machine-readable specifications of these components and their associated scripts (`scripts/ai-do.js`, `scripts/validate-project.js`, `scripts/generate-component-manifest.js`, `scripts/ai-log.js`), refer to the JSON documentation files located in [./docs/internal/ai-docs/](./docs/internal/ai-docs/).

---

## 🧠 RAG PROJECT MEMORY

**Transform from stateless AI to project-aware assistant with comprehensive codebase memory.**

⚠️ **The RAG system has been moved to a separate repository for better modularity.** Refer to the [bs-rag-tools repository](https://github.com/kristoffersanio/bs-rag-tools) for setup and usage.

---

## 📄 PDF ANALYSIS (MCP SERVER)

**Analyze PDF files using Gemini CLI through Claude Code integration.**

⚠️ **The MCP PDF analyzer has been moved to a separate repository for better modularity.** Refer to the [bs-mcp-servers repository](https://github.com/kristoffersanio/bs-mcp-servers) for setup and usage.

---

## 🆘 EMERGENCY QUICK ACCESS

For immediate troubleshooting and system health checks, utilize the AI-First validation and intent discovery tools.

*   **General Project Validation**: `npm run ai:do validate-project` (provides structured JSON output for analysis).
*   **Discover Troubleshooting Commands**: `npm run ai:do list-intents` (to find specific intents for various issues).

For detailed emergency procedures, refer to the [Troubleshooting Guide](./docs/quick-start/troubleshooting.md).

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
# After implementing any code changes (enhanced security & performance analysis)
npm run code:review -- --file [modified-file]

# Security-focused review for sensitive components
npm run code:review -- --file [auth-component] --ai-mode --format json

# Before considering task complete
npm run code:typecheck  # TypeScript validation
npm run dev:build       # Ensure build succeeds

# Batch quality check for entire feature
npm run code:review -- --batch src/components/[feature]/ --threshold-failing 75
```

### **Error Recovery Patterns**

#### **TypeScript Errors**
1. Run `npm run code:typecheck` to see specific errors
2. Check [Component Standards](./docs/development/standards/standards/component-standards.md) for patterns
3. Verify imports match file naming conventions

#### **Build Failures**
1. Check console output for specific errors
2. Run `npm run dev:build:fast` to skip image optimization
3. Verify all imports use correct paths and extensions

#### **Context Confusion**
1. Use Glob tool to find files: `*.tsx`, `**/*.astro`
2. Use LS tool to explore directory structure
3. Reference [Troubleshooting Guide](./docs/quick-start/troubleshooting.md)

---

## 📁 PROJECT CONTEXT

### **Architecture Overview**
This is an **Astro-based e-commerce platform** for interactive displays and smartboards.

**Core Technologies**: Astro 5.x, React 19, TypeScript, SCSS, Vercel
**Key Features**: Product quiz, dynamic filtering, buying guides, automated content generation
**✅ REDESIGN STATUS**: Phase 1 Complete - Enhanced design system with modern components ready for Phase 2 implementation

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
- **✅ COMPLETE**: **Enhanced gradient system** with 25+ utility classes for instant styling
- **✅ NEW**: **Complete component library** with Card, Form, Loading components

### **Data Organization**
- **Product data**: JSON files in `/src/data/models.[brand].json`
- **Content collections**: Blog posts in `/src/content/blog/`
- **Dynamic routes**: Auto-generated from data structure
- **Centralized exports**: Import from `/src/data/models.all.js`

### **Development Standards Reference**
- **Component Standards**: [Component Standards](./docs/development/standards/standards/component-standards.md)
- **Styling Patterns**: [Styling Patterns](./docs/development/standards/standards/styling-patterns.md)  
- **File Naming**: [File Naming](./docs/development/standards/standards/file-naming.md)
- **Functional Programming**: [Functional Programming](./docs/development/standards/functional-programming.md)
- **✅ COMPLETE**: [Gradient System Quick Reference](./docs/development/standards/standards/GRADIENT_SYSTEM_QUICK_REFERENCE.md)
- **✅ NEW**: [Enhanced Design System](/design-system) - Live component showcase and documentation

---

## 🛠️ TOOL INTEGRATION

This project features a robust suite of automated tools for code quality, security, content management, and development workflows. These tools are integrated into the AI-First architecture to streamline development and ensure high standards.

For detailed, machine-readable specifications of these tools and their usage, refer to the AI-First documentation files located in [./docs/internal/ai-docs/](./docs/internal/ai-docs/). Specific tool configurations and advanced usage patterns are also documented within the relevant AI-First JSON files (e.g., `ai-config.json`, `ai-intents.json`).

---

## ⚡ COMMON DEVELOPMENT PATTERNS

This section outlines common development patterns and best practices within the project. For detailed, machine-readable guidance on specific patterns (e.g., component creation, data handling, design system usage), refer to the relevant AI-First documentation files in [./docs/internal/ai-docs/](./docs/internal/ai-docs/) and the human-readable documentation linked in the 'DETAILED DOCUMENTATION REFERENCES' section.

Key areas include:
*   **Adding New Products**: Structured data integration.
*   **Creating New Components**: Adherence to component standards and leveraging existing design system elements.
*   **Using the Enhanced Design System**: Application of styling utilities, modern components, and animations.
*   **Working with Content**: Content collection, SEO analysis, and quality standards.
*   **Testing Changes**: Local verification, build validation, and quality assurance processes.

---

## 📚 DETAILED DOCUMENTATION REFERENCES

For comprehensive, machine-readable documentation on various aspects of the project, including AI-specific workflows, component details, and tool configurations, refer to the structured JSON files located in [./docs/internal/ai-docs/](./docs/internal/ai-docs/).

For human-readable documentation, refer to the project's main [README.md](./README.md) and the [Documentation Hub](./docs/README.md).

---

## 🎯 AI-SPECIFIC BEST PRACTICES

This section outlines the core principles and practices for AI agents working on this project. For detailed, machine-readable guidance on context management, implementation approaches, quality assurance, and communication patterns, refer to the AI-First documentation files located in [./docs/internal/ai-docs/](./docs/internal/ai-docs/).

---

**Remember**: This project emphasizes **human-AI collaboration** where AI handles implementation while humans guide strategy and verify results. Focus on **functional programming principles**, **quality automation**, and **clear communication patterns** for optimal development velocity.
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

### **Adding New Products**
1. Add JSON data to appropriate `/src/data/models.[brand].json` file
2. Update imports in `/src/data/models.all.js`
3. Product pages auto-generate from dynamic routes

### **Creating New Components**
1. Follow standards in [Component Standards](./docs/development/standards/standards/component-standards.md)
2. Use TypeScript (.tsx) with functional programming patterns
3. **✅ LEVERAGE PHASE 1**: Use existing Card, Form, Loading components from `/src/components/common/`
4. Create SCSS module for styling OR use enhanced gradient utility classes
5. Export via index.ts file
6. Run code review agent on completion

### **Using the Enhanced Design System (Phase 1 Complete)**
1. **Gradient Backgrounds**: Use `gradient-bg-primary`, `gradient-bg-success`, `gradient-bg-premium`, `gradient-bg-attention`
2. **Glass Effects**: Apply `glass-light`, `glass-dark`, `glass-strong` for modern interfaces
3. **Enhanced Buttons**: 7 variants including `button-gradient`, `button-glass`, `button-fab`
4. **Typography**: Use `heading-hero`, `heading-section`, `subtitle-large`, `text-fluid-sm`
5. **Animations**: Hardware-accelerated `animate-float`, `animate-pulse`, `animate-fade-up`, `animate-rotate`
6. **Modern Components**: Import from `/src/components/common/` - Card, Form, Loading components
7. **View System**: Visit `/design-system` to see all components and utilities

```typescript
// Phase 1 Components Available
import { Card, CardContent, CardTitle } from '@/components/common/Card';
import { FormInput, FormSelect, FormCheckbox } from '@/components/common/Form';
import { Spinner, LoadingOverlay, ProgressBar } from '@/components/common/Loading';

// Enhanced styling with new utilities
<Card variant="glass" hoverable>
  <CardContent>
    <h2 className="heading-section gradient-text-primary">Modern Design</h2>
    <p className="text-fluid-sm">Enhanced with Phase 1 components</p>
    <button className="button-gradient animate-float">Action</button>
  </CardContent>
</Card>
```

### **Working with Content**
1. Blog posts go in `/src/content/blog/` as markdown files
2. Use Astro content collections for structured data
3. Run SEO analysis on content before publishing
4. Follow content quality standards

### **Testing Changes**
1. Run `npm run dev:server` to test locally
2. Use `npm run dev:build` to verify production build
3. Run `npm run code:typecheck` for TypeScript validation
4. Use `npm run code:review -- --file [file]` for quality assurance

---

## 📚 DETAILED DOCUMENTATION REFERENCES

### **For Comprehensive Information**
- **[README.md](./README.md)** - Project overview, installation, architecture
- **[DOCS.md](./DOCS.md)** - Daily development commands and navigation  
- **[Emergency Procedures](./docs/quick-start/troubleshooting.md)** - System recovery and troubleshooting

### **For Development & Operations**
- **[Development Standards](./src/development-standards/README.md)** - Code standards and patterns
- **[AI Workflows](./docs/development/ai-workflows.md)** - AI-specific development patterns
- **[Daily Commands](./docs/development/commands.md)** - Common development commands

### **For Research & Technical Documentation**
- **[Documentation Hub](./docs/README.md)** - Centralized documentation index
- **[MCP Building Guidelines](./docs/MCP_BUILDING_GUIDELINES.md)** - MCP server development standards
- **[Technical Architecture Decisions](./docs/TECHNICAL_ARCHITECTURE_DECISIONS_RESEARCH.md)** - System design decisions

### **For Development Standards**
- **Component Standards** - `/docs/development/standards/standards/component-standards.md`
- **Functional Programming** - `/docs/development/standards/functional-programming.md`
- **Styling Patterns** - `/docs/development/standards/standards/styling-patterns.md`
- **File Naming** - `/docs/development/standards/standards/file-naming.md`
- **✅ COMPLETE**: **Enhanced Gradient System** - `/docs/development/standards/standards/GRADIENT_SYSTEM_QUICK_REFERENCE.md`

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
- **✅ LEVERAGE PHASE 1**: Use existing Card, Form, Loading components from `/src/components/common/`
- **Use enhanced design system**: Apply gradient utilities, modern animations, and glass effects
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
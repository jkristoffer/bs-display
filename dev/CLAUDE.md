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
npm run git:commit             # Intelligent git commits
npm run code:review -- --file [path]  # Automated code review
npm run content:blog:generate  # AI blog post generation
npm run data:validate         # JSON schema validation
npm run ai:performance        # AI agent performance tracking
```

### **No Slash Commands**
Previous `/commit` slash commands have been deprecated. Use `npm run git:commit` instead.

### **AI-Enhanced Features**
```bash
# Dry-run any destructive operation
npm run git:commit:ai -- --dry-run
npm run ai:validate:dry

# JSON output for parsing
npm run git:status:json
npm run code:review -- --file test.js --json

# Contextual help
npm run help git       # Show git commands
npm run help code      # Show code commands
npm run help content   # Show content commands
```

---

## 🧠 RAG PROJECT MEMORY

**Transform from stateless AI to project-aware assistant with comprehensive codebase memory.**

⚠️ **The RAG system has been moved to a separate repository for better modularity.**

### **New Location & Setup**
```bash
# Clone the separate RAG tools repository
git clone /Users/kristoffersanio/git/bs-rag-tools
cd bs-rag-tools

# Setup for this project
pip install -r requirements.txt
export GEMINI_API_KEY="your_api_key_here"

# Project-aware queries with full context
./gemini_rag_wrapper.sh "How does the ProductCard component work?"
./gemini_rag_wrapper.sh "Images are 404ing on product pages"
```

### **Learn More**
- **[RAG System Guide](./docs/RAG_PROJECT_MEMORY_GUIDE.md)** - Complete documentation
- **[RAG Quick Reference](./docs/RAG_QUICK_REFERENCE.md)** - Daily usage examples
- **[RAG System Overview](./docs/RAG_SYSTEM_OVERVIEW.md)** - Technical architecture and setup

---

## 📄 PDF ANALYSIS (MCP SERVER)

**Analyze PDF files using Gemini CLI through Claude Code integration.**

⚠️ **The MCP PDF analyzer has been moved to a separate repository for better modularity.**

### **New Location & Setup**
```bash
# Clone the separate MCP servers repository
git clone /Users/kristoffersanio/git/bs-mcp-servers
cd bs-mcp-servers/pdf-analyzer

# Setup and build
npm install && npm run build

# Claude Code integration
claude mcp add pdf-analyzer -s project -- node /Users/kristoffersanio/git/bs-mcp-servers/pdf-analyzer/dist/index.js
claude mcp list     # List configured servers
claude mcp remove pdf-analyzer  # Remove server
```

### **Usage in Claude Code**
Once configured, the PDF analyzer is available as:
- **Tool name**: `mcp__pdf-analyzer__analyze_pdf`
- **Analysis types**: extract, summarize, pricing, specifications
- **Example**: Analyze `quotation_for_85inch_smart_board.pdf` for pricing information

### **Configuration**
- **Server config**: `.mcp.json` (project-scoped, team-shared)
- **Source code**: `scripts/mcp-servers/pdf-analyzer/`
- **Dependencies**: Gemini CLI (must be in PATH)

---

## 🆘 EMERGENCY QUICK ACCESS

### **Automation Failures**
```bash
# Code review agent issues (enhanced with security & performance)
npm run code:review -- --file test.js
npm run code:review:config                    # Regenerate configuration
npm run code:review -- --file test.js --format json  # Machine-readable output

# Security audit failures
npm run code:review -- --batch src/ --format json | grep "security"

# SEO system failures  
npm run content:seo:analyze -- --file src/content/blog/[post].md

# Blog generation problems
npm run content:blog:generate

# Check all automation tools
npm run help
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

### **Full Emergency Procedures**: [Troubleshooting Guide](./docs/quick-start/troubleshooting.md)

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
2. Check [Component Standards](./docs/development/standards/development-standards/standards/component-standards.md) for patterns
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
- **Component Standards**: [Component Standards](./docs/development/standards/development-standards/standards/component-standards.md)
- **Styling Patterns**: [Styling Patterns](./docs/development/standards/development-standards/standards/styling-patterns.md)  
- **File Naming**: [File Naming](./docs/development/standards/development-standards/standards/file-naming.md)
- **Functional Programming**: [Functional Programming](./docs/development/standards/development-standards/functional-programming.md)

---

## 🛠️ TOOL INTEGRATION

### **Code Quality & Security**
```bash
# Essential code review (run after every change)
npm run code:review -- --file [file]

# Full directory analysis with security & performance checks
npm run code:review -- --batch src/components/

# Configuration management
npm run code:review:config                    # Generate default .codereview.json
npm run code:review:config:interactive        # Interactive configuration setup

# Output formats for different use cases
npm run code:review -- --file [file] --format detailed   # Full human-readable report
npm run code:review -- --file [file] --format json       # Machine-readable JSON
npm run code:review -- --file [file] --format minimal    # Concise score summary

# AI-optimized workflows with metadata tracking
npm run code:review -- --file [file] --ai-mode --agent-id "claude-dev" --task-id "security-audit"

# Custom thresholds for different quality gates
npm run code:review -- --file [file] --threshold-failing 70 --threshold-excellent 95
```

#### **Enhanced Analysis Categories (Weighted Scoring)**
- **🔒 Security (20%)**: XSS vulnerabilities, secrets exposure, input validation, authentication issues
- **⚡ Functional Programming (25%)**: Pure functions, immutability, composition, side effects
- **🚀 Performance (10%)**: React optimization, memory leaks, expensive operations, bundle size
- **📏 Project Standards (15%)**: File naming, imports, exports, styling patterns
- **🔷 TypeScript (15%)**: Type annotations, interfaces, generics, avoiding `any`
- **⚛️ React Patterns (15%)**: Hooks rules, component patterns, memoization, props management

#### **Configuration System (.codereview.json)**
```json
{
  "rules": {
    "security": {
      "enabled": true,
      "weight": 0.20,
      "custom": {
        "checkXss": true,
        "checkSecrets": true,
        "strictMode": true
      }
    }
  },
  "ignore": ["**/*.test.tsx", "**/dist/**"],
  "thresholds": {
    "excellent": 90,
    "failing": 60
  }
}
```

#### **Security Analysis Features**
- **XSS Prevention**: Detects `dangerouslySetInnerHTML`, `eval()`, direct HTML injection
- **Secrets Detection**: Finds hardcoded API keys, passwords, tokens in code
- **Input Validation**: Identifies unvalidated form inputs, SQL injection patterns
- **Authentication Security**: Checks for weak session management, auth bypasses
- **Safe DOM Practices**: Flags unsafe `document.write`, `innerHTML` usage

#### **Performance Optimization Checks**
- **React Performance**: Missing `React.memo`, `useCallback`, `useMemo` opportunities
- **Memory Leak Detection**: Missing cleanup in `useEffect`, global variable issues
- **Algorithm Efficiency**: Nested loops, inefficient array operations
- **Bundle Size**: Large library imports, unused dependencies

#### **AI Workflow Integration**
```bash
# Generate code with AI agent tracking
npm run code:review -- --file new-component.tsx --ai-mode --agent-id "claude-sonnet" --task-id "create-auth-component"

# Exit codes for CI/CD integration
# 0: Success (score above threshold)
# 1: Failure (score below threshold)
```

### **Content & SEO**
```bash
# Analyze blog post SEO
npm run content:seo:analyze -- --file src/content/blog/[post].md

# Auto-optimize content
npm run content:seo:optimize -- --file src/content/blog/[post].md

# Generate new blog post
npm run content:blog:generate
```

### **Development Commands**
```bash
npm run dev               # Start development server
npm run dev:expose        # Start server accessible externally
npm run build             # Build for production
npm run build:fast        # Build without image optimization
npm run check             # TypeScript checking
npm run preview           # Preview production build
```

### **Essential Tools List**
```bash
npm run help             # Show all available commands
npm run help [category]  # Show commands by category (git, code, content, data)
npm run ai:tools:list    # Show detailed automation tools
```

---

## ⚡ COMMON DEVELOPMENT PATTERNS

### **Adding New Products**
1. Add JSON data to appropriate `/src/data/models.[brand].json` file
2. Update imports in `/src/data/models.all.js`
3. Product pages auto-generate from dynamic routes

### **Creating New Components**
1. Follow standards in [Component Standards](./docs/development/standards/development-standards/standards/component-standards.md)
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
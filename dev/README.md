# Big Shine Display E-commerce Platform

> **AI-first e-commerce platform** for interactive displays and smartboards built with Astro, React, and TypeScript.

[![Built with Astro](https://astro.badg.es/v2/built-with-astro/tiny.svg)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)

## Overview

Big Shine Display is a sophisticated e-commerce platform specializing in interactive displays, smartboards, and educational technology. The platform features a **product recommendation quiz**, **dynamic filtering system**, and **comprehensive buying guides** to help customers find the perfect display solutions.

### 🚀 **AI-First Development**

This project is designed for **human-AI collaboration** with comprehensive automation systems for content generation, code quality enforcement, and SEO optimization. Single developer maintained with AI assistants handling implementation while human provides strategic direction.

## Quick Start

### Prerequisites
- **Node.js 18+** 
- **npm** (comes with Node.js)
- **Git**

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd bs-display/dev

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:4321` to see the platform running locally.

### Essential Commands

```bash
npm run dev          # Start Astro development server
npm run build        # Build for production  
npm run preview      # Preview production build locally
npm run check        # Run TypeScript type checking
npm run help         # See all available commands
npm run ai:do <intent> [params] # Primary entry point for AI-driven tasks
```

## Technology Stack

### **Core Framework**
- **[Astro 5.x](https://astro.build)** - Static site generator with islands architecture
- **[React 19](https://reactjs.org)** - Component library for interactive elements
- **[TypeScript](https://www.typescriptlang.org)** - Type safety throughout the application

### **Styling & UI**
- **SCSS** - Advanced styling with variables, mixins, and modules
- **CSS Modules** - Component-scoped styling
- **Responsive Design** - Mobile-first approach with consistent breakpoints

### **Data & Content**
- **JSON-based product data** - Organized by brand and category
- **Astro Content Collections** - Blog posts and use cases
- **Dynamic routing** - Auto-generated product pages

### **Deployment & Analytics**
- **[Vercel](https://vercel.com)** - Deployment platform with edge functions
- **Vercel Analytics** - Performance monitoring and insights

## Key Features

### 🧠 **Interactive Product Quiz**
Intelligent recommendation engine that matches customers with optimal display solutions based on their specific needs and use cases.

### 🔍 **Advanced Product Filtering** 
Real-time filtering system allowing customers to narrow down products by specifications, brands, and categories.

### 📊 **Product Comparison Tables**
Side-by-side comparisons of technical specifications and features.

### 📝 **Comprehensive Buying Guides**
Expert-written guides covering display technologies, installation processes, and use case scenarios.

### 🤖 **Automated Content Generation**
AI-powered blog post generation with SEO optimization and quality assurance.

### 🔧 **Unified Tool Interface**
Streamlined command system with 56% fewer commands (98→44) through systematic consolidation and deduplication.

## Architecture Overview

### **Component Structure**
```
src/components/
├── common/          # Reusable UI components (Nav, Footer, SEO)
├── home/            # Homepage-specific components  
├── products/        # Product catalog and filtering
├── quiz/            # Interactive recommendation quiz
└── blog/            # Blog and content components
```

### **Data Organization**
```
src/data/
├── models.*.json    # Product data organized by brand
├── schema.*.json    # Data validation schemas
└── models.all.js    # Centralized data exports
```

### **Routing System**
- **Dynamic product pages**: `/products/[category]/[brand]/[id]`
- **Content-driven pages**: Auto-generated from markdown files
- **API endpoints**: Contact forms and data fetching
- **Living documentation**: Auto-updated route documentation

## For AI Assistants 🤖

> **New AI assistants should start here for comprehensive guidance**

### **Primary Documentation**
- **[CLAUDE.md](./CLAUDE.md)** - Complete AI development guide (mandatory reading)
- **[EMERGENCY_PROCEDURES.md](./EMERGENCY_PROCEDURES.md)** - System recovery procedures

### **Quick AI Development Rules**
See [CLAUDE.md](./CLAUDE.md) for complete AI development guidance including:
- Context verification patterns
- Functional programming requirements  
- Quality assurance procedures
- Development workflow standards

### **Essential Commands**
```bash
npm run help                    # See all available commands
npm run ai:do <intent> [params] # Primary entry point for AI-driven tasks

# Enhanced code quality with security & performance analysis
npm run code:review -- --file [file]
npm run code:review -- --batch [directory]
npm run code:review:config                    # Setup configuration

# Content SEO optimization
npm run content:seo:analyze -- --file [blog-post]

# Development workflow
npm run dev                                   # Start development
npm run check                                 # TypeScript validation
npm run build                                 # Production build
```

### **AI-First Architecture & Tooling**

This project is built on advanced AI-First principles, providing structured, machine-readable interfaces for enhanced AI collaboration and autonomy. Key components include `ai-config.json` (centralized AI configuration), `ai-intents.json` (high-level intent mapping), `component-manifest.json` (programmatic UI inventory), and `.ai-events.log` (structured action logging). All AI-First documentation adheres to `ai-doc-schema.json` for consistent machine-readability.

For detailed, machine-readable specifications of these components and their associated scripts, refer to the JSON documentation files located in [./docs/internal/ai-docs/](./docs/internal/ai-docs/). For a comprehensive AI development guide, see [CLAUDE.md](./CLAUDE.md).

## Development Workflow

### **For Simple Tasks (30min-2hrs)**
1. **Understand** requirements and acceptance criteria
2. **Verify** context using Glob/LS tools 
3. **Implement** following functional programming standards
4. **Validate** with type checking and code review agent

### **For Complex Tasks (Multi-session)**
1. **Plan** using TodoWrite tool for progress tracking
2. **Implement incrementally** with phase-by-phase completion
3. **Verify each phase** before proceeding
4. **Document** architectural decisions and progress

### **Quality Assurance**
- **TypeScript** type checking for all components
- **Code Review Agent** automated standards enforcement
- **Functional programming** compliance verification
- **Manual testing** against acceptance criteria

## Project Structure

```
bs-display/dev/
├── 📁 src/
│   ├── components/     # React & Astro components
│   ├── content/        # Blog posts and use cases  
│   ├── data/           # Product data and schemas
│   ├── layouts/        # Page layout templates
│   ├── pages/          # Route definitions
│   └── styles/         # Global SCSS and variables
├── 📁 scripts/         # Automation and utility scripts
├── 📁 scripts/         # Automation and utility scripts
├── 📁 public/          # Static assets and images
├── 📄 CLAUDE.md        # AI assistant comprehensive guide
├── 📄 astro.config.mjs # Astro configuration
└── 📄 package.json     # Dependencies and scripts
```

### **Key Files & Directories**

| Path | Purpose |
|------|---------|
| `CLAUDE.md` | **Primary documentation** for AI assistants |
| `src/components/` | All React and Astro UI components |
| `src/data/models.*.json` | Product data organized by brand |
| `scripts/` | Automation scripts for code review, SEO, and content |
| `src/development-standards/` | Development patterns and standards |
| `content-queue.json` | Automated blog generation queue |

## Automation Systems

### **🔍 Enhanced Code Review Agent**
**Enterprise-grade automated code quality analysis with security & performance auditing**

#### **Features**
- **🔒 Security Analysis (20%)**: XSS detection, secrets scanning, input validation
- **⚡ Performance Optimization (10%)**: React performance, memory leaks, bundle analysis
- **📋 Functional Programming (25%)**: Pure functions, immutability, composition
- **🔷 TypeScript Quality (15%)**: Type safety, interfaces, avoiding `any`
- **⚛️ React Patterns (15%)**: Hooks compliance, component optimization
- **📏 Project Standards (15%)**: File naming, imports, styling consistency

#### **Usage**
```bash
# Single file analysis with full report
npm run code:review -- --file src/components/Auth.tsx

# Batch analysis for security audit
npm run code:review -- --batch src/components/auth/ --format json

# Configuration management
npm run code:review:config                    # Generate .codereview.json
npm run code:review:config:interactive        # Interactive setup

# AI workflow integration
npm run code:review -- --file new-component.tsx --ai-mode --agent-id "claude-sonnet"
```

#### **Configuration System**
Flexible configuration via `.codereview.json`:
- **Rule weights** and thresholds customization
- **Ignore patterns** for files/directories
- **Custom security** and performance rules
- **Output formats** (detailed, JSON, minimal)
- **Automated standards enforcement** with scoring system (A-F grades)
- **Functional programming compliance** verification
- **GitHub Actions integration** for PR analysis
- **AI agent performance tracking**

### **📈 SEO Optimization Engine**
- **9-category SEO analysis** with detailed scoring
- **Intelligent auto-optimization** with safety checks
- **Automated PR commenting** with improvement suggestions
- **Content quality assurance** before publication

### **📝 Blog Generation System**
- **Template-based content creation** for 4 content types
- **Scheduled generation** every 3 days via GitHub Actions
- **Content queue management** with priorities and keywords
- **Automatic PR creation** with SEO analysis

## Contributing

### **For External Contributors**

1. **Read the documentation**: Start with this README, then review [CLAUDE.md](./CLAUDE.md)
2. **Follow development standards**: See `/src/development-standards/standards/`
3. **Use functional programming**: Pure functions, immutability, composition patterns
4. **Run code review agent**: Ensure code meets quality standards before submitting

### **Development Environment Setup**

```bash
# Install dependencies
npm install

# Start development server  
npm run dev

# Run type checking
npm run check

# Test code quality with enhanced security & performance analysis
npm run code:review -- --file [your-file]
```

### **Pull Request Process**

1. **Fork and clone** the repository
2. **Create feature branch** with descriptive name
3. **Follow functional programming** standards
4. **Run code review agent** on modified files
5. **Submit PR** with clear description and acceptance criteria

**Automated PR checks include:**
- **Enhanced code review** analysis with security & performance scoring
- **SEO analysis** for content changes  
- **TypeScript** type checking and build verification
- **Security audit** for potential vulnerabilities
- **Performance optimization** recommendations

### **AI-First Development Notes**

This project uses **human-AI collaboration** extensively. Contributors should:
- **Understand AI development patterns** in [CLAUDE.md](./CLAUDE.md)
- **Use AI-First tools** for quality assurance and streamlined workflows (e.g., `npm run ai:do` for high-level tasks, `npm run validate:project:json` for structured validation, `npm run components:manifest` for UI component insights).
- **Follow established standards** rather than creating new patterns
- **Document architectural decisions** for future AI assistants

## Deployment

### **Production Deployment**
The platform is deployed on **Vercel** with automatic deployments from the main branch.

```bash
# Build for production
npm run build

# Preview production build  
npm run preview
```

### **Environment Variables**
Configuration is handled through Astro's built-in environment support. Contact the maintainer for production environment details.

## Performance & Monitoring

- **Vercel Analytics** - User behavior and performance insights
- **Speed Insights** - Core Web Vitals monitoring  
- **Automated SEO scoring** - Content quality tracking
- **Code review metrics** - Development quality monitoring

## Documentation Hierarchy

This project utilizes a structured documentation hierarchy to provide comprehensive guidance for both human and AI collaborators. Key documentation entry points include:

*   **[README.md](./README.md)** (this file): Project overview, quick start, and high-level architecture.
*   **[CLAUDE.md](./CLAUDE.md)**: The primary AI development guide, outlining critical rules, AI-First architecture, and core development patterns.
*   **[Documentation Hub](./docs/README.md)**: A centralized index for all human-readable documentation.
*   **[AI-First Documentation](./docs/internal/ai-docs/)**: A dedicated directory containing machine-readable JSON documentation files for AI agents, adhering to `ai-doc-schema.json`.

## License & Contact

### **License**
This project is proprietary software. All rights reserved.

### **Contact Information**
- **Maintainer**: Single developer with AI assistant collaboration
- **Issues**: Report technical issues through project channels
- **Emergency**: See [EMERGENCY_PROCEDURES.md](./EMERGENCY_PROCEDURES.md) for system recovery

### **Security**
- **Pricing Policy**: All pricing information is confidential
- **Data Handling**: Follow established security practices
- **Dependencies**: Regular security audits via npm audit

---

## Getting Started Checklist

For new contributors or AI assistants:

- [ ] **Clone repository** and run `npm install`
- [ ] **Start development server** with `npm run dev`
- [ ] **Read CLAUDE.md** for comprehensive development guidance
- [ ] **Review development standards** in `/src/development-standards/standards/`
- [ ] **Test code review agent** with a sample file
- [ ] **Understand functional programming requirements**
- [ ] **Explore project structure** and key components

**Ready to contribute?** Start with small changes and use the automation tools to ensure quality standards are met.

---

*This project demonstrates the power of human-AI collaboration in modern web development, combining cutting-edge technology with intelligent automation for rapid, high-quality development.*
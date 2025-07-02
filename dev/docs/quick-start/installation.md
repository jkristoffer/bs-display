# Installation Guide

## Prerequisites
- **Node.js 18+** 
- **npm** (comes with Node.js)
- **Git**

## Installation

```bash
# Clone the repository
git clone [repository-url]
cd bs-display/dev

# Install dependencies
npm install

# Start development server
npm run dev:server
```

Visit `http://localhost:4321` to see the platform running locally.

## Essential Commands

```bash
npm run dev:server   # Start Astro development server
npm run dev:build    # Build for production  
npm run dev:preview  # Preview production build locally
npm run code:typecheck # Run TypeScript type checking
npm run help         # See all available commands
```

## Development Environment Setup

```bash
# Install dependencies
npm install

# Start development server  
npm run dev:server

# Run type checking
npm run code:typecheck

# Test code quality (for any modified files)
node scripts/code-review-agent.js --file [your-file]
```

## Getting Started Checklist

For new contributors or AI assistants:

- [ ] **Clone repository** and run `npm install`
- [ ] **Start development server** with `npm run dev:server`
- [ ] **Read CLAUDE.md** for comprehensive development guidance
- [ ] **Review development standards** in `/src/development-standards/standards/`
- [ ] **Test code review agent** with a sample file
- [ ] **Understand functional programming requirements**
- [ ] **Explore project structure** and key components

**Ready to contribute?** Start with small changes and use the automation tools to ensure quality standards are met.

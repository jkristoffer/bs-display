# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build & Development

- `npm run dev` - Start Astro development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run check` - Run Astro type checking

## Architecture Overview

This is an **Astro-based e-commerce website** for interactive displays and smartboards, built with React components and SCSS styling.

### Core Technologies

- **Astro 5.x** - Static site generator with islands architecture
- **React 19** - Component library for interactive elements
- **TypeScript** - Type safety throughout
- **SCSS** - Styling with global variables and mixins
- **Vercel** - Deployment platform with analytics

### Key Architecture Patterns

#### Data Management

- **JSON-based product data** in `src/data/` - Models organized by brand (infinitypro, metz, smart6000sv3, etc.)
- **Content collections** for blog posts and use cases using Astro's content API
- **Centralized exports** via `models.all.js` for easy data access

#### Component Structure

- **Astro components** (.astro) for layout and static content
- **React components** (.tsx/.jsx) for interactive features
- **Modular CSS** with component-specific SCSS modules
- **Global styles** in `src/styles/` with variables, mixins, and breakpoints

#### Key Interactive Features

1. **Quiz System** (`src/components/quiz/`) - Product recommendation engine with:

   - State management via custom hooks (`quizState.ts`)
   - Product matching algorithm (`utils/productMatcher.ts`)
   - Multi-step wizard with results visualization

2. **Product Filtering** (`src/components/products/FilterUI/`) - Dynamic product catalog with:

   - Real-time filtering by specifications
   - Brand and category navigation
   - Responsive card layouts

3. **Data Table Component** (`src/components/home/DataTable/`) - Product comparison tables

#### Routing Structure

- **Dynamic routes** for products: `/products/[category]/[brand]/[id]`
- **Content-driven pages** for blog and use cases
- **API endpoints** in `src/pages/api/` for contact forms and data fetching

#### Styling System

- **Global SCSS architecture** with auto-imported variables and mixins
- **Component-scoped modules** for isolated styling
- **Responsive design** with consistent breakpoint system
- **CSS custom properties** for theming and dynamic styling

### Development Patterns

#### Adding New Products

1. Add JSON data to appropriate `src/data/models.[brand].json` file
2. Update the imports in `src/data/models.all.js`
3. Product pages auto-generate from dynamic routes

#### Creating New Components

- **Follow development standards**: See `/src/project-management/standards/` for detailed guidelines
- **Component structure**: Use TypeScript (.tsx), SCSS modules, and proper exports
- **File organization**: PascalCase directories with index.ts exports
- **Styling**: SCSS modules for component styles, global classes for utilities

#### Development Standards

**IMPORTANT**: All new development should follow the standards in `/src/project-management/standards/`:
- **Component Standards**: TypeScript patterns, file structure, and organization
- **Styling Patterns**: SCSS modules vs global styles (resolves previous CSS modules confusion)
- **Work Item Format**: Structured project management with AI-friendly formatting
- **File Naming**: Consistent naming conventions across the project

#### AI-Agent Infrastructure (Future-Ready)

**Context**: This project is designed for eventual AI-agent automation where multiple specialized agents handle most coding tasks, with humans focusing on verification, task creation, and architectural decisions.

**Current Implementation**: Hybrid approach with human-AI collaboration using structured standards that are AI-agent compatible.

**AI-Agent Extensions** (in `/src/project-management/standards/`):
- **ai-agent-work-items.md**: Machine-parseable work item format with JSON metadata for agent coordination
- **agent-coordination.md**: Multi-agent coordination protocols, handoff procedures, and conflict resolution
- **automated-verification.md**: System for converting acceptance criteria into automated test suites

**Agent Types Defined**:
- **Frontend-UI Agent**: React/Astro components, SCSS styling, client-side functionality
- **Backend-API Agent**: Server-side logic, APIs, data processing
- **Data-Pipeline Agent**: Data transformation, schema validation, content management
- **Testing Agent**: Test creation from acceptance criteria, quality assurance
- **Integration Agent**: Multi-agent coordination, deployment, system-wide consistency

**Implementation Strategy**:
1. **Current Phase**: Use development standards for human-AI collaboration
2. **Near Future**: Add JSON metadata to work items for complex features
3. **Long Term**: Deploy specialized agents using coordination protocols

**Key Benefits**:
- Standards reduce AI confusion and improve consistency today
- Work items can be automatically assigned to specialized agents
- Acceptance criteria automatically generate test suites
- Human oversight focuses on business decisions rather than implementation details

**Usage for AI Assistants**: 
- Follow current development standards immediately
- Reference agent coordination protocols for complex multi-file changes
- Use automated verification patterns when implementing features with acceptance criteria
- Understand this codebase is designed for eventual full AI-agent automation

#### SEO & Performance

- Comprehensive sitemap generation with custom priorities in `astro.config.mjs`
- Vercel analytics and speed insights integration
- Responsive image optimization with Astro's image service
- Meta tag management through reusable SEO component

### Testing & Quality

- Prettier formatting with Astro plugin
- No formal test framework currently configured (tests show "Error: no test specified")
- **Code quality**: Follow TypeScript patterns and SCSS module standards

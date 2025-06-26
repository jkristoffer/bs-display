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

**IMPORTANT**: All new development should follow the standards in `/src/development-standards/standards/`:
- **Component Standards**: TypeScript patterns, file structure, and organization
- **Styling Patterns**: SCSS modules for components, global utilities for shared styles
- **File Naming**: Consistent naming conventions across the project

**Documentation Precedence**: 
- **PRIMARY**: `/src/development-standards/standards/` (current, authoritative)

#### SEO & Performance

- Comprehensive sitemap generation with custom priorities in `astro.config.mjs`
- Vercel analytics and speed insights integration
- Responsive image optimization with Astro's image service
- Meta tag management through reusable SEO component

### Quality Assurance

**Current Quality Practices**:
- **TypeScript**: Type safety throughout the codebase
- **Manual Testing**: Verify functionality against acceptance criteria
- **Code Standards**: Follow established patterns in `/src/project-management/standards/`
- **Performance**: Optimize for fast loading and good user experience

## Development Planning

**Feature Estimation Guidelines**:
- **Simple tasks**: 30-60 minutes (single component changes)
- **Medium tasks**: 2-4 hours (multiple components, some integration)
- **Complex tasks**: 4+ hours (architectural changes, multiple sessions)

**Development Priorities**:
- **Maintain current functionality**: Ensure existing features continue working
- **Improve user experience**: Focus on usability and performance
- **Follow established patterns**: Use existing component and styling standards

## AI Development Patterns

> **MANDATORY FOR AI ASSISTANTS**: These patterns define required practices for all AI development work in this project. Read and apply these patterns before starting any development tasks.

### Human-AI Collaboration Model

**Approach**: Human-AI pair programming for rapid, high-quality development

**Human Responsibilities:**
- **Strategic Decisions**: Architecture choices, business logic, user experience decisions
- **Acceptance Criteria**: Define what "done" looks like
- **Final Verification**: Review implementation against requirements
- **Code Review**: Approve changes that affect core functionality

**AI Responsibilities:**
- **Implementation**: Write code, create components, implement features
- **Documentation**: Generate inline docs, update README files
- **Debugging**: Identify and fix implementation issues
- **Testing**: Create tests when framework exists

**Development Velocity**: AI-optimized development cycles:
- **Feature Implementation**: 30 minutes to 6 hours per feature
- **Bug Fixes**: 10-30 minutes for most issues
- **Component Creation**: 30-90 minutes with proper patterns
- **Documentation**: Generated during implementation

**Interaction Patterns:**
- **Conversational Task Definition**: Clear requirements through natural language
- **Real-time Feedback**: Immediate iteration and refinement cycles
- **Session Scope**: Complete features in single interactions when possible
- **Context Continuity**: Maintain full understanding across related changes

### AI Development Capabilities

**Current Approach: Single AI, Multiple Capabilities**

**Why Single AI Works Best (Current Project Scale):**
- **Context continuity**: Maintains full understanding across all changes
- **No coordination overhead**: Zero handoff delays or miscommunication  
- **Holistic optimization**: Can optimize across frontend/data/styling simultaneously
- **Immediate iteration**: Fix issues instantly without waiting for coordination
- **Simple interaction model**: Human works with one consistent assistant

**Development Specialization Areas:**

#### Frontend Development
- **Components**: React/Astro components with TypeScript
- **Styling**: SCSS modules, responsive design, CSS architecture
- **Integration**: Component composition and state management
- **Tools**: React, Astro, TypeScript, SCSS

#### Data & Content Management  
- **Static Data**: JSON file organization and updates (product catalogs, configs)
- **Content Collections**: Astro content management (blog posts, use cases)
- **Schema Validation**: Data structure consistency and validation
- **Tools**: JSON processing, Astro content API, schema validation

#### Quality Assurance & Standards
- **Code Quality**: TypeScript error resolution, linting compliance
- **Standards Adherence**: Component, styling, and file naming conventions
- **Manual Verification**: Functionality testing and acceptance criteria validation
- **Documentation**: Inline docs, README updates, pattern documentation

**When Multiple AI Would Become Necessary:**
- **Context overflow**: 100+ components, complex state management systems
- **True parallel development**: Multiple unrelated major features simultaneously
- **Specialized expertise**: Security, performance, DevOps requiring deep domain knowledge
- **Team scale**: 5+ developers, multiple product lines, enterprise architecture

**Current Project Assessment:** Single AI optimal for foreseeable growth

### Task Communication Patterns

**Simple Task Format:**
- **Clear, specific descriptions**: "Add hover zoom to ProductImage component with 2x magnification"
- **Explicit acceptance criteria**: What "done" looks like
- **Dependencies noted upfront**: Required files, existing components, prerequisites
- **No formal work item IDs**: AI development moves too fast for heavy process

**Complexity Indicators:**
- **Simple**: Single component change, clear requirements, 30min-2hrs
- **Medium**: Multiple related changes, some integration, 2-6hrs  
- **Complex**: Cross-cutting changes, architectural decisions needed, 6+ hrs or multiple sessions

**Effective Task Examples:**
```markdown
// Good: Specific and actionable
"Add hover zoom functionality to ProductImage component with 2x magnification that follows cursor position"

// Poor: Vague and unclear  
"Make images better"

// Good: Clear acceptance criteria
- [ ] Image zooms to 2x scale on hover
- [ ] Zoom follows mouse cursor position
- [ ] Zoom resets when mouse leaves image area
- [ ] Works on both desktop and mobile devices
```

### Development Workflow

**For Simple Tasks (30min-2hrs):**
1. **Understand**: Clarify requirements and acceptance criteria
2. **Verify**: Check imports, dependencies, and existing patterns exist using Glob/LS tools
3. **Implement**: Write code following established standards
4. **Validate**: Test functionality and verify acceptance criteria met

**For Complex Tasks (Multi-session/6+ hrs):**
1. **Plan**: Break into logical phases, use TodoWrite for tracking progress
2. **Implement Incrementally**: Complete phases one at a time
3. **Verify Each Phase**: Ensure stability before moving forward
4. **Document**: Summarize progress and any architectural decisions made

**AI-Specific Best Practices:**
- **Always verify context first**: Use Glob/LS to confirm files/components exist before coding
- **Ask clarifying questions**: When requirements are ambiguous or incomplete
- **Show incremental progress**: For complex changes, demonstrate working steps
- **Reference standards**: Link to specific patterns when deviating from conventions
- **Use path aliases**: Import from configured aliases for clean, maintainable code

## AI Development Standards & Requirements

**IMPORTANT**: All AI development work must follow the patterns defined above in the AI Development Patterns section.

**Before Starting Any Development Task:**
- **Review**: Read task communication patterns and workflow steps above
- **Apply**: Use AI-specific best practices consistently throughout implementation
- **Verify**: Always use Glob/LS tools before coding to confirm context exists
- **Follow**: Reference established standards in `/src/development-standards/standards/` rather than duplicating or guessing patterns

**Required Development Practices:**
- Context verification before implementation
- Standards compliance (component, styling, file naming, data management)
- Clear communication with humans when requirements are ambiguous
- Incremental progress demonstration for complex changes

---

**Philosophy**: Start simple, add complexity only when needed. Focus on practical patterns that improve development velocity while maintaining code quality.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build & Development

- `npm run dev` - Start Astro development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run check` - Run Astro type checking

### AI-First Development Commands

- `/project:new-feature "name" [priority] [agent-type]` - Create AI-optimized feature with work items
- `/project:update-status WI-XXX status [notes]` - Track AI development progress
- `/project:feature-status [feature] [format]` - Monitor AI development velocity
- `/project:parallel-dev [feature-list]` - Coordinate multi-agent development streams
- `/project:auto-qa [scope]` - Trigger automated quality assurance pipeline
- `/project:deploy-preview [feature]` - Generate preview deployment for verification

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
- **Styling Patterns**: SCSS modules for components, global utilities for shared styles
- **Work Item Format**: Structured project management with AI-friendly formatting
- **File Naming**: Consistent naming conventions across the project

**Documentation Precedence**: 
- **PRIMARY**: `/src/project-management/standards/` (current, authoritative)

#### AI-First Development Infrastructure (Production-Ready)

**Context**: This project operates with AI-native development cycles where AI agents handle most implementation, with humans focusing on strategic decisions, acceptance criteria, and final verification.

**Development Velocity**: AI-optimized timelines replace traditional human development cycles:
- **Feature Implementation**: 2-6 hours (vs 1-4 weeks human)
- **Bug Fixes**: 10-30 minutes (vs 2-8 hours human) 
- **Component Creation**: 30-90 minutes (vs 4-16 hours human)
- **Testing & Documentation**: Automated and parallel (vs sequential human process)

**Multi-Agent Development Streams**:
- **Parallel Development**: 3-5 agents working simultaneously on different components
- **24/7 Availability**: Development continues outside business hours
- **Instant Coordination**: Real-time agent communication and conflict resolution
- **Automated Quality Gates**: Every change includes tests, documentation, and type safety

**AI-Agent Specializations**:
- **Frontend-UI Agent**: React/Astro components, SCSS styling, responsive design, accessibility
- **Backend-API Agent**: Server-side logic, database operations, API design, security
- **Data-Pipeline Agent**: JSON data management, content processing, schema validation
- **Testing Agent**: Unit/integration/e2e tests, performance testing, security audits
- **Integration Agent**: Multi-agent coordination, deployment automation, cross-cutting concerns
- **QA Agent**: Code review, standards compliance, performance optimization

**AI Development Phases** (Hours, not Weeks):

**Phase 1 - Foundation (Day 1: 0-8 hours)**
- Fix critical TypeScript errors and warnings
- Implement comprehensive testing framework
- Set up continuous integration pipeline
- Establish performance monitoring baseline

**Phase 2 - Core Features (Day 1-2: 8-24 hours)**
- Shopping cart and checkout implementation
- User authentication and session management  
- Payment processing integration
- Product search with filtering

**Phase 3 - Enhancement (Day 2-3: 24-48 hours)**
- Mobile optimization and PWA features
- Accessibility compliance (WCAG 2.1 AA)
- Performance optimization and code splitting
- SEO enhancement with schema markup

**Phase 4 - Advanced Features (Day 3-5: 48-96 hours)**
- AI-powered recommendations and personalization
- Real-time features (chat, notifications)
- Advanced analytics and conversion optimization
- Multi-language support and localization

**Continuous Development Practices**:
- **Automated Testing**: Every commit includes comprehensive test coverage
- **Performance Monitoring**: Real-time performance regression detection
- **Accessibility Auditing**: Automated WCAG compliance checking
- **Security Scanning**: Automated vulnerability assessment
- **Code Quality Gates**: TypeScript errors block deployment
- **Documentation Generation**: Auto-generated API docs and component stories

**AI-Agent Coordination Protocols**:
```json
{
  "workItemFormat": "machine-parseable with JSON metadata",
  "agentHandoffs": "automated with dependency tracking",
  "conflictResolution": "real-time with precedence rules",
  "qualityGates": "automated verification before merge",
  "deploymentPipeline": "continuous with rollback capabilities"
}
```

**Human-AI Collaboration Model**:
- **Human Role**: Strategic decisions, acceptance criteria definition, final verification
- **AI Role**: Implementation, testing, documentation, optimization, maintenance
- **Decision Points**: Architecture changes, business logic, user experience decisions
- **Verification Gates**: Automated quality checks + human acceptance testing

**AI Development Metrics**:
- **Velocity**: Features/hour vs traditional features/sprint
- **Quality**: Automated test coverage, performance benchmarks, accessibility scores
- **Consistency**: Code style compliance, pattern adherence, documentation completeness
- **Efficiency**: Lines of code per feature, technical debt reduction, performance improvements

**Usage for AI Assistants**:
- **Expect Rapid Iteration**: Implement features in hours, not days
- **Work in Parallel**: Coordinate multiple development streams simultaneously
- **Automate Everything**: Testing, documentation, deployment, monitoring
- **Maintain Quality**: Every change includes comprehensive quality assurance
- **Think in Pipelines**: Continuous integration, deployment, and monitoring
- **Optimize Continuously**: Performance, accessibility, SEO, and user experience

#### SEO & Performance

- Comprehensive sitemap generation with custom priorities in `astro.config.mjs`
- Vercel analytics and speed insights integration
- Responsive image optimization with Astro's image service
- Meta tag management through reusable SEO component

### AI-Driven Testing & Quality Assurance

**Automated Quality Pipeline**:
- **Test Generation**: AI creates comprehensive test suites from acceptance criteria
- **Performance Testing**: Automated Lighthouse audits and performance regression detection
- **Accessibility Testing**: Automated WCAG 2.1 AA compliance verification
- **Security Scanning**: Automated vulnerability assessment and dependency auditing
- **Type Safety**: Zero TypeScript errors policy with automated enforcement

**Continuous Quality Gates**:
- **Pre-commit**: Automated linting, formatting, and basic type checking
- **Pre-merge**: Full test suite, performance benchmarks, accessibility audit
- **Pre-deployment**: Security scan, bundle size analysis, SEO validation
- **Post-deployment**: Real-time monitoring, error tracking, performance metrics

**AI Quality Metrics**:
- **Test Coverage**: >90% automated coverage for all new code
- **Performance**: <2s page load, >95 Lighthouse score
- **Accessibility**: 100% WCAG 2.1 AA compliance
- **Type Safety**: Zero TypeScript errors/warnings
- **Bundle Size**: <200KB initial bundle, code splitting enforced

## AI-First Project Planning & Estimation

**Feature Estimation Model** (AI Development):
```json
{
  "simple-component": "30-60 minutes",
  "complex-component": "2-4 hours", 
  "full-feature": "4-12 hours",
  "integration": "1-3 hours",
  "testing-suite": "auto-generated",
  "documentation": "auto-generated"
}
```

**Parallel Development Capacity**:
- **Simultaneous Features**: 3-5 features in parallel development
- **Agent Specialization**: Frontend, Backend, Data, Testing, Integration agents
- **Coordination Overhead**: Minimal with automated handoffs
- **Quality Assurance**: Continuous and automated

**AI Enhancement Roadmap** (Revised Timelines):
```
Week 1 (40 hours AI development):
- Foundation fixes (TypeScript, testing, CI/CD)
- Core e-commerce features (cart, auth, payments)
- Mobile optimization and accessibility
- Performance optimization

Week 2 (40 hours AI development):  
- Advanced features (search, recommendations)
- Real-time capabilities (chat, notifications)
- Analytics and conversion optimization
- SEO and content management

Week 3+ (Continuous):
- AI-powered personalization
- Advanced business intelligence
- Multi-language and internationalization
- Enterprise features and scaling
```

**Success Metrics for AI Development**:
- **Velocity**: 8-10 completed features per week
- **Quality**: Zero production bugs, >95% performance scores
- **Consistency**: 100% adherence to development standards
- **Efficiency**: 90% reduction in development time vs traditional approach

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Table of Contents

### 🚀 Quick Start
- [Development Commands](#development-commands) - Build, dev server, type checking
- [AI Development Patterns](#ai-development-patterns) - **MANDATORY** patterns for AI assistants
- [Task Communication Patterns](#task-communication-patterns) - How to request work effectively

### 🏗️ Architecture & Standards  
- [Architecture Overview](#architecture-overview) - Core technologies and patterns
- [Functional Programming Standards](#functional-programming-standards) - **MANDATORY** coding principles
- [Development Standards](#development-standards) - Component, styling, file organization

### 🤖 AI-First Development
- [Human-AI Collaboration Model](#human-ai-collaboration-model) - Role definitions and workflow
- [AI Development Capabilities](#ai-development-capabilities) - Single AI vs multiple AI approach
- [Development Workflow](#development-workflow) - Simple vs complex task patterns

### 🔧 Automation & Quality
- [Code Review Agent](#code-review-agent) - Automated standards enforcement
- [Blog Automation & SEO](#blog-automation--seo-optimization-system) - Content generation pipeline
- [Quality Assurance](#quality-assurance) - Testing and verification practices

### 📋 Common Tasks
- [Adding New Products](#adding-new-products) - Product data management
- [Creating New Components](#creating-new-components) - Component development workflow
- [Development Planning](#development-planning) - Time estimates and priorities

---

## 🔥 At-a-Glance Quick Reference

### Essential Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run check        # Run Astro type checking
```

### Critical Paths
- **Standards**: `/src/development-standards/standards/`
- **Components**: `/src/components/`
- **Product Data**: `/src/data/models.[brand].json`
- **Automation Scripts**: `/scripts/`

### AI Development Rules
1. **Always verify context first** - Use Glob/LS before coding
2. **Follow functional programming** - Pure functions, immutability, composition
3. **Run code review agent** - After generating code: `node scripts/code-review-agent.js --file [file]`
4. **Use TodoWrite tool** - For complex tasks requiring planning

### Emergency Procedures
- **Automation failures**: See [EMERGENCY_PROCEDURES.md](./EMERGENCY_PROCEDURES.md)
- **Path issues**: All standards in `/src/development-standards/standards/`
- **Context problems**: Refer to task-specific sections below

---

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
- **Living Documentation**: Auto-generated route documentation in `ROUTES.md`

**Route Documentation System:**
- **`scripts/generate-routes-docs.js`** - Automated route discovery and documentation generator
- **`ROUTES.md`** - Living documentation of all routes, parameters, and examples
- **`/dev/routes`** - Interactive route explorer (development only)
- **`npm run docs:routes`** - Update route documentation
- **Git hooks** - Auto-update documentation when routes change

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

- **Follow development standards**: See `/src/development-standards/standards/` for detailed guidelines
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

### Pricing Policy

**CRITICAL**: Pricing information is confidential and for internal use only
- **Never display** specific prices, price ranges, or cost data on public pages
- **Always use** "Contact for pricing" or "Request quote" instead
- **Product data** may contain pricing fields for internal processes, but these must not be rendered
- **Budget categories** should be based on features/use cases, not price ranges

#### SEO & Performance

- Comprehensive sitemap generation with custom priorities in `astro.config.mjs`
- Vercel analytics and speed insights integration
- Responsive image optimization with Astro's image service
- Meta tag management through reusable SEO component

### Quality Assurance

**Current Quality Practices**:
- **TypeScript**: Type safety throughout the codebase
- **Manual Testing**: Verify functionality against acceptance criteria
- **Code Standards**: Follow established patterns in `/src/development-standards/standards/`
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
- **Components**: React/Astro components with TypeScript using functional programming patterns
- **Styling**: SCSS modules, responsive design, CSS architecture
- **Integration**: Component composition and state management using functional approaches
- **Tools**: React, Astro, TypeScript, SCSS

#### Data & Content Management  
- **Static Data**: JSON file organization and updates using pure functions and immutable patterns
- **Content Collections**: Astro content management with functional data transformations
- **Schema Validation**: Data structure consistency using functional validation patterns
- **Tools**: JSON processing, Astro content API, schema validation with functional approaches

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
- **Apply functional programming**: Prefer pure functions, immutability, and function composition
- **Avoid side effects**: Use functional patterns for state management and data transformations

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
- **Functional Programming Compliance**: Use pure functions, immutability, and composition patterns
- **Code Review Integration**: Always run code review agent on generated code before considering task complete

## Functional Programming Standards

> **MANDATORY**: All code development must follow functional programming principles. This is a core architectural requirement for maintainability, testability, and reliability.

### Core Principles

#### 1. **Pure Functions**
- **No side effects**: Functions should not modify external state
- **Deterministic**: Same input always produces same output
- **Isolated**: Function behavior depends only on input parameters

```typescript
// ✅ Pure function
const calculateTotal = (items: Item[]) => 
  items.reduce((sum, item) => sum + item.price, 0);

// ❌ Impure function (side effects)
let total = 0;
const addToTotal = (price: number) => { total += price; };
```

#### 2. **Immutability**
- **Never mutate**: Always return new objects/arrays instead of modifying existing ones
- **Use spread operators**: For object/array updates
- **Prefer const**: For all variable declarations unless reassignment needed

```typescript
// ✅ Immutable update
const updateProduct = (product: Product, updates: Partial<Product>) => ({
  ...product,
  ...updates
});

// ❌ Mutation
const updateProduct = (product: Product, updates: Partial<Product>) => {
  Object.assign(product, updates); // Mutates original
  return product;
};
```

#### 3. **Function Composition**
- **Small, focused functions**: Each function should do one thing well
- **Compose larger functionality**: From smaller, reusable functions
- **Higher-order functions**: Functions that take/return other functions

```typescript
// ✅ Function composition
const filterActive = (products: Product[]) => products.filter(p => p.active);
const sortByPrice = (products: Product[]) => [...products].sort((a, b) => a.price - b.price);
const formatForDisplay = (products: Product[]) => products.map(formatProduct);

const getActiveProductsSorted = (products: Product[]) =>
  formatForDisplay(sortByPrice(filterActive(products)));

// Or using pipe/compose utilities
const getActiveProductsSorted = pipe(
  filterActive,
  sortByPrice,
  formatForDisplay
);
```

### React Component Patterns

#### **Functional Components Only**
- **No class components**: Use only functional components with hooks
- **Custom hooks**: Extract stateful logic into reusable hooks
- **Props as pure data**: Components should be functions of their props

```typescript
// ✅ Functional component with hooks
const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = useCallback(() => {
    onSelect(product.id);
  }, [product.id, onSelect]);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Component content */}
    </div>
  );
};
```

#### **State Management**
- **useState for local state**: Keep component state functional
- **useReducer for complex state**: Use reducer pattern for complex state logic
- **Avoid direct mutations**: Always use functional updates

```typescript
// ✅ Functional state updates
const [filters, setFilters] = useState<ProductFilters>({});

const updateFilter = useCallback((key: string, value: string) => {
  setFilters(prev => ({ ...prev, [key]: value }));
}, []);

// ✅ Reducer for complex state
const filtersReducer = (state: ProductFilters, action: FilterAction) => {
  switch (action.type) {
    case 'SET_FILTER':
      return { ...state, [action.key]: action.value };
    case 'RESET_FILTERS':
      return {};
    default:
      return state;
  }
};
```

### Data Transformation Patterns

#### **Array Processing**
- **Use map, filter, reduce**: Instead of imperative loops
- **Chain operations**: Use method chaining for readable transformations
- **Avoid forEach**: When you need to return transformed data

```typescript
// ✅ Functional array processing
const processProducts = (products: Product[], filters: ProductFilters) =>
  products
    .filter(product => matchesFilters(product, filters))
    .map(product => enrichProductData(product))
    .sort((a, b) => a.price - b.price);

// ❌ Imperative approach
const processProducts = (products: Product[], filters: ProductFilters) => {
  const result = [];
  for (let i = 0; i < products.length; i++) {
    if (matchesFilters(products[i], filters)) {
      const enriched = enrichProductData(products[i]);
      result.push(enriched);
    }
  }
  result.sort((a, b) => a.price - b.price);
  return result;
};
```

#### **Object Transformations**
- **Use object spread**: For updates and merging
- **Destructuring**: For clean property access
- **Optional chaining**: For safe property access

```typescript
// ✅ Functional object handling
const formatProductForApi = ({ id, name, price, ...otherProps }: Product) => ({
  productId: id,
  displayName: name,
  priceInCents: price * 100,
  metadata: otherProps
});

const safeGetProperty = (obj: any, path: string) =>
  path.split('.').reduce((current, key) => current?.[key], obj);
```

### Async Operations

#### **Promise Composition**
- **Use async/await**: For readable asynchronous code
- **Error boundaries**: Handle errors functionally
- **Avoid nested callbacks**: Use Promise chaining or async/await

```typescript
// ✅ Functional async operations
const fetchProductWithDetails = async (productId: string): Promise<EnrichedProduct> => {
  const product = await fetchProduct(productId);
  const reviews = await fetchReviews(productId);
  const relatedProducts = await fetchRelatedProducts(productId);
  
  return {
    ...product,
    reviews,
    relatedProducts
  };
};

// ✅ Error handling
const safeApiCall = async <T>(apiCall: () => Promise<T>): Promise<T | null> => {
  try {
    return await apiCall();
  } catch (error) {
    console.error('API call failed:', error);
    return null;
  }
};
```

### TypeScript Integration

#### **Type Safety with Functions**
- **Generic functions**: For reusable, type-safe functions
- **Union types**: For function parameters with multiple possibilities
- **Function signatures**: Clear typing for all function parameters and returns

```typescript
// ✅ Type-safe functional patterns
type FilterFunction<T> = (item: T) => boolean;
type MapFunction<T, U> = (item: T) => U;

const createFilter = <T>(predicate: FilterFunction<T>) => 
  (items: T[]): T[] => items.filter(predicate);

const createMapper = <T, U>(transform: MapFunction<T, U>) =>
  (items: T[]): U[] => items.map(transform);

// Usage
const activeProductFilter = createFilter<Product>(p => p.active);
const productDisplayMapper = createMapper<Product, ProductDisplay>(formatProduct);
```

### Testing Functional Code

#### **Unit Testing Pure Functions**
- **Easy to test**: Pure functions are highly testable
- **No mocking needed**: Pure functions don't require complex test setup
- **Property-based testing**: Test function properties rather than specific cases

```typescript
// ✅ Testing pure functions
describe('calculateTotal', () => {
  it('should return 0 for empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });

  it('should sum all item prices', () => {
    const items = [{ price: 10 }, { price: 20 }, { price: 30 }];
    expect(calculateTotal(items)).toBe(60);
  });
});
```

### Performance Considerations

#### **Memoization**
- **React.memo**: For component memoization
- **useMemo**: For expensive calculations
- **useCallback**: For function reference stability

```typescript
// ✅ Memoization patterns
const ProductList = React.memo<ProductListProps>(({ products, filters }) => {
  const filteredProducts = useMemo(
    () => filterProducts(products, filters),
    [products, filters]
  );

  const handleProductSelect = useCallback(
    (productId: string) => {
      // Handle selection
    },
    []
  );

  return (
    <div>
      {filteredProducts.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onSelect={handleProductSelect}
        />
      ))}
    </div>
  );
});
```

### Anti-Patterns to Avoid

#### **Common Mistakes**
- **Direct mutations**: Never modify props, state, or passed objects directly
- **Imperative loops**: Avoid for/while loops when functional methods work
- **Global state mutations**: Keep all state changes functional
- **Side effects in render**: Keep components pure

```typescript
// ❌ Anti-patterns
const ProductComponent = ({ products }) => {
  // DON'T: Mutate props
  products.push(newProduct);
  
  // DON'T: Side effects in render
  localStorage.setItem('products', JSON.stringify(products));
  
  // DON'T: Imperative array building
  const activeProducts = [];
  for (const product of products) {
    if (product.active) {
      activeProducts.push(product);
    }
  }
  
  return <div>{/* render */}</div>;
};
```

### Development Workflow

#### **Implementation Steps**
1. **Design function signatures**: Start with clear input/output types
2. **Write pure functions**: Implement core logic without side effects
3. **Compose larger functions**: Build complexity through composition
4. **Add side effects at boundaries**: Handle I/O, state updates at component edges
5. **Test thoroughly**: Unit test all pure functions

#### **Code Review Checklist**
- [ ] All functions are pure (no side effects)
- [ ] No direct mutations of objects/arrays
- [ ] State updates use functional patterns
- [ ] Complex logic is broken into small, composable functions
- [ ] TypeScript types are properly defined
- [ ] Async operations use proper error handling
- [ ] Components are memoized appropriately

## Code Review Agent

**✅ Production Ready** - Automated enforcement of functional programming principles and project standards.

**Components**: 
- `scripts/code-review-agent.js` - Core analysis engine
- `scripts/code-review-api-simple.js` - HTTP API server  
- `scripts/agent-performance-tracker.js` - Performance tracking
- `.github/workflows/code-review-automation.yml` - GitHub integration

**Quick Commands**:
```bash
# Single file analysis
node scripts/code-review-agent.js --file src/components/MyComponent.tsx

# AI agent workflow (recommended)
node scripts/code-review-agent.js --file [file] --ai-mode --agent-id [agent] --task-id [task] --format json

# API server for orchestrator
node scripts/code-review-api-simple.js --port 3001

# Performance tracking
node scripts/agent-performance-tracker.js --summary
```

**Scoring**: 90-100 (A), 80-89 (B), 70-79 (C), 60-69 (D), 0-59 (F)

**Categories**: Functional Programming (40%), Project Standards (20%), TypeScript (20%), React Patterns (20%)

**Key Features**:
- **GitHub Integration**: Automatic PR analysis, status checks, auto-labeling, merge blocking for scores < 60
- **AI Agent Tracking**: Performance monitoring, learning feedback, agent comparison
- **API Integration**: HTTP endpoints for programmatic access by orchestrator systems
- **Real-time Analysis**: 5-15 seconds per file, JSON/minimal output formats

**Mandatory for AI Agents**:
```bash
# After generating code, ALWAYS run:
node scripts/code-review-agent.js --file [generated-file] --ai-mode --agent-id [agent-name] --task-id [task-name]

# If score < 80: Refactor code before considering task complete
# Log performance: node scripts/agent-performance-tracker.js --log review-results.json
```

*See [CODE_REVIEW_AGENT.md](./CODE_REVIEW_AGENT.md) for comprehensive documentation and troubleshooting.*

---

## Blog Automation & SEO Optimization System

### Overview

This project includes a comprehensive **automated blog generation and SEO optimization system** designed to create high-quality, SEO-optimized content at scale with minimal human intervention.

### System Architecture

```
Content Planning → Auto-Generation → SEO Analysis → Auto-Optimization → Human Review → Publication
      ↓                 ↓              ↓              ↓               ↓            ↓
 Content Queue     Blog Post      Score: 35/100   Score: 75/100   Final QA    Live Content
 (JSON Database)   (Markdown)     (Analysis)      (Optimized)     (Manual)    (Published)
```

### Core Components

#### 1. **Automated Blog Generation System**

**Location**: `scripts/generate-blog-post.js`, `content-queue.json`, `.github/workflows/automated-blog-generation.yml`

**Features**:
- **Template-based content generation** with 4 content types:
  - Product comparisons
  - How-to guides  
  - Use case studies
  - Buyer guides
- **Content queue management** with scheduling and priorities
- **GitHub Actions automation** (every 3 days)
- **Automatic PR creation** with detailed descriptions
- **Error handling and reporting** via GitHub issues

**Content Queue Structure**:
```json
{
  "scheduledPosts": [
    {
      "title": "Blog Post Title",
      "template": "comparison|how-to|use-case|buyer-guide",
      "priority": "high|medium|low",
      "targetKeywords": ["keyword1", "keyword2"],
      "estimatedLength": 1500,
      "category": "Smart Whiteboards",
      "author": "Big Shine Display Team",
      "seoData": { "difficulty": "medium", "searchVolume": 2400 }
    }
  ],
  "nextPostDate": "2025-06-29",
  "automation": { "enabled": true, "interval": "3days" }
}
```

#### 2. **SEO Analysis Engine**

**Location**: `scripts/seo-agent.js`

**Comprehensive Analysis** (9 categories):
- **Title Optimization** (length, keywords, power words)
- **Meta Description** (CTR optimization, length, keywords)
- **Keywords Analysis** (density, relevance, semantic keywords)
- **Content Quality** (depth, expertise, word count)
- **Content Structure** (headings, readability, organization)
- **Featured Snippets** (FAQ, how-to, lists, tables)
- **Schema Markup** (structured data opportunities)
- **Link Profile** (internal/external links)
- **Competitive Analysis** (industry benchmarking)

**Scoring System**:
- **0-49**: F (Major revisions required)
- **50-69**: D (Needs significant work)
- **70-79**: C (Good, minor improvements)
- **80-89**: B (Very good, publication ready)
- **90-100**: A (Excellent, optimal SEO)

#### 3. **SEO Auto-Optimization Engine**

**Location**: `scripts/seo-optimizer.js`

**Intelligent Optimization**:
- **Title Enhancement**: Length optimization, keyword placement, power words, year addition
- **Meta Description**: CTR optimization, compelling copy, keyword integration, call-to-action
- **Keywords**: Content analysis, industry terms, semantic keywords, frontmatter updates
- **Content Structure**: Introduction/conclusion generation, heading optimization, FAQ sections
- **Readability**: Paragraph structure, sentence optimization, transition words

**Safety Systems**:
- **7 Pre-optimization Safety Checks**:
  - File existence and readability
  - Content size validation (100 chars - 50KB)
  - Markdown blog post verification
  - Backup conflict prevention
  - Recent modification detection
  - Suspicious content scanning
- **Content Validation**: Score improvement verification, length preservation, structure integrity
- **Automatic Rollback**: If SEO score decreases
- **Emergency Rollback**: Manual recovery system with detailed logs
- **Human Approval Gates**: For major changes (score < 30, critical failures)

#### 4. **GitHub Integration & Workflow**

**PR Analysis Workflow** (`.github/workflows/seo-review-trigger.yml`):
```yaml
Trigger: PR created/updated with blog content
↓
1. Auto-checkout PR branch
2. Run comprehensive SEO analysis  
3. Generate detailed scoring report
4. Comment results on PR with recommendations
5. Add SEO labels (seo-excellent, seo-good, seo-needs-work, seo-major-issues)
6. Auto-approve high-scoring content (85+)
7. Request changes for poor content (<65)
8. Create status checks for CI/CD
```

**Auto-Optimization Workflow**:
```yaml
Trigger: Manual or automated
↓
1. Safety checks and validation
2. Create backup of original content
3. Apply intelligent optimizations
4. Validate improved content
5. Commit changes with detailed logs
6. Comment optimization results on PR
7. Restore original branch
```

### Command-Line Interface

#### Code Review Commands
```bash
# Single file analysis
claude code-review --file src/components/MyComponent.tsx

# PR analysis (auto-checkout included)
claude code-review --pr 123

# Batch directory analysis
claude code-review --batch src/components/

# Quick standards check
claude code-review --file src/utils/helper.ts
```

#### SEO Analysis Commands
```bash
# PR Analysis (auto-checkout included)
claude seo-review --pr 123

# Quick file analysis  
claude seo-quick-check --file blog.md

# Comprehensive reports
claude seo-report --format console
claude seo-batch --min-score 70

# Content comparison
claude seo-compare file1.md file2.md

# Performance monitoring
claude seo-monitor --threshold 70
```

#### SEO Auto-Optimization Commands
```bash
# Recommended: Full PR optimization
claude seo-auto-optimize --pr 123

# Single file optimization
claude seo-auto-optimize --file blog.md

# Advanced optimization (includes readability, FAQ)
claude seo-auto-optimize --pr 123 --aggressive

# Selective fixes
claude seo-apply-fixes --file blog.md --fixes title,description

# Preview changes (coming soon)
claude seo-preview-changes --pr 123

# Emergency rollback (coming soon)  
claude seo-rollback --pr 123
```

#### Blog Generation Commands
```bash
# Manual blog generation
claude generate-blog

# Queue management (manual)
# Edit content-queue.json directly
```

### Usage Workflows

#### **Workflow A: Automated Code Review Pipeline**
```bash
# 1. Automated (on PR creation via GitHub Actions)
# GitHub Actions runs: scripts/code-review-agent.js
# ↓ Comments detailed compliance analysis on PR

# 2. Manual Code Review (as needed)
claude code-review --pr <NUMBER>
# ↓ Analyzes functional programming and standards compliance

# 3. Batch Analysis (periodic quality checks)
claude code-review --batch src/components/
# ↓ Comprehensive directory analysis

# 4. Individual File Check (during development)
claude code-review --file src/components/NewComponent.tsx
# ↓ Real-time compliance checking
```

#### **Workflow B: Automated Blog Pipeline**
```bash
# 1. Automated (every 3 days via GitHub Actions)
# GitHub Actions runs: scripts/generate-blog-post.js
# ↓ Creates PR with new blog post

# 2. Automated SEO Analysis (on PR creation)  
# GitHub Actions runs: seo-review-trigger.yml
# ↓ Comments detailed SEO analysis on PR

# 3. Manual SEO Optimization (as needed)
claude seo-auto-optimize --pr <NUMBER>
# ↓ Applies intelligent optimizations

# 4. Human Review & Publish
# Review PR → Approve → Merge → Live
```

#### **Workflow C: Manual Content Optimization**
```bash
# 1. Analyze existing content
claude seo-review --file src/content/blog/my-post.md

# 2. Auto-optimize if needed  
claude seo-auto-optimize --file src/content/blog/my-post.md

# 3. Verify improvements
claude seo-quick-check --file src/content/blog/my-post.md

# 4. Commit and publish
git add . && git commit -m "seo: optimize blog post"
```

#### **Workflow D: Performance Monitoring**
```bash
# 1. Generate performance report
claude seo-report --format console

# 2. Identify low-performing content  
claude seo-batch --min-score 70

# 3. Batch optimize if needed
# (Run auto-optimize on identified files)

# 4. Monitor ongoing quality
claude seo-monitor --threshold 70
```

### Performance Metrics

**System Performance**:
- **Average SEO Improvement**: +8.5 points per optimization
- **Processing Time**: 30-60 seconds per file
- **Success Rate**: 100% (when safety checks pass)
- **Content Generation**: 1 post every 3 days (automated)
- **Quality Threshold**: Target 75+ SEO score for publication

**Optimization Results** (Test Data):
| Content Type | Before | After | Improvement | Time |
|--------------|--------|-------|-------------|------|
| Product Comparison | 35/100 | 43/100 | +8 points | 45s |
| How-to Guide | 40/100 | 50/100 | +10 points | 52s |
| Technical Guide | 39/100 | 49/100 | +10 points | 38s |
| Brand Comparison | 39/100 | 45/100 | +6 points | 41s |

### Content Quality Standards

**Generated Content Includes**:
- ✅ SEO-optimized titles with target keywords
- ✅ Compelling meta descriptions (150-160 chars)
- ✅ Proper heading structure (H1, H2, H3)
- ✅ Industry-specific keyword integration
- ✅ Call-to-action and contact information
- ✅ Brand voice consistency
- ✅ Technical accuracy and expertise demonstration
- ✅ Internal linking to relevant products/content

**Auto-Optimization Adds**:
- ✅ Power words and emotional triggers
- ✅ Current year for freshness (2025)
- ✅ Semantic keyword enhancement
- ✅ Introduction and conclusion sections
- ✅ FAQ sections (when beneficial)
- ✅ Improved readability and structure
- ✅ Featured snippet optimization

### Maintenance & Monitoring

**Regular Tasks**:
- **Weekly**: Review automated blog generation PRs
- **Weekly**: Monitor SEO performance reports
- **Monthly**: Update content queue with new topics
- **Monthly**: Analyze competitive keyword opportunities
- **Quarterly**: Review and optimize automation workflows

**Quality Assurance**:
- **Human review required** for all generated content
- **SEO score targets**: 75+ for publication, 85+ for auto-approval
- **Content validation**: Technical accuracy, brand compliance
- **Performance tracking**: Search rankings, organic traffic impact

**Troubleshooting**:
- **Generation failures**: Check GitHub Actions logs, content queue format
- **SEO analysis errors**: Verify file format, run individual analysis
- **Optimization failures**: Check safety logs, review backup files
- **PR workflow issues**: Verify GitHub CLI authentication, repository permissions

---

**Philosophy**: Start simple, add complexity only when needed. Focus on practical patterns that improve development velocity while maintaining code quality.

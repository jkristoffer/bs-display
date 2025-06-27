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

#### **Workflow A: Automated Blog Pipeline**
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

#### **Workflow B: Manual Content Optimization**
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

#### **Workflow C: Performance Monitoring**
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

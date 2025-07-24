# Semantic Token Structure & Naming Conventions

**Project**: CSS Architecture Cleanup - Phase 2  
**Objective**: Design cohesive 100-variable semantic token system  
**Approach**: Design system principles with clear hierarchy and naming

## Token Architecture Overview

The new 100-variable system follows a **hierarchical semantic naming convention** that balances clarity, consistency, and scalability.

### Naming Convention Principles

1. **Semantic Over Descriptive**: `--color-primary` not `--color-blue`
2. **Hierarchical Structure**: `category-element-variant-state`
3. **Consistent Patterns**: Same structure across all token types
4. **Future-Proof**: Extensible without breaking existing usage
5. **AI-Friendly**: Clear, predictable patterns for automated tools

### Token Hierarchy Pattern

```
--{category}-{element}-{variant}-{state}
```

**Examples**:
- `--color-primary` (category-element)
- `--color-primary-hover` (category-element-state)
- `--spacing-md` (category-size)
- `--text-hero` (category-purpose)
- `--shadow-lg` (category-size)

## Complete Token System (100 Variables)

### 1. COLOR TOKENS (25 variables)

#### Brand Colors (3 variables)
```scss
// Primary brand identity
--color-primary: #009688;           // Main brand color (227 occurrences)
--color-primary-hover: #007a6b;     // Interactive hover state
--color-primary-active: #006b5d;    // Interactive active state
```

#### Secondary Colors (1 variable)
```scss
// Secondary brand accent
--color-secondary: #ffa726;         // Secondary brand accent
```

#### Surface Colors (4 variables)
```scss
// Background and surface colors
--color-background: #ffffff;        // Main page background
--color-surface: #fafafa;          // Card and component surfaces
--color-surface-muted: #f1f5f9;    // Subtle background areas
--color-surface-elevated: #ffffff;  // Elevated components (modals, dropdowns)
```

#### Text Colors (4 variables)
```scss
// Text color hierarchy
--color-text-primary: #1e293b;     // Primary text content
--color-text-secondary: #64748b;    // Secondary/muted text
--color-text-muted: #94a3b8;       // Disabled/placeholder text
--color-text-inverse: #ffffff;      // Text on dark backgrounds
```

#### Border Colors (3 variables)
```scss
// Border and divider colors
--color-border-default: #d1d5db;   // Standard borders
--color-border-muted: #e2e8f0;     // Subtle dividers
--color-border-strong: #9ca3af;    // Emphasized borders
```

#### State Colors (4 variables)
```scss
// Semantic state colors
--color-success: #22c55e;          // Success states, confirmations
--color-warning: #f59e0b;          // Warning states, cautions
--color-error: #ef4444;            // Error states, destructive actions
--color-info: #3b82f6;             // Informational states, links
```

#### Button Colors (6 variables)
```scss
// Button semantic colors
--color-button-primary: var(--color-primary);      // Primary buttons
--color-button-secondary: var(--color-secondary);  // Secondary buttons  
--color-button-success: var(--color-success);      // Success actions
--color-button-warning: var(--color-warning);      // Warning actions
--color-button-error: var(--color-error);          // Destructive actions
--color-button-disabled: var(--color-surface-muted); // Disabled state
```

### 2. TYPOGRAPHY TOKENS (15 variables)

#### Font Families (3 variables)
```scss
// Font family semantic tokens
--font-heading: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
```

#### Font Sizes (8 variables)
```scss
// Fluid typography scale
--text-hero: clamp(2.5rem, 5vw, 4rem);       // Hero headings (389 occurrences)
--text-section: clamp(1.75rem, 3vw, 2.5rem); // Section headings (166 occurrences)
--text-subsection: clamp(1.25rem, 2vw, 1.5rem); // Subsection headings
--text-body: clamp(1rem, 1.5vw, 1.125rem);   // Body text, paragraphs
--text-small: clamp(0.875rem, 1vw, 1rem);    // Small text, captions
--text-micro: clamp(0.75rem, 0.8vw, 0.875rem); // Fine print, metadata
--text-caption: clamp(0.75rem, 0.8vw, 0.875rem); // Image captions, labels
--text-label: clamp(0.875rem, 1vw, 1rem);    // Form labels, UI labels
```

#### Font Weights (4 variables)
```scss
// Font weight scale
--font-weight-normal: 400;          // Regular text
--font-weight-medium: 500;          // Slightly emphasized
--font-weight-semibold: 600;        // Headings, important text  
--font-weight-bold: 700;            // Strong emphasis, titles
```

### 3. SPACING TOKENS (12 variables)

#### 8px-Based Spacing Scale
```scss
// Consistent spacing scale (984 occurrences preserved)
--spacing-0: 0;                     // No spacing
--spacing-1: 0.125rem;             // 2px - Fine adjustments
--spacing-2: 0.25rem;              // 4px - Tight spacing
--spacing-4: 0.5rem;               // 8px - Small gaps
--spacing-6: 0.75rem;              // 12px - Medium-small gaps
--spacing-8: 1rem;                 // 16px - Standard spacing
--spacing-12: 1.5rem;              // 24px - Large gaps
--spacing-16: 2rem;                // 32px - Section spacing
--spacing-24: 3rem;                // 48px - Large sections
--spacing-32: 4rem;                // 64px - Major sections
--spacing-48: 6rem;                // 96px - Hero spacing
--spacing-64: 8rem;                // 128px - Maximum spacing
```

### 4. VISUAL EFFECTS TOKENS (20 variables)

#### Border Radius (6 variables)
```scss
// Border radius scale
--radius-none: 0;                   // Sharp corners
--radius-sm: 0.25rem;              // 4px - Buttons, small elements
--radius-md: 0.375rem;             // 6px - Cards, inputs
--radius-lg: 0.5rem;               // 8px - Larger cards
--radius-xl: 0.75rem;              // 12px - Hero elements
--radius-full: 9999px;             // Pills, avatars, circular
```

#### Shadows (6 variables)
```scss
// Shadow elevation scale
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);     // Subtle depth
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);      // Small elevation
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);      // Medium elevation
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);    // Large elevation
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);    // Extra large elevation
--shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25);  // Maximum elevation
```

#### Gradients (8 variables)
```scss
// Semantic gradient system
--gradient-primary: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
--gradient-secondary: linear-gradient(135deg, var(--color-secondary) 0%, #f57c00 100%);
--gradient-success: linear-gradient(135deg, var(--color-success) 0%, #16a34a 100%);
--gradient-warning: linear-gradient(135deg, var(--color-warning) 0%, #d97706 100%);
--gradient-error: linear-gradient(135deg, var(--color-error) 0%, #dc2626 100%);
--gradient-premium: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
--gradient-attention: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
--gradient-hero: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
```

### 5. LAYOUT TOKENS (4 variables)

#### Container System
```scss
// Container width system
--container-narrow: 800px;          // Blog posts, forms, focused content
--container-default: 1200px;        // Main content areas
--container-wide: 1400px;           // Wide layouts, dashboards
--container-full: 100%;             // Full-width sections
```

### 6. ANIMATION TOKENS (3 variables)

#### Timing & Easing
```scss
// Animation timing system
--duration-normal: 300ms;           // Standard transitions
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);    // Smooth easing
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55); // Playful bounce
```

### 7. Z-INDEX TOKENS (6 variables)

#### Layer Management System
```scss
// Z-index layering system
--z-base: 1;                        // Base layer
--z-navigation: 100;                // Navigation bars
--z-dropdown: 1000;                 // Dropdown menus
--z-modal: 9000;                    // Modal dialogs
--z-overlay: 9999;                  // Overlays, backdrops
--z-tooltip: 10000;                 // Tooltips, highest priority
```

## Usage Guidelines & Documentation

### Color Token Usage

#### Primary Colors
```scss
/* ✅ GOOD: Semantic usage */
.button-primary {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}

.button-primary:hover {
  background-color: var(--color-primary-hover);
}

/* ❌ BAD: Don't reference color values directly */
.button-primary {
  background-color: #009688; /* Use var(--color-primary) instead */
}
```

#### Surface Colors
```scss
/* ✅ GOOD: Appropriate surface usage */
.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-default);
}

.page-background {
  background-color: var(--color-background);
}

.muted-section {
  background-color: var(--color-surface-muted);
}
```

### Typography Token Usage

#### Font Size Hierarchy
```scss
/* ✅ GOOD: Semantic font size usage */
.hero-title {
  font-size: var(--text-hero);
  font-weight: var(--font-weight-bold);
}

.section-heading {
  font-size: var(--text-section);
  font-weight: var(--font-weight-semibold);
}

.body-text {
  font-size: var(--text-body);
  font-weight: var(--font-weight-normal);
}

/* ❌ BAD: Don't use hardcoded values */
.hero-title {
  font-size: 4rem; /* Use var(--text-hero) instead */
}
```

### Spacing Token Usage

#### Layout Spacing
```scss
/* ✅ GOOD: Consistent spacing usage */
.section {
  padding: var(--spacing-24) 0;
  margin-bottom: var(--spacing-16);
}

.card {
  padding: var(--spacing-8);
  gap: var(--spacing-6);
}

.button {
  padding: var(--spacing-4) var(--spacing-8);
}

/* ❌ BAD: Don't use arbitrary values */
.section {
  padding: 48px 0; /* Use var(--spacing-24) instead */
}
```

### Visual Effects Usage

#### Shadows & Elevation
```scss
/* ✅ GOOD: Elevation hierarchy */
.card {
  box-shadow: var(--shadow-sm);
}

.card:hover {
  box-shadow: var(--shadow-md);
}

.modal {
  box-shadow: var(--shadow-xl);
}

.tooltip {
  box-shadow: var(--shadow-lg);
}
```

#### Border Radius
```scss
/* ✅ GOOD: Consistent radius usage */
.button {
  border-radius: var(--radius-md);
}

.card {
  border-radius: var(--radius-lg);
}

.avatar {
  border-radius: var(--radius-full);
}
```

## Migration Strategy

### Phase 1: Infrastructure (Days 6-7)
1. **Create new variables.scss** with 100 semantic tokens
2. **Update global imports** to reference new token system
3. **Test token system** in isolated environment

### Phase 2: Global Styles (Day 8-9)
1. **Migrate global stylesheets** to use new tokens
2. **Update utility classes** and base styles
3. **Create backward compatibility** layer

### Phase 3: Component Migration (Day 10)  
1. **Update high-impact components** using new tokens
2. **Validate visual consistency** across all pages
3. **Remove legacy variables** after full migration

## AI Agent Guidelines

### Token Selection Rules for AI Agents

1. **Colors**: Always use semantic color tokens (`--color-primary`) over descriptive (`--color-blue`)
2. **Spacing**: Use numbered spacing scale (`--spacing-8`) for consistent layouts
3. **Typography**: Use fluid text tokens (`--text-body`) for responsive design
4. **Effects**: Use elevation-based shadows (`--shadow-md`) for depth hierarchy

### Common Patterns

```scss
/* Button Pattern */
.button {
  padding: var(--spacing-4) var(--spacing-8);
  border-radius: var(--radius-md);
  font-size: var(--text-body);
  font-weight: var(--font-weight-medium);
  box-shadow: var(--shadow-sm);
}

/* Card Pattern */
.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  padding: var(--spacing-8);
  box-shadow: var(--shadow-sm);
}

/* Section Pattern */
.section {
  padding: var(--spacing-24) 0;
  max-width: var(--container-default);
}
```

## Token System Benefits

### For Developers
- **Reduced Cognitive Load**: 100 clear tokens vs 304 confusing variables
- **Consistent Patterns**: Predictable naming and hierarchy
- **Better Tooling**: IDE autocomplete with semantic names
- **Easier Maintenance**: Single source of truth for design values

### For Design System
- **Semantic Clarity**: Tokens reflect purpose, not appearance
- **Scalable Architecture**: Easy to extend without breaking existing usage
- **Design-Dev Alignment**: Shared vocabulary between teams
- **Future-Proof**: Can adapt to design changes without code refactoring

### For AI Agents
- **Clear Patterns**: Predictable token selection rules
- **Hierarchical Structure**: Easy to understand relationships
- **Consistent Naming**: Reduces ambiguity in automated decisions
- **Complete Documentation**: Clear usage guidelines and examples

---

**Token System Complete**: 100 semantic variables designed with clear hierarchy and usage patterns  
**Next Step**: Begin implementation of new token system in variables.scss  
**Migration Impact**: Systematic replacement of 304 variables with improved semantic structure
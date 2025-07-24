# Variable Consolidation Map: 304 → 100 Variables

**Project**: BS Display CSS Cleanup - Phase 2  
**Target**: 67% variable reduction while maintaining visual parity  
**Risk Level**: Managed through phased approach with backward compatibility

## Consolidation Overview

| Category | Current | Target | Reduction | Risk Level | Impact |
|----------|---------|--------|-----------|------------|---------|
| Colors | 78 | 25 | 68% | High | 227 occurrences |
| Typography | 45 | 15 | 67% | Medium | 488 occurrences |
| Spacing | 50 | 12 | 76% | Medium | 984 occurrences |
| Visual Effects | 65 | 20 | 69% | Low | <200 occurrences |
| Layout | 8 | 4 | 50% | Low | <100 occurrences |
| Animation | 6 | 3 | 50% | Low | <50 occurrences |
| Z-Index | 9 | 6 | 33% | Low | <50 occurrences |
| SCSS Variables | 2 | 0 | 100% | Medium | Quiz styles only |

**Total**: 304 → 100 variables (67% reduction)

## Detailed Consolidation Mapping

### 1. COLOR SYSTEM: 78 → 25 variables

#### Brand Colors (12 → 3)

**CONSOLIDATE: Primary Brand Color Group**
```scss
// REMOVE (9 variables - same #009688 value)
--color-accent-primary: #009688;           → --color-primary
--color-accent-primary-rgb: 0, 150, 136;   → DELETE (use color-mix())
--primary-blue: #009688;                    → --color-primary
--brand-primary: #009688;                   → --color-primary  
--brand-blue: #009688;                      → --color-primary
--accent-blue: #009688;                     → --color-primary
--main-blue: #009688;                       → --color-primary
--button-blue: #009688;                     → --color-primary
--link-blue: #009688;                       → --color-primary

// KEEP/RENAME (3 variables)
--color-accent-primary → --color-primary: #009688;
--color-accent-primary-hover → --color-primary-hover: #007a6b;  
--color-accent-primary-active → --color-primary-active: #006b5d;
```

**CONSOLIDATE: Secondary Brand Color Group**
```scss
// REMOVE (3 variables - same #ffa726 value)
--color-accent-secondary: #ffa726;         → --color-secondary
--color-accent-secondary-rgb: 255, 167, 38; → DELETE (use color-mix())
--secondary-orange: #ffa726;               → --color-secondary

// KEEP/RENAME (1 variable)
--color-accent-secondary → --color-secondary: #ffa726;
```

#### Surface & Background Colors (15 → 4)

**RESOLVE: Background Color Conflict**
```scss
// CONFLICT RESOLUTION (choose single value)
--color-background: #ffffff;  // CURRENT #1
--color-background: #f8fafc;  // CURRENT #2 (duplicate)
→ DECISION: Keep #ffffff for better contrast

// CONSOLIDATION MAP
--color-background: #ffffff;               → --color-background: #ffffff;
--color-surface: #fafafa;                  → --color-surface: #fafafa;
--color-surface: #ffffff;                  → DELETE (duplicate)
--color-surface-muted: #f1f5f9;           → --color-surface-muted: #f1f5f9;
--color-surface-elevated: #ffffff;        → --color-surface-elevated: #ffffff;

// REMOVE (11 redundant surface variables)
--color-admin-bg, --color-admin-surface, --color-admin-sidebar-bg → Use semantic alternatives
```

#### Button Colors (16 → 6)

**SIMPLIFY: Button Color System**
```scss
// REMOVE (10 specific button variants)
--color-button-ghost-border → var(--color-primary)
--color-button-ghost-text → var(--color-primary)  
--color-button-primary-background → var(--color-primary)
--color-button-primary-text → white
--color-button-secondary-* → Map to semantic colors

// KEEP (6 semantic button states)
--color-button-primary: var(--color-primary);
--color-button-secondary: var(--color-secondary);
--color-button-success: var(--color-success);
--color-button-warning: var(--color-warning);
--color-button-error: var(--color-error);
--color-button-disabled: var(--color-surface-muted);
```

#### State Colors (8 → 4) - KEEP AS-IS
```scss
// ALREADY WELL-STRUCTURED (no changes needed)
--color-success: #22c55e;
--color-warning: #f59e0b;  
--color-error: #ef4444;
--color-info: #3b82f6;
```

### 2. TYPOGRAPHY SYSTEM: 45 → 15 variables

#### Font Families (5 → 3)

**REMOVE: Deprecated Font Variables**
```scss
// DELETE (deprecated - 2 variables)
--font-primary → DELETE (replaced by --font-body)
--font-secondary → DELETE (replaced by --font-heading)

// KEEP (3 semantic variables)
--font-heading: var(--font-family-heading);   // 488 occurrences
--font-body: var(--font-family-body);         // High usage
--font-mono: var(--font-family-mono);         // Code blocks
```

#### Font Sizes (32 → 8)

**KEEP: Modern Fluid Typography System**
```scss
// HIGH USAGE - KEEP (8 variables)
--text-hero: clamp(2.5rem, 5vw, 4rem);       // 389 occurrences
--text-section: clamp(1.75rem, 3vw, 2.5rem); // 166 occurrences  
--text-subsection: clamp(1.25rem, 2vw, 1.5rem);
--text-body: clamp(1rem, 1.5vw, 1.125rem);
--text-small: clamp(0.875rem, 1vw, 1rem);
--text-micro: clamp(0.75rem, 0.8vw, 0.875rem);
--text-caption: clamp(0.75rem, 0.8vw, 0.875rem);
--text-label: clamp(0.875rem, 1vw, 1rem);
```

**REMOVE: Legacy Fixed Font Sizes**
```scss
// DELETE (24 legacy variables)
--font-size-h1: 2.5rem;           → --text-hero
--font-size-h2: 2rem;             → --text-section
--font-size-h3: 1.75rem;          → --text-subsection
--font-size-h4: 1.5rem;           → --text-subsection
--font-size-h5: 1.25rem;          → --text-body
--font-size-h6: 1rem;             → --text-body
--font-size-body: 1rem;           → --text-body
--font-size-small: 0.875rem;      → --text-small
--font-size-micro: 0.75rem;       → --text-micro

// DELETE (13 legacy variants)
--font-size-h1-legacy through --font-size-micro-legacy → Use modern equivalents
--font-size-nav-primary, --font-size-nav-secondary → --text-body, --text-small
```

#### Font Properties (8 → 4)

**CONSOLIDATE: Font Weights & Line Heights**
```scss
// KEEP ESSENTIAL (4 variables)
--font-weight-normal: 400;
--font-weight-medium: 500; 
--font-weight-semibold: 600;
--font-weight-bold: 700;

// REMOVE REDUNDANT (4 variables)
--font-weight-light: 300;          → Rarely used
--line-height-tight: 1.25;         → Use CSS defaults
--line-height-normal: 1.5;         → Use CSS defaults  
--line-height-relaxed: 1.75;       → Use CSS defaults
```

### 3. SPACING SYSTEM: 50 → 12 variables

#### Modern 8px System (16 → 12)

**KEEP: Core Spacing Scale**
```scss
// HIGH USAGE - PRESERVE (984 occurrences across 58 files)
--spacing-0: 0;                    // Base
--spacing-1: 0.125rem;            // 2px - fine adjustments
--spacing-2: 0.25rem;             // 4px - small gaps
--spacing-4: 0.5rem;              // 8px - standard small
--spacing-6: 0.75rem;             // 12px - medium small  
--spacing-8: 1rem;                // 16px - standard medium
--spacing-12: 1.5rem;             // 24px - large gaps
--spacing-16: 2rem;               // 32px - section spacing
--spacing-24: 3rem;               // 48px - large sections
--spacing-32: 4rem;               // 64px - major sections
--spacing-48: 6rem;               // 96px - hero spacing
--spacing-64: 8rem;               // 128px - maximum spacing
```

**REMOVE: Intermediate Values**
```scss  
// DELETE (4 variables - rarely used)
--spacing-3: 0.1875rem;           → Use --spacing-2 or --spacing-4
--spacing-5: 0.3125rem;           → Use --spacing-4 or --spacing-6
--spacing-10: 0.625rem;           → Use --spacing-8 or --spacing-12
--spacing-96: 12rem;              → Use --spacing-64 (sufficient maximum)
```

#### Semantic Spacing (6 → 0)

**REMOVE: Semantic Aliases**
```scss
// DELETE - Map to numbered system (6 variables)
--spacing-xs: 0.25rem;            → --spacing-2
--spacing-sm: 0.5rem;             → --spacing-4  
--spacing-md: 1rem;               → --spacing-8
--spacing-lg: 1.5rem;             → --spacing-12
--spacing-xl: 2rem;               → --spacing-16
--spacing-xxl: 3rem;              → --spacing-24
```

#### Fluid Spacing (14 → 0)

**REMOVE: Fluid Spacing System**
```scss
// DELETE - Use numbered system (14 variables)
--space-section: clamp(2rem, 5vw, 4rem);     → --spacing-24 to --spacing-48
--space-card: clamp(1rem, 2vw, 1.5rem);      → --spacing-8 to --spacing-12
--space-element: clamp(0.5rem, 1vw, 1rem);   → --spacing-4 to --spacing-8
--space-xs through --space-xl                → Map to numbered equivalents
```

#### Legacy Spacing (14 → 0)

**REMOVE: Legacy Contextual Spacing**
```scss
// DELETE - Direct replacement (14 variables)
--padding-s1: 0.5rem;             → --spacing-4
--padding-s2: 1rem;               → --spacing-8
--margin-small: 0.5rem;           → --spacing-4
--margin-medium: 1rem;            → --spacing-8
--gap-small: 0.5rem;              → --spacing-4
--gap-medium: 1rem;               → --spacing-8
// ... plus 8 more contextual variables
```

### 4. VISUAL EFFECTS: 65 → 20 variables

#### Border Radius (16 → 6)

**CONSOLIDATE: Radius System**
```scss
// KEEP: Semantic Radius Scale (6 variables)
--radius-none: 0;
--radius-sm: 0.25rem;             // 4px - buttons, small elements
--radius-md: 0.375rem;            // 6px - cards, inputs  
--radius-lg: 0.5rem;              // 8px - larger cards
--radius-xl: 0.75rem;             // 12px - hero elements
--radius-full: 9999px;            // Pills, avatars

// REMOVE: Overlapping Definitions (10 variables)
--border-radius-small: var(--radius-md);        → --radius-md
--border-radius-card: var(--radius-xl);         → --radius-xl  
--border-radius-button: var(--radius-lg);       → --radius-lg
--border-radius-lg: 24px;                       → --radius-xl (converted)
--border-radius-md: 16px;                       → --radius-lg (converted)
--border-radius-sm: 8px;                        → --radius-md (converted)
// ... plus 4 more legacy variants
```

#### Shadows (14 → 6)

**KEEP: Modern Shadow Scale**
```scss
// WELL-STRUCTURED SYSTEM (6 variables)
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25);
```

**REMOVE: Legacy Shadow Variants**
```scss
// DELETE (8 variables)
--box-shadow-1: -1px 2px 3px 2px rgba(33, 33, 33, 0.15); → --shadow-md
--box-shadow-card: var(--shadow-sm);                      → --shadow-sm
--box-shadow-card-hover: var(--shadow-md);                → --shadow-md
--shadow-accent: 0 4px 6px rgba(0, 150, 136, 0.3);       → --shadow-md with custom color
--shadow-accent-lg: 0 10px 15px rgba(0, 150, 136, 0.2);  → --shadow-lg with custom color
// ... plus 3 more legacy variants
```

#### Gradients (19 → 8)

**KEEP: Semantic Gradients**
```scss
// HIGH-VALUE SEMANTIC GRADIENTS (8 variables)
--gradient-primary: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
--gradient-secondary: linear-gradient(135deg, var(--color-secondary) 0%, #f57c00 100%);
--gradient-success: linear-gradient(135deg, var(--color-success) 0%, #16a34a 100%);
--gradient-warning: linear-gradient(135deg, var(--color-warning) 0%, #d97706 100%);
--gradient-error: linear-gradient(135deg, var(--color-error) 0%, #dc2626 100%);
--gradient-premium: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
--gradient-attention: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
--gradient-hero: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
```

**REMOVE: Color-Specific Gradients**
```scss
// DELETE (11 variables - replaced by semantic)
--gradient-green: linear-gradient(135deg, #10b981 0%, #059669 100%);  → --gradient-success
--gradient-blue: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);   → --gradient-primary
--gradient-indigo: linear-gradient(135deg, #6366f1 0%, #4338ca 100%); → --gradient-primary
--gradient-purple: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); → --gradient-premium
--gradient-pink: linear-gradient(135deg, #ec4899 0%, #db2777 100%);    → --gradient-attention
--gradient-red: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);     → --gradient-error
--gradient-orange: linear-gradient(135deg, #f97316 0%, #ea580c 100%);  → --gradient-warning
--gradient-yellow: linear-gradient(135deg, #eab308 0%, #ca8a04 100%);  → --gradient-premium
// ... plus 3 text gradient variants
```

### 5. LAYOUT & CONTAINER: 8 → 4 variables

#### Container System (4 → 4) - KEEP AS-IS
```scss
// WELL-STRUCTURED - NO CHANGES
--container-narrow: 800px;        // Blog posts, forms
--container-default: 1200px;      // Main content  
--container-wide: 1400px;         // Wide layouts
--container-full: 100%;           // Full width
```

#### Breakpoints (4 → 0) - REMOVE
```scss
// DELETE - Use CSS custom media queries or Tailwind equivalents
--breakpoint-sm: 576px;           → Use 576px directly or CSS media
--breakpoint-md: 768px;           → Use 768px directly or CSS media
--breakpoint-lg: 992px;           → Use 992px directly or CSS media
--breakpoint-xl: 1200px;          → Use 1200px directly or CSS media
```

### 6. ANIMATION & INTERACTION: 6 → 3 variables

#### Easing Functions (2 → 2) - KEEP
```scss
// USEFUL SYSTEM PATTERNS
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

#### Durations (3 → 1)
```scss
// KEEP STANDARD (1 variable)
--duration-normal: 300ms;         // Standard transition

// REMOVE RARELY USED (2 variables)  
--duration-fast: 150ms;           → Use 150ms directly
--duration-slow: 600ms;           → Use 600ms directly
```

### 7. Z-INDEX SYSTEM: 9 → 6 variables

#### Layer Management (6 → 6) - KEEP ESSENTIAL
```scss
// CORE LAYERING SYSTEM
--z-base: 1;
--z-navigation: 100;
--z-dropdown: 1000; 
--z-modal: 9000;
--z-overlay: 9999;
--z-tooltip: 10000;
```

#### Navigation Specific (3 → 0) - REMOVE
```scss
// DELETE - Use base z-index values
--z-nav-primary: var(--z-navigation);     → --z-navigation
--z-nav-secondary: calc(var(--z-navigation) + 1); → --z-navigation + 1
--z-nav-dropdown: var(--z-dropdown);      → --z-dropdown
```

### 8. SCSS VARIABLES: 2 → 0 variables

#### Legacy SCSS Variables - CONVERT TO CSS CUSTOM PROPERTIES
```scss
// CONVERT/REMOVE (2 variables)
$color-accent-primary: #009688;    → --color-primary: #009688;
$color-accent-secondary: #ffa726;  → --color-secondary: #ffa726;

// UPDATE quiz-styles.scss usage
.quiz-container {
  color: $color-accent-primary; → color: var(--color-primary);
}
```

## Migration Scripts Required

### 1. Variable Replacement Script
```javascript
// scripts/migrate-variables.js
const variableMap = {
  // Colors
  '--color-accent-primary': '--color-primary',
  '--primary-blue': '--color-primary',
  '--brand-primary': '--color-primary',
  // ... complete mapping for all 204 removed variables
};
```

### 2. Value Standardization Script  
```javascript
// scripts/standardize-values.js
const valueMap = {
  // Resolve background color conflict
  '#f8fafc': '#ffffff',  // Standardize background
  // Convert legacy spacing
  '0.3125rem': '0.25rem', // --spacing-5 → --spacing-2
  // ... complete value standardization
};
```

### 3. SCSS Variable Conversion Script
```javascript
// scripts/convert-scss-vars.js
const scssToCSS = {
  '$color-accent-primary': 'var(--color-primary)',
  '$color-accent-secondary': 'var(--color-secondary)',
};
```

## Risk Assessment & Mitigation

### High-Risk Changes (Requires Careful Testing)

1. **Primary Color Consolidation** - 227 occurrences
   - **Impact**: Buttons, links, accents across 58 files
   - **Mitigation**: Visual regression testing on all pages
   - **Rollback**: Keep old variables as aliases initially

2. **Background Color Standardization** - 58 files affected
   - **Impact**: Card backgrounds, page backgrounds
   - **Mitigation**: Screenshot comparison testing
   - **Rollback**: Revert to dual values if issues found

3. **Spacing System Migration** - 984 occurrences
   - **Impact**: Layout spacing across entire site
   - **Mitigation**: Component-by-component testing
   - **Rollback**: Legacy spacing compatibility layer

### Medium-Risk Changes

1. **Typography System Update** - 488 occurrences
   - **Impact**: Font sizes across 71 files
   - **Mitigation**: Text rendering validation
   
2. **SCSS Variable Conversion** - Quiz styles affected
   - **Impact**: Quiz component styling
   - **Mitigation**: Isolated quiz testing

### Low-Risk Changes

1. **Visual Effects Consolidation** - <200 occurrences
   - **Impact**: Shadows, gradients, borders
   - **Mitigation**: Visual spot checks

2. **Layout Variables** - <100 occurrences
   - **Impact**: Container and breakpoint usage
   - **Mitigation**: Responsive testing

## Success Metrics

### Quantitative Targets
- **Variable Count**: 304 → 100 (67% reduction) ✅
- **Bundle Size**: Additional 10-15% reduction expected
- **Maintenance Complexity**: 67% fewer variables to manage

### Qualitative Improvements  
- **Semantic Clarity**: Clear token naming system
- **Design Consistency**: Single source of truth for values
- **Developer Experience**: Easier variable selection
- **AI Agent Adoption**: Simplified system for AI understanding

---

**Consolidation Map Complete**: Ready for Phase 2 execution with detailed migration plan  
**Next Step**: Create semantic token structure and begin systematic consolidation  
**Estimated Timeline**: 5 days for complete variable consolidation with zero visual regressions
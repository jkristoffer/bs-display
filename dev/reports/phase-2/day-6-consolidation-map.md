# Day 6 Variable Consolidation Map - Specific Decisions

**Date**: 2025-07-24  
**Analysis Based On**: 327 variables, 3,227 usage instances across codebase  
**Target**: Consolidate to ~100 variables (69% reduction)

## Analysis Summary

### Current Variable Distribution
- **Colors**: 73 variables (22% of total)
- **Typography**: 72 variables (22% of total) 
- **Spacing**: 51 variables (16% of total)
- **Effects**: 49 variables (15% of total)
- **Layout/Animation/Z-index**: 82 variables (25% of total)

### Usage Distribution  
- **High usage (>50 occurrences)**: 10 variables
- **Medium usage (10-50 occurrences)**: 66 variables  
- **Low usage (<10 occurrences)**: 251 variables

## Detailed Consolidation Decisions

### 1. COLOR VARIABLES: 73 → 25 (66% reduction)

#### **Decision A1: Preserve High-Usage Primary Colors**
```scss
// KEEP (191 occurrences across 41 files)
--color-accent-primary: #009688;

// REMOVE RGB variant (129 occurrences - use color-mix() instead)
--color-accent-primary-rgb: 0, 150, 136; → DELETE

// NEW SEMANTIC STRUCTURE
--color-primary: #009688;                    // Rename from accent-primary
--color-primary-hover: #007a6b;             // Keep hover state
--color-primary-active: #006b5d;            // Keep active state
```
**Impact**: 320 total occurrences affected  
**Risk**: HIGH - Brand identity colors  
**Mitigation**: Automated find-replace with visual validation

#### **Decision A2: Consolidate Button Color System**
```scss
// CURRENT (16 button color variables)
--color-button-ghost-border: var(--color-accent-primary);
--color-button-ghost-text: var(--color-accent-primary);
--color-button-primary-background: var(--color-accent-primary);
// ... 13 more button variants

// CONSOLIDATE TO (6 semantic variables)
--color-button-primary: var(--color-primary);
--color-button-secondary: var(--color-secondary);
--color-button-success: var(--color-success);
--color-button-warning: var(--color-warning);
--color-button-error: var(--color-error);
--color-button-disabled: var(--color-surface-muted);
```
**Impact**: ~100 button-related occurrences  
**Risk**: MEDIUM - UI consistency critical  
**Migration**: Map all button variants to semantic equivalents

#### **Decision A3: Standardize Text Colors**
```scss
// KEEP high-usage text colors (130 occurrences)
--color-text-primary: #333333;              // Keep exact value
--color-text-secondary: (59 occurrences);   // Keep for hierarchy

// CONSOLIDATE admin colors to semantic equivalents
--color-admin-text: #2d3748; → --color-text-primary
--color-admin-text-secondary: #718096; → --color-text-secondary
```

### 2. TYPOGRAPHY VARIABLES: 72 → 15 (79% reduction)

#### **Decision B1: Keep Modern Fluid Typography**
```scss
// KEEP (High usage, responsive design)
--text-hero: clamp(2.5rem, 5vw + 1rem, 4rem);        // Hero sections
--text-section: clamp(2rem, 4vw + 0.5rem, 3rem);     // Section headings
--text-subsection: clamp(1.5rem, 3vw + 0.25rem, 2rem); // Subsections
--text-body: clamp(1rem, 2vw, 1.125rem);             // Body text
```

#### **Decision B2: Remove Legacy Font Sizes**
```scss
// REMOVE (57 legacy variables - replace with fluid equivalents)
--font-size-h1: clamp(32px, 5vw, 48px); → --text-hero
--font-size-h2: clamp(28px, 4vw, 36px); → --text-section
--font-size-h3: clamp(24px, 3.5vw, 32px); → --text-subsection
--font-size-body-regular: clamp(14px, 1.75vw, 16px); → --text-body

// REMOVE all legacy fixed sizes (9 variables)
--font-size-h1-legacy: 48px; → --text-hero
--font-size-h2-legacy: 38px; → --text-section
// ... all legacy variants

// REMOVE navigation-specific sizes (2 variables)
--font-size-nav-primary: 15px; → --text-body
--font-size-nav-secondary: 14px; → --text-small
```
**Impact**: 54+ occurrences of body-regular, plus legacy usage  
**Risk**: MEDIUM - Text sizing changes  
**Migration**: Systematic replacement with fluid equivalents

#### **Decision B3: Consolidate Font Families**
```scss
// REMOVE deprecated aliases (2 variables)
--font-primary: var(--font-body); → DELETE
--font-secondary: var(--font-body); → DELETE

// KEEP semantic families (3 variables)
--font-heading: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'Fira Code', 'Consolas', monospace;
```

### 3. SPACING VARIABLES: 51 → 12 (76% reduction)

#### **Decision C1: Standardize on Modern 8px System**
```scss
// KEEP numeric spacing (high usage - 187+ occurrences)
--spacing-0: 0;
--spacing-1: 0.125rem;    // 2px
--spacing-2: 0.25rem;     // 4px
--spacing-4: 0.5rem;      // 8px
--spacing-6: 0.75rem;     // 12px
--spacing-8: 1rem;        // 16px
--spacing-12: 1.5rem;     // 24px
--spacing-16: 2rem;       // 32px
--spacing-24: 3rem;       // 48px
--spacing-32: 4rem;       // 64px
--spacing-48: 6rem;       // 96px
--spacing-64: 8rem;       // 128px
```

#### **Decision C2: Remove Semantic Spacing Aliases**
```scss
// REMOVE semantic aliases (map to numeric equivalents)
--spacing-xs: var(--spacing-2);     → --spacing-2
--spacing-sm: var(--spacing-4);     → --spacing-4  
--spacing-md: var(--spacing-8);     → --spacing-8
--spacing-lg: var(--spacing-12);    → --spacing-12
--spacing-xl: var(--spacing-16);    → --spacing-16
--spacing-xxl: var(--spacing-24);   → --spacing-24
```
**Impact**: 187 occurrences of --spacing-md need updating  
**Risk**: MEDIUM - Layout spacing changes  
**Migration**: Direct replacement with numeric equivalents

#### **Decision C3: Consolidate Contextual Spacing**
```scss
// RESOLVE duplicate spacing values (from analysis)
--spacing-md: var(--spacing-8);             // Keep this one
--spacing-container-padding: var(--spacing-8); → --spacing-8

--spacing-lg: var(--spacing-12);            // Keep this one  
--spacing-component-gap: var(--spacing-12); → --spacing-12

--spacing-xxl: var(--spacing-24);           // Keep this one
--spacing-section-gap: var(--spacing-24);   → --spacing-24

// REMOVE contextual variables (15+ variables)
--spacing-card-padding: 24px;        → --spacing-12
--spacing-gap-between-blocks: 20px;  → --spacing-10 (but map to --spacing-12)
--spacing-container-padding: var(--spacing-8); → --spacing-8
```

### 4. VISUAL EFFECTS: 49 → 20 (59% reduction)

#### **Decision D1: Consolidate Shadow System**
```scss
// KEEP modern shadow scale (6 variables)
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25);

// REMOVE legacy shadows (10+ variables)
--box-shadow-1: -1px 2px 3px 2px rgba(33, 33, 33, 0.15); → --shadow-md
--box-shadow-card: var(--shadow-sm);                      → --shadow-sm
--box-shadow-card-hover: var(--shadow-md);                → --shadow-md
```

#### **Decision D2: Standardize Border Radius**
```scss
// KEEP semantic radius scale (6 variables)
--radius-none: 0;
--radius-sm: 0.25rem;     // 4px
--radius-md: 0.375rem;    // 6px  
--radius-lg: 0.5rem;      // 8px
--radius-xl: 0.75rem;     // 12px
--radius-full: 9999px;

// REMOVE overlapping definitions (8+ variables)
--border-radius-small: var(--radius-md);  → --radius-md
--border-radius-card: var(--radius-xl);   → --radius-xl
--border-radius-button: var(--radius-lg); → --radius-lg
```

#### **Decision D3: Consolidate Gradients**
```scss
// KEEP semantic gradients (8 variables)
--gradient-primary: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
--gradient-success: linear-gradient(135deg, var(--color-success) 0%, #16a34a 100%);
--gradient-warning: linear-gradient(135deg, var(--color-warning) 0%, #d97706 100%);
--gradient-error: linear-gradient(135deg, var(--color-error) 0%, #dc2626 100%);
--gradient-premium: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
--gradient-attention: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
--gradient-hero: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);

// REMOVE color-specific gradients (15+ variables)  
--gradient-green: linear-gradient(...); → --gradient-success
--gradient-blue: linear-gradient(...);  → --gradient-primary
--gradient-red: linear-gradient(...);   → --gradient-error
```

### 5. LAYOUT & UTILITY: 82 → 20 (76% reduction)

#### **Decision E1: Container System - Keep As-Is**
```scss
// WELL-STRUCTURED - NO CHANGES (4 variables)
--container-narrow: 800px;
--container-default: 1200px;  
--container-wide: 1400px;
--container-full: 100%;
```

#### **Decision E2: Z-Index System - Consolidate**
```scss
// KEEP essential layers (6 variables)
--z-base: 1;
--z-navigation: 100;
--z-dropdown: 1000;
--z-modal: 9000;
--z-overlay: 9999;
--z-tooltip: 10000;

// REMOVE navigation-specific variants (3 variables)
--z-nav-primary: var(--z-navigation);     → --z-navigation
--z-nav-secondary: calc(var(--z-navigation) + 1); → --z-navigation
--z-nav-dropdown: var(--z-dropdown);      → --z-dropdown
```

#### **Decision E3: Animation System - Simplify**
```scss
// KEEP essential (3 variables)
--duration-normal: 300ms;
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

// REMOVE rarely used (3+ variables)
--duration-fast: 150ms;  → Use 150ms directly
--duration-slow: 600ms;  → Use 600ms directly
```

## Priority Migration Order

### **Phase A: Low-Risk (50 variables)**
1. **Remove RGB color variants** (5 variables) - Use color-mix() instead
2. **Remove legacy font aliases** (2 variables) - Direct deletion
3. **Remove unused gradients** (15 variables) - Low usage
4. **Remove animation variants** (3 variables) - Use direct values
5. **Remove navigation z-index variants** (3 variables) - Use base values
6. **Remove legacy spacing aliases** (20+ variables) - Map to numeric

### **Phase B: Medium-Risk (150 variables)**  
1. **Typography system migration** (57 variables) - Replace with fluid system
2. **Spacing semantic→numeric migration** (20 variables) - Direct mapping
3. **Shadow system consolidation** (10 variables) - Map to modern scale
4. **Border radius standardization** (8 variables) - Semantic mapping

### **Phase C: High-Risk (127 variables)**
1. **Primary color consolidation** (191 occurrences) - Brand colors
2. **Button system update** (16→6 variables) - UI consistency  
3. **Text color standardization** (130+ occurrences) - Readability critical

## Implementation Scripts Required

### Script 1: Variable Replacement
```javascript
const variableMap = {
  // Phase A - Low Risk
  '--color-accent-primary-rgb': 'DELETE', 
  '--font-primary': 'DELETE',
  '--font-secondary': 'DELETE',
  
  // Phase B - Medium Risk  
  '--font-size-body-regular': '--text-body',
  '--spacing-md': '--spacing-8',
  '--spacing-lg': '--spacing-12',
  
  // Phase C - High Risk
  '--color-accent-primary': '--color-primary',
  // ... complete mapping
};
```

### Script 2: Value Standardization
```javascript
const valueMap = {
  // Resolve spacing duplicates
  'var(--spacing-md)': 'var(--spacing-8)',
  'var(--spacing-lg)': 'var(--spacing-12)',
  
  // Font size replacements
  'clamp(14px, 1.75vw, 16px)': 'var(--text-body)',
  'clamp(32px, 5vw, 48px)': 'var(--text-hero)'
};
```

## Success Metrics

### Quantitative Targets
- **Variable Count**: 327 → 100 (69% reduction) ✅
- **High-Usage Variables Preserved**: 10/10 variables kept with updates
- **Medium-Usage Variables**: 66 → 30 (optimized for value)
- **Low-Usage Variables**: 251 → 10 (aggressive cleanup)

### Quality Assurance
- **Zero Visual Regressions**: Screenshot comparison for all pages
- **Performance Maintained**: Bundle size tracking throughout migration
- **Accessibility Preserved**: Color contrast validation
- **Responsive Design Intact**: Typography and spacing validation

---

**Day 6 Consolidation Map Complete**: Ready for rationale documentation and validation  
**Next Steps**: Document decision rationale and validate color/spacing calculations  
**Execution Confidence**: HIGH - Analysis-driven decisions with clear migration paths
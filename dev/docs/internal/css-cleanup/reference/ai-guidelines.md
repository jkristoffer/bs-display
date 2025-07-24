# AI Guidelines for CSS Development

**Purpose**: Provide comprehensive CSS best practices and patterns for AI agents working on this codebase

## Core CSS Principles

### 1. Always Use Semantic Tokens
**Rule**: Never use hardcoded values in CSS. Always reference semantic design tokens.

```scss
// ✅ CORRECT - Use semantic tokens
.component {
  color: $color-text-primary;
  background-color: $color-background-light;
  padding: $spacing-md;
  border-radius: $radius-lg;
  font-size: $font-size-md;
  box-shadow: $shadow-sm;
}

// ❌ INCORRECT - No hardcoded values
.component {
  color: #333333;
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

### 2. CSS Modules for All Components
**Rule**: Every React/Astro component must use CSS modules for styling.

```tsx
// ✅ CORRECT - CSS Modules pattern
// ComponentName.tsx
import styles from './ComponentName.module.scss';

export function ComponentName() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Title</h2>
      <p className={styles.content}>Content</p>
    </div>
  );
}
```

```scss
// ComponentName.module.scss
@import '../../styles/variables';

.container {
  background-color: $color-background-light;
  padding: $spacing-lg;
  border-radius: $radius-md;
}

.title {
  color: $color-text-primary;
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  margin-bottom: $spacing-sm;
}

.content {
  color: $color-text-secondary;
  font-size: $font-size-md;
  line-height: 1.5;
}
```

### 3. No Inline Styles
**Rule**: Never use inline styles. All styling must be in CSS modules.

```tsx
// ✅ CORRECT - Use CSS classes
<div className={styles.alertBox}>
  <span className={styles.alertText}>Alert message</span>
</div>

// ❌ INCORRECT - No inline styles
<div style={{ backgroundColor: '#f8d7da', padding: '12px' }}>
  <span style={{ color: '#721c24' }}>Alert message</span>
</div>
```

## Design Token System

### Available Token Categories

#### Colors
```scss
// Primary Brand Colors
$color-primary: #007bff;
$color-primary-light: #66b3ff;
$color-primary-dark: #0056b3;

// Secondary Colors
$color-secondary: #6c757d;

// Status Colors
$color-success: #28a745;
$color-warning: #ffc107;
$color-error: #dc3545;
$color-info: #17a2b8;

// Text Colors
$color-text-primary: #212529;
$color-text-secondary: #6c757d;
$color-text-muted: #868e96;
$color-text-inverse: #ffffff;

// Background Colors
$color-background-primary: #ffffff;
$color-background-secondary: #f8f9fa;
$color-background-light: #f8f9fa;
$color-background-dark: #343a40;

// Border Colors
$color-border-light: #dee2e6;
$color-border-medium: #ced4da;
$color-border-dark: #adb5bd;
```

#### Spacing
```scss
// Spacing Scale (rem-based for accessibility)
$spacing-xs: 0.25rem;   // 4px
$spacing-sm: 0.5rem;    // 8px
$spacing-md: 1rem;      // 16px
$spacing-lg: 1.5rem;    // 24px
$spacing-xl: 2rem;      // 32px
$spacing-2xl: 3rem;     // 48px
```

#### Typography
```scss
// Font Sizes
$font-size-xs: 0.75rem;   // 12px
$font-size-sm: 0.875rem;  // 14px
$font-size-md: 1rem;      // 16px (base)
$font-size-lg: 1.125rem;  // 18px
$font-size-xl: 1.25rem;   // 20px

// Font Weights
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;

// Line Heights
$line-height-tight: 1.25;
$line-height-normal: 1.5;
$line-height-relaxed: 1.75;
```

#### Shadows & Effects
```scss
// Box Shadows
$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
$shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);

// Border Radius
$radius-sm: 0.25rem;  // 4px
$radius-md: 0.375rem; // 6px
$radius-lg: 0.5rem;   // 8px
$radius-xl: 0.75rem;  // 12px
$radius-full: 9999px; // Fully rounded
```

## Component Creation Patterns

### Basic Component Structure
```
src/components/
├── common/
│   ├── ComponentName/
│   │   ├── ComponentName.tsx
│   │   ├── ComponentName.module.scss
│   │   └── index.ts
```

### Component File Template
```tsx
// ComponentName.tsx
import styles from './ComponentName.module.scss';

interface ComponentNameProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function ComponentName({ 
  children, 
  variant = 'primary', 
  size = 'md' 
}: ComponentNameProps) {
  return (
    <div className={`${styles.container} ${styles[variant]} ${styles[size]}`}>
      {children}
    </div>
  );
}
```

```scss
// ComponentName.module.scss
@import '../../styles/variables';

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-md;
  font-weight: $font-weight-medium;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: $shadow-md;
  }
}

// Variants
.primary {
  background-color: $color-primary;
  color: $color-text-inverse;
  
  &:hover {
    background-color: $color-primary-dark;
  }
}

.secondary {
  background-color: $color-secondary;
  color: $color-text-inverse;
  
  &:hover {
    background-color: $color-secondary;
    opacity: 0.9;
  }
}

// Sizes
.sm {
  padding: $spacing-xs $spacing-sm;
  font-size: $font-size-sm;
}

.md {
  padding: $spacing-sm $spacing-md;
  font-size: $font-size-md;
}

.lg {
  padding: $spacing-md $spacing-lg;
  font-size: $font-size-lg;
}
```

```ts
// index.ts
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName';
```

## Layout Patterns

### Grid Layouts
```scss
// ✅ Use CSS Grid for complex layouts
.productGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: $spacing-lg;
  padding: $spacing-lg;
}

// ✅ Use Flexbox for simpler layouts
.cardHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-md;
}
```

### Responsive Design
```scss
// ✅ Mobile-first responsive design
.component {
  padding: $spacing-sm;
  
  @media (min-width: 768px) {
    padding: $spacing-md;
  }
  
  @media (min-width: 1024px) {
    padding: $spacing-lg;
  }
}
```

## Common Component Patterns

### Card Component
```scss
.card {
  background-color: $color-background-primary;
  border: 1px solid $color-border-light;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
  overflow: hidden;
  
  &:hover {
    box-shadow: $shadow-md;
    transform: translateY(-2px);
  }
}

.cardHeader {
  padding: $spacing-md;
  border-bottom: 1px solid $color-border-light;
  background-color: $color-background-secondary;
}

.cardBody {
  padding: $spacing-md;
}

.cardFooter {
  padding: $spacing-md;
  border-top: 1px solid $color-border-light;
  background-color: $color-background-secondary;
}
```

### Button Component
```scss
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: $radius-md;
  font-weight: $font-weight-medium;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.primary {
  background-color: $color-primary;
  color: $color-text-inverse;
  
  &:hover:not(:disabled) {
    background-color: $color-primary-dark;
  }
}

.secondary {
  background-color: transparent;
  color: $color-primary;
  border: 1px solid $color-primary;
  
  &:hover:not(:disabled) {
    background-color: $color-primary;
    color: $color-text-inverse;
  }
}
```

### Form Component
```scss
.formGroup {
  margin-bottom: $spacing-md;
}

.label {
  display: block;
  margin-bottom: $spacing-xs;
  font-weight: $font-weight-medium;
  color: $color-text-primary;
}

.input {
  width: 100%;
  padding: $spacing-sm;
  border: 1px solid $color-border-medium;
  border-radius: $radius-md;
  font-size: $font-size-md;
  
  &:focus {
    outline: none;
    border-color: $color-primary;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  }
  
  &.error {
    border-color: $color-error;
  }
}

.errorMessage {
  margin-top: $spacing-xs;
  font-size: $font-size-sm;
  color: $color-error;
}
```

## Performance Best Practices

### CSS Loading Strategy
```scss
// ✅ Import variables only once per component
@import '../../styles/variables';

// ✅ Use specific imports for utilities
@import '../../styles/mixins/responsive';

// ❌ Avoid importing entire style libraries
// @import '../../styles/all-styles';
```

### Selector Efficiency
```scss
// ✅ Efficient selectors
.component {
  // Direct class targeting
}

.component .child {
  // Specific child targeting
}

// ❌ Avoid overly specific selectors
// .page .section .container .component .child .grandchild {
//   // Too specific, hard to override
// }
```

## Testing Guidelines

### Visual Regression Testing
When creating or modifying components:

1. **Test all variants and sizes**
2. **Test responsive behavior at different breakpoints**
3. **Test interactive states (hover, focus, active)**
4. **Test with different content lengths**
5. **Test accessibility features**

### Browser Compatibility
Ensure compatibility with:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Common Mistakes to Avoid

### ❌ Don't Mix Styling Approaches
```tsx
// ❌ WRONG - Mixing CSS modules with inline styles
<div className={styles.container} style={{ marginTop: '20px' }}>
  Content
</div>

// ✅ CORRECT - Use CSS modules exclusively
<div className={`${styles.container} ${styles.extraMargin}`}>
  Content
</div>
```

### ❌ Don't Use Global Classes in Components
```scss
// ❌ WRONG - Global class in module
.container {
  .global-utility-class {
    // This creates global pollution
  }
}

// ✅ CORRECT - Local classes only
.container {
  // Local styles only
}
```

### ❌ Don't Break Token System
```scss
// ❌ WRONG - Calculating values from tokens
.component {
  margin: calc(#{$spacing-md} + 5px); // Breaks the system
}

// ✅ CORRECT - Use existing tokens or request new ones
.component {
  margin: $spacing-lg; // Use next size up
}
```

## Linting and Validation

### Automated Checks
The codebase includes automated linting that will catch:
- Hardcoded color values (`#ffffff`, `rgb()`, etc.)
- Hardcoded pixel values (`16px`, `1em`, etc.)
- Invalid variable patterns
- Missing CSS module imports

### Manual Review Checklist
Before submitting changes:
- [ ] All styling uses CSS modules
- [ ] No inline styles used
- [ ] All values use semantic tokens
- [ ] Component follows naming conventions
- [ ] Responsive design implemented
- [ ] Accessibility features included
- [ ] Visual regression tested

## Getting Help

### Documentation References
- [Variable Consolidation Map](../technical/variable-consolidation-map.md)
- [Component Migration Guide](../technical/component-migration-guide.md)
- [Testing Procedures](../technical/testing-procedures.md)

### Quick Commands
```bash
# Lint CSS files
npm run lint:css

# Check for hardcoded values
npm run css:validate

# Analyze bundle size
npm run analyze:css

# Build and test
npm run build:fast && npm run preview
```

---

**Remember**: This CSS system is designed for maintainability, scalability, and AI agent comprehension. Following these patterns ensures consistent, high-quality styling across the entire application.
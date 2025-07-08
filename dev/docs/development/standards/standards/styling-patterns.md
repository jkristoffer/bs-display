# Styling Standards

## Current Standard: SCSS Modules + Modern Gradient System

**Decision**: Use SCSS modules for component-specific styles, global SCSS for layout and utilities. Now enhanced with a comprehensive gradient-based design system.

**NEW**: Complete gradient system with 25+ utility classes, glassmorphism effects, and modern animations available globally.

### SCSS Modules Pattern
```scss
// ComponentName.module.scss
.componentName {
  display: flex;
  padding: var(--spacing-md);
  
  &__title {
    font-size: var(--font-size-lg);
    color: var(--color-primary);
  }
  
  &--active {
    background-color: var(--color-surface-active);
  }
}
```

```typescript
// ComponentName.tsx
import styles from './ComponentName.module.scss';

export function ComponentName({ isActive }: Props) {
  return (
    <div className={`${styles.componentName} ${isActive ? styles['componentName--active'] : ''}`}>
      <h2 className={styles.componentName__title}>Title</h2>
    </div>
  );
}
```

### Global Styles Usage
Use global styles for:
- Layout utilities (`.container`, `.grid`)
- Typography base styles
- CSS custom properties (design tokens)
- **NEW**: Gradient backgrounds (`.gradient-bg-*`)
- **NEW**: Gradient text effects (`.gradient-text-*`)
- **NEW**: Glassmorphism effects (`.glass-*`)
- **NEW**: Modern animations (`.animate-*`)
- **NEW**: Enhanced button system (`.button-*`)

```typescript
// Using global classes with new gradient system
<div className="container">
  <div className="grid grid--2-col">
    <div className="gradient-bg-primary glass-light">
      <h2 className="gradient-text-primary">Modern Card</h2>
      <button className="button-gradient animate-float">Action</button>
    </div>
  </div>
</div>
```

## Design Tokens

### CSS Custom Properties (Available Globally)
```scss
// Already available through global injection
:root {
  // Spacing (unchanged)
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  // Legacy colors (still available)
  --color-primary: #007bff;
  --color-secondary: #6c757d;
  --color-success: #28a745;
  --color-danger: #dc3545;
  
  // NEW: Modern Gradient System
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-green: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  --gradient-blue: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  --gradient-orange: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
  --gradient-purple: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
  --gradient-pink: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
  --gradient-teal: linear-gradient(135deg, #14b8a6 0%, #0f766e 100%);
  --gradient-indigo: linear-gradient(135deg, #6366f1 0%, #4338ca 100%);
  
  // NEW: Glassmorphism variables
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
  --glass-backdrop: blur(10px);
  
  // NEW: Fluid Typography
  --font-size-h1: clamp(32px, 5vw, 48px);
  --font-size-h2: clamp(28px, 4vw, 36px);
  --font-size-h3: clamp(24px, 3vw, 30px);
  --font-size-h4: clamp(20px, 2.5vw, 24px);
  --font-size-h5: clamp(18px, 2vw, 20px);
  --font-size-h6: clamp(16px, 1.5vw, 18px);
  
  // NEW: Contextual spacing
  --spacing-hero: clamp(4rem, 10vw, 12rem);
  --spacing-section: clamp(3rem, 8vw, 8rem);
  --spacing-card-padding: clamp(1rem, 3vw, 2rem);
}
```

### Breakpoints (Available via Mixins)
```scss
// Use existing breakpoint mixins
.component {
  padding: var(--spacing-sm);
  
  @include tablet {
    padding: var(--spacing-md);
  }
  
  @include desktop {
    padding: var(--spacing-lg);
  }
}
```

## Naming Conventions

### SCSS Module Classes
- **Component root**: `.componentName`
- **Elements**: `.componentName__element`
- **Modifiers**: `.componentName--modifier`
- **States**: `.componentName--active`, `.componentName--disabled`

### Global Classes
- **Layout**: `.container`, `.grid`, `.flex`
- **Utilities**: `.text-center`, `.margin-bottom-lg`
- **Components**: `.button`, `.card`, `.modal`
- **NEW - Gradient Backgrounds**: `.gradient-bg-primary`, `.gradient-bg-success`, `.gradient-bg-warning`, `.gradient-bg-info`
- **NEW - Gradient Text**: `.gradient-text-primary`, `.gradient-text-success`, `.gradient-text-warning`, `.gradient-text-info`
- **NEW - Glassmorphism**: `.glass-light`, `.glass-dark`, `.glass-strong`
- **NEW - Animations**: `.animate-float`, `.animate-pulse`, `.animate-fade-up`, `.animate-rotate`
- **NEW - Enhanced Buttons**: `.button-gradient`, `.button-glass`, `.button-success`, `.button-warning`, `.button-fab`
- **NEW - Icon Containers**: `.icon-container-gradient`, `.icon-container-glass`
- **NEW - Typography**: `.heading-hero`, `.heading-section`, `.subtitle-large`, `.text-fluid-sm`

## Organization Patterns

### Component-Level SCSS with Modern Gradient System
```scss
// Import global utilities if needed
@use '../../../styles/mixins' as *;

.productCard {
  display: flex;
  flex-direction: column;
  border: 1px solid transparent;
  border-radius: var(--border-radius-md);
  background: var(--color-surface);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  // NEW: Gradient top border animation
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--gradient-primary);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  
  &__image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &__content {
    padding: var(--spacing-card-padding); // NEW: Fluid padding
  }
  
  &__title {
    font-size: var(--font-size-h4); // NEW: Fluid typography
    margin-bottom: var(--spacing-sm);
  }
  
  // NEW: Enhanced hover effects
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    
    &::before {
      transform: scaleX(1);
    }
    
    .productCard__image {
      transform: scale(1.05);
    }
  }
  
  // NEW: Gradient variant
  &--gradient {
    background: var(--gradient-primary);
    color: white;
    
    .productCard__title {
      color: white;
    }
  }
  
  // NEW: Glass variant
  &--glass {
    background: var(--glass-bg);
    backdrop-filter: var(--glass-backdrop);
    border: 1px solid var(--glass-border);
  }
  
  @include tablet {
    flex-direction: row;
    
    &__image {
      width: 200px;
      height: auto;
    }
  }
}
```

### Large Component Styles
For components with extensive styles (like Quiz), consider splitting:
```
Quiz/
├── Quiz.tsx
├── Quiz.module.scss          # Main component styles
├── QuizQuestion.module.scss  # Sub-component styles
└── QuizResults.module.scss   # Sub-component styles
```

## Performance Considerations

### CSS Loading
- SCSS modules automatically scoped and optimized
- Global styles loaded once via Astro configuration
- Unused CSS automatically purged in production

### Bundle Size
- Use global utilities for repeated patterns
- Keep component modules focused on unique styles
- Leverage CSS custom properties for theming

## Modern Gradient System Usage Examples

### Quick Start Examples
```typescript
// Hero section with gradient background
<section className="gradient-bg-primary">
  <div className="container">
    <h1 className="heading-hero gradient-text-primary">Welcome</h1>
    <button className="button-gradient animate-float">Get Started</button>
  </div>
</section>

// Product card with glass effect
<div className="glass-light animate-fade-up">
  <div className="icon-container-gradient">🚀</div>
  <h3 className="gradient-text-success">Modern Design</h3>
  <p>Beautiful glassmorphism effects</p>
</div>

// Call-to-action with multiple effects
<div className="gradient-bg-orange glass-strong">
  <h2 className="gradient-text-warning">Special Offer</h2>
  <button className="button-glass animate-pulse">Claim Now</button>
</div>
```

### Complete Utility Class Reference
```scss
// Gradient Backgrounds (8 available)
.gradient-bg-primary    // Blue to purple
.gradient-bg-green      // Teal to green
.gradient-bg-blue       // Light to dark blue
.gradient-bg-orange     // Yellow to orange
.gradient-bg-purple     // Light to dark purple
.gradient-bg-pink       // Pink to deep pink
.gradient-bg-teal       // Teal variants
.gradient-bg-indigo     // Indigo variants

// Gradient Text Effects (4 available)
.gradient-text-primary  // Primary gradient text
.gradient-text-success  // Success gradient text
.gradient-text-warning  // Warning gradient text
.gradient-text-info     // Info gradient text

// Glassmorphism Effects (3 available)
.glass-light           // Light glass effect
.glass-dark            // Dark glass effect
.glass-strong          // Strong glass effect

// Animations (4 available)
.animate-float         // Floating animation
.animate-pulse         // Pulsing animation
.animate-fade-up       // Fade up animation
.animate-rotate        // Rotation animation

// Enhanced Buttons (7 variants)
.button-primary        // Standard primary
.button-gradient       // Gradient button
.button-glass          // Glass button
.button-success        // Success button
.button-warning        // Warning button
.button-ghost          // Ghost button
.button-fab            // Floating action button

// Icon Containers (2 variants)
.icon-container-gradient // Gradient icon container
.icon-container-glass    // Glass icon container

// Typography (4 fluid scales)
.heading-hero          // Hero heading (fluid)
.heading-section       // Section heading (fluid)
.subtitle-large        // Large subtitle (fluid)
.text-fluid-sm         // Small body text (fluid)
```

## Migration Notes

### From Global to Modules
When updating existing components:
1. Create `.module.scss` file
2. Move component-specific styles
3. Update className usage
4. **NEW**: Leverage gradient utilities for modern effects
5. Keep global utilities as-is

### Gradual Adoption
- New components: Use SCSS modules + gradient utilities
- Existing components: Update during feature work
- **NEW**: Add gradient effects to enhance visual appeal
- No bulk refactoring required

### Performance Considerations
- Gradient utilities add ~0.9KB to bundle size
- Hardware-accelerated animations for 60fps performance
- PurgeCSS automatically removes unused gradient classes
- All animations respect `prefers-reduced-motion`

---

**Important**: This resolves the previous conflict between "no CSS modules" guidance and actual `.module.scss` usage. SCSS modules are now the official standard for component styling.
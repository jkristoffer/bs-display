# Styling Standards

## Current Standard: SCSS Modules

**Decision**: Use SCSS modules for component-specific styles, global SCSS for layout and utilities.

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
- Animation utilities

```typescript
// Using global classes
<div className="container">
  <div className="grid grid--2-col">
    <ComponentName />
  </div>
</div>
```

## Design Tokens

### CSS Custom Properties (Available Globally)
```scss
// Already available through global injection
:root {
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  --color-primary: #007bff;
  --color-secondary: #6c757d;
  --color-success: #28a745;
  --color-danger: #dc3545;
  
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
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

## Organization Patterns

### Component-Level SCSS
```scss
// Import global utilities if needed
@use '../../../styles/mixins' as *;

.productCard {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  
  &__image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  &__content {
    padding: var(--spacing-md);
  }
  
  &__title {
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-sm);
  }
  
  &--featured {
    border-color: var(--color-primary);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

## Migration Notes

### From Global to Modules
When updating existing components:
1. Create `.module.scss` file
2. Move component-specific styles
3. Update className usage
4. Keep global utilities as-is

### Gradual Adoption
- New components: Use SCSS modules
- Existing components: Update during feature work
- No bulk refactoring required

---

**Important**: This resolves the previous conflict between "no CSS modules" guidance and actual `.module.scss` usage. SCSS modules are now the official standard for component styling.
# Component Development Standards

## Component Types & File Extensions

### React Components
- **Interactive components**: Use `.tsx` for TypeScript
- **Legacy components**: Convert `.jsx` to `.tsx` during maintenance
- **Props interface**: Always define TypeScript interfaces

### Astro Components
- **Pages and layouts**: Use `.astro` for static content
- **Data fetching**: Use Astro for server-side data loading
- **Layout imports**: Always verify layout exists before importing
  - Available layouts: `BaseLayout`, `MainLayout`, `ProductLayout`, `BlogLayout`, `UseCaseLayout`
  - Use `BaseLayout` for new pages unless specific layout needed

## Component Structure

### File Organization
```
/src/components/[feature]/ComponentName/
├── ComponentName.tsx          # Main component
├── ComponentName.module.scss  # Styles (if needed)
├── index.ts                  # Clean exports
├── types.ts                  # TypeScript interfaces (if complex)
└── README.md                 # Documentation (if complex)
```

### Standard Component Template
```typescript
// ComponentName.tsx
interface ComponentNameProps {
  title: string;
  isActive?: boolean;
  onAction?: () => void;
  variant?: 'default' | 'gradient' | 'glass';
}

export function ComponentName({ 
  title, 
  isActive = false, 
  onAction,
  variant = 'default'
}: ComponentNameProps) {
  const getVariantClass = () => {
    switch (variant) {
      case 'gradient': return 'gradient-bg-primary';
      case 'glass': return 'glass-light';
      default: return '';
    }
  };

  return (
    <div className={`component-name ${isActive ? 'component-name--active' : ''} ${getVariantClass()}`}>
      <h2 className={variant === 'gradient' ? 'gradient-text-primary' : ''}>{title}</h2>
      {onAction && (
        <button 
          onClick={onAction} 
          type="button"
          className="button-gradient"
        >
          Action
        </button>
      )}
    </div>
  );
}
```

### Index File Pattern
```typescript
// index.ts
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName';
```

## Import/Export Conventions

### Imports
```typescript
// External libraries first
import { useState } from 'react';

// Internal utilities
import { formatDate } from '@utils/dateHelpers';

// Local components
import { Button } from '../Button';
import type { User } from './types';
```

### Exports
- **Named exports preferred**: `export function ComponentName`
- **Default exports for pages**: `export default function HomePage`
- **Type exports**: `export type { ComponentProps }`

## Styling Standards

### SCSS Modules (Current Standard)
- Use `.module.scss` for component-specific styles
- Import as: `import styles from './Component.module.scss'`
- Use: `className={styles.componentName}`

### Global Styles & New Gradient System
- Use global classes for layout and utility styles
- **NEW**: Gradient utility classes available globally
- **NEW**: Glassmorphism effects and animations
- Available through automatic SCSS injection
- BEM naming: `.component-name__element--modifier`

### Modern Gradient System (Available Globally)
```typescript
// Background gradients
<div className="gradient-bg-primary">Primary gradient background</div>
<div className="gradient-bg-success">Success gradient background</div>
<div className="gradient-bg-warning">Warning gradient background</div>

// Text gradients
<h1 className="gradient-text-primary">Gradient text effect</h1>
<h2 className="gradient-text-success">Success gradient text</h2>

// Glassmorphism effects
<div className="glass-light">Light glass effect</div>
<div className="glass-dark">Dark glass effect</div>
<div className="glass-strong">Strong glass effect</div>

// Icon containers
<div className="icon-container-gradient">🎨</div>
<div className="icon-container-glass">💎</div>

// Animations
<div className="animate-float">Floating animation</div>
<div className="animate-pulse">Pulsing animation</div>
<div className="animate-fade-up">Fade up animation</div>
```

### Enhanced Button System
```typescript
// Modern button variants (use with Button component)
<Button variant="primary">Primary Button</Button>
<Button variant="gradient">Gradient Button</Button>
<Button variant="glass">Glass Button</Button>
<Button variant="success">Success Button</Button>
<Button variant="warning">Warning Button</Button>
```

## Common Patterns

### State Management
```typescript
// Simple state
const [isOpen, setIsOpen] = useState(false);

// Complex state (use useReducer)
const [state, dispatch] = useReducer(reducer, initialState);
```

### Event Handlers
```typescript
// Prefer explicit event types
function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  // Handle submission...
}

// Use callback pattern for child events
function handleItemClick(itemId: string) {
  // Handle click...
}
```

### Conditional Rendering
```typescript
// Simple conditionals
{isVisible && <div>Content</div>}

// Complex conditionals
{status === 'loading' ? (
  <LoadingSpinner />
) : error ? (
  <ErrorMessage error={error} />
) : (
  <ContentDisplay data={data} />
)}
```

## Documentation

### When to Document
- Complex components with multiple responsibilities
- Components used across multiple features
- Components with non-obvious behavior

### Documentation Template
```markdown
# ComponentName

Brief description of what this component does.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| title | string | Yes | - | Display title |
| isActive | boolean | No | false | Active state |

## Usage

\`\`\`tsx
<ComponentName 
  title="Example Title" 
  isActive={true} 
/>
\`\`\`

## Notes

- Any important implementation details
- Known limitations or gotchas
```

---

**Note**: These standards apply to new development. Existing components should be gradually updated during maintenance, not in bulk refactoring sessions.
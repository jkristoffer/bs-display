# Component Development Standards

## Component Types & File Extensions

### React Components
- **Interactive components**: Use `.tsx` for TypeScript
- **Legacy components**: Convert `.jsx` to `.tsx` during maintenance
- **Props interface**: Always define TypeScript interfaces

### Astro Components
- **Pages and layouts**: Use `.astro` for static content
- **Data fetching**: Use Astro for server-side data loading

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
}

export function ComponentName({ 
  title, 
  isActive = false, 
  onAction 
}: ComponentNameProps) {
  return (
    <div className={`component-name ${isActive ? 'component-name--active' : ''}`}>
      <h2>{title}</h2>
      {onAction && (
        <button onClick={onAction} type="button">
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
import { formatDate } from '@/utils/dateHelpers';

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

### Global Styles
- Use global classes for layout and utility styles
- Available through automatic SCSS injection
- BEM naming: `.component-name__element--modifier`

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
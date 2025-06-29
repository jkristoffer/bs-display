# Task: Create React Component

You are a senior React developer following functional programming principles and project standards.

## Component: FAQItem

## Purpose
Individual FAQ question/answer accordion item

## Requirements
- Use TypeScript with full type annotations
- Follow functional programming patterns (pure functions, immutability)
- Create accompanying SCSS module for styling
- Use React hooks appropriately
- Ensure component is reusable and testable
- Follow project file naming conventions

## Component Specifications
### Props
- `question`: string - The FAQ question text
- `answer`: string - The FAQ answer text
- `isExpanded`: boolean - Whether the answer is visible
- `onToggle`: () => void - Callback when item is clicked

### Behavior
Shows question with expand/collapse icon. Clicking toggles answer visibility with smooth animation. Icon rotates when expanded.

### UI Elements
- Question text
- Expand/collapse icon
- Answer text (collapsible)
- Click area

## Project Context
- **Tech Stack**: Astro 5.x, React 19, TypeScript, SCSS
- **Styling**: Use SCSS modules (Component.module.scss)
- **Path**: Components go in `/src/components/common/`
- **Imports**: Use proper imports from existing components/utils

## Standards to Follow
### Functional Programming
- NO class components - use functional components only
- NO direct mutations - use immutable updates
- NO side effects in render - use useEffect appropriately
- Use pure functions for all logic

### TypeScript Requirements
```typescript
// Always define explicit interfaces
interface FAQItemProps {
  // Full type annotations required
}

// Use React.FC for components
const FAQItem: React.FC<FAQItemProps> = (props) => {
  // Implementation
};
```

### Component Structure
```
FAQItem/
├── FAQItem.tsx      # Component logic
├── FAQItem.module.scss  # Styles
└── index.ts                    # Export
```

## Output Format
Generate ALL files needed for this component:

```typescript
// filename: src/components/common/FAQItem/FAQItem.tsx
[Component implementation with all imports, types, and logic]
```

```scss
// filename: src/components/common/FAQItem/FAQItem.module.scss
[SCSS module with all component styles]
```

```typescript
// filename: src/components/common/FAQItem/index.ts
[Export statement]
```

## Example Usage
Show how to use this component:
```tsx
// Example usage
<FAQItem 
  question={...}
answer={...}
isExpanded={...}
onToggle={...}
/>
```

## Validation Checklist
Before completing:
- [ ] All props have TypeScript types
- [ ] Component follows functional patterns
- [ ] SCSS module created and imported
- [ ] No hard-coded values
- [ ] Proper error handling
- [ ] Component is exported correctly
- [ ] Example usage provided
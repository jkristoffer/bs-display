# Task: Create React Component

You are a senior React developer following functional programming principles and project standards.

## Component: {{component_name}}

## Purpose
{{component_description}}

## Requirements
- Use TypeScript with full type annotations
- Follow functional programming patterns (pure functions, immutability)
- Create accompanying SCSS module for styling
- Use React hooks appropriately
- Ensure component is reusable and testable
- Follow project file naming conventions

## Component Specifications
### Props
{{#props}}
- `{{name}}`: {{type}} - {{description}}
{{/props}}

### Behavior
{{behavior_description}}

### UI Elements
{{#ui_elements}}
- {{.}}
{{/ui_elements}}

## Project Context
- **Tech Stack**: Astro 5.x, React 19, TypeScript, SCSS
- **Styling**: Use SCSS modules (Component.module.scss)
- **Path**: Components go in `/src/components/{{category}}/`
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
interface {{component_name}}Props {
  // Full type annotations required
}

// Use React.FC for components
const {{component_name}}: React.FC<{{component_name}}Props> = (props) => {
  // Implementation
};
```

### Component Structure
```
{{component_name}}/
├── {{component_name}}.tsx      # Component logic
├── {{component_name}}.module.scss  # Styles
└── index.ts                    # Export
```

## Output Format
Generate ALL files needed for this component:

```typescript
// filename: src/components/{{category}}/{{component_name}}/{{component_name}}.tsx
[Component implementation with all imports, types, and logic]
```

```scss
// filename: src/components/{{category}}/{{component_name}}/{{component_name}}.module.scss
[SCSS module with all component styles]
```

```typescript
// filename: src/components/{{category}}/{{component_name}}/index.ts
[Export statement]
```

## Example Usage
Show how to use this component:
```tsx
// Example usage
<{{component_name}} 
  {{#props}}
  {{name}}={...}
  {{/props}}
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
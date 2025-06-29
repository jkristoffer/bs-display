# Task: Add TypeScript Types to Existing Code

You are a TypeScript expert adding proper type annotations to existing JavaScript/loosely-typed code.

## File to Refactor: {{file_path}}

## Refactoring Goals
{{#goals}}
- {{.}}
{{/goals}}

## Current Code Issues
{{#issues}}
- {{.}}
{{/issues}}

## Requirements
- Add explicit TypeScript types to all functions, parameters, and returns
- Create interfaces for complex objects
- Replace 'any' types with specific types
- Ensure no implicit 'any' types remain
- Maintain existing functionality exactly
- Follow project TypeScript conventions

## Type Inference Hints
{{#type_hints}}
- `{{variable}}`: likely type is `{{suggested_type}}` because {{reason}}
{{/type_hints}}

## Project Type Conventions
### Naming
- Interfaces: PascalCase with 'I' prefix for models (e.g., `IProduct`)
- Type aliases: PascalCase without prefix (e.g., `ProductFilter`)
- Enums: PascalCase for name, UPPER_SNAKE for values
- Generics: Single letter (T, U) or descriptive (TItem, TResponse)

### Structure
```typescript
// 1. Imports
import type { ExternalType } from './types';

// 2. Type definitions
interface ComponentProps {
  // Props here
}

// 3. Implementation
const Component: React.FC<ComponentProps> = (props) => {
  // Implementation
};
```

## Common Type Patterns in This Project
### React Component Props
```typescript
interface ComponentNameProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}
```

### API Response Types
```typescript
interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}
```

### Product/Model Types
```typescript
interface IProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  // etc.
}
```

## Refactoring Process
1. Analyze the existing code structure
2. Identify all variables, parameters, and return values needing types
3. Create necessary interfaces and type aliases
4. Add types incrementally, ensuring no behavior changes
5. Resolve any type errors that arise
6. Ensure all implicit 'any' types are resolved

## Output Format
Generate the fully typed version:

```typescript
// filename: {{file_path}}
// REFACTORED: Added complete TypeScript types

{{#new_imports}}
import type { {{.}} } from '{{source}}';
{{/new_imports}}

// New type definitions
{{#new_types}}
interface {{type_name}} {
  {{properties}}
}
{{/new_types}}

// Refactored code with types
[Complete refactored code with all types added]
```

## Type Addition Examples
### Before
```javascript
const processData = (items, options) => {
  return items.filter(item => item.active)
    .map(item => ({ ...item, processed: true }));
};
```

### After
```typescript
interface DataItem {
  id: string;
  active: boolean;
  [key: string]: unknown;
}

interface ProcessedItem extends DataItem {
  processed: boolean;
}

interface ProcessOptions {
  // Add based on usage
}

const processData = (items: DataItem[], options?: ProcessOptions): ProcessedItem[] => {
  return items.filter((item): item is DataItem => item.active)
    .map((item): ProcessedItem => ({ ...item, processed: true }));
};
```

## Common Type Fixes
### Replace 'any' with union types
```typescript
// Bad: any
const value: any = getData();

// Good: specific union
const value: string | number | null = getData();
```

### Add function types
```typescript
// Bad: implicit any
const callback = (data) => console.log(data);

// Good: explicit types
const callback = (data: ResponseData): void => console.log(data);
```

### Type event handlers
```typescript
// Bad: any event
const handleClick = (e) => { };

// Good: specific event
const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => { };
```

## Validation Checklist
- [ ] All function parameters have explicit types
- [ ] All function return types are specified
- [ ] No 'any' types remain (unless absolutely necessary with justification)
- [ ] All interfaces are properly defined
- [ ] Event handlers have correct event types
- [ ] React components use proper prop types
- [ ] No type errors in TypeScript compiler
# BS Display - Coding Standards & Style Guide

This document outlines the coding standards and style guidelines for the BS Display project. Following these standards ensures consistency across the codebase, improves maintainability, and makes onboarding new developers easier.

## 1. General Principles

### 1.1 Code Quality

- Write clean, readable, and self-documenting code
- Follow the DRY (Don't Repeat Yourself) principle
- Keep functions and components small and focused on a single responsibility
- Prioritize readability over clever or overly concise code
- Write code that is easy to test

### 1.2 Comments

- Use comments to explain "why" rather than "what" or "how"
- Add comments for complex logic that isn't immediately obvious
- Use JSDoc comments for functions and components that are part of public APIs
- Keep comments up-to-date when changing code

```javascript
// Good: Explains why this approach was chosen
// Using a timeout to prevent excessive API calls during rapid typing
setTimeout(() => {
  fetchResults(searchTerm);
}, 300);

// Bad: States the obvious
// This function fetches data
function fetchData() { ... }
```

## 2. File Organization

### 2.1 Directory Structure

Follow the feature-based organization pattern:

```
dev/src/
├── components/
│   ├── common/          # Shared components
│   ├── home/            # Home page components
│   └── products/        # Product-related components
├── layouts/             # Page layouts
├── pages/               # Astro pages including dynamic routes
├── data/                # Data files and models
├── services/            # Data services
├── utils/               # Utility functions
└── styles/              # Global styles and variables
```

### 2.2 Component File Structure

Each component should be organized in its own directory with related files:

```
Button/
├── Button.astro         # Component implementation
├── Button.module.css    # Component-specific styles (if applicable)
└── index.ts             # Re-export for easier imports (optional)
```

### 2.3 File Naming

- **Components**: Use PascalCase for component files (e.g., `Button.astro`, `ProductCard.jsx`)
- **Utilities**: Use camelCase for utility files (e.g., `formatPrice.js`, `useWindowSize.js`)
- **CSS Modules**: Use the same name as the component with `.module.css` extension (e.g., `Button.module.css`)
- **Test Files**: Use the same name as the file being tested with `.test.js` or `.spec.js` extension

## 3. Astro Components

### 3.1 Component Structure

```astro
---
// 1. Imports
import SomeComponent from '../SomeComponent.astro';

// 2. Props interface
interface Props {
  title: string;
  description?: string;
}

// 3. Props destructuring
const { title, description = 'Default description' } = Astro.props;

// 4. Component logic
const formattedTitle = title.toUpperCase();
---

<!-- 5. Component template -->
<div class="container">
  <h1>{formattedTitle}</h1>
  {description && <p>{description}</p>}
  <SomeComponent />
</div>

<!-- 6. Component styles -->
<style>
  .container {
    padding: 20px;
  }

  h1 {
    color: var(--color-text-primary);
  }
</style>
```

### 3.2 Props

- Define a TypeScript interface for component props
- Provide default values for optional props
- Use destructuring to access props

```astro
---
interface Props {
  title: string;        // Required prop
  description?: string; // Optional prop
  items?: string[];     // Optional array prop
}

const {
  title,
  description = 'Default description',
  items = []
} = Astro.props;
---
```

## 4. React Components

### 4.1 Component Structure

```jsx
// 1. Imports
import React, { useState } from 'react';
import styles from './ComponentName.module.css';

// 2. Props interface
interface ComponentNameProps {
  initialValue: number;
  onChange?: (value: number) => void;
}

// 3. Component definition
const ComponentName: React.FC<ComponentNameProps> = ({
  initialValue,
  onChange
}) => {
  // 4. State and hooks
  const [value, setValue] = useState(initialValue);

  // 5. Event handlers
  const handleClick = () => {
    const newValue = value + 1;
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  // 6. Render
  return (
    <div className={styles.container}>
      <p className={styles.value}>{value}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
};

// 7. Export
export default ComponentName;
```

### 4.2 Hooks

- Place hooks at the top of the component function
- Follow the [Rules of Hooks](https://reactjs.org/docs/hooks-rules.html)
- Use custom hooks to share stateful logic between components
- Keep hook dependencies arrays accurate

```jsx
// Good
const MyComponent = () => {
  const [count, setCount] = useState(0);
  const data = useContext(DataContext);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]); // Correct dependency array

  // Rest of component...
};
```

### 4.3 Event Handlers

- Prefix event handler functions with `handle`
- Use arrow functions for event handlers to avoid binding issues

```jsx
// Good
const handleClick = () => {
  // Handle click event
};

return <button onClick={handleClick}>Click me</button>;
```

## 5. CSS and Styling

### 5.1 CSS Modules

- Use CSS Modules for component-specific styles
- Use camelCase for class names in CSS Modules
- Avoid using global styles except for base styles

```css
/* ComponentName.module.css */
.container {
  display: flex;
  padding: 20px;
}

.title {
  font-size: 24px;
  color: var(--color-text-primary);
}
```

```jsx
// ComponentName.jsx
import styles from './ComponentName.module.css';

return (
  <div className={styles.container}>
    <h1 className={styles.title}>Title</h1>
  </div>
);
```

### 5.2 CSS Variables

- Use CSS variables for theming and consistent values
- Define global variables in `variables.css`
- Follow the naming convention: `--category-name-modifier`

```css
/* variables.css */
:root {
  --color-text-primary: #333333;
  --spacing-md: 16px;
  --font-size-h1: 32px;
}
```

### 5.3 Responsive Design

- Use mobile-first approach for responsive design
- Use media queries with variables for breakpoints, Using SCSS
- Test on multiple screen sizes

```css
.container {
  padding: 10px;
}

@media (min-width: $breakpoint-md) {
  .container {
    padding: 20px;
  }
}
```

## 6. TypeScript

### 6.1 Type Definitions

- Use TypeScript interfaces for defining object shapes
- Use type aliases for union types and complex types
- Export types that are used across multiple files

```typescript
// Types for a product
export interface Product {
  id: string;
  name: string;
  price: number;
}

// Type for sort options
export type SortOption = 'price' | 'name' | 'newest';
```

### 6.2 Type Annotations

- Add type annotations for function parameters and return types
- Use inference for simple variable assignments
- Avoid using `any` type; use `unknown` if the type is truly unknown

```typescript
// Good
function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

// Avoid
function processData(data: any): any {
  // ...
}
```

## 7. JavaScript/TypeScript Style

### 7.1 Variables and Functions

- Use `const` for variables that don't change
- Use `let` for variables that need to be reassigned
- Use camelCase for variable and function names
- Use descriptive names that explain purpose

```javascript
// Good
const maxItemCount = 10;
let currentItemCount = 0;

function calculateTotalPrice(items) {
  // ...
}

// Avoid
const x = 10;
let y = 0;

function calc(i) {
  // ...
}
```

### 7.2 Conditionals

- Use ternary operators for simple conditions
- Use early returns to reduce nesting
- Use optional chaining and nullish coalescing when appropriate

```javascript
// Good
const displayName = user.name ? user.name : 'Guest';

// Early return
function processUser(user) {
  if (!user) return null;

  // Process user...
}

// Optional chaining and nullish coalescing
const userName = user?.profile?.name ?? 'Guest';
```

### 7.3 Arrays and Objects

- Use array methods like `map`, `filter`, and `reduce` instead of loops when appropriate
- Use the spread operator for shallow copying
- Use object destructuring to extract properties

```javascript
// Array methods
const activeUsers = users.filter((user) => user.isActive);
const userNames = users.map((user) => user.name);

// Spread operator
const newArray = [...oldArray, newItem];
const newObject = { ...oldObject, newProperty: value };

// Destructuring
const { name, email, age } = user;
```

## 8. Testing

### 8.1 Test Structure

- Group related tests with `describe` blocks
- Use clear test descriptions that explain what is being tested
- Follow the Arrange-Act-Assert pattern

```javascript
describe('ProductCard', () => {
  it('displays the product name', () => {
    // Arrange
    const product = { name: 'Test Product', price: 100 };

    // Act
    render(<ProductCard product={product} />);

    // Assert
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });
});
```

### 8.2 Test Coverage

- Aim for high test coverage, especially for critical paths
- Test edge cases and error scenarios
- Mock external dependencies

## 9. Performance

### 9.1 React Performance

- Use memoization (`React.memo`, `useMemo`, `useCallback`) for expensive operations
- Avoid unnecessary re-renders
- Use virtualization for long lists

```jsx
// Memoize expensive component
const MemoizedComponent = React.memo(ExpensiveComponent);

// Memoize expensive calculation
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

// Memoize callback
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

### 9.2 Astro Performance

- Use Astro's partial hydration features (`client:load`, `client:visible`, etc.) appropriately
- Minimize client-side JavaScript
- Use static site generation for content that doesn't change frequently

## 10. Accessibility

### 10.1 Semantic HTML

- Use semantic HTML elements (`<button>`, `<nav>`, `<article>`, etc.)
- Use appropriate ARIA attributes when necessary
- Ensure proper heading hierarchy

```html
<!-- Good -->
<button aria-label="Close">X</button>

<!-- Avoid -->
<div onclick="closeModal()">X</div>
```

### 10.2 Keyboard Navigation

- Ensure all interactive elements are keyboard accessible
- Use proper focus management
- Test with keyboard navigation

### 10.3 Color Contrast

- Ensure sufficient color contrast for text
- Don't rely solely on color to convey information
- Test with color blindness simulators

## 11. Git and Version Control

### 11.1 Commit Messages

- Use clear and descriptive commit messages
- Follow the format: `type(scope): description`
- Types include: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

```
feat(products): add sorting functionality to product list
fix(nav): resolve mobile navigation overflow issue
docs(readme): update installation instructions
```

### 11.2 Branching Strategy

- Use feature branches for new features
- Use fix branches for bug fixes
- Create pull requests for code review before merging

## 12. Documentation

### 12.1 Code Documentation

- Use JSDoc comments for public APIs and complex functions
- Document component props with TypeScript interfaces
- Include examples for non-obvious usage

```javascript
/**
 * Formats a price value with currency symbol
 * @param {number} price - The price value to format
 * @param {string} [currency='USD'] - The currency code
 * @returns {string} Formatted price string
 * @example
 * formatPrice(10.99) // '$10.99'
 * formatPrice(10.99, 'EUR') // '€10.99'
 */
function formatPrice(price, currency = 'USD') {
  // Implementation...
}
```

### 12.2 README and Project Documentation

- Maintain up-to-date README with installation and usage instructions
- Document architecture decisions
- Include troubleshooting guides for common issues

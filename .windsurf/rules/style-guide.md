---
trigger: always_on
description: When dealing with files with extensions .css , .scss , .astro , .ts, .jsx, .tsx
---

This document provides comprehensive instructions for applying consistent styling to the BigShine Display project.

# 1. Project Style Architecture

The project uses Astro with SCSS for styling. Key aspects:

- Global Styles: All styles are automatically injected globally via Vite configuration
- No CSS Modules: Use BEM naming convention with global styles (no component-scoped CSS)
- SCSS Integration: The astro.config.mjs file automatically imports the main SCSS index for all SCSS files

```
// How styles are automatically included (from astro.config.mjs):
additionalData: (source, filename) => {
  if (filename.endsWith('index.scss')) return source;
  return `@use "src/styles/index.scss" as *;\n${source}`;
}
```

# 2. Style Directory Structure

```
/dev/src/styles/
├── index.scss       # Main entry point for all styles
├── global.scss      # Base styles and defaults
├── variables.scss   # Design tokens and CSS variables
├── mixins.scss      # Reusable CSS utility classes
└── _breakpoints.scss # Responsive breakpoint definitions
```

# 3. Design Tokens

Always use the predefined CSS variables for consistency:

```
// Colors
--color-background: #ffffff;
--color-surface: #fafafa;
--color-text-primary: #333333;
--color-accent-primary: #009688;
--color-accent-primary-rgb: 0, 150, 136;
--color-accent-secondary: #ffa726;
--color-border: #dddddd;

// Typography
--font-primary: 'Inter', 'Poppins', 'Helvetica Neue', Arial, sans-serif;
--font-secondary: 'Poppins', 'Helvetica Neue', Arial, sans-serif;
--font-size-h1: 40px;
--font-size-h2: 32px;
--font-size-h3: 24px;
--font-size-body-large: 18px;
--font-size-body-regular: 16px;
--font-size-small: 14px;
--font-size-smaller: 12px;

// Spacing
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-xxl: 48px;
--padding-s1: 15px;
--padding-s2: 50px;

// Breakpoints
--breakpoint-sm: 576px;  // 576px
--breakpoint-md: 768px;  // 768px
--breakpoint-lg: 992px;  // 992px
--breakpoint-xl: 1200px; // 1200px
```

# 4. Utility Classes & Mixins

Use the predefined utility classes for common patterns

```
// Flexbox Layouts
.flex-row       // display: flex; flex-direction: row;
.flex-column    // display: flex; flex-direction: column;
.flex-center    // display: flex; justify-content: center; align-items: center;
.flex-between   // display: flex; justify-content: space-between; align-items: center;
.flex-wrap      // flex-wrap: wrap;

// Typography
.text-center    // text-align: center;
.text-primary   // color: var(--color-text-primary);
.text-accent    // color: var(--color-accent-primary);

// Containers
.container      // max-width: var(--spacing-container-max-width); margin: 0 auto;
.full-width     // width: 100%;

// Responsive Helpers
.hide-sm        // Hides elements on small screens
.hide-md        // Hides elements on medium screens
.show-md        // Shows elements on medium screens and up

// Button Styles
.button-primary  // Main CTA buttons
.button-ghost    // Secondary/outline buttons
.button-faint    // Subtle/tertiary buttons
```

# 6. Responsive Design Best Practices

1. Use the predefined breakpoints for media queries, pay special attention so the use of SCSS variable and not CSS variable as those will not work on media queries:

```
@media (max-width: $breakpoint-sm) {
  // Styles for medium screens and smaller
}
```

2. Use the responsive utility classes to show/hide elements at different breakpoints
3. Use the grid-container class for responsive grid layouts:

```
.grid-container  // display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
```

# 7. Style Implementation Guidelines

1. Follow BEM Naming: Use Block\_\_Element--Modifier pattern for class names with kebab-case
2. Prefer Utility Classes: Use existing utility classes before writing custom CSS
3. Avoid Inline Styles: Use class-based styling over inline style attributes
4. Functional Programming: Use functional patterns; avoid classes per the code style guide
5. No CSS Modules: Styles are global; avoid component-scoped CSS
6. Prefix Utilities: Utility classes should be prefixed with u- (e.g., .u-margin-sm)
7. Use Design Tokens: Always reference the variables for colors, spacing, etc.

# 8. Adding New Styles

When adding new styles:

1. Follow the existing organization structure
2. Keep global utilities in mixins.scss
3. Define any new variables in variables.scss
4. Ensure responsive behavior

This guide ensures consistent styling across the project while maintaining the established patterns and best practices.

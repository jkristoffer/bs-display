---
trigger: always_on
description: When dealing with files with extensions .css , .scss , .astro , .ts, .jsx, .tsx
---

# Global Style System Overview

## 1. Directory Overview

- The /src/styles/ directory centralizes all global styles for the project. Key files include:
  - index.scss: Main entry point for global styles; imports all other style resources.
  - variables.scss: Defines design tokens (colors, spacing, typography, breakpoints).
  - mixins.scss: Contains reusable SCSS mixins for patterns and responsive behaviors.

Additional SCSS files may define utility classes, layout helpers, or base element resets.

## 2. Style Conventions

- SCSS Syntax: All styles use SCSS for variables, nesting, and mixins.
- Naming: Follows BEM (Block\_\_Element--Modifier) for components, with kebab-case for class names.
- Utilities: Utility classes (e.g., .u-margin-sm, .u-flex-center) are prefixed with u-.
- No CSS Modules: Styles are global; avoid per-component CSS modules.
- Structure: Organize by purpose (tokens, mixins, utilities, base).

## 3. Design Tokens

- Defined in variables.scss:
  - Colors: Use SCSS variables (e.g., $color-primary, $color-bg).
  - Spacing: Standardized scale (e.g., $space-xs, $space-md, $space-lg).
  - Typography: Font families, weights, and sizes (e.g., $font-size-base, $font-heading).
  - Breakpoints: Responsive breakpoints as variables (e.g., $break-md, $break-lg).

## 4. Reusable Classes / Layout Rules

- Utility Classes: For margins, padding, flex/grid layouts, text alignment, etc.
- Example: .u-mb-lg (large bottom margin), .u-flex-center (centered flexbox).
- Layout Helpers: Classes for grid systems or containers (e.g., .container, .row, .col-6).
- Mixins: Use mixins from mixins.scss for media queries and common patterns.

## 5. Global Imports

All styles are automatically injected globally via Vite configuration.
No need to import styles in individual components; index.scss is always present.

## 6. Component Styling Rules

- No Inline Styles: Avoid inline style attributes; use classes or SCSS.
- Prefer Utilities: Use provided utility/layout classes for spacing and alignment.
- Consistent Tokens: Reference design tokens (variables) for colors, spacing, etc.
- Extend, Don’t Override: Add new classes/mixins for new patterns; avoid overriding global styles.

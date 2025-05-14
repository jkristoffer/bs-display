---
trigger: always_on
---

# General Code Style & Formatting

- Use functional and declarative programming patterns; avoid classes.
- Prefer iteration and modularization over code duplication.
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError).
- Structure files: exported component, subcomponents, helpers, static content, types

# Naming Conventions

- Use lowercase with dashes for directories (e.g., components/auth-wizard).
- Favor named exports for components.

# TypeScript Best Practices

- Use TypeScript for all code; prefer interfaces over types.
- Avoid any and enums; use explicit types and maps instead.
- Use functional components with TypeScript interfaces.
- Enable strict mode in TypeScript for better type safety.

# Syntax & Formatting

- Use the function keyword for pure functions.
- Avoid unnecessary curly braces in conditionals; use concise syntax for simple statements.
- Use Prettier for consistent code formatting.
- Use /dev/src/eslint.config.mjs for linting rules

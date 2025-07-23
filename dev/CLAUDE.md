# CLAUDE.md

Quick reference for working on this Astro + React e-commerce platform.

## Architecture Note
This project uses Astro with React for interactive components. **Favor pure Astro components** when:
- Content is static or server-rendered
- No client-side state management needed
- SEO and performance are priorities
- Building layout components, cards, or display elements

Use React components only when you need:
- Client-side interactivity (forms, filters, real-time updates)
- Complex state management
- User interactions that require JavaScript

## Most Used Commands

```bash
# 1. Find files (Claude Code tools)
Glob **/*ProductCard*.tsx           # Find components by name
LS src/components/                  # Browse directory structure

# 2. Read & Edit (Claude Code tools)
Read src/components/common/ProductCard/ProductCard.tsx
Edit src/components/common/ProductCard/ProductCard.tsx

# 3. Validate changes
npm run check                       # TypeScript check
npm run code:review -- --file src/components/common/ProductCard/ProductCard.tsx

# 4. Development
npm run dev                         # Start dev server
npm run build                       # Full build with image optimization
npm run build:fast                  # Quick build without images
```

## Common Workflows

### Update a Component
```bash
# Find it
Glob **/*Nav*.tsx

# Read it
Read src/components/common/Nav/Nav.tsx

# Edit it (match exact strings including whitespace)
Edit src/components/common/Nav/Nav.tsx

# Test it
npm run check
npm run build:fast
```

### Add/Update Products
```bash
# Check existing format
Read src/data/models/models.viewsonic.json | head -50

# Edit product data
Edit src/data/models/models.viewsonic.json

# Validate
npm run data:validate
```

### Fix TypeScript Errors
```bash
npm run check                       # See all errors

# Common fixes:
# - Missing import: Add at top of file
# - Type error: Add type assertion (as HTMLElement)
# - Can't find module: Check file extension (.tsx not .ts)
# - EventTarget errors: Cast to HTMLElement: (e.target as HTMLElement)
# - React unused import: Remove the import statement
# - Navigation errors: Check src/components/common/Nav/hooks/
```

## Quick Fixes

### Build Failed
```bash
npm run build:fast                  # Skip image optimization
# Still failing? Check:
# - Import paths match filenames exactly
# - No circular dependencies
# - All dependencies installed
```

### Can't Find Component
```bash
Glob **/*ComponentName*.tsx         # Search everywhere
npm run components:manifest         # List all components
LS src/components/                  # Browse structure
```

### Before You Start

1. **Always read first**: Use Read tool before editing
2. **Track complex work**: Use TodoWrite for 3+ step tasks
3. **Test everything**: Run check + code:review after changes

## Known Issues & Quirks

- **Nav component TypeScript errors**: Expected, being refactored
- **Analytics deprecation warnings**: Normal, using legacy Performance API
- **Missing images**: Check `missing_images_tracker.csv` for tracking
- **Untracked Nav files**: Backup files from recent refactoring
- **Data validation script**: Has outdated paths, use direct file validation instead

## Project Structure

```
src/
├── components/     # React & Astro UI
├── data/          # Product data (models.*.json)
├── content/       # Blog posts
├── pages/         # Routes and APIs
└── styles/        # Global SCSS
```

## All Commands Reference

```bash
npm run help                        # Show all commands
npm run check                       # TypeScript validation
npm run build:fast                  # Quick build
npm run code:review -- --file       # AI code review
npm run data:validate               # Validate JSON data
npm run components:manifest         # List components
npm run ai:do <intent>              # AI tasks
```

---

Key docs: [Standards](./docs/development/standards/) | [Troubleshooting](./docs/quick-start/troubleshooting.md)
# File and Directory Naming Standards

## File Extensions

### Component Files

- **React Components**: `.tsx` (TypeScript + JSX)
- **Astro Components**: `.astro`
- **Type Definitions**: `.ts` (standalone) or inline in `.tsx`
- **Utility Functions**: `.ts`

### Legacy Migration

- **Existing `.jsx` files**: Convert to `.tsx` during maintenance
- **No new `.jsx` files**: Always use TypeScript for new components

## Directory Structure

### Component Organization

```
src/components/[feature]/ComponentName/
├── ComponentName.tsx
├── ComponentName.module.scss
├── index.ts
└── types.ts (if needed)
```

### Naming Conventions

#### Directories

- **PascalCase**: `ProductCard`, `QuizResults`, `NavigationMenu`
- **kebab-case for features**: `quiz-enhancement`, `buying-guide`
- **Consistency**: Choose one pattern per directory level

#### Component Files

- **PascalCase**: `ProductCard.tsx`, `QuizIntro.tsx`
- **Match directory name**: Directory `ProductCard/` → File `ProductCard.tsx`
- **Index files**: Always `index.ts` (lowercase)

#### Style Files

- **Component modules**: `ComponentName.module.scss`
- **Global styles**: `kebab-case.scss` (`quiz-styles.scss`)
- **Utility styles**: `_utilities.scss`, `_mixins.scss`

#### Data Files

- **Product data**: `models.[brand].json` (`models.infinitypro.json`)
- **Configuration**: `kebab-case.json` (`quiz-config.json`)
- **Schemas**: `[name].schema.json`

## Import/Export Patterns

### Index Files (Preferred)

```typescript
// src/components/common/ProductCard/index.ts
export { ProductCard } from './ProductCard';
export type { ProductCardProps } from './ProductCard';
```

### Direct Exports (Alternative)

```typescript
// When index files add complexity without value
import { ProductCard } from '../ProductCard/ProductCard';
```

### Path Aliases

```typescript
// Use configured path aliases
import { ProductCard } from '@/components/common/ProductCard';
import { formatPrice } from '@/utils/formatting';
import type { Product } from '@/types/product';
```

## Feature-Based Organization

### Top-Level Features

```
src/components/
├── common/          # Reusable across features
├── home/           # Homepage-specific
├── products/       # Product catalog & details
├── quiz/          # Product recommendation
└── navigation/    # Site navigation
```

### Sub-Feature Organization

```
src/components/products/
├── ProductCard/
├── ProductDetails/
├── FilterUI/
│   ├── FilterSidebar/
│   ├── FilterChips/
│   └── SortDropdown/
└── ProductGrid/
```

## Consistency Rules

### Current Project Patterns

- **Components**: PascalCase directories and files
- **Styles**: `.module.scss` for components
- **Data**: Brand-based JSON organization
- **Types**: Inline in component files or separate `types.ts`

### When to Create Subdirectories

- **Multiple related components**: `FilterUI/` with sub-components
- **Complex features**: `Quiz/` with multiple supporting files
- **Shared utilities**: Feature-specific helpers and types

### When to Use Index Files

- **Clean imports**: Hide internal structure
- **Multiple exports**: Component + types + utilities
- **Public API**: Clear interface for feature consumers

## Examples

### Simple Component

```
src/components/common/Button/
├── Button.tsx
├── Button.module.scss
└── index.ts
```

### Complex Feature

```
src/components/quiz/
├── Quiz.tsx                    # Main component
├── Quiz.module.scss           # Main styles
├── QuizQuestion/
│   ├── QuizQuestion.tsx
│   ├── QuizQuestion.module.scss
│   └── index.ts
├── QuizResults/
│   ├── QuizResults.tsx
│   ├── QuizResults.module.scss
│   └── index.ts
├── hooks/
│   ├── useQuizState.ts
│   └── useQuizScoring.ts
├── utils/
│   ├── productMatcher.ts
│   └── scoreCalculator.ts
├── types.ts
└── index.ts
```

### Data Organization

```
src/data/
├── models/
│   ├── models.infinitypro.json
│   ├── models.metz.json
│   ├── models.smart6000sv3.json
│   └── models.all.js
├── schemas/
│   ├── product.schema.json
│   └── quiz.schema.json
└── config/
    ├── quiz-config.json
    └── site-config.json
```

## Migration Strategy

### Gradual Adoption

1. **New files**: Follow these standards immediately
2. **Existing files**: Update during feature work
3. **Bulk changes**: Avoid unless necessary

### Priority Order

1. **Convert `.jsx` to `.tsx`**: During component updates
2. **Standardize component structure**: When adding features
3. **Organize directories**: When structure becomes confusing
4. **Add index files**: When imports become unwieldy

---

**Note**: These standards should make the codebase more predictable for both developers and AI assistants. Consistency reduces cognitive load and improves maintainability.

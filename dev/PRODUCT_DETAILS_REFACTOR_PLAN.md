# Product Details Refactor Implementation Plan

## Overview
Refactor ProductDetails component from smartboard-specific to category-agnostic system supporting all 4 product categories: smartboards, lecterns, accessories, collaboration.

## AI-First Implementation Strategy

### Phase 1: Core Architecture (High Priority)

#### Task 1: Create Specification Configuration System
**File**: `src/utils/product-specs.ts`
**Pattern**: Pure function configuration mapping
**AI Instructions**:
```typescript
// Create category-specific field mapping configuration
export const PRODUCT_SPEC_CONFIG = {
  smartboards: {
    displayOrder: ['size', 'resolution', 'os', 'touchTechnology', 'brightness', 'contrastRatio', 'viewingAngle', 'responseTime', 'panelLife', 'audioOutput', 'powerConsumption', 'warranty'],
    fieldLabels: {
      size: 'Screen Size',
      resolution: 'Resolution',
      touchTechnology: 'Touch Technology',
      // ... complete mapping
    },
    formatters: {
      size: (value: number) => `${value}"`,
      // ... value formatters
    }
  },
  lecterns: {
    displayOrder: ['size', 'resolution', 'os', 'motorizedFeatures', 'microphone', 'audio', 'warranty'],
    fieldLabels: { /* lectern-specific labels */ },
    formatters: { /* lectern-specific formatters */ }
  },
  accessories: {
    displayOrder: ['category', 'compatibility', 'priceRange', 'features'],
    fieldLabels: { /* accessory-specific labels */ },
    formatters: { /* accessory-specific formatters */ }
  },
  collaboration: {
    displayOrder: ['category', 'type', 'features', 'compatibility'],
    fieldLabels: { /* collaboration-specific labels */ },
    formatters: { /* collaboration-specific formatters */ }
  }
} as const;
```

#### Task 2: Implement Dynamic Specification Rendering
**File**: `src/utils/product-specs.ts`
**Pattern**: Functional composition with type safety
**AI Instructions**:
```typescript
// Pure function for generating specifications
export const generateProductSpecifications = (
  model: ProductModel,
  productType: keyof typeof PRODUCT_SPEC_CONFIG
): Array<{ label: string; value: string }> => {
  const config = PRODUCT_SPEC_CONFIG[productType];
  return config.displayOrder
    .map(field => ({
      field,
      value: model[field as keyof ProductModel]
    }))
    .filter(({ value }) => value !== undefined && value !== null && value !== '')
    .map(({ field, value }) => ({
      label: config.fieldLabels[field],
      value: config.formatters[field] ? config.formatters[field](value) : String(value)
    }));
};
```

#### Task 3: Create Category-Aware Breadcrumb Generation
**File**: `src/utils/breadcrumb-generator.ts`
**Pattern**: Pure function with category mapping
**AI Instructions**:
```typescript
// Category-specific breadcrumb configuration
export const CATEGORY_BREADCRUMB_CONFIG = {
  smartboards: { label: 'Smart Boards', path: '/products/smartboards/' },
  lecterns: { label: 'Lecterns', path: '/products/lecterns/' },
  accessories: { label: 'Accessories', path: '/products/accessories/' },
  collaboration: { label: 'Collaboration', path: '/products/collaboration/' }
} as const;

export const generateProductBreadcrumbs = (
  model: ProductModel,
  productType: keyof typeof CATEGORY_BREADCRUMB_CONFIG
): Array<{ label: string; path?: string }> => {
  const categoryConfig = CATEGORY_BREADCRUMB_CONFIG[productType];
  return [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products/' },
    { label: categoryConfig.label, path: categoryConfig.path },
    { 
      label: model.brand,
      path: `${categoryConfig.path}${model.brand.toLowerCase().replace(/\s+/g, '-')}/`
    },
    { label: model.model }
  ];
};
```

#### Task 4: Refactor ProductDetails Component
**File**: `src/components/products/ProductDetails/ProductDetails.tsx`
**Pattern**: Functional React component with composition
**AI Instructions**:
```typescript
// Replace hardcoded specifications with dynamic rendering
// Use generateProductSpecifications() utility
// Use generateProductBreadcrumbs() utility
// Maintain existing styling and structure
// Add conditional rendering for category-specific sections
```

### Phase 2: Enhanced Flexibility (Medium Priority)

#### Task 5: Update ProductDetails Props Interface
**File**: `src/types/product.ts`
**Pattern**: Enhanced TypeScript interfaces
**AI Instructions**:
```typescript
// Extend ProductDetailsProps with category-specific options
export interface ProductDetailsProps {
  model: ProductModel;
  productType: 'smartboards' | 'lecterns' | 'accessories' | 'collaboration';
  customActions?: ProductAction[];
  hideSpecs?: string[];
  additionalSpecs?: { [key: string]: string };
}
```

#### Task 6: Create Category-Specific Action Configurations
**File**: `src/utils/product-actions.ts`
**Pattern**: Configuration-driven action system
**AI Instructions**:
```typescript
// Define category-specific action buttons
export const PRODUCT_ACTION_CONFIG = {
  smartboards: [
    { label: 'Request Quote', action: 'quote', primary: true },
    { label: 'Book a Demo', action: 'demo', primary: false }
  ],
  lecterns: [
    { label: 'Request Quote', action: 'quote', primary: true },
    { label: 'Download Specs', action: 'specs', primary: false }
  ],
  accessories: [
    { label: 'Request Quote', action: 'quote', primary: true }
  ],
  collaboration: [
    { label: 'Request Quote', action: 'quote', primary: true },
    { label: 'Book a Demo', action: 'demo', primary: false }
  ]
} as const;
```

#### Task 7: Update All Product Detail Pages
**Files**: `src/pages/products/*/[brand]/[id].astro`
**Pattern**: Consistent page structure across categories
**AI Instructions**:
```typescript
// Update each category's [id].astro files to:
// 1. Use correct productType parameter
// 2. Generate category-specific breadcrumbs
// 3. Use category-specific SEO schemas
// 4. Maintain existing functionality
```

### Phase 3: Quality Assurance (Low Priority)

#### Task 8: Code Review Agent Validation
**Command**: `npm run code:review -- --batch src/components/products/ProductDetails/`
**AI Instructions**:
- Run code review on all modified files
- Ensure functional programming compliance
- Validate TypeScript interfaces
- Check security patterns

#### Task 9: Cross-Category Testing
**Pattern**: Manual verification across all categories
**AI Instructions**:
- Test ProductDetails component with sample data from each category
- Verify specifications render correctly
- Confirm breadcrumbs work for all categories
- Validate action buttons appear appropriately

## File Modification Matrix

| File | Task | Priority | Dependencies |
|------|------|----------|--------------|
| `src/utils/product-specs.ts` | 1, 2 | High | None |
| `src/utils/breadcrumb-generator.ts` | 3 | High | None |
| `src/components/products/ProductDetails/ProductDetails.tsx` | 4 | High | Tasks 1-3 |
| `src/types/product.ts` | 5 | Medium | None |
| `src/utils/product-actions.ts` | 6 | Medium | None |
| `src/pages/products/*/[brand]/[id].astro` | 7 | Medium | Tasks 1-4 |

## Functional Programming Compliance

- **Pure Functions**: All utilities are pure functions with no side effects
- **Immutability**: Configuration objects use `as const` assertions
- **Composition**: Component logic composes utility functions
- **Type Safety**: Full TypeScript coverage with strict types

## Success Criteria

1. **Functional**: ProductDetails renders appropriately for all 4 categories
2. **Maintainable**: Adding new categories requires only configuration changes
3. **Type-Safe**: All category-specific fields properly typed
4. **Consistent**: Styling and behavior consistent across categories
5. **Performance**: No rendering performance degradation

## AI Development Notes

- Use existing component patterns from codebase
- Follow project's functional programming standards
- Maintain SCSS module structure
- Preserve existing accessibility features
- Use TodoWrite tool to track implementation progress
# Implementation Plan: Dynamic FilterUI System

## Overview
This document provides a detailed, step-by-step implementation plan for refactoring the FilterUI component to support dynamic, product-type-specific filtering.

## Prerequisites
- Familiarity with React, TypeScript, and functional programming principles
- Understanding of current FilterUI component structure
- Access to the codebase at `/Users/kristoffersanio/git/bs-display/dev/`

## Implementation Steps

### Phase 1: Foundation Setup (Days 1-2)

#### Step 1.1: Create Type Definitions
**File**: `src/types/filter.types.ts`
```typescript
// Create new file for filter-specific types
export interface FilterConfig {
  id: string;
  type: 'single' | 'multi' | 'range' | 'boolean';
  label: string;
  accessor: (model: ProductModel) => any;
  formatter?: (value: any) => string;
  defaultExpanded?: boolean;
  sortOrder?: 'alpha' | 'numeric' | 'custom';
  customSort?: (a: any, b: any) => number;
}

export interface DynamicFilterState {
  [filterId: string]: any[];
}

export interface ProductFilterPreset {
  productType: 'smartboards' | 'lecterns' | 'accessories';
  filters: FilterConfig[];
}
```

**Validation**: Run `npm run code:typecheck` to ensure types compile

#### Step 1.2: Extend ProductModel Interface
**File**: `src/types/product.ts`
```typescript
// Add to existing ProductModel interface
export interface ProductModel {
  // ... existing fields ...
  
  // Lectern-specific fields
  motorizedFeatures?: string[];
  microphone?: {
    type: 'gooseneck' | 'wireless' | 'handheld';
    quantity: number;
  };
  audio?: {
    amplifier?: string;
    speakers?: string;
  };
  
  // Accessory-specific fields
  category?: 'stands' | 'stylus' | 'connectivity' | 'other';
  compatibility?: string[];
}
```

**Validation**: Run `npm run code:review -- --file src/types/product.ts`

#### Step 1.3: Create Filter Configuration Registry
**File**: `src/components/products/FilterUI/configs/filterConfigs.ts`
```typescript
import type { FilterConfig } from '../../../../types/filter.types';

export const smartBoardFilters: FilterConfig[] = [
  {
    id: 'brand',
    type: 'multi',
    label: 'Brands',
    accessor: (model) => model.brand,
    defaultExpanded: true,
    sortOrder: 'alpha'
  },
  {
    id: 'size',
    type: 'multi',
    label: 'Screen Size',
    accessor: (model) => model.size,
    formatter: (value) => `${value}"`,
    defaultExpanded: true,
    sortOrder: 'numeric'
  },
  {
    id: 'touchTechnology',
    type: 'multi',
    label: 'Touch Technology',
    accessor: (model) => model.touchTechnology,
    defaultExpanded: false
  },
  {
    id: 'contrastRatio',
    type: 'multi',
    label: 'Contrast Ratio',
    accessor: (model) => model.contrastRatio,
    defaultExpanded: false
  }
];

export const lecternFilters: FilterConfig[] = [
  {
    id: 'brand',
    type: 'multi',
    label: 'Brands',
    accessor: (model) => model.brand,
    defaultExpanded: true,
    sortOrder: 'alpha'
  },
  {
    id: 'size',
    type: 'multi',
    label: 'Screen Size',
    accessor: (model) => model.size,
    formatter: (value) => `${value}"`,
    defaultExpanded: true,
    sortOrder: 'numeric'
  },
  {
    id: 'motorizedFeatures',
    type: 'multi',
    label: 'Motorized Features',
    accessor: (model) => model.motorizedFeatures,
    defaultExpanded: true
  },
  {
    id: 'microphoneType',
    type: 'multi',
    label: 'Microphone Type',
    accessor: (model) => model.microphone?.type,
    defaultExpanded: false
  }
];

export const accessoryFilters: FilterConfig[] = [
  {
    id: 'brand',
    type: 'multi',
    label: 'Brands',
    accessor: (model) => model.brand,
    defaultExpanded: true,
    sortOrder: 'alpha'
  },
  {
    id: 'category',
    type: 'multi',
    label: 'Category',
    accessor: (model) => model.category,
    formatter: (value) => value.charAt(0).toUpperCase() + value.slice(1),
    defaultExpanded: true
  },
  {
    id: 'compatibility',
    type: 'multi',
    label: 'Compatible With',
    accessor: (model) => model.compatibility,
    defaultExpanded: false
  }
];

export const filterPresets = {
  smartboards: smartBoardFilters,
  lecterns: lecternFilters,
  accessories: accessoryFilters
};
```

### Phase 2: Core Component Refactoring (Days 3-5)

#### Step 2.1: Create Dynamic Filter Panel
**File**: `src/components/products/FilterUI/FilterPanel/DynamicFilterPanel.tsx`
```typescript
// New component that accepts filter configuration
// Copy existing FilterPanel.tsx as starting point
// Refactor to use dynamic filter configuration instead of hardcoded sections
```

**Key Changes**:
1. Replace hardcoded filter sections with dynamic rendering
2. Use filterConfig to determine which filters to show
3. Generate filter state dynamically based on configuration
4. Maintain existing memoization patterns

**Validation**: Test with existing smart board data to ensure no regression

#### Step 2.2: Create Backward Compatibility Wrapper
**File**: `src/components/products/FilterUI/FilterPanel/FilterPanel.tsx`
```typescript
// Modify existing component to use DynamicFilterPanel internally
// This ensures existing implementations continue to work
import DynamicFilterPanel from './DynamicFilterPanel';
import { smartBoardFilters } from '../configs/filterConfigs';

const FilterPanel: React.FC<FilterPanelProps> = (props) => {
  // Map old props to new dynamic system
  return <DynamicFilterPanel {...props} filterConfig={smartBoardFilters} />;
};
```

#### Step 2.3: Update FilterUI Component
**File**: `src/components/products/FilterUI/FilterUI.tsx`
```typescript
// Add logic to select appropriate filter configuration based on productType
import { filterPresets } from './configs/filterConfigs';

const FilterUI: React.FC<FilterUIProps> = ({ allModels, productType = 'smartboards', customFilters }) => {
  const filterConfig = customFilters || filterPresets[productType];
  
  // Update to use DynamicFilterPanel with configuration
  // Maintain existing filter state management logic
};
```

### Phase 3: Product-Specific Implementation (Days 6-8)

#### Step 3.1: Test Smart Boards (No Changes Needed)
**Files**: No changes required
- Verify `/products/smartboards/` continues to work
- Run visual regression tests
- Check filter counts and functionality

#### Step 3.2: Update Lecterns Implementation
**File**: `src/pages/products/lecterns/index.astro`
```typescript
// No changes needed - FilterUI automatically uses lectern filters
// based on productType="lecterns"
```

**Validation**:
1. Navigate to `/products/lecterns/`
2. Verify motorized features filter appears
3. Verify touch technology filter is absent
4. Test filtering functionality

#### Step 3.3: Create Accessories Data Structure
**File**: `src/data/accessories/accessories.all.js`
```javascript
// Create new data structure for accessories
import standsData from './accessories.stands.json';
import stylusData from './accessories.stylus.json';
import connectivityData from './accessories.connectivity.json';

export default [
  ...standsData,
  ...stylusData,
  ...connectivityData
];
```

**File**: `src/data/accessories/accessories.stands.json`
```json
[
  {
    "id": "stand-mobile-01",
    "brand": "SMART",
    "model": "Mobile Stand MS-1",
    "category": "stands",
    "compatibility": ["SMART Board MX", "SMART Board 6000S"],
    "features": ["Height adjustable", "Locking wheels", "Cable management"],
    "priceRange": "$800-$1,200",
    "image": "/images/products/accessories/stands/smart-ms1.jpg"
  }
]
```

### Phase 4: Testing and Validation (Days 9-10)

#### Step 4.1: Unit Tests
**File**: `src/components/products/FilterUI/__tests__/DynamicFilterPanel.test.tsx`
```typescript
// Test dynamic filter generation
// Test filter state management
// Test backward compatibility
```

#### Step 4.2: Integration Tests
1. Test all three product types
2. Verify filter configurations load correctly
3. Test filter functionality for each type
4. Verify performance metrics

#### Step 4.3: Visual Regression Tests
1. Screenshot existing pages before changes
2. Screenshot after implementation
3. Compare for visual differences

### Phase 5: Documentation and Deployment (Day 11)

#### Step 5.1: Update Component Documentation
**File**: `src/components/products/FilterUI/README.md`
- Document new props and configuration options
- Provide examples for each product type
- Document migration guide for custom implementations

#### Step 5.2: Update CLAUDE.md
Add section about dynamic filter system for future AI agents

#### Step 5.3: Deployment Checklist
- [ ] All tests passing
- [ ] Code review completed
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] Backward compatibility verified

## Rollback Plan

If issues arise:
1. The old FilterPanel component is preserved
2. Can revert FilterUI to use old component
3. No database changes to rollback
4. Static assets unchanged

## Success Criteria

1. **Functionality**
   - [ ] Smart boards filtering works as before
   - [ ] Lecterns show appropriate filters
   - [ ] Accessories have working filter system

2. **Performance**
   - [ ] Filter operations < 100ms
   - [ ] No increased memory usage
   - [ ] No additional API calls

3. **Code Quality**
   - [ ] TypeScript compilation successful
   - [ ] Code review agent approval
   - [ ] Test coverage > 80%

## Notes for AI Implementation

1. **Follow functional programming principles** throughout
2. **Use existing patterns** from current codebase
3. **Run code review agent** after each major step: `npm run code:review -- --file [file]`
4. **Test incrementally** - don't wait until the end
5. **Preserve git history** - make meaningful commits

## Common Pitfalls to Avoid

1. **Don't break existing pages** - test thoroughly
2. **Don't forget memoization** - performance is critical
3. **Don't hardcode product types** - keep it extensible
4. **Don't skip TypeScript types** - they prevent bugs
5. **Don't modify original FilterPanel** - create new component

## Resources

- Current FilterUI: `/src/components/products/FilterUI/`
- Product types: `/src/types/product.ts`
- Smart board data: `/src/data/models/`
- Lectern data: `/src/data/lecterns/`
- Development standards: `/src/development-standards/`
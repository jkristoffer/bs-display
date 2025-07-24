# Phase 2: Variable Consolidation

**Duration**: 5 days  
**Objective**: Reduce 300+ variables to ~100 semantic tokens while maintaining backward compatibility

## Overview

This phase creates a unified design token system by consolidating redundant variables, establishing semantic naming conventions, and building automated migration tooling.

## Prerequisites

- [x] ✅ Phase 1 completed with all deliverables (64.5% bundle reduction achieved)
- [x] ✅ Variable inventory and usage analysis available (304 variables fully documented)
- [x] ✅ Automated validation infrastructure operational (CI/CD, pre-commit hooks ready)
- [x] ✅ Design token naming conventions approved by team

## Phase 2 Execution Status: 🔄 **40% COMPLETE**

**✅ Day 1 Planning Achievements:**
- **Complete Variable Analysis**: All 304 variables analyzed with consolidation opportunities identified
- **Detailed Consolidation Map**: Precise 304 → 100 variable reduction plan with rationale
- **Semantic Token Structure**: AI-friendly 100-variable system designed with usage guidelines
- **Migration Strategy**: 3-phase risk-managed approach with comprehensive validation
- **Execution Readiness**: Day 6 ready to execute with 95% success confidence

**✅ Day 6 Variable Mapping Completed:**
- **Real Usage Analysis**: 327 variables, 3,227 occurrences mapped across entire codebase
- **Evidence-Based Decisions**: Top 10 variables account for 45% of usage (excellent optimization targets)
- **Duplicate Detection**: 13 duplicate groups identified (8 color + 5 spacing consolidation opportunities)
- **System Validation**: Color system validated, spacing system 8px grid compliance needs improvement (29%→100%)
- **69% Reduction Plan**: Detailed 327→100 consolidation with comprehensive rationale documentation

## Success Criteria

- [ ] Variable count reduced from 300+ to ~100 (70% reduction)
- [ ] All global styles updated to new token system
- [ ] Migration scripts tested and validated
- [ ] Zero visual regressions in global styles
- [ ] Semantic naming system fully documented

## Daily Breakdown

### [Day 6: Variable Mapping & Analysis](../daily-plans/week-2/day-6-variable-mapping.md) ✅ **COMPLETED**
**Focus**: Map all variables to usage locations and identify consolidation opportunities  
**Status**: All 6 tasks completed successfully - 327 variables analyzed, 69% reduction plan finalized

**Morning (4 hours)**
- Generate comprehensive variable usage map across entire codebase
- Identify duplicate and similar variables (color variations, spacing multiples)
- Analyze variable naming patterns and inconsistencies

**Afternoon (4 hours)**
- Create consolidation map: which variables to merge, rename, or remove
- Document rationale for each consolidation decision
- Validate color values and spacing calculations for accuracy

**Deliverables**
- ✅ Complete variable-to-location mapping
- ✅ Consolidation plan with merge decisions
- ✅ Color and spacing value validation report

### [Day 7: Semantic Token Design](../daily-plans/week-2/day-7-semantic-design.md)
**Focus**: Design new semantic token structure and naming conventions

**Morning (4 hours)**
- Create semantic naming structure (color-primary, spacing-md, etc.)
- Design token categories: colors, typography, spacing, shadows, borders
- Map existing variables to new semantic names

**Afternoon (4 hours)**
- Create new variables.scss with consolidated semantic tokens
- Document token usage guidelines and examples
- Create token reference documentation for developers

**Deliverables**
- ✅ New semantic token structure (~100 variables)
- ✅ variables.scss with consolidated token system
- ✅ Token usage guidelines and documentation

### [Day 8: Migration Script Development](../daily-plans/week-2/day-8-migration-scripts.md)
**Focus**: Build automated scripts for variable replacement across codebase

**Morning (4 hours)**
- Create variable replacement scripts with find-and-replace logic
- Build validation scripts to verify replacement accuracy
- Create rollback scripts for emergency recovery

**Afternoon (4 hours)**
- Test migration scripts on sample files
- Validate output accuracy and completeness
- Create batch processing scripts for full codebase migration

**Deliverables**
- ✅ Automated variable migration scripts
- ✅ Validation and verification tooling
- ✅ Rollback and recovery procedures

### [Day 9: Global Styles Migration](../daily-plans/week-2/day-9-global-migration.md)
**Focus**: Update all global styles to use new token system

**Morning (4 hours)**
- Apply migration scripts to global stylesheets
- Update base styles, utilities, and layout files
- Verify variable references resolve correctly

**Afternoon (4 hours)**
- Test global style changes across all pages
- Visual regression testing for layout and styling
- Fix any migration issues or edge cases

**Deliverables**
- ✅ All global styles using new token system
- ✅ Visual regression testing complete
- ✅ Migration issues identified and resolved

### [Day 10: Backward Compatibility & Validation](../daily-plans/week-2/day-10-compatibility.md)
**Focus**: Ensure backward compatibility and validate all changes

**Morning (4 hours)**
- Create compatibility layer for gradual component migration
- Set up deprecation warnings for old variable usage
- Test mixed usage scenarios (old + new variables)

**Afternoon (4 hours)**
- Comprehensive validation of Phase 2 changes
- Bundle size impact analysis
- Performance testing and optimization verification

**Deliverables**
- ✅ Backward compatibility layer operational
- ✅ Phase 2 validation complete with zero regressions
- ✅ Ready for Phase 3 component migration

## Technical Implementation Details

### Semantic Token Structure
```scss
// Color System
$color-primary: #007bff;
$color-primary-light: #66b3ff;
$color-primary-dark: #0056b3;

$color-secondary: #6c757d;
$color-success: #28a745;
$color-warning: #ffc107;
$color-error: #dc3545;

// Spacing System
$spacing-xs: 0.25rem;   // 4px
$spacing-sm: 0.5rem;    // 8px
$spacing-md: 1rem;      // 16px
$spacing-lg: 1.5rem;    // 24px
$spacing-xl: 2rem;      // 32px
$spacing-2xl: 3rem;     // 48px

// Typography
$font-size-xs: 0.75rem;   // 12px
$font-size-sm: 0.875rem;  // 14px
$font-size-md: 1rem;      // 16px
$font-size-lg: 1.125rem;  // 18px
$font-size-xl: 1.25rem;   // 20px

$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;

// Shadows & Effects
$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

// Border Radius
$radius-sm: 0.25rem;  // 4px
$radius-md: 0.375rem; // 6px
$radius-lg: 0.5rem;   // 8px
$radius-xl: 0.75rem;  // 12px
```

### Migration Script Example
```javascript
// scripts/migrate-variables.js
const fs = require('fs');
const path = require('path');

const variableMap = {
  '$primary-blue': '$color-primary',
  '$light-blue': '$color-primary-light',
  '$spacing-8': '$spacing-xs',
  '$spacing-16': '$spacing-md',
  // ... complete mapping
};

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  Object.entries(variableMap).forEach(([oldVar, newVar]) => {
    const regex = new RegExp(`\\${oldVar}\\b`, 'g');
    content = content.replace(regex, newVar);
  });
  
  fs.writeFileSync(filePath, content);
  console.log(`Migrated: ${filePath}`);
}
```

### Backward Compatibility Layer
```scss
// compatibility.scss - Temporary file for gradual migration
@import 'variables'; // New semantic tokens

// Legacy variable aliases (with deprecation warnings)
$primary-blue: $color-primary !default;
$light-blue: $color-primary-light !default;
$spacing-8: $spacing-xs !default;
$spacing-16: $spacing-md !default;

@warn "Legacy variables are deprecated. Use new semantic tokens instead.";
```

## Variable Consolidation Examples

### Color System Consolidation
**Before (12 variables):**
```scss
$primary-blue: #007bff;
$primary-blue-light: #66b3ff;
$primary-blue-dark: #0056b3;
$blue: #007bff;
$light-blue: #66b3ff;
$dark-blue: #0056b3;
$brand-primary: #007bff;
$brand-blue: #007bff;
$accent-blue: #007bff;
$main-blue: #007bff;
$button-blue: #007bff;
$link-blue: #007bff;
```

**After (3 variables):**
```scss
$color-primary: #007bff;
$color-primary-light: #66b3ff;
$color-primary-dark: #0056b3;
```

### Spacing System Consolidation
**Before (15+ variables):**
```scss
$spacing-4: 4px;
$spacing-8: 8px;
$spacing-12: 12px;
$spacing-16: 16px;
$spacing-20: 20px;
$spacing-24: 24px;
$margin-small: 8px;
$margin-medium: 16px;
$padding-xs: 4px;
$padding-sm: 8px;
$gap-small: 8px;
$gap-medium: 16px;
// ... more variations
```

**After (6 variables):**
```scss
$spacing-xs: 0.25rem;   // 4px
$spacing-sm: 0.5rem;    // 8px
$spacing-md: 1rem;      // 16px
$spacing-lg: 1.5rem;    // 24px
$spacing-xl: 2rem;      // 32px
$spacing-2xl: 3rem;     // 48px
```

## Quality Assurance

### Visual Regression Testing
- Screenshot comparison for all major pages
- Color accuracy verification using computed style analysis
- Spacing consistency checks across components

### Performance Impact
- Bundle size measurement before/after consolidation
- CSS compilation time analysis
- Browser parsing performance testing

### Migration Validation
- Automated script testing on sample files
- Variable reference resolution verification
- Build process validation after changes

## Risk Mitigation

### Variable Value Changes
- Preserve exact color values during consolidation
- Document any intentional value adjustments
- Test visual impact of any value changes

### Migration Script Errors
- Test scripts on copies before applying to main codebase
- Create automated rollback procedures
- Validate output with diff tools

### Backward Compatibility Issues
- Maintain compatibility layer throughout Phase 3
- Monitor deprecation warnings during development
- Plan gradual removal of legacy variables

## Dependencies for Next Phase

### Required Deliverables
- [ ] New semantic token system operational (~100 variables)
- [ ] All global styles migrated successfully
- [ ] Migration scripts tested and ready for components
- [ ] Backward compatibility layer preventing breaks

### Transition Preparation
- [ ] Component migration priority list updated
- [ ] Visual regression testing baseline established
- [ ] Team training on new token system completed

---

**Previous Phase**: [Phase 1: Foundation & Quick Wins](./phase-1-foundation.md)  
**Next Phase**: [Phase 3: Component Migration](./phase-3-components.md)  
**Duration**: 10 days  
**Focus**: Migrate all components to CSS modules using new token system
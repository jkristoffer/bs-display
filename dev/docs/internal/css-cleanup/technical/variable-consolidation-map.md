# Variable Consolidation Map

**Objective**: Transform 300+ CSS variables into ~100 semantic tokens while maintaining visual parity

## Consolidation Strategy

### Color System Consolidation

#### Primary Colors (Before: 12 variables → After: 3 variables)
```scss
// BEFORE (Multiple duplicate variables)
$primary-blue: #007bff;
$primary-blue-light: #66b3ff;  
$primary-blue-dark: #0056b3;
$blue: #007bff;                // Duplicate
$light-blue: #66b3ff;          // Duplicate
$dark-blue: #0056b3;           // Duplicate
$brand-primary: #007bff;       // Duplicate
$brand-blue: #007bff;          // Duplicate
$accent-blue: #007bff;         // Duplicate
$main-blue: #007bff;           // Duplicate
$button-blue: #007bff;         // Duplicate
$link-blue: #007bff;           // Duplicate

// AFTER (Semantic tokens)
$color-primary: #007bff;
$color-primary-light: #66b3ff;
$color-primary-dark: #0056b3;
```

#### Secondary Colors (Before: 8 variables → After: 1 variable)
```scss
// BEFORE
$secondary-gray: #6c757d;
$gray: #6c757d;               // Duplicate
$text-secondary: #6c757d;     // Duplicate
$muted-gray: #6c757d;         // Duplicate
$neutral-gray: #6c757d;       // Duplicate
$secondary-color: #6c757d;    // Duplicate
$gray-text: #6c757d;          // Duplicate
$subdued-gray: #6c757d;       // Duplicate

// AFTER
$color-secondary: #6c757d;
```

#### Status Colors (Before: 15 variables → After: 4 variables)
```scss
// BEFORE
$success-green: #28a745;
$green: #28a745;              // Duplicate
$positive-green: #28a745;     // Duplicate
$valid-green: #28a745;        // Duplicate
$confirm-green: #28a745;      // Duplicate
$warning-yellow: #ffc107;
$yellow: #ffc107;             // Duplicate
$caution-yellow: #ffc107;     // Duplicate
$alert-yellow: #ffc107;       // Duplicate
$error-red: #dc3545;
$red: #dc3545;                // Duplicate
$danger-red: #dc3545;         // Duplicate
$invalid-red: #dc3545;        // Duplicate
$negative-red: #dc3545;       // Duplicate
$info-blue: #17a2b8;

// AFTER
$color-success: #28a745;
$color-warning: #ffc107;
$color-error: #dc3545;
$color-info: #17a2b8;
```

### Spacing System Consolidation

#### Spacing Variables (Before: 25+ variables → After: 6 variables)
```scss
// BEFORE (Inconsistent and redundant)
$spacing-2: 2px;
$spacing-4: 4px;
$spacing-6: 6px;
$spacing-8: 8px;
$spacing-10: 10px;
$spacing-12: 12px;
$spacing-14: 14px;
$spacing-16: 16px;
$spacing-18: 18px;
$spacing-20: 20px;
$spacing-22: 22px;
$spacing-24: 24px;
$spacing-28: 28px;
$spacing-32: 32px;
$spacing-36: 36px;
$spacing-40: 40px;
$spacing-48: 48px;
$margin-small: 8px;           // Duplicate concept
$margin-medium: 16px;         // Duplicate concept
$margin-large: 24px;          // Duplicate concept
$padding-xs: 4px;             // Duplicate concept
$padding-sm: 8px;             // Duplicate concept
$padding-md: 16px;            // Duplicate concept
$padding-lg: 24px;            // Duplicate concept
$gap-small: 8px;              // Duplicate concept
$gap-medium: 16px;            // Duplicate concept

// AFTER (Systematic scale)
$spacing-xs: 0.25rem;         // 4px
$spacing-sm: 0.5rem;          // 8px
$spacing-md: 1rem;            // 16px
$spacing-lg: 1.5rem;          // 24px
$spacing-xl: 2rem;            // 32px
$spacing-2xl: 3rem;           // 48px
```

### Typography System Consolidation

#### Font Sizes (Before: 18 variables → After: 5 variables)
```scss
// BEFORE
$font-size-10: 10px;
$font-size-11: 11px;
$font-size-12: 12px;
$font-size-13: 13px;
$font-size-14: 14px;
$font-size-15: 15px;
$font-size-16: 16px;
$font-size-17: 17px;
$font-size-18: 18px;
$font-size-20: 20px;
$font-size-22: 22px;
$font-size-24: 24px;
$text-small: 12px;            // Duplicate
$text-normal: 16px;           // Duplicate
$text-large: 18px;            // Duplicate
$text-xl: 20px;               // Duplicate
$text-xxl: 24px;              // Duplicate
$body-text: 16px;             // Duplicate

// AFTER
$font-size-xs: 0.75rem;       // 12px
$font-size-sm: 0.875rem;      // 14px
$font-size-md: 1rem;          // 16px (base)
$font-size-lg: 1.125rem;      // 18px
$font-size-xl: 1.25rem;       // 20px
```

#### Font Weights (Before: 12 variables → After: 4 variables)
```scss
// BEFORE
$font-weight-100: 100;
$font-weight-200: 200;
$font-weight-300: 300;
$font-weight-400: 400;
$font-weight-500: 500;
$font-weight-600: 600;
$font-weight-700: 700;
$font-weight-800: 800;
$font-weight-900: 900;
$font-light: 300;             // Duplicate
$font-normal: 400;            // Duplicate
$font-bold: 700;              // Duplicate

// AFTER
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

## Migration Mapping Table

### Complete Variable Migration Map

| Old Variable | New Variable | Notes |
|--------------|--------------|-------|
| `$primary-blue` | `$color-primary` | Main brand color |
| `$blue` | `$color-primary` | Same value |
| `$brand-primary` | `$color-primary` | Same value |
| `$brand-blue` | `$color-primary` | Same value |
| `$accent-blue` | `$color-primary` | Same value |
| `$main-blue` | `$color-primary` | Same value |
| `$button-blue` | `$color-primary` | Same value |
| `$link-blue` | `$color-primary` | Same value |
| `$primary-blue-light` | `$color-primary-light` | Lighter variant |
| `$light-blue` | `$color-primary-light` | Same value |
| `$primary-blue-dark` | `$color-primary-dark` | Darker variant |
| `$dark-blue` | `$color-primary-dark` | Same value |
| `$secondary-gray` | `$color-secondary` | Secondary brand color |
| `$gray` | `$color-secondary` | Same value |
| `$text-secondary` | `$color-secondary` | Same value |
| `$muted-gray` | `$color-secondary` | Same value |
| `$neutral-gray` | `$color-secondary` | Same value |
| `$secondary-color` | `$color-secondary` | Same value |
| `$success-green` | `$color-success` | Success state |
| `$green` | `$color-success` | Same value |
| `$positive-green` | `$color-success` | Same value |
| `$valid-green` | `$color-success` | Same value |
| `$warning-yellow` | `$color-warning` | Warning state |
| `$yellow` | `$color-warning` | Same value |
| `$caution-yellow` | `$color-warning` | Same value |
| `$error-red` | `$color-error` | Error state |
| `$red` | `$color-error` | Same value |
| `$danger-red` | `$color-error` | Same value |
| `$spacing-4` | `$spacing-xs` | 4px spacing |
| `$spacing-8` | `$spacing-sm` | 8px spacing |
| `$spacing-16` | `$spacing-md` | 16px spacing |
| `$spacing-24` | `$spacing-lg` | 24px spacing |
| `$spacing-32` | `$spacing-xl` | 32px spacing |
| `$spacing-48` | `$spacing-2xl` | 48px spacing |
| `$margin-small` | `$spacing-sm` | 8px spacing |
| `$margin-medium` | `$spacing-md` | 16px spacing |
| `$margin-large` | `$spacing-lg` | 24px spacing |
| `$padding-xs` | `$spacing-xs` | 4px spacing |
| `$padding-sm` | `$spacing-sm` | 8px spacing |
| `$padding-md` | `$spacing-md` | 16px spacing |
| `$padding-lg` | `$spacing-lg` | 24px spacing |
| `$font-size-12` | `$font-size-xs` | 12px text |
| `$font-size-14` | `$font-size-sm` | 14px text |
| `$font-size-16` | `$font-size-md` | 16px text |
| `$font-size-18` | `$font-size-lg` | 18px text |
| `$font-size-20` | `$font-size-xl` | 20px text |
| `$text-small` | `$font-size-xs` | 12px text |
| `$text-normal` | `$font-size-md` | 16px text |
| `$text-large` | `$font-size-lg` | 18px text |

### Variables to Remove (No Replacement)

| Variable | Reason for Removal |
|----------|-------------------|
| `$spacing-2` | Too small, not in design system |
| `$spacing-6` | Between xs and sm, not needed |
| `$spacing-10` | Odd size, not systematic |
| `$spacing-12` | Close to sm, consolidate |
| `$spacing-14` | Between sm and md, not needed |
| `$spacing-18` | Between md and lg, not needed |
| `$spacing-20` | Between md and lg, not needed |
| `$spacing-22` | Odd size, not systematic |
| `$font-size-10` | Too small for accessibility |
| `$font-size-11` | Not in systematic scale |
| `$font-size-13` | Between xs and sm |
| `$font-size-15` | Between sm and md |
| `$font-size-17` | Between md and lg |

## Automated Migration Script

### Migration Script Template
```javascript
// scripts/migrate-variables.js
const fs = require('fs');
const path = require('path');

const variableMap = {
  // Colors
  '$primary-blue': '$color-primary',
  '$blue': '$color-primary',
  '$brand-primary': '$color-primary',
  '$brand-blue': '$color-primary',
  '$accent-blue': '$color-primary',
  '$main-blue': '$color-primary',
  '$button-blue': '$color-primary',
  '$link-blue': '$color-primary',
  '$primary-blue-light': '$color-primary-light',
  '$light-blue': '$color-primary-light',
  '$primary-blue-dark': '$color-primary-dark',
  '$dark-blue': '$color-primary-dark',
  
  // Secondary colors
  '$secondary-gray': '$color-secondary',
  '$gray': '$color-secondary',
  '$text-secondary': '$color-secondary',
  '$muted-gray': '$color-secondary',
  '$neutral-gray': '$color-secondary',
  '$secondary-color': '$color-secondary',
  
  // Status colors
  '$success-green': '$color-success',
  '$green': '$color-success',
  '$positive-green': '$color-success',
  '$valid-green': '$color-success',
  '$warning-yellow': '$color-warning',
  '$yellow': '$color-warning',
  '$caution-yellow': '$color-warning',
  '$error-red': '$color-error',
  '$red': '$color-error',
  '$danger-red': '$color-error',
  
  // Spacing
  '$spacing-4': '$spacing-xs',
  '$spacing-8': '$spacing-sm',
  '$spacing-16': '$spacing-md',
  '$spacing-24': '$spacing-lg',
  '$spacing-32': '$spacing-xl',
  '$spacing-48': '$spacing-2xl',
  '$margin-small': '$spacing-sm',
  '$margin-medium': '$spacing-md',
  '$margin-large': '$spacing-lg',
  '$padding-xs': '$spacing-xs',
  '$padding-sm': '$spacing-sm',
  '$padding-md': '$spacing-md',
  '$padding-lg': '$spacing-lg',
  
  // Typography
  '$font-size-12': '$font-size-xs',
  '$font-size-14': '$font-size-sm',
  '$font-size-16': '$font-size-md',
  '$font-size-18': '$font-size-lg',
  '$font-size-20': '$font-size-xl',
  '$text-small': '$font-size-xs',
  '$text-normal': '$font-size-md',
  '$text-large': '$font-size-lg',
};

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changesMade = false;
  
  Object.entries(variableMap).forEach(([oldVar, newVar]) => {
    const regex = new RegExp(`\\${oldVar.replace(/\$/g, '\\$')}\\b`, 'g');
    if (content.match(regex)) {
      content = content.replace(regex, newVar);
      changesMade = true;
      console.log(`  ${oldVar} → ${newVar}`);
    }
  });
  
  if (changesMade) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Migrated: ${filePath}`);
    return true;
  }
  
  return false;
}

function migrateDirectory(dirPath) {
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  let totalChanges = 0;
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file.name);
    
    if (file.isDirectory()) {
      totalChanges += migrateDirectory(fullPath);
    } else if (file.name.endsWith('.scss') || file.name.endsWith('.css')) {
      if (migrateFile(fullPath)) {
        totalChanges++;
      }
    }
  });
  
  return totalChanges;
}

// Run migration
console.log('🚀 Starting variable migration...');
const changedFiles = migrateDirectory('./src');
console.log(`✅ Migration complete! ${changedFiles} files updated.`);
```

## Validation Procedures

### Pre-Migration Validation
1. **Variable Inventory**: Complete list of all existing variables
2. **Usage Analysis**: Where each variable is used
3. **Value Verification**: Confirm color/size values are identical
4. **Dependency Mapping**: Understand variable relationships

### Post-Migration Validation
1. **Build Testing**: Ensure project builds without errors
2. **Visual Regression**: Screenshots before/after comparison
3. **Functionality Testing**: All interactive elements work
4. **Performance Testing**: Bundle size and load time improvements

### Rollback Procedures
1. **Git Rollback**: Restore previous commit if issues found
2. **Variable Restoration**: Script to restore original variables
3. **Build Verification**: Confirm rollback resolves issues
4. **Documentation Update**: Record rollback reasons and learnings

---

**Related Documentation**:
- [Component Migration Guide](./component-migration-guide.md)
- [Testing Procedures](./testing-procedures.md)
- [Rollback Procedures](./rollback-procedures.md)
/**
 * CategoryTabs component exports
 * Following project patterns for clean imports
 */

export { default as CategoryTabs } from './CategoryTabs';
export { default as CategoryTab } from './CategoryTab';
export type { 
  CategoryTabsProps, 
  CategoryTabProps, 
  CategoryConfig, 
  CategoryType 
} from './types';
export {
  createCategoryConfigs,
  calculateProductCounts,
  getCategoryLabel,
  getCategoryTabClasses,
  isValidCategory
} from './utils';

// Default export for convenience
export { default } from './CategoryTabs';
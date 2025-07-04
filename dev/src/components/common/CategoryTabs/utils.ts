/**
 * Pure utility functions for CategoryTabs component
 * Following functional programming principles - no side effects
 */

import type { CategoryType, CategoryConfig, CategoryData } from './types';

/**
 * Pure function to create category configuration
 * @param productCounts - Optional product counts for each category
 * @returns Immutable array of category configurations
 */
export const createCategoryConfigs = (
  productCounts?: Record<CategoryType, number>
): readonly CategoryConfig[] => {
  const baseConfigs: readonly CategoryConfig[] = [
    {
      key: 'smartboards',
      label: 'Smart Boards',
      icon: '',
      path: '/products/smartboards'
    },
    {
      key: 'lecterns',
      label: 'Lecterns',
      icon: '',
      path: '/products/lecterns'
    },
    {
      key: 'accessories',
      label: 'Accessories',
      icon: '',
      path: '/products/accessories'
    },
    {
      key: 'collaboration',
      label: 'Collaboration',
      icon: '',
      path: '/products/collaboration'
    }
  ] as const;

  // Add product counts if provided
  return baseConfigs.map(config => ({
    ...config,
    count: productCounts?.[config.key]
  }));
};

/**
 * Pure function to calculate product counts from data arrays
 * @param categoryData - Object containing product arrays for each category
 * @returns Product counts for each category
 */
export const calculateProductCounts = (
  categoryData: CategoryData
): Record<CategoryType, number> => ({
  smartboards: categoryData.smartboards.length,
  lecterns: categoryData.lecterns.length,
  accessories: categoryData.accessories.length,
  collaboration: categoryData.collaboration.length
});

/**
 * Pure function to get category display label with count
 * @param category - Category configuration
 * @param showCount - Whether to show count
 * @returns Formatted label string
 */
export const getCategoryLabel = (
  category: CategoryConfig,
  showCount: boolean = true
): string => {
  if (!showCount || category.count === undefined) {
    return category.label;
  }
  return `${category.label} (${category.count})`;
};

/**
 * Pure function to generate CSS classes for category tab
 * @param isActive - Whether the tab is active
 * @param className - Additional CSS classes
 * @returns Space-separated CSS class string
 */
export const getCategoryTabClasses = (
  isActive: boolean,
  className?: string
): string => {
  const baseClasses = ['category-tab'];
  
  if (isActive) {
    baseClasses.push('category-tab--active');
  }
  
  if (className) {
    baseClasses.push(className);
  }
  
  return baseClasses.join(' ');
};

/**
 * Pure function to check if a category is valid
 * @param category - Category to validate
 * @returns Boolean indicating validity
 */
export const isValidCategory = (category: string): category is CategoryType => {
  const validCategories: readonly CategoryType[] = ['smartboards', 'lecterns', 'accessories', 'collaboration'];
  return validCategories.includes(category as CategoryType);
};
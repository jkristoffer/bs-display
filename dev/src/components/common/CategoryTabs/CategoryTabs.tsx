/**
 * CategoryTabs - Main navigation tabs component
 * Functional programming approach with immutable data and pure functions
 */

import React, { useMemo, useCallback } from 'react';
import type { CategoryTabsProps, CategoryType } from './types';
import CategoryTab from './CategoryTab';
import { createCategoryConfigs, calculateProductCounts } from './utils';
import styles from './CategoryTabs.module.scss';

// Import product data for count calculations
import { default as smartboardsData } from '../../../data/models/models.all.js';
import { default as lecternsData } from '../../../data/lecterns/lecterns.all.js';
import { default as accessoriesData } from '../../../data/accessories/accessories.all.js';
import { default as collaborationData } from '../../../data/collaboration/collaboration.all.js';

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  showCounts = true,
  className
}) => {
  // Memoized product counts calculation using pure functions
  const productCounts = useMemo(() => {
    if (!showCounts) return undefined;
    
    return calculateProductCounts({
      smartboards: smartboardsData,
      lecterns: lecternsData,
      accessories: accessoriesData,
      collaboration: collaborationData
    });
  }, [showCounts]);

  // Memoized category configurations using pure functions
  const categoryConfigs = useMemo(() => 
    createCategoryConfigs(productCounts),
    [productCounts]
  );

  // Navigation handler - uses native navigation for SEO and simplicity
  const handleCategoryClick = useCallback((categoryKey: CategoryType) => {
    const targetCategory = categoryConfigs.find(cat => cat.key === categoryKey);
    if (targetCategory?.path) {
      window.location.href = targetCategory.path;
    }
  }, [categoryConfigs]);

  // Memoized container classes
  const containerClasses = useMemo(() => {
    const baseClasses = [styles.categoryTabs];
    if (className) {
      baseClasses.push(className);
    }
    return baseClasses.join(' ');
  }, [className]);

  return (
    <nav 
      className={containerClasses}
      role="tablist"
      aria-label="Product category navigation"
    >
      {categoryConfigs.map((category) => (
        <CategoryTab
          key={category.key}
          category={category}
          isActive={category.key === activeCategory}
          onClick={handleCategoryClick}
        />
      ))}
    </nav>
  );
};

export default React.memo(CategoryTabs);
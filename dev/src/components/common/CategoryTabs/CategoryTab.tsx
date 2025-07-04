/**
 * CategoryTab - Individual tab component
 * Functional programming approach with pure render logic
 */

import React, { useCallback } from 'react';
import type { CategoryTabProps } from './types';
import { getCategoryLabel, getCategoryTabClasses } from './utils';
import styles from './CategoryTabs.module.scss';

const CategoryTab: React.FC<CategoryTabProps> = ({
  category,
  isActive,
  onClick
}) => {
  // Memoized click handler following functional patterns
  const handleClick = useCallback(() => {
    if (onClick && !isActive) {
      onClick(category.key);
    }
  }, [onClick, isActive, category.key]);

  // Memoized keyboard handler for accessibility
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if ((event.key === 'Enter' || event.key === ' ') && onClick && !isActive) {
      event.preventDefault();
      onClick(category.key);
    }
  }, [onClick, isActive, category.key]);

  return (
    <button
      type="button"
      className={getCategoryTabClasses(isActive, styles.categoryTab)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-selected={isActive}
      aria-controls={`category-panel-${category.key}`}
      role="tab"
      tabIndex={isActive ? 0 : -1}
    >
      {category.icon && (
        <span className={styles.categoryIcon} aria-hidden="true">
          {category.icon}
        </span>
      )}
      <span className={styles.categoryLabel}>
        {getCategoryLabel(category, true)}
      </span>
    </button>
  );
};

export default React.memo(CategoryTab);
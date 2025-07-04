import React, { useState, useEffect, useMemo } from 'react';
import FilterOption from './FilterOption';
import styles from './FilterPanel.module.scss';
import type { ProductModel, FilterCounts } from '../../../../types/product';
import type { FilterConfig, DynamicFilterState, ExpandedState, DynamicFilterPanelProps } from '../../../../types/filter.types';

const DynamicFilterPanel: React.FC<DynamicFilterPanelProps> = ({ 
  allModels, 
  filterConfig, 
  onFilterChange 
}) => {
  const [filterState, setFilterState] = useState<DynamicFilterState>({});
  const [isExpanded, setIsExpanded] = useState<ExpandedState>({});

  // Initialize filter state and expanded state from configuration
  useEffect(() => {
    const initialFilterState: DynamicFilterState = {};
    const initialExpandedState: ExpandedState = {};
    
    filterConfig.forEach(config => {
      initialFilterState[config.id] = [];
      initialExpandedState[config.id] = config.defaultExpanded ?? false;
    });
    
    setFilterState(initialFilterState);
    setIsExpanded(initialExpandedState);
  }, [filterConfig]);

  // Optimized count calculations with memoization
  const filterCounts = useMemo<Record<string, FilterCounts>>(() => {
    const counts: Record<string, FilterCounts> = {};
    
    filterConfig.forEach(config => {
      counts[config.id] = {};
      allModels.forEach((model: ProductModel) => {
        const value = config.accessor(model);
        
        if (value !== undefined && value !== null) {
          // Handle array values (like motorizedFeatures, compatibility)
          if (Array.isArray(value)) {
            value.forEach(item => {
              if (item) {
                counts[config.id][item] = (counts[config.id][item] || 0) + 1;
              }
            });
          } else {
            // Handle single values
            const stringValue = String(value);
            counts[config.id][stringValue] = (counts[config.id][stringValue] || 0) + 1;
          }
        }
      });
    });
    
    return counts;
  }, [allModels, filterConfig]);

  const getFilterCount = (filterId: string, value: any): number => {
    return filterCounts[filterId]?.[String(value)] || 0;
  };

  useEffect(() => {
    onFilterChange(filterState);
  }, [filterState, onFilterChange]);

  const toggleFilterValue = (filterId: string, value: any): void => {
    const stringValue = String(value);
    const currentValues = filterState[filterId] || [];
    
    setFilterState(prev => ({
      ...prev,
      [filterId]: currentValues.includes(stringValue)
        ? currentValues.filter(v => v !== stringValue)
        : [...currentValues, stringValue]
    }));
  };

  const toggleSection = (filterId: string): void => {
    setIsExpanded(prev => ({
      ...prev,
      [filterId]: !prev[filterId]
    }));
  };

  const clearFilters = (): void => {
    const clearedState: DynamicFilterState = {};
    filterConfig.forEach(config => {
      clearedState[config.id] = [];
    });
    setFilterState(clearedState);
  };

  const getFilterOptions = useMemo(() => (config: FilterConfig): any[] => {
    const allValues = allModels
      .map((model: ProductModel) => config.accessor(model))
      .filter(value => value !== undefined && value !== null)
      .flatMap(value => Array.isArray(value) ? value.filter(Boolean) : [value]);
    
    const uniqueValues = Array.from(new Set(allValues));
    
    // Apply sorting based on configuration
    if (config.sortOrder === 'alpha') {
      return [...uniqueValues].sort((a, b) => String(a).localeCompare(String(b)));
    } else if (config.sortOrder === 'numeric') {
      return [...uniqueValues].sort((a, b) => Number(a) - Number(b));
    } else if (config.sortOrder === 'custom' && config.customSort) {
      return [...uniqueValues].sort(config.customSort);
    }
    
    return uniqueValues;
  }, [allModels]);

  const hasActiveFilters = Object.values(filterState).some(values => values.length > 0);

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Filters</h2>
        {hasActiveFilters && (
          <button className={styles.clearButton} onClick={clearFilters}>
            Clear All
          </button>
        )}
      </div>

      {filterConfig.map(config => {
        const options = getFilterOptions(config);
        const currentFilterValues = filterState[config.id] || [];
        
        if (options.length === 0) return null;
        
        return (
          <div key={config.id} className={styles.filterSection}>
            <div
              className={styles.sectionHeader}
              onClick={() => toggleSection(config.id)}
            >
              <h3 className={styles.sectionTitle}>{config.label}</h3>
              <span className={styles.expandIcon}>
                {isExpanded[config.id] ? '−' : '+'}
              </span>
            </div>

            {isExpanded[config.id] && (
              <div className={styles.optionsContainer}>
                {options.map((option: any) => {
                  const displayValue = config.formatter ? config.formatter(option) : String(option);
                  const stringValue = String(option);
                  
                  return (
                    <FilterOption
                      key={stringValue}
                      label={displayValue}
                      checked={currentFilterValues.includes(stringValue)}
                      onChange={() => toggleFilterValue(config.id, option)}
                      count={getFilterCount(config.id, option)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
};

export default DynamicFilterPanel;
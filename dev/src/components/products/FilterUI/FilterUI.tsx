import React, { useState } from 'react';
import FilterPanel from './FilterPanel/FilterPanel';
import DynamicFilterPanel from './FilterPanel/DynamicFilterPanel';
import ModelDisplay from './ModelDisplay/ModelDisplay';
import styles from './FilterUI.module.scss';
import { getFilterConfigForProductType } from './configs/filterConfigs';
import type { ProductModel, FilterState, FilterUIProps } from '../../../types/product';
import type { DynamicFilterState } from '../../../types/filter.types';

const FilterUI: React.FC<FilterUIProps> = ({ allModels, productType = 'smartboards', customFilters }) => {
  const [dynamicFilters, setDynamicFilters] = useState<DynamicFilterState>({});
  const [mobileFiltersVisible, setMobileFiltersVisible] = useState<boolean>(false);

  const filterConfig = customFilters || getFilterConfigForProductType(productType);

  const filtered = allModels.filter((model: ProductModel) => {
    return filterConfig.every(config => {
      const filterValues = dynamicFilters[config.id] || [];
      if (filterValues.length === 0) return true;
      
      const modelValue = config.accessor(model);
      
      if (modelValue === undefined || modelValue === null) return false;
      
      // Handle array values (like motorizedFeatures, compatibility)
      if (Array.isArray(modelValue)) {
        return modelValue.some(item => filterValues.includes(String(item)));
      }
      
      // Handle single values
      return filterValues.includes(String(modelValue));
    });
  });

  const toggleMobileFilters = (): void => {
    setMobileFiltersVisible(!mobileFiltersVisible);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.mobileFilterToggle}>
        <button onClick={toggleMobileFilters}>
          {mobileFiltersVisible ? 'Hide Filters' : 'Show Filters'}(
          {filtered.length} products)
        </button>
      </div>

      <div
        className={`${styles.filterPanel} ${mobileFiltersVisible ? styles.visible : ''}`}
      >
        {productType === 'smartboards' ? (
          <FilterPanel allModels={allModels} onFilterChange={(legacyFilters: FilterState) => {
            // Convert legacy filters to dynamic format for backward compatibility
            const dynamicFormat: DynamicFilterState = {
              brand: legacyFilters.brands,
              size: legacyFilters.sizes.map(String),
              touchTechnology: legacyFilters.touchTechs,
              contrastRatio: legacyFilters.contrastRatios
            };
            setDynamicFilters(dynamicFormat);
          }} />
        ) : (
          <DynamicFilterPanel 
            allModels={allModels}
            filterConfig={filterConfig}
            onFilterChange={setDynamicFilters}
          />
        )}
      </div>

      <div className={styles.modelDisplay}>
        <ModelDisplay models={filtered} productType={productType} />
      </div>
    </div>
  );
};

export default FilterUI;
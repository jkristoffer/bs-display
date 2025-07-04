import React from 'react';
import DynamicFilterPanel from './DynamicFilterPanel';
import { smartBoardFilters } from '../configs/filterConfigs';
import type { FilterPanelProps, FilterState } from '../../../../types/product';
import type { DynamicFilterState } from '../../../../types/filter.types';

const FilterPanel: React.FC<FilterPanelProps> = ({ allModels, onFilterChange }) => {
  const handleDynamicFilterChange = (dynamicFilters: DynamicFilterState): void => {
    // Convert dynamic filter state back to legacy format for backward compatibility
    const legacyFilters: FilterState = {
      brands: dynamicFilters.brand || [],
      sizes: (dynamicFilters.size || []).map(Number),
      touchTechs: dynamicFilters.touchTechnology || [],
      contrastRatios: dynamicFilters.contrastRatio || []
    };
    
    onFilterChange(legacyFilters);
  };

  return (
    <DynamicFilterPanel 
      allModels={allModels}
      filterConfig={smartBoardFilters}
      onFilterChange={handleDynamicFilterChange}
    />
  );
};

export default FilterPanel;
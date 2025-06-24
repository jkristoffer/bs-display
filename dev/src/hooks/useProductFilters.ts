/**
 * Custom hook for product filtering logic
 */
import { useState, useMemo } from 'react';
import type { ProductModel, FilterState, FilterCounts } from '../types/product';

export const useProductFilters = (allModels: ProductModel[]) => {
  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    sizes: [],
    touchTechs: [],
    contrastRatios: []
  });

  // Optimized count calculations with memoization
  const filterCounts = useMemo(() => {
    const brandCounts: FilterCounts = {};
    const sizeCounts: FilterCounts = {};
    const touchTechCounts: FilterCounts = {};
    const contrastRatioCounts: FilterCounts = {};

    allModels.forEach(model => {
      // Brand counts
      brandCounts[model.brand] = (brandCounts[model.brand] || 0) + 1;
      
      // Size counts
      sizeCounts[model.size] = (sizeCounts[model.size] || 0) + 1;
      
      // Touch technology counts
      if (model.touchTechnology) {
        touchTechCounts[model.touchTechnology] = (touchTechCounts[model.touchTechnology] || 0) + 1;
      }
      
      // Contrast ratio counts
      if (model.contrastRatio) {
        contrastRatioCounts[model.contrastRatio] = (contrastRatioCounts[model.contrastRatio] || 0) + 1;
      }
    });

    return {
      brands: brandCounts,
      sizes: sizeCounts,
      touchTechs: touchTechCounts,
      contrastRatios: contrastRatioCounts
    };
  }, [allModels]);

  // Extract unique values for each filter
  const filterOptions = useMemo(() => ({
    brands: [...new Set(allModels.map(m => m.brand))].sort(),
    sizes: [...new Set(allModels.map(m => m.size))].sort((a, b) => a - b),
    touchTechs: [...new Set(allModels.map(m => m.touchTechnology))].filter(Boolean),
    contrastRatios: [...new Set(allModels.map(m => m.contrastRatio))].filter(Boolean)
  }), [allModels]);

  // Filter products based on current filter state
  const filteredModels = useMemo(() => {
    return allModels.filter(model => {
      const matchBrand = filters.brands.length === 0 || filters.brands.includes(model.brand);
      const matchSize = filters.sizes.length === 0 || filters.sizes.includes(model.size);
      const matchTouchTech = filters.touchTechs.length === 0 || 
        (model.touchTechnology && filters.touchTechs.includes(model.touchTechnology));
      const matchContrastRatio = filters.contrastRatios.length === 0 || 
        (model.contrastRatio && filters.contrastRatios.includes(model.contrastRatio));

      return matchBrand && matchSize && matchTouchTech && matchContrastRatio;
    });
  }, [allModels, filters]);

  const clearFilters = () => {
    setFilters({
      brands: [],
      sizes: [],
      touchTechs: [],
      contrastRatios: []
    });
  };

  const hasActiveFilters = filters.brands.length > 0 || 
    filters.sizes.length > 0 || 
    filters.touchTechs.length > 0 || 
    filters.contrastRatios.length > 0;

  return {
    filters,
    setFilters,
    filteredModels,
    filterCounts,
    filterOptions,
    clearFilters,
    hasActiveFilters
  };
};
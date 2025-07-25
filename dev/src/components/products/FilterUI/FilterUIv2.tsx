/**
 * FilterUIv2 - Modern filter interface with toolbar and drawer
 * Replaces the old fixed sidebar approach with better UX
 */

import React, { useState, useMemo, useCallback } from 'react';
import type { ProductModel } from '../../../types/product';
import ProductCard from '../../common/ProductCard/ProductCard';
import styles from './FilterUIv2.module.scss';

interface FilterUIv2Props {
  allModels: ProductModel[];
  productType?: string;
}

const FilterUIv2: React.FC<FilterUIv2Props> = ({ 
  allModels, 
  productType = 'smartboards' 
}) => {
  // State management
  const [activeFilters, setActiveFilters] = useState<{[key: string]: string[]}>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');

  // Filter data extraction
  const filterData = useMemo(() => {
    const brands = [...new Set(allModels.map(m => m.brand))].sort();
    const sizes = [...new Set(allModels.map(m => m.size))].sort((a, b) => a - b);
    const touchTechs = [...new Set(allModels.map(m => m.touchTechnology).filter(Boolean))].sort();
    return { brands, sizes, touchTechs };
  }, [allModels]);

  // Apply filters and sorting
  const filteredAndSortedModels = useMemo(() => {
    let filtered = allModels.filter(model => {
      // Brand filter
      if (activeFilters.brand?.length && !activeFilters.brand.includes(model.brand)) {
        return false;
      }
      // Size filter
      if (activeFilters.size?.length && !activeFilters.size.includes(String(model.size))) {
        return false;
      }
      // Touch technology filter
      if (activeFilters.touchTechnology?.length && model.touchTechnology && 
          !activeFilters.touchTechnology.includes(model.touchTechnology)) {
        return false;
      }
      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'brand':
          return a.brand.localeCompare(b.brand);
        case 'size':
          return a.size - b.size;
        case 'name':
        default:
          return (a.name || a.model).localeCompare(b.name || b.model);
      }
    });

    return filtered;
  }, [allModels, activeFilters, sortBy]);

  // Active filter chips
  const filterChips = useMemo(() => {
    const chips: Array<{id: string, label: string, category: string, value: string}> = [];
    Object.entries(activeFilters).forEach(([category, values]) => {
      values.forEach(value => {
        let label = value;
        if (category === 'size') label = `${value}"`;
        chips.push({
          id: `${category}:${value}`,
          label,
          category,
          value
        });
      });
    });
    return chips;
  }, [activeFilters]);

  // Filter actions
  const toggleFilter = (category: string, value: string) => {
    setActiveFilters(prev => {
      const currentValues = prev[category] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return newValues.length > 0 
        ? { ...prev, [category]: newValues }
        : { ...prev, [category]: [] };
    });
  };

  const removeFilter = (category: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: (prev[category] || []).filter(v => v !== value)
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters({});
  };

  // Product action handlers
  const handleViewDetails = useCallback((product: ProductModel) => {
    const brandSlug = product.brand.toLowerCase().replace(/\s+/g, '-');
    window.location.href = `/products/${productType}/${brandSlug}/${product.id}`;
  }, [productType]);

  const handleRequestQuote = useCallback((product: ProductModel) => {
    // Navigate to contact page with product info
    const params = new URLSearchParams({
      product: `${product.brand} ${product.model}`,
      type: productType || 'smartboards'
    });
    window.location.href = `/contact?${params.toString()}`;
  }, [productType]);

  return (
    <div className={styles.container}>
      
      {/* TOP TOOLBAR */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarContent}>
          
          {/* Left: Filter button and chips */}
          <div className={styles.toolbarLeft}>
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className={`${styles.filterToggle} ${drawerOpen ? styles.filterToggleActive : ''}`}
            >
              🔍 Filters {filterChips.length > 0 && `(${filterChips.length})`}
            </button>

            {/* Filter Chips */}
            <div className={styles.chipContainer}>
              {filterChips.map(chip => (
                <div
                  key={chip.id}
                  className={styles.chip}
                >
                  {chip.label}
                  <button
                    onClick={() => removeFilter(chip.category, chip.value)}
                    className={styles.chipRemove}
                  >
                    ×
                  </button>
                </div>
              ))}
              
              {filterChips.length > 0 && (
                <button
                  onClick={clearAllFilters}
                  className={styles.clearAll}
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Right: Controls */}
          <div className={styles.toolbarRight}>
            <span className={styles.productCount}>
              {filteredAndSortedModels.length} products
            </span>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="name">Name A-Z</option>
              <option value="brand">Brand</option>
              <option value="size">Size</option>
            </select>

            <div className={styles.viewModeGroup}>
              <button
                onClick={() => setViewMode('grid')}
                className={`${styles.viewModeButton} ${viewMode === 'grid' ? styles.viewModeButtonActive : ''}`}
              >
                ▦
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`${styles.viewModeButton} ${viewMode === 'list' ? styles.viewModeButtonActive : ''}`}
              >
                ☰
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainLayout}>
        
        {/* FILTER DRAWER */}
        {drawerOpen && (
          <div className={styles.drawer}>
            <h3 className={styles.drawerTitle}>Filter Options</h3>
            
            {/* Brand Filter */}
            <div className={styles.filterSection}>
              <h4 className={styles.filterSectionTitle}>Brands</h4>
              <div className={styles.filterOptions}>
                {filterData.brands.map(brand => (
                  <label key={brand} className={styles.filterLabel}>
                    <input
                      type="checkbox"
                      checked={(activeFilters.brand || []).includes(brand)}
                      onChange={() => toggleFilter('brand', brand)}
                      className={styles.filterCheckbox}
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className={styles.filterSection}>
              <h4 className={styles.filterSectionTitle}>Screen Size</h4>
              <div className={styles.filterOptions}>
                {filterData.sizes.map(size => (
                  <label key={size} className={styles.filterLabel}>
                    <input
                      type="checkbox"
                      checked={(activeFilters.size || []).includes(String(size))}
                      onChange={() => toggleFilter('size', String(size))}
                      className={styles.filterCheckbox}
                    />
                    <span>{size}" Display</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Touch Technology Filter (for smartboards) */}
            {productType === 'smartboards' && filterData.touchTechs.length > 0 && (
              <div className={styles.filterSection}>
                <h4 className={styles.filterSectionTitle}>Touch Technology</h4>
                <div className={styles.filterOptions}>
                  {filterData.touchTechs.map(tech => tech && (
                    <label key={tech} className={styles.filterLabel}>
                      <input
                        type="checkbox"
                        checked={(activeFilters.touchTechnology || []).includes(tech)}
                        onChange={() => toggleFilter('touchTechnology', tech)}
                        className={styles.filterCheckbox}
                      />
                      <span>{tech}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PRODUCTS DISPLAY */}
        <div className={styles.productsSection}>
          <div className={viewMode === 'grid' ? styles.productGrid : styles.productList}>
            {filteredAndSortedModels.map((model, index) => (
              <ProductCard
                key={model.id || index}
                product={model}
                displayMode={viewMode}
                productType={productType as 'smartboards' | 'lecterns' | 'accessories'}
                actions={{
                  viewDetails: {
                    label: 'View Details',
                    onClick: handleViewDetails
                  },
                  requestQuote: {
                    label: 'Request Quote',
                    onClick: handleRequestQuote
                  }
                }}
                context="filter"
                maxFeatures={3}
              />
            ))}
          </div>
          
          {filteredAndSortedModels.length === 0 && (
            <div className={styles.emptyState}>
              <h3 className={styles.emptyStateTitle}>No products match your filters</h3>
              <p className={styles.emptyStateText}>Try adjusting your filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterUIv2;
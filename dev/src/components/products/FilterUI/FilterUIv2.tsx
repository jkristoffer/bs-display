/**
 * FilterUIv2 - Modern filter interface with toolbar and drawer
 * Replaces the old fixed sidebar approach with better UX
 */

import React, { useState, useMemo, useCallback } from 'react';
import type { ProductModel } from '../../../types/product';
import ProductCard from '../../common/ProductCard/ProductCard';

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
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      
      {/* TOP TOOLBAR */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'white',
        borderBottom: '1px solid #ddd',
        padding: '16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          
          {/* Left: Filter button and chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: drawerOpen ? 'var(--color-primary)' : '#fff',
                color: drawerOpen ? 'white' : 'var(--color-primary)',
                border: '1px solid var(--color-primary)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
            >
              🔍 Filters {filterChips.length > 0 && `(${filterChips.length})`}
            </button>

            {/* Filter Chips */}
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              {filterChips.map(chip => (
                <div
                  key={chip.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    background: 'var(--color-primary)',
                    color: 'white',
                    borderRadius: '16px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {chip.label}
                  <button
                    onClick={() => removeFilter(chip.category, chip.value)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      padding: '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      fontSize: '12px'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              
              {filterChips.length > 0 && (
                <button
                  onClick={clearAllFilters}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary)',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontSize: '14px'
                  }}
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Right: Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#666', fontSize: '14px', whiteSpace: 'nowrap' }}>
              {filteredAndSortedModels.length} products
            </span>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '6px 8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="name">Name A-Z</option>
              <option value="brand">Brand</option>
              <option value="size">Size</option>
            </select>

            <div style={{ display: 'flex', border: '1px solid #ddd', borderRadius: '4px' }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '6px 8px',
                  background: viewMode === 'grid' ? 'var(--color-primary)' : 'white',
                  color: viewMode === 'grid' ? 'white' : '#666',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                ▦
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '6px 8px',
                  background: viewMode === 'list' ? 'var(--color-primary)' : 'white',
                  color: viewMode === 'list' ? 'white' : '#666',
                  border: 'none',
                  borderLeft: '1px solid #ddd',
                  cursor: 'pointer'
                }}
              >
                ☰
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* FILTER DRAWER */}
        {drawerOpen && (
          <div style={{
            width: '300px',
            background: 'white',
            borderRight: '1px solid #ddd',
            padding: '20px',
            position: 'sticky',
            top: '80px',
            height: 'calc(100vh - 80px)',
            overflowY: 'auto'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Filter Options</h3>
            
            {/* Brand Filter */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>Brands</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filterData.brands.map(brand => (
                  <label key={brand} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={(activeFilters.brand || []).includes(brand)}
                      onChange={() => toggleFilter('brand', brand)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px' }}>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>Screen Size</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filterData.sizes.map(size => (
                  <label key={size} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={(activeFilters.size || []).includes(String(size))}
                      onChange={() => toggleFilter('size', String(size))}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px' }}>{size}" Display</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Touch Technology Filter (for smartboards) */}
            {productType === 'smartboards' && filterData.touchTechs.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>Touch Technology</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filterData.touchTechs.map(tech => tech && (
                    <label key={tech} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={(activeFilters.touchTechnology || []).includes(tech)}
                        onChange={() => toggleFilter('touchTechnology', tech)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '14px' }}>{tech}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PRODUCTS DISPLAY */}
        <div style={{ flex: 1, padding: '20px' }}>
          <div style={{
            display: viewMode === 'grid' ? 'grid' : 'flex',
            gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(320px, 1fr))' : 'none',
            flexDirection: viewMode === 'list' ? 'column' : 'row',
            gap: '24px'
          }}>
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
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#666',
              background: '#f9f9f9',
              borderRadius: '8px',
              border: '2px dashed #ddd'
            }}>
              <h3 style={{ margin: '0 0 8px 0' }}>No products match your filters</h3>
              <p style={{ margin: 0 }}>Try adjusting your filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterUIv2;
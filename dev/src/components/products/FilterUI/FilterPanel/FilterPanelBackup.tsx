import React, { useState, useEffect, useMemo } from 'react';
import FilterOption from './FilterOption';
import styles from './FilterPanel.module.scss';
import type { ProductModel, FilterPanelProps, FilterCounts } from '../../../../types/product';

interface ExpandedState {
  brands: boolean;
  sizes: boolean;
  touchTech: boolean;
  contrastRatio: boolean;
}

const FilterPanelBackup: React.FC<FilterPanelProps> = ({ allModels, onFilterChange }) => {
  const [brands, setBrands] = useState<string[]>([]);
  const [sizes, setSizes] = useState<number[]>([]);
  const [touchTechs, setTouchTechs] = useState<string[]>([]);
  const [contrastRatios, setContrastRatios] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState<ExpandedState>({
    brands: true,
    sizes: true,
    touchTech: false,
    contrastRatio: false
  });

  // Optimized count calculations with memoization
  const brandCounts = useMemo<FilterCounts>(() => {
    const counts: FilterCounts = {};
    allModels.forEach((model: ProductModel) => {
      counts[model.brand] = (counts[model.brand] || 0) + 1;
    });
    return counts;
  }, [allModels]);

  const sizeCounts = useMemo<FilterCounts>(() => {
    const counts: FilterCounts = {};
    allModels.forEach((model: ProductModel) => {
      counts[model.size] = (counts[model.size] || 0) + 1;
    });
    return counts;
  }, [allModels]);

  const touchTechCounts = useMemo<FilterCounts>(() => {
    const counts: FilterCounts = {};
    allModels.forEach((model: ProductModel) => {
      if (model.touchTechnology) {
        counts[model.touchTechnology] = (counts[model.touchTechnology] || 0) + 1;
      }
    });
    return counts;
  }, [allModels]);

  const contrastRatioCounts = useMemo<FilterCounts>(() => {
    const counts: FilterCounts = {};
    allModels.forEach((model: ProductModel) => {
      if (model.contrastRatio) {
        counts[model.contrastRatio] = (counts[model.contrastRatio] || 0) + 1;
      }
    });
    return counts;
  }, [allModels]);

  const getBrandCount = (brand: string): number => brandCounts[brand] || 0;
  const getSizeCount = (size: number): number => sizeCounts[size] || 0;
  const getTouchTechCount = (tech: string): number => touchTechCounts[tech] || 0;
  const getContrastRatioCount = (ratio: string): number => contrastRatioCounts[ratio] || 0;

  useEffect(() => {
    onFilterChange({
      brands,
      sizes,
      touchTechs,
      contrastRatios
    });
  }, [brands, sizes, touchTechs, contrastRatios, onFilterChange]);

  const toggleBrand = (item: string): void => {
    setBrands(
      brands.includes(item) ? brands.filter((i) => i !== item) : [...brands, item]
    );
  };

  const toggleSize = (item: number): void => {
    setSizes(
      sizes.includes(item) ? sizes.filter((i) => i !== item) : [...sizes, item]
    );
  };

  const toggleTouchTech = (item: string): void => {
    setTouchTechs(
      touchTechs.includes(item) ? touchTechs.filter((i) => i !== item) : [...touchTechs, item]
    );
  };

  const toggleContrastRatio = (item: string): void => {
    setContrastRatios(
      contrastRatios.includes(item) ? contrastRatios.filter((i) => i !== item) : [...contrastRatios, item]
    );
  };

  const toggleSection = (section: keyof ExpandedState): void => {
    setIsExpanded({
      ...isExpanded,
      [section]: !isExpanded[section]
    });
  };

  const clearFilters = (): void => {
    setBrands([]);
    setSizes([]);
    setTouchTechs([]);
    setContrastRatios([]);
  };

  // Extract unique values for each filter
  const allBrands = [...new Set(allModels.map((m: ProductModel) => m.brand))].sort();
  const allSizes = [...new Set(allModels.map((m: ProductModel) => m.size))].sort(
    (a: number, b: number) => a - b
  );
  const allTouchTech = [
    ...new Set(allModels.map((m: ProductModel) => m.touchTechnology))
  ].filter(Boolean) as string[];
  const allContrastRatios = [
    ...new Set(allModels.map((m: ProductModel) => m.contrastRatio))
  ].filter(Boolean) as string[];

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Filters</h2>
        {(brands.length > 0 ||
          sizes.length > 0 ||
          touchTechs.length > 0 ||
          contrastRatios.length > 0) && (
          <button className={styles.clearButton} onClick={clearFilters}>
            Clear All
          </button>
        )}
      </div>

      <div className={styles.filterSection}>
        <div
          className={styles.sectionHeader}
          onClick={() => toggleSection('brands')}
        >
          <h3 className={styles.sectionTitle}>Brands</h3>
          <span className={styles.expandIcon}>
            {isExpanded.brands ? '−' : '+'}
          </span>
        </div>

        {isExpanded.brands && (
          <div className={styles.optionsContainer}>
            {allBrands.map((brand: string) => (
              <FilterOption
                key={brand}
                label={brand}
                checked={brands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                count={getBrandCount(brand)}
              />
            ))}
          </div>
        )}
      </div>

      <div className={styles.filterSection}>
        <div
          className={styles.sectionHeader}
          onClick={() => toggleSection('sizes')}
        >
          <h3 className={styles.sectionTitle}>Screen Size</h3>
          <span className={styles.expandIcon}>
            {isExpanded.sizes ? '−' : '+'}
          </span>
        </div>

        {isExpanded.sizes && (
          <div className={styles.optionsContainer}>
            {allSizes.map((size: number) => (
              <FilterOption
                key={size}
                label={`${size}"`}
                checked={sizes.includes(size)}
                onChange={() => toggleSize(size)}
                count={getSizeCount(size)}
              />
            ))}
          </div>
        )}
      </div>

      <div className={styles.filterSection}>
        <div
          className={styles.sectionHeader}
          onClick={() => toggleSection('touchTech')}
        >
          <h3 className={styles.sectionTitle}>Touch Technology</h3>
          <span className={styles.expandIcon}>
            {isExpanded.touchTech ? '−' : '+'}
          </span>
        </div>

        {isExpanded.touchTech && (
          <div className={styles.optionsContainer}>
            {allTouchTech.map((tech: string) => (
              <FilterOption
                key={tech}
                label={tech}
                checked={touchTechs.includes(tech)}
                onChange={() => toggleTouchTech(tech)}
                count={getTouchTechCount(tech)}
              />
            ))}
          </div>
        )}
      </div>

      <div className={styles.filterSection}>
        <div
          className={styles.sectionHeader}
          onClick={() => toggleSection('contrastRatio')}
        >
          <h3 className={styles.sectionTitle}>Contrast Ratio</h3>
          <span className={styles.expandIcon}>
            {isExpanded.contrastRatio ? '−' : '+'}
          </span>
        </div>

        {isExpanded.contrastRatio && (
          <div className={styles.optionsContainer}>
            {allContrastRatios.map((ratio: string) => (
              <FilterOption
                key={ratio}
                label={ratio}
                checked={contrastRatios.includes(ratio)}
                onChange={() => toggleContrastRatio(ratio)}
                count={getContrastRatioCount(ratio)}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default FilterPanelBackup;
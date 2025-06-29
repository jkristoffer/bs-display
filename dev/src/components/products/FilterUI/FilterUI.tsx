import React, { useState } from 'react';
import FilterPanel from './FilterPanel/FilterPanel';
import ModelDisplay from './ModelDisplay/ModelDisplay';
import styles from './FilterUI.module.scss';
import type { ProductModel, FilterState, FilterUIProps } from '../../../types/product';

const FilterUI: React.FC<FilterUIProps> = ({ allModels, productType = 'smartboards' }) => {
  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    sizes: [],
    touchTechs: [],
    contrastRatios: []
  });
  const [mobileFiltersVisible, setMobileFiltersVisible] = useState<boolean>(false);

  const filtered = allModels.filter((model: ProductModel) => {
    const matchBrand =
      filters.brands.length === 0 || filters.brands.includes(model.brand);

    const matchSize =
      filters.sizes.length === 0 || filters.sizes.includes(model.size);

    const matchTouchTech =
      filters.touchTechs.length === 0 ||
      (model.touchTechnology && filters.touchTechs.includes(model.touchTechnology));

    const matchContrastRatio =
      filters.contrastRatios.length === 0 ||
      (model.contrastRatio && filters.contrastRatios.includes(model.contrastRatio));

    return matchBrand && matchSize && matchTouchTech && matchContrastRatio;
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
        <FilterPanel allModels={allModels} onFilterChange={setFilters} />
      </div>

      <div className={styles.modelDisplay}>
        <ModelDisplay models={filtered} productType={productType} />
      </div>
    </div>
  );
};

export default FilterUI;
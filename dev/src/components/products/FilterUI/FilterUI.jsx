import React, { useState } from 'react';
import FilterPanel from './FilterPanel/FilterPanel';
import ModelDisplay from './ModelDisplay/ModelDisplay';
import styles from './FilterUI.module.scss';

export default function FilterUI({ allModels }) {
  const [filters, setFilters] = useState({
    brands: [],
    sizes: [],
    touchTechs: [],
    contrastRatios: [],
    priceRanges: []
  });
  const [mobileFiltersVisible, setMobileFiltersVisible] = useState(false);

  const filtered = allModels.filter((model) => {
    const matchBrand =
      filters.brands.length === 0 || filters.brands.includes(model.brand);

    const matchSize =
      filters.sizes.length === 0 || filters.sizes.includes(model.size);

    const matchTouchTech =
      filters.touchTechs.length === 0 ||
      filters.touchTechs.includes(model.touchTechnology);

    const matchContrastRatio =
      filters.contrastRatios.length === 0 ||
      filters.contrastRatios.includes(model.contrastRatio);

    return matchBrand && matchSize && matchTouchTech && matchContrastRatio;
  });

  const toggleMobileFilters = () => {
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
        <ModelDisplay models={filtered} />
      </div>
    </div>
  );
}

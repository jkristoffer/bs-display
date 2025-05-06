import React, { useState, useEffect } from 'react';
import FilterOption from './FilterOption';
import styles from './FilterPanel.module.scss';

export default function FilterPanel({ allModels, onFilterChange }) {
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [touchTechs, setTouchTechs] = useState([]);
  const [contrastRatios, setContrastRatios] = useState([]);
  const [isExpanded, setIsExpanded] = useState({
    brands: true,
    sizes: true,
    touchTech: false,
    contrastRatio: false
  });

  // Count models for each filter option
  const getBrandCount = (brand) =>
    allModels.filter((m) => m.brand === brand).length;
  const getSizeCount = (size) =>
    allModels.filter((m) => m.size === size).length;
  const getTouchTechCount = (tech) =>
    allModels.filter((m) => m.touchTechnology === tech).length;
  const getContrastRatioCount = (ratio) =>
    allModels.filter((m) => m.contrastRatio === ratio).length;

  useEffect(() => {
    onFilterChange({
      brands,
      sizes,
      touchTechs,
      contrastRatios
    });
  }, [brands, sizes, touchTechs, contrastRatios]);

  const toggle = (item, list, setList) => {
    setList(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item]
    );
  };

  const toggleSection = (section) => {
    setIsExpanded({
      ...isExpanded,
      [section]: !isExpanded[section]
    });
  };

  const clearFilters = () => {
    setBrands([]);
    setSizes([]);
    setTouchTechs([]);
    setContrastRatios([]);
    setPriceRanges([]);
  };

  // Extract unique values for each filter
  const allBrands = [...new Set(allModels.map((m) => m.brand))].sort();
  const allSizes = [...new Set(allModels.map((m) => m.size))].sort(
    (a, b) => a - b
  );
  const allTouchTech = [
    ...new Set(allModels.map((m) => m.touchTechnology))
  ].filter(Boolean);
  const allContrastRatios = [
    ...new Set(allModels.map((m) => m.contrastRatio))
  ].filter(Boolean);

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
            {allBrands.map((brand) => (
              <FilterOption
                key={brand}
                label={brand}
                checked={brands.includes(brand)}
                onChange={() => toggle(brand, brands, setBrands)}
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
            {allSizes.map((size) => (
              <FilterOption
                key={size}
                label={`${size}"`}
                checked={sizes.includes(size)}
                onChange={() => toggle(size, sizes, setSizes)}
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
            {allTouchTech.map((tech) => (
              <FilterOption
                key={tech}
                label={tech}
                checked={touchTechs.includes(tech)}
                onChange={() => toggle(tech, touchTechs, setTouchTechs)}
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
            {allContrastRatios.map((ratio) => (
              <FilterOption
                key={ratio}
                label={ratio}
                checked={contrastRatios.includes(ratio)}
                onChange={() =>
                  toggle(ratio, contrastRatios, setContrastRatios)
                }
                count={getContrastRatioCount(ratio)}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

import { useState, useEffect, useMemo } from 'react';
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

  // Optimized count calculations with memoization
  const brandCounts = useMemo(() => {
    const counts = {};
    allModels.forEach(model => {
      counts[model.brand] = (counts[model.brand] || 0) + 1;
    });
    return counts;
  }, [allModels]);

  const sizeCounts = useMemo(() => {
    const counts = {};
    allModels.forEach(model => {
      counts[model.size] = (counts[model.size] || 0) + 1;
    });
    return counts;
  }, [allModels]);

  const touchTechCounts = useMemo(() => {
    const counts = {};
    allModels.forEach(model => {
      if (model.touchTechnology) {
        counts[model.touchTechnology] = (counts[model.touchTechnology] || 0) + 1;
      }
    });
    return counts;
  }, [allModels]);

  const contrastRatioCounts = useMemo(() => {
    const counts = {};
    allModels.forEach(model => {
      if (model.contrastRatio) {
        counts[model.contrastRatio] = (counts[model.contrastRatio] || 0) + 1;
      }
    });
    return counts;
  }, [allModels]);

  const getBrandCount = (brand) => brandCounts[brand] || 0;
  const getSizeCount = (size) => sizeCounts[size] || 0;
  const getTouchTechCount = (tech) => touchTechCounts[tech] || 0;
  const getContrastRatioCount = (ratio) => contrastRatioCounts[ratio] || 0;

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

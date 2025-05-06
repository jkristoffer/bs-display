import React, { useState } from 'react';
import ModelCard from './ModelCard';
import styles from './ModelDisplay.module.css';

export default function ModelDisplay({ models }) {
  const [sortBy, setSortBy] = useState('default');

  // Sort models based on selected criteria
  const sortedModels = [...models].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        // Extract numeric value from price range (assuming format like "$2,000 - $2,500")
        const aPrice = parseInt(a.priceRange.replace(/[^0-9]/g, ''));
        const bPrice = parseInt(b.priceRange.replace(/[^0-9]/g, ''));
        return aPrice - bPrice;
      case 'price-high':
        const aPriceHigh = parseInt(a.priceRange.replace(/[^0-9]/g, ''));
        const bPriceHigh = parseInt(b.priceRange.replace(/[^0-9]/g, ''));
        return bPriceHigh - aPriceHigh;
      case 'size-small':
        return a.size - b.size;
      case 'size-large':
        return b.size - a.size;
      default:
        // Default sorting by brand and then model
        return a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model);
    }
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.resultsCount}>
          Showing <span className={styles.count}>{models.length}</span> models
        </div>
        <div className={styles.sortContainer}>
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            className={styles.sortSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="size-small">Size: Small to Large</option>
            <option value="size-large">Size: Large to Small</option>
          </select>
        </div>
      </div>

      <section className={styles.grid}>
        {sortedModels.map((model) => (
          <div key={model.id} className={styles.cardWrapper}>
            <ModelCard model={model} />
          </div>
        ))}
      </section>

      {models.length === 0 && (
        <div className={styles.noResults}>
          <h3>No models match your current filters</h3>
          <p>Try adjusting your filter criteria to see more results.</p>
        </div>
      )}
    </div>
  );
}

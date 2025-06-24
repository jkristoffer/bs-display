import React, { useState } from 'react';
import type { Product } from '../../quiz/types';
import styles from './ProductCard.module.scss';

export interface ProductCardAction {
  label: string;
  onClick: (product: Product) => void;
  variant?: 'primary' | 'secondary';
}

export interface ProductCardProps {
  product: Product;
  displayMode?: 'grid' | 'list';
  showMatchScore?: boolean;
  matchPercentage?: number;
  actions?: {
    viewDetails?: ProductCardAction;
    requestQuote?: ProductCardAction;
  };
  maxFeatures?: number;
  getRelevantFeatures?: (product: Product, context?: string) => string[];
  context?: string;
  productType?: 'smartboards' | 'lecterns';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  displayMode = 'grid',
  showMatchScore = false,
  matchPercentage,
  actions,
  maxFeatures = 5,
  getRelevantFeatures,
  context,
  productType = 'smartboards'
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const {
    id,
    brand,
    model: modelName,
    size,
    touchTechnology,
    features = [],
    image
  } = product;

  // Get features to display
  const displayFeatures = getRelevantFeatures
    ? getRelevantFeatures(product, context)
    : features;

  const featuresToShow = displayFeatures.slice(0, maxFeatures);
  const hasMoreFeatures = displayFeatures.length > maxFeatures;

  // Handle default actions if not provided
  const handleViewDetails = () => {
    if (actions?.viewDetails?.onClick) {
      actions.viewDetails.onClick(product);
    } else {
      // Default behavior
      const brandSlug = brand.toLowerCase().replace(/\s+/g, '-');
      window.location.href = `/products/${productType}/${brandSlug}/${id}`;
    }
  };

  const handleRequestQuote = () => {
    if (actions?.requestQuote?.onClick) {
      actions.requestQuote.onClick(product);
    } else {
      // Default behavior
      window.location.href = '/contact';
    }
  };

  return (
    <div
      className={`${styles.card} ${displayMode === 'list' ? styles.listCard : ''}`}
    >
      <div
        className={`${styles.imageContainer} ${displayMode === 'list' ? styles.listImageContainer : ''}`}
      >
        {imageLoading && (
          <div className={styles.imagePlaceholder}>
            <div className={styles.loadingShimmer}></div>
          </div>
        )}
        <img
          src={
            imageError
              ? '/assets/iboard-placeholder.jpeg'
              : image || '/assets/iboard-placeholder.jpeg'
          }
          alt={`${brand} ${modelName} interactive display`}
          className={`${styles.image} ${imageLoading ? styles.imageLoading : ''}`}
          loading="lazy"
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageError(true);
            setImageLoading(false);
          }}
        />
        <div className={styles.brandBadge}>{brand}</div>
      </div>

      <div
        className={`${styles.content} ${displayMode === 'list' ? styles.listContent : ''}`}
      >
        <div className={displayMode === 'list' ? styles.mainInfo : ''}>
          <h4 className={styles.title}>
            {brand} – {modelName}
          </h4>

          <div className={styles.specs}>
            <span className={styles.spec}>{size}"</span>
            {touchTechnology && (
              <span className={styles.spec}>{touchTechnology}</span>
            )}
            {showMatchScore && matchPercentage && (
              <span className={`${styles.spec} ${styles.matchScore}`}>
                {matchPercentage}% Match
              </span>
            )}
          </div>
        </div>

        <div
          className={`${styles.featuresContainer} ${displayMode === 'list' ? styles.listFeaturesContainer : ''}`}
        >
          <h5 className={styles.featuresTitle}>Key Features</h5>
          <ul className={styles.featureList}>
            {featuresToShow.map((feature, index) => (
              <li key={index} className={styles.feature}>
                {feature}
              </li>
            ))}
          </ul>
          {hasMoreFeatures && (
            <div className={styles.moreFeatures}>
              +{displayFeatures.length - maxFeatures} more features
            </div>
          )}
        </div>

        <div
          className={`${styles.actions} ${displayMode === 'list' ? styles.listActions : ''}`}
        >
          <button
            onClick={handleViewDetails}
            className={styles.detailsButton}
            aria-label={`View details for ${brand} ${modelName}`}
          >
            {actions?.viewDetails?.label || 'View Details'}
          </button>

          {(actions?.requestQuote || !actions?.viewDetails) && (
            <button
              onClick={handleRequestQuote}
              className={styles.quoteButton}
              aria-label={`Request quote for ${brand} ${modelName}`}
            >
              {actions?.requestQuote?.label || 'Request Quote'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

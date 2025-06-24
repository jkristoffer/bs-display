import React, { useState } from 'react';
import styles from './ModelCard.module.scss';
import { routes } from '../../../../utils/routes';

const ModelCard = ({ model, displayMode, productType = 'smartboards' }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const {
    id,
    brand,
    model: modelName,
    size,
    os,
    touchTechnology,
    features,
    image
  } = model;

  const viewDetails = () => {
    // Use proper navigation instead of window.location
    const url = routes.products[productType].product(brand, id);
    window.open(url, '_self');
  };

  const requestQuote = () => {
    // Use proper navigation instead of window.location
    window.open(routes.contact, '_self');
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {imageLoading && (
          <div className={styles.imagePlaceholder}>
            <div className={styles.loadingShimmer}></div>
          </div>
        )}
        <img
          src={imageError ? '/assets/iboard-placeholder.jpeg' : (image || '/assets/iboard-placeholder.jpeg')}
          alt={modelName}
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

      <div className={`${styles.content} ${displayMode ? styles[displayMode] : ''}`}>
        <h4 className={styles.title}>
          {brand} – {modelName}
        </h4>

        <div className={styles.specs}>
          <span className={styles.spec}>{size}"</span>
          <span className={styles.spec}>{touchTechnology}</span>
          <span className={styles.spec}>{os}</span>
        </div>

        <div className={styles.featuresContainer}>
          <h5 className={styles.featuresTitle}>Key Features</h5>
          <ul className={styles.featureList}>
            {features.slice(0, 5).map((feature, index) => (
              <li key={index} className={styles.feature}>
                {feature}
              </li>
            ))}
          </ul>
          {features.length > 5 && (
            <div className={styles.moreFeatures}>
              +{features.length - 5} more features
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button onClick={viewDetails} className={styles.detailsButton}>
            View Details
          </button>
          <button onClick={requestQuote} className={styles.quoteButton}>
            Request Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelCard;

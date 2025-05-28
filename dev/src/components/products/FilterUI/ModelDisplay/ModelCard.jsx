import styles from './ModelCard.module.scss';
import { routes } from '../../../../utils/routes';

const ModelCard = ({ model, productType = 'smartboards' }) => {
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
    window.location.href = routes.products[productType].product(brand, id);
  };

  const requestQuote = () => {
    window.location.href = routes.contact;
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={image || '/assets/iboard-placeholder.jpeg'}
          alt={modelName}
          className={styles.image}
          loading="lazy"
        />
        <div className={styles.brandBadge}>{brand}</div>
      </div>

      <div className={styles.content}>
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

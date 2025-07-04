import React, { useState, useRef, useEffect } from 'react';
import type { ProductModel } from '../../../types/product';
import styles from './ProductCard.module.scss';
import SmartProductImage from '../SmartProductImage/SmartProductImage';

export interface ProductCardAction {
  label: string;
  onClick: (product: ProductModel) => void;
  variant?: 'primary' | 'secondary';
}

export interface ProductCardProps {
  product: ProductModel;
  displayMode?: 'grid' | 'list';
  showMatchScore?: boolean;
  matchPercentage?: number;
  actions?: {
    viewDetails?: ProductCardAction;
    requestQuote?: ProductCardAction;
  };
  maxFeatures?: number;
  getRelevantFeatures?: (product: ProductModel, context?: string) => string[];
  context?: string;
  productType?: 'smartboards' | 'lecterns' | 'accessories';
}

// Helper functions for ProductCard component
const useImageLoader = (image: string) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Reset loading state when image source changes
    setImageLoading(() => true);
    setImageError(() => false);
    
    // Check if image is already loaded
    const checkImageLoad = () => {
      const img = imgRef.current;
      if (img && img.complete && img.naturalHeight !== 0) {
        setImageLoading(() => false);
      }
    };
    
    checkImageLoad();
    
    // Set a timeout as fallback to hide loading animation
    const fallbackTimeout = setTimeout(() => {
      setImageLoading(() => false);
    }, 3000);
    
    return () => clearTimeout(fallbackTimeout);
  }, [image]);

  return { imageError, imageLoading, imgRef, setImageError, setImageLoading };
};

const getDisplayFeatures = (
  product: ProductModel,
  getRelevantFeatures?: (product: ProductModel, context?: string) => string[],
  context?: string,
  maxFeatures = 5
) => {
  const displayFeatures = getRelevantFeatures
    ? getRelevantFeatures(product, context)
    : product.features || [];

  return {
    featuresToShow: displayFeatures.slice(0, maxFeatures),
    hasMoreFeatures: displayFeatures.length > maxFeatures,
    totalFeatures: displayFeatures.length
  };
};

const getProductSpecs = (product: ProductModel, productType: string): string[] => {
  switch (productType) {
    case 'smartboards':
      return [
        ...(product.size > 0 ? [`${product.size}"`] : []),
        ...(product.touchTechnology ? [product.touchTechnology] : [])
      ];
      
    case 'lecterns':
      return [
        ...(product.size > 0 ? [`${product.size}"`] : []),
        ...(product.motorizedFeatures && product.motorizedFeatures.length > 0 
          ? [product.motorizedFeatures[0]] 
          : [])
      ];
      
    case 'accessories':
      return [
        ...(product.category 
          ? [product.category.charAt(0).toUpperCase() + product.category.slice(1)] 
          : []),
        ...(product.compatibility && product.compatibility.length > 0 
          ? [`Compatible with ${product.compatibility[0]}`] 
          : [])
      ];
      
    default:
      return product.size > 0 ? [`${product.size}"`] : [];
  }
};

const getProductAltText = (product: ProductModel, productType: string) => {
  const { brand, model } = product;
  
  switch (productType) {
    case 'smartboards':
      return `${brand} ${model} interactive smart board`;
    case 'lecterns':
      return `${brand} ${model} smart lectern`;
    case 'accessories':
      return `${brand} ${model} display accessory`;
    default:
      return `${brand} ${model} interactive display`;
  }
};

const getPlaceholderImage = (productType: string) => {
  switch (productType) {
    case 'smartboards':
      return '/assets/iboard-placeholder.jpeg';
    case 'lecterns':
      return '/assets/lectern-placeholder.jpeg';
    case 'accessories':
      return '/assets/accessory-placeholder.jpeg';
    default:
      return '/assets/iboard-placeholder.jpeg';
  }
};

const createActionHandlers = (
  product: ProductModel,
  actions?: ProductCardProps['actions'],
  productType = 'smartboards'
) => {
  const handleViewDetails = () => {
    if (actions?.viewDetails?.onClick) {
      actions.viewDetails.onClick(product);
    } else {
      // Default behavior
      const brandSlug = product.brand.toLowerCase().replace(/\s+/g, '-');
      window.location.href = `/products/${productType}/${brandSlug}/${product.id}`;
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

  return { handleViewDetails, handleRequestQuote };
};

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
  const {
    brand,
    model: modelName,
    image
  } = product;

  const { imageError, imageLoading, imgRef, setImageError, setImageLoading } = useImageLoader(image || '');
  const { featuresToShow, hasMoreFeatures, totalFeatures } = getDisplayFeatures(
    product,
    getRelevantFeatures,
    context,
    maxFeatures
  );
  const { handleViewDetails, handleRequestQuote } = createActionHandlers(
    product,
    actions,
    productType
  );
  const productSpecs = getProductSpecs(product, productType);
  const altText = getProductAltText(product, productType);
  const placeholderImage = getPlaceholderImage(productType);

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
        <SmartProductImage
          ref={imgRef}
          src={
            imageError
              ? placeholderImage
              : image || placeholderImage
          }
          alt={altText}
          className={`${styles.image} ${imageLoading ? styles.imageLoading : ''}`}
          loading="lazy"
          onLoad={() => setImageLoading(() => false)}
          onError={() => {
            setImageError(() => true);
            setImageLoading(() => false);
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
            {productSpecs.map((spec, index) => (
              <span key={index} className={styles.spec}>{spec}</span>
            ))}
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
              +{totalFeatures - maxFeatures} more features
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

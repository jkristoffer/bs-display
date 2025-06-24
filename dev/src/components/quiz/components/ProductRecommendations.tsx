import type { FC } from 'react';
import type { Product } from '../types';

interface ProductRecommendationsProps {
  result: string;
  getProductsForQuizResult: (result: string) => { products: Product[] };
  getRelevantFeatures: (product: Product, result: string) => string[];
}

/**
 * ProductRecommendations component that displays a list of recommended products
 * based on the quiz result with detailed information and features.
 */
export const ProductRecommendations: FC<ProductRecommendationsProps> = ({
  result,
  getProductsForQuizResult,
  getRelevantFeatures
}) => {
  // Get product recommendations based on the quiz result
  const { products } = getProductsForQuizResult(result);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="product-recommendations" aria-labelledby="product-recommendations-title">
      <h5 id="product-recommendations-title">Recommended Products:</h5>
      <div className="product-list" role="list">
        {products.map((product, index) => {
          const matchPercentage = product.matchPercentage || 95;
          return (
            <article 
              key={product.id} 
              className="product-item"
              role="listitem"
              aria-labelledby={`product-${product.id}-name`}
            >
              <div className="product-content">
                <div className="product-image-container">
                  {product.image ? (
                    <>
                      <img
                        src={product.image}
                        alt={`${product.brand} ${product.model} interactive display`}
                        className="product-image"
                        loading="lazy"
                      />
                      <div className="brand-badge" aria-label={`${product.brand} brand`}>
                        {product.brand}
                      </div>
                    </>
                  ) : (
                    <div 
                      className="product-image-placeholder" 
                      role="img"
                      aria-label={`Placeholder image for ${product.brand} ${product.model}`}
                    />
                  )}
                </div>
                
                <div className="product-details">
                  <div className="product-header">
                    <h6 
                      id={`product-${product.id}-name`}
                      className="product-name"
                    >
                      {product.brand} {product.model.split(' ')[0]}
                    </h6>
                  </div>
                  
                  <div className="product-specs" role="list" aria-label="Product specifications">
                    <span className="spec-item" role="listitem" aria-label={`Screen size: ${product.size} inches`}>
                      {product.size}"
                    </span>
                    {product.touchTechnology && (
                      <span 
                        className="spec-item" 
                        role="listitem"
                        aria-label={`Touch technology: ${product.touchTechnology}`}
                      >
                        {product.touchTechnology}
                      </span>
                    )}
                  </div>
                  
                  <div className="product-match" aria-label={`Compatibility match: ${matchPercentage} percent`}>
                    <div className="match-info">
                      <span className="match-label">Compatibility:</span>
                      <span className="match-score">{matchPercentage}%</span>
                    </div>
                    <div className="match-progress" aria-hidden="true">
                      <div 
                        className="match-progress-ring"
                        style={{ '--match-percentage': matchPercentage } as React.CSSProperties}
                      >
                        <span className="match-percentage-text">{matchPercentage}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="product-features" role="list" aria-label="Key features">
                    {getRelevantFeatures(product, result)
                      .slice(0, 3)
                      .map((feature, i) => (
                        <span 
                          key={i} 
                          className="feature-tag"
                          role="listitem"
                          aria-label={`Feature: ${feature}`}
                        >
                          {feature}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
              
              <button
                className="view-product-button"
                onClick={() => {
                  const brand = product.brand.toLowerCase().replace(/\s+/g, '-');
                  window.location.href = `/products/smartboards/${brand}/${product.id}`;
                }}
                aria-label={`View detailed information about ${product.brand} ${product.model}`}
              >
                View Details →
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
};

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
    <div className="product-recommendations">
      <h5>Recommended Products:</h5>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <div className="product-content">
              {product.image ? (
                <img
                  src={product.image}
                  alt={`${product.brand} ${product.model}`}
                  className="product-image"
                />
              ) : (
                <div className="product-image-placeholder" />
              )}
              <div className="product-details">
                <div className="product-name">
                  {product.brand} {product.model.split(' ')[0]}
                </div>
                <div className="product-specs">
                  <span className="spec-item">{product.size}"</span>
                  {product.touchTechnology && (
                    <span className="spec-item">{product.touchTechnology}</span>
                  )}
                </div>
                <div className="product-match">
                  <span className="match-label">Match:</span>
                  <span className="match-score">
                    {product.matchPercentage || 95}%
                  </span>
                </div>
                <div className="product-features">
                  {getRelevantFeatures(product, result)
                    .slice(0, 2)
                    .map((feature, i) => (
                      <div key={i} className="feature-tag">
                        {feature}
                      </div>
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
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

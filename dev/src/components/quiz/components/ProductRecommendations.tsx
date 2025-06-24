import type { FC } from 'react';
import type { Product } from '../types';
import { ProductCard } from '../../common/ProductCard';

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

  const handleViewDetails = (product: Product) => {
    const brand = product.brand.toLowerCase().replace(/\s+/g, '-');
    window.location.href = `/products/smartboards/${brand}/${product.id}`;
  };

  return (
    <section className="product-recommendations" aria-labelledby="product-recommendations-title">
      <h5 id="product-recommendations-title">Recommended Products:</h5>
      <div className="product-list" role="list">
        {products.map((product) => {
          const matchPercentage = product.matchPercentage || 95;
          
          return (
            <ProductCard
              key={product.id}
              product={product}
              showMatchScore={true}
              matchPercentage={matchPercentage}
              maxFeatures={3}
              getRelevantFeatures={getRelevantFeatures}
              context={result}
              actions={{
                viewDetails: {
                  label: 'View Details →',
                  onClick: handleViewDetails
                }
              }}
            />
          );
        })}
      </div>
    </section>
  );
};

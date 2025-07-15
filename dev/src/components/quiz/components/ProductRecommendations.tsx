import type { FC } from 'react';
import type { Product } from '../types';
import type { ProductModel } from '../../../types/product';
import { ProductCard } from '../../common/ProductCard/ProductCard';

interface ProductRecommendationsProps {
  result: string;
  getProductsForQuizResult: (result: string) => { products: Product[]; allFeatures?: string[] };
  getRelevantFeatures: (product: Product, context?: string) => string[];
}

// Convert Product type to ProductModel type for ProductCard component
const convertProductToProductModel = (product: Product): ProductModel => {
  return {
    id: product.id,
    brand: product.brand,
    model: product.model,
    size: product.size,
    touchTechnology: product.touchTechnology,
    resolution: product.resolution,
    features: product.features || [],
    image: product.image,
    // Add any additional ProductModel properties with defaults
    name: `${product.brand} ${product.model}`,
    warranty: undefined,
    priceRange: undefined,
    brightness: undefined,
    contrastRatio: undefined,
    viewingAngle: undefined,
    responseTime: undefined,
    panelLife: undefined,
    audioOutput: undefined,
    powerConsumption: undefined,
    os: undefined
  };
};

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

  const handleViewDetails = (product: ProductModel) => {
    const brand = product.brand.toLowerCase().replace(/\s+/g, '-');
    window.location.href = `/products/smartboards/${brand}/${product.id}`;
  };

  return (
    <section className="product-recommendations" aria-labelledby="product-recommendations-title">
      <h5 id="product-recommendations-title">Recommended Products:</h5>
      <div className="product-list" role="list">
        {products.map((product) => {
          const matchPercentage = product.matchPercentage || 95;
          const productModel = convertProductToProductModel(product);
          
          return (
            <ProductCard
              key={product.id}
              product={productModel}
              showMatchScore={true}
              matchPercentage={matchPercentage}
              maxFeatures={3}
              getRelevantFeatures={() => getRelevantFeatures(product, result)}
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

import React from 'react';
import { ProductCard } from '../../../common/ProductCard';
import type { ModelCardProps } from '../../../../types/product';
import type { ProductModel } from '../../../../types/product';

const ModelCard: React.FC<ModelCardProps> = ({ model, displayMode = 'grid-3', productType = 'smartboards' }) => {
  const viewDetails = (): void => {
    // Use proper navigation instead of window.location
    const brandSlug = model.brand.toLowerCase().replace(/\s+/g, '-');
    const url = `/products/${productType}/${brandSlug}/${model.id}`;
    window.open(url, '_self');
  };

  const requestQuote = (): void => {
    // Use proper navigation instead of window.location
    window.open('/contact', '_self');
  };

  // Create enhanced features list that includes OS
  const getEnhancedFeatures = (product: ProductModel): string[] => {
    const baseFeatures = product.features || [];
    const enhancedFeatures = [...baseFeatures];
    
    // Add OS as a feature if it exists and isn't already in features
    if (model.os && !baseFeatures.some((f: string) => f.toLowerCase().includes('android') || f.toLowerCase().includes('windows'))) {
      enhancedFeatures.unshift(`${model.os} Operating System`);
    }
    
    return enhancedFeatures;
  };

  return (
    <ProductCard
      product={model}
      displayMode={displayMode === 'list' ? 'list' : 'grid'}
      productType={productType as 'smartboards' | 'lecterns'}
      maxFeatures={5}
      getRelevantFeatures={getEnhancedFeatures}
      actions={{
        viewDetails: {
          label: 'View Details',
          onClick: viewDetails
        },
        requestQuote: {
          label: 'Request Quote',
          onClick: requestQuote
        }
      }}
    />
  );
};

export default ModelCard;
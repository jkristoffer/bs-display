import { ProductCard } from '../../../common/ProductCard';
import { routes } from '../../../../utils/routes';

const ModelCard = ({ model, displayMode, productType = 'smartboards' }) => {
  const viewDetails = () => {
    // Use proper navigation instead of window.location
    const url = routes.products[productType].product(model.brand, model.id);
    window.open(url, '_self');
  };

  const requestQuote = () => {
    // Use proper navigation instead of window.location
    window.open(routes.contact, '_self');
  };

  // Convert model data to Product interface format
  const productData = {
    id: model.id,
    brand: model.brand,
    model: model.model,
    size: model.size,
    touchTechnology: model.touchTechnology,
    features: model.features || [],
    image: model.image
  };

  // Create enhanced features list that includes OS
  const getEnhancedFeatures = (product) => {
    const baseFeatures = product.features || [];
    const enhancedFeatures = [...baseFeatures];
    
    // Add OS as a feature if it exists and isn't already in features
    if (model.os && !baseFeatures.some(f => f.toLowerCase().includes('android') || f.toLowerCase().includes('windows'))) {
      enhancedFeatures.unshift(`${model.os} Operating System`);
    }
    
    return enhancedFeatures;
  };

  return (
    <ProductCard
      product={productData}
      displayMode={displayMode}
      productType={productType}
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

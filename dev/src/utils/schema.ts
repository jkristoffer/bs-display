/**
 * Schema.org utility functions for generating structured data
 * 
 * This module provides typed interfaces and functions for creating
 * schema.org JSON-LD markup to improve SEO and rich results in search engines.
 */

// Common organization details - can be extended with more properties as needed
interface OrganizationInfo {
  name: string;
  url: string;
  logo?: string;
  telephone?: string;
  email?: string;
  address?: AddressInfo;
  sameAs?: string[]; // Social media profiles
}

interface AddressInfo {
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
}

// Product schema interfaces
interface ProductInfo {
  id: string;
  name: string;
  description: string;
  brand: string;
  image: string[];
  category?: string;
  url?: string;
  sku?: string;
  model?: string;
  offers?: OfferInfo;
  aggregateRating?: AggregateRatingInfo;
  review?: ReviewInfo[];
  additionalProperty?: PropertyValueInfo[];
}

interface OfferInfo {
  price?: string;
  priceCurrency?: string;
  priceValidUntil?: string;
  availability?: string;
  itemCondition?: string;
  seller?: OrganizationInfo;
}

interface AggregateRatingInfo {
  ratingValue: string;
  reviewCount: string;
}

interface ReviewInfo {
  author: string;
  datePublished: string;
  reviewBody: string;
  reviewRating: {
    ratingValue: string;
  };
}

interface PropertyValueInfo {
  name: string;
  value: string;
}

// Breadcrumb schema interface
interface BreadcrumbInfo {
  items: BreadcrumbItemInfo[];
}

interface BreadcrumbItemInfo {
  name: string;
  item: string;
  position: number;
}

/**
 * Default organization info for Big Shine Display
 * Update with actual company details
 */
export const defaultOrganization: OrganizationInfo = {
  name: 'Big Shine Display',
  url: 'https://bigshine.display',
  logo: 'https://bigshine.display/logo.png',
  telephone: '+1-123-456-7890',
  sameAs: [
    'https://facebook.com/bigshinedisplay',
    'https://twitter.com/bigshinedisplay',
    'https://linkedin.com/company/bigshinedisplay'
  ],
  address: {
    streetAddress: '123 Display Street',
    addressLocality: 'Tech City',
    addressRegion: 'CA',
    postalCode: '12345',
    addressCountry: 'US'
  }
};

/**
 * Creates JSON-LD structured data for Organization
 * 
 * @param organizationInfo - Organization details
 * @returns JSON-LD string for the Organization
 */
export function generateOrganizationSchema(
  organizationInfo: OrganizationInfo = defaultOrganization
): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: organizationInfo.name,
    url: organizationInfo.url,
    logo: organizationInfo.logo,
    telephone: organizationInfo.telephone,
    email: organizationInfo.email,
    sameAs: organizationInfo.sameAs,
    address: organizationInfo.address ? {
      '@type': 'PostalAddress',
      streetAddress: organizationInfo.address.streetAddress,
      addressLocality: organizationInfo.address.addressLocality,
      addressRegion: organizationInfo.address.addressRegion,
      postalCode: organizationInfo.address.postalCode,
      addressCountry: organizationInfo.address.addressCountry
    } : undefined
  };

  return JSON.stringify(schema);
}

/**
 * Creates JSON-LD structured data for Product
 * 
 * @param productInfo - Product details
 * @param organization - Organization details (defaults to Big Shine Display)
 * @returns JSON-LD string for the Product
 */
export function generateProductSchema(
  productInfo: ProductInfo,
  organization: OrganizationInfo = defaultOrganization
): string {
  // Format additional properties from product specs
  const additionalProperties = productInfo.additionalProperty || [];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productInfo.name,
    description: productInfo.description,
    brand: {
      '@type': 'Brand',
      name: productInfo.brand
    },
    image: productInfo.image,
    sku: productInfo.sku,
    mpn: productInfo.id,
    model: productInfo.model,
    category: productInfo.category,
    offers: productInfo.offers ? {
      '@type': 'Offer',
      price: productInfo.offers.price,
      priceCurrency: productInfo.offers.priceCurrency,
      priceValidUntil: productInfo.offers.priceValidUntil,
      availability: productInfo.offers.availability,
      itemCondition: productInfo.offers.itemCondition,
      seller: {
        '@type': 'Organization',
        name: organization.name,
        url: organization.url
      }
    } : undefined,
    aggregateRating: productInfo.aggregateRating ? {
      '@type': 'AggregateRating',
      ratingValue: productInfo.aggregateRating.ratingValue,
      reviewCount: productInfo.aggregateRating.reviewCount
    } : undefined,
    review: productInfo.review?.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author
      },
      datePublished: review.datePublished,
      reviewBody: review.reviewBody,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.reviewRating.ratingValue
      }
    })),
    additionalProperty: additionalProperties.map(prop => ({
      '@type': 'PropertyValue',
      name: prop.name,
      value: prop.value
    }))
  };

  return JSON.stringify(schema);
}

/**
 * Creates JSON-LD structured data for BreadcrumbList
 * 
 * @param breadcrumbInfo - Breadcrumb details
 * @returns JSON-LD string for the BreadcrumbList
 */
export function generateBreadcrumbSchema(breadcrumbInfo: BreadcrumbInfo): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbInfo.items.map((item, index) => ({
      '@type': 'ListItem',
      position: item.position || index + 1,
      name: item.name,
      item: item.item
    }))
  };

  return JSON.stringify(schema);
}

/**
 * Helper function to convert our product model to schema-compatible format
 * 
 * @param model - The product model from our data source
 * @param baseUrl - Base URL for generating absolute URLs
 * @returns ProductInfo object ready for schema generation
 */
export function convertModelToProductInfo(
  model: any,
  productType: string,
  baseUrl = 'https://bigshine.display'
): ProductInfo {
  const brandSlug = model.brand.toLowerCase().replace(/\s+/g, '-');
  const productUrl = `${baseUrl}/products/${productType}/${brandSlug}/${model.id}`;
  const imageUrl = model.image.startsWith('http') 
    ? model.image 
    : `${baseUrl}${model.image}`;
  
  // Extract price range if available
  let offerInfo: OfferInfo | undefined;
  if (model.priceRange) {
    const priceMatch = model.priceRange.match(/\$([0-9,]+)\s-\s\$([0-9,]+)/);
    if (priceMatch) {
      const lowerPrice = priceMatch[1].replace(',', '');
      offerInfo = {
        price: lowerPrice,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition'
      };
    }
  }

  // Convert technical specifications to additionalProperty format
  const additionalProperties: PropertyValueInfo[] = [];
  
  if (model.size) {
    additionalProperties.push({ name: 'Screen Size', value: `${model.size} inches` });
  }
  if (model.resolution) {
    additionalProperties.push({ name: 'Resolution', value: model.resolution });
  }
  if (model.os) {
    additionalProperties.push({ name: 'Operating System', value: model.os });
  }
  if (model.touchTechnology) {
    additionalProperties.push({ name: 'Touch Technology', value: model.touchTechnology });
  }
  if (model.brightness) {
    additionalProperties.push({ name: 'Brightness', value: model.brightness });
  }
  if (model.contrastRatio) {
    additionalProperties.push({ name: 'Contrast Ratio', value: model.contrastRatio });
  }
  if (model.viewingAngle) {
    additionalProperties.push({ name: 'Viewing Angle', value: model.viewingAngle });
  }
  if (model.responseTime) {
    additionalProperties.push({ name: 'Response Time', value: model.responseTime });
  }
  if (model.panelLife) {
    additionalProperties.push({ name: 'Panel Life', value: model.panelLife });
  }
  if (model.audioOutput) {
    additionalProperties.push({ name: 'Audio Output', value: model.audioOutput });
  }
  if (model.powerConsumption) {
    additionalProperties.push({ name: 'Power Consumption', value: model.powerConsumption });
  }
  if (model.warranty) {
    additionalProperties.push({ name: 'Warranty', value: model.warranty });
  }

  // Create the product info
  return {
    id: model.id,
    name: `${model.brand} ${model.model}`,
    description: `${model.brand} ${model.model} ${model.size}" interactive display with ${model.resolution} resolution and ${model.touchTechnology} touch technology.`,
    brand: model.brand,
    image: [imageUrl],
    url: productUrl,
    model: model.model,
    category: `Interactive ${productType}`,
    offers: offerInfo,
    additionalProperty: additionalProperties
  };
}

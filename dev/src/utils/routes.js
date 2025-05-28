/**
 * Centralized route definitions for the application
 * Use this to avoid hardcoding paths throughout the app
 */

/**
 * Create a URL-friendly slug from a string
 * @param {string} text - Text to convert to slug
 * @returns {string} URL-friendly slug
 */
export function createSlug(text) {
  if (typeof text !== 'string') return '';
  return text.toLowerCase().replace(/\s+/g, '-');
}

export const routes = {
  home: '/',
  about: '/about/',
  contact: '/contact/',
  products: {
    index: '/products/',
    smartboards: {
      index: '/products/smartboards/',
      brand: (brand) => `/products/smartboards/${createSlug(brand)}/`,
      product: (brand, id) => `/products/smartboards/${createSlug(brand)}/${id}`
    },
    lecterns: {
      index: '/products/lecterns/',
      brand: (brand) => `/products/lecterns/${createSlug(brand)}/`,
      product: (brand, id) => `/products/lecterns/${createSlug(brand)}/${id}`
    }
  },
  quiz: '/quiz/'
};

/**
 * Generate breadcrumb items for product pages
 * @param {Object} options - Configuration options
 * @returns {Array} Array of breadcrumb items
 */
export function getProductBreadcrumbs({ 
  productType = 'smartboards',
  brand = null,
  brandLabel = null,
  productId = null,
  productLabel = null
}) {
  const items = [
    { label: 'Home', path: routes.home },
    { label: 'Products', path: routes.products.index }
  ];

  // Add product type breadcrumb
  items.push({
    label: productType === 'smartboards' ? 'Smart Boards' : 'Lecterns',
    path: routes.products[productType].index
  });

  // Add brand breadcrumb if provided
  if (brand && brandLabel) {
    // Make sure we're using a properly formatted brand slug
    const brandSlug = typeof brand === 'string' ? createSlug(brand) : brand;
    
    items.push({
      label: brandLabel,
      path: routes.products[productType].brand(brandSlug)
    });
  }

  // Add product breadcrumb if provided
  if (productId && productLabel) {
    items.push({
      label: productLabel
    });
  }

  return items;
}

export default routes;

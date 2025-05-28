/**
 * Centralized route definitions for the application
 * Use this to avoid hardcoding paths throughout the app
 */

export const routes = {
  home: '/',
  about: '/about/',
  contact: '/contact/',
  products: {
    index: '/products/',
    smartboards: {
      index: '/products/smartboards/',
      brand: (brand) => `/products/smartboards/${brand.toLowerCase().replace(/\\s+/g, '-')}/`,
      product: (brand, id) => `/products/smartboards/${brand.toLowerCase().replace(/\\s+/g, '-')}/${id}`
    },
    lecterns: {
      index: '/products/lecterns/',
      brand: (brand) => `/products/lecterns/${brand.toLowerCase().replace(/\\s+/g, '-')}/`,
      product: (brand, id) => `/products/lecterns/${brand.toLowerCase().replace(/\\s+/g, '-')}/${id}`
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
    items.push({
      label: brandLabel,
      path: routes.products[productType].brand(brand)
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

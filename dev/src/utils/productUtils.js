/**
 * Utility functions for product data processing
 */

/**
 * Parse price from price range string
 * @param {string} priceRange - Price range like "$2,000 - $2,500" or "$1,500"
 * @returns {number} - Lowest price as number, or 0 if invalid
 */
export const parsePrice = (priceRange) => {
  if (!priceRange || typeof priceRange !== 'string') {
    return 0;
  }
  
  // Extract all numbers from the string
  const numbers = priceRange.match(/\d+/g);
  if (!numbers || numbers.length === 0) {
    return 0;
  }
  
  // Return the first (lowest) price
  return parseInt(numbers[0], 10);
};

/**
 * Parse highest price from price range string
 * @param {string} priceRange - Price range like "$2,000 - $2,500" or "$1,500"
 * @returns {number} - Highest price as number, or lowest if single price
 */
export const parseHighestPrice = (priceRange) => {
  if (!priceRange || typeof priceRange !== 'string') {
    return 0;
  }
  
  const numbers = priceRange.match(/\d+/g);
  if (!numbers || numbers.length === 0) {
    return 0;
  }
  
  // Return the last (highest) price, or first if only one
  return parseInt(numbers[numbers.length - 1], 10);
};

/**
 * Sort products by various criteria
 * @param {Array} products - Array of product objects
 * @param {string} sortBy - Sort criteria
 * @returns {Array} - Sorted array of products
 */
export const sortProducts = (products, sortBy) => {
  return [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parsePrice(a.priceRange) - parsePrice(b.priceRange);
      case 'price-high':
        return parseHighestPrice(b.priceRange) - parseHighestPrice(a.priceRange);
      case 'size-small':
        return a.size - b.size;
      case 'size-large':
        return b.size - a.size;
      default:
        // Default sorting by brand and then model
        return a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model);
    }
  });
};
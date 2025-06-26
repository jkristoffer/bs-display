/**
 * ProductMatchingService - Centralized product matching and recommendation logic
 * 
 * This service handles all product-related operations for the quiz system,
 * providing a clean separation between UI components and business logic.
 */

import type { Product, CategoryType } from '../types';
import { 
  findMatchingProducts, 
  getProductsForQuizResult, 
  getRelevantFeatures 
} from '../utils/productMatcher';

export interface ProductResult {
  products: Product[];
  allFeatures: string[];
}

export interface ProductMatchingConfig {
  maxProducts: number;
  maxFeatures: number;
}

/**
 * ProductMatchingService provides centralized product matching functionality
 */
export class ProductMatchingService {

  /**
   * Get product recommendations for a quiz result category
   */
  static getRecommendations(
    category: string | CategoryType
  ): ProductResult {
    // Configuration merging for future use
    // const _finalConfig = { ...this.defaultConfig, ...config };
    
    try {
      return getProductsForQuizResult(category);
    } catch (error) {
      console.warn('Error getting product recommendations:', error);
      return { products: [], allFeatures: [] };
    }
  }

  /**
   * Find products matching specific criteria
   */
  static findMatching(
    category: CategoryType, 
    limit: number = 3
  ): Product[] {
    try {
      return findMatchingProducts(category, limit);
    } catch (error) {
      console.warn('Error finding matching products:', error);
      return [];
    }
  }

  /**
   * Get relevant features for a product in a given context
   */
  static getRelevantFeatures(
    product: Product, 
    context?: string | CategoryType
  ): string[] {
    try {
      return getRelevantFeatures(product, context);
    } catch (error) {
      console.warn('Error getting relevant features:', error);
      return [];
    }
  }

  /**
   * Score a product's relevance to a category (0-100)
   */
  static scoreRelevance(product: Product, category: CategoryType): number {
    try {
      // Get all matching products to find relative score
      const allMatches = this.findMatching(category, 20);
      const productMatch = allMatches.find(p => p.id === product.id);
      return productMatch?.matchScore || 0;
    } catch (error) {
      console.warn('Error scoring product relevance:', error);
      return 0;
    }
  }

  /**
   * Validate that a category is supported
   */
  static isSupportedCategory(category: string): category is CategoryType {
    const validCategories: CategoryType[] = ['education', 'corporate', 'creative', 'general'];
    return validCategories.includes(category as CategoryType);
  }

  /**
   * Get category display information
   */
  static getCategoryInfo(category: string): { name: string; color: string } {
    const categoryMap: Record<string, { name: string; color: string }> = {
      education: { 
        name: 'Education', 
        color: 'var(--color-accent-primary)' 
      },
      corporate: { 
        name: 'Corporate', 
        color: 'var(--color-accent-secondary)' 
      },
      creative: { 
        name: 'Creative', 
        color: '#ff6b6b' 
      },
      general: { 
        name: 'General', 
        color: '#666' 
      }
    };

    return categoryMap[category] || { 
      name: 'Unknown', 
      color: '#999' 
    };
  }
}
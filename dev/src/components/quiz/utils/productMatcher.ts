import type { CategoryType } from '../types';
import { allModels } from '../../../data/models.all';

/**
 * Types for product matching functionality
 */
interface ProductMatchingCriteria {
  category: string;
  touchTechnology?: string[];
  size?: number[];
  resolution?: string[];
  features?: string[];
  minSize?: number;
  maxSize?: number;
}

/**
 * Maps quiz categories to product filter criteria
 */
const categoryToProductCriteria: Record<string, ProductMatchingCriteria> = {
  // Education category - focused on affordable, durable displays with IR touch
  education: {
    category: 'education',
    touchTechnology: ['Infrared', 'IR Touch', 'Optical'],
    size: [65, 75, 86],
    features: [
      'Multi-user annotation',
      'Simple interface',
      'Lesson capture',
      'whiteboard'
    ]
  },

  // Corporate category - professional displays with capacitive touch
  corporate: {
    category: 'corporate',
    touchTechnology: ['Capacitive', 'PCAP'],
    size: [65, 75, 86],
    features: [
      'Cloud tools',
      'Wireless screen sharing',
      'Video conferencing',
      'screen sharing'
    ]
  },

  // Creative category - high-end displays with precision touch
  creative: {
    category: 'creative',
    touchTechnology: ['Electromagnetic', 'EMR', 'Capacitive', 'Optical Bonded'],
    minSize: 65,
    features: [
      'Pressure-sensitive input',
      'Color accuracy',
      'Drawing tools',
      '4K UHD'
    ]
  },

  // General category - versatile displays with various touch technologies
  general: {
    category: 'general',
    touchTechnology: ['Capacitive', 'Infrared', 'Optical', 'IR Touch'],
    size: [65, 75, 86, 98],
    features: ['Moderate visual clarity', 'Cloud access', 'Multi-platform compatibility']
  },

  // Hybrid categories with specialized criteria
  'education-corporate': {
    category: 'education-corporate',
    touchTechnology: ['IR Touch with Multi-User Support', 'Infrared', 'Capacitive'],
    size: [75, 86],
    features: [
      'Cloud integration',
      'Video conferencing',
      'Lesson recording',
      'whiteboard',
      'screen sharing'
    ]
  },

  'education-creative': {
    category: 'education-creative',
    touchTechnology: ['Pressure-Sensitive Stylus', 'Optical Bonded', 'EMR Touch'],
    size: [65, 75, 86],
    features: [
      'Color accuracy',
      'Multi-user drawing',
      'Content library',
      'templates'
    ]
  },

  'corporate-creative': {
    category: 'corporate-creative',
    touchTechnology: ['EMR Touch', 'Capacitive', 'Optical Bonded'],
    minSize: 75,
    features: [
      'Professional color accuracy',
      'Cloud synchronization',
      'Advanced annotation tools'
    ]
  },

  'corporate-general': {
    category: 'corporate-general',
    touchTechnology: ['Capacitive', 'Infrared', 'Optical'],
    size: [75, 86, 98],
    features: [
      'Enterprise management',
      'Multi-platform compatibility',
      'Simplified user interface'
    ]
  },

  'creative-general': {
    category: 'creative-general',
    touchTechnology: ['Dual-Mode Touch', 'Capacitive', 'Optical Bonded'],
    size: [65, 75, 86],
    features: [
      'Pressure sensitivity',
      'Cross-application compatibility',
      'Customizable interface'
    ]
  },

  'education-general': {
    category: 'education-general',
    touchTechnology: ['Optical', 'Infrared', 'IR Touch'],
    size: [65, 75, 86],
    features: [
      'Simplified interface',
      'Content variety',
      'Quick-switch modes'
    ]
  },

  'corporate-education': {
    category: 'corporate-education',
    touchTechnology: ['Hybrid IR/Capacitive Touch', 'Infrared', 'Capacitive'],
    size: [75, 86],
    features: [
      'Enterprise management',
      'Multi-user collaboration',
      'Learning management integration',
      'Video conferencing'
    ]
  },

  'creative-education': {
    category: 'creative-education',
    touchTechnology: ['Pressure-Sensitive', 'EMR Touch', 'Optical Bonded'],
    size: [65, 75, 86],
    features: [
      'Creative tools',
      'Educational templates',
      'Precision touch',
      'Multi-user collaboration'
    ]
  }
};

/**
 * Score a product's match against criteria
 * @param product - The product to score
 * @param criteria - The matching criteria
 * @returns A score from 0-100 indicating match quality
 */
function scoreProductMatch(product: any, criteria: ProductMatchingCriteria): number {
  let score = 0;
  const maxScore = 100;
  
  // Category weights for different attributes
  const weights = {
    touchTechnology: 30,
    size: 25,
    features: 30,
    resolution: 15
  };
  
  // Score touch technology (30%)
  if (criteria.touchTechnology && product.touchTechnology) {
    const matchingTech = criteria.touchTechnology.some(tech => 
      product.touchTechnology.toLowerCase().includes(tech.toLowerCase())
    );
    if (matchingTech) score += weights.touchTechnology;
  }
  
  // Score size (25%)
  if (criteria.size && criteria.size.includes(product.size)) {
    score += weights.size;
  } else if (criteria.minSize && product.size >= criteria.minSize) {
    score += weights.size;
  } else if (criteria.maxSize && product.size <= criteria.maxSize) {
    score += weights.size;
  }
  
  // Score features (30%)
  if (criteria.features && product.features) {
    let featureMatches = 0;
    for (const criteriaFeature of criteria.features) {
      for (const productFeature of product.features) {
        if (productFeature.toLowerCase().includes(criteriaFeature.toLowerCase())) {
          featureMatches++;
          break; // Found a match for this criteria feature
        }
      }
    }
    
    // Calculate percentage of matching features
    const featureMatchPercentage = featureMatches / criteria.features.length;
    score += weights.features * featureMatchPercentage;
  }
  
  // Score resolution (15%)
  if (criteria.resolution && criteria.resolution.includes(product.resolution)) {
    score += weights.resolution;
  } else if (product.resolution && product.resolution.includes('3840x2160')) {
    // Bonus for 4K UHD
    score += weights.resolution * 0.8;
  }
  
  return score;
}

/**
 * Find matching products for a given quiz category
 * @param category - The category from quiz results
 * @param limit - Maximum number of products to return
 * @returns An array of matching products sorted by match quality
 */
export function findMatchingProducts(category: CategoryType, limit = 3): any[] {
  // Get the criteria for this category
  const criteria = categoryToProductCriteria[category];
  
  if (!criteria) {
    console.warn(`No product matching criteria found for category: ${category}`);
    return [];
  }
  
  // Score all products against the criteria
  const scoredProducts = allModels.map(product => ({
    product,
    score: scoreProductMatch(product, criteria)
  }));
  
  // Sort by score (descending) and take the top matches
  const topMatches = scoredProducts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => ({
      ...item.product,
      matchScore: item.score,
      matchPercentage: Math.round(item.score)
    }));
  
  return topMatches;
}

/**
 * Extract important features from a product based on category
 * @param product - The product object
 * @param category - The quiz category
 * @returns An array of the most relevant features for this category
 */
export function getRelevantFeatures(product: any, category: CategoryType): string[] {
  if (!product || !product.features) return [];
  
  const featurePriorities: Record<string, string[]> = {
    education: [
      'whiteboard', 'lesson', 'classroom', 'teaching', 'multi-user', 
      'annotation', 'simple', 'education'
    ],
    corporate: [
      'meeting', 'conference', 'presentation', 'wireless', 'sharing',
      'video conferencing', 'cloud', 'collaboration'
    ],
    creative: [
      'color', 'accuracy', 'precision', 'pressure', 'drawing', 'design',
      'stylus', 'creative'
    ],
    general: [
      'compatibility', 'multiple', 'flexible', 'versatile', 
      'multitasking', 'various'
    ]
  };
  
  // For hybrid categories, combine the relevant keywords
  const primaryCategory = category.split('-')[0] as CategoryType;
  const secondaryCategory = category.split('-')[1] as CategoryType;
  
  let priorityKeywords = featurePriorities[primaryCategory] || [];
  if (secondaryCategory && featurePriorities[secondaryCategory]) {
    priorityKeywords = [...priorityKeywords, ...featurePriorities[secondaryCategory]];
  }
  
  // Find features that match priority keywords
  const relevantFeatures = product.features.filter((feature: string) => {
    const featureLower = feature.toLowerCase();
    return priorityKeywords.some(keyword => 
      featureLower.includes(keyword.toLowerCase())
    );
  });
  
  // If we found enough relevant features, return them
  if (relevantFeatures.length >= 3) {
    return relevantFeatures.slice(0, 4); // Return top 4 relevant features
  }
  
  // Otherwise, return the first few features
  return product.features.slice(0, 4);
}

/**
 * Get products based on quiz results
 * This is the main export that the Quiz component will use
 */
export interface ProductResult {
  products: any[];
  allFeatures: string[];
}

/**
 * Get matching products and their features for quiz results
 * @param category - The quiz result category
 * @returns Object containing matching products and relevant features
 */
export function getProductsForQuizResult(category: CategoryType): ProductResult {
  const products = findMatchingProducts(category, 3);
  
  // Collect all relevant features across products
  const allFeatures = new Set<string>();
  products.forEach(product => {
    getRelevantFeatures(product, category).forEach(feature => {
      allFeatures.add(feature);
    });
  });
  
  return {
    products,
    allFeatures: Array.from(allFeatures).slice(0, 6) // Limit to top 6 features
  };
}

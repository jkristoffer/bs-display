/**
 * QuizConfig - Centralized configuration for the quiz system
 * 
 * This configuration centralizes all quiz-related settings, making it easy
 * to adjust behavior without code changes.
 */

import type { CategoryType } from '../types';

export interface QuizDisplayConfig {
  maxProductsPerResult: number;
  maxFeaturesPerProduct: number;
  maxSecondaryRecommendations: number;
  animationDuration: number;
  showScores: boolean;
  enableHybridDetection: boolean;
}

export interface QuizScoringConfig {
  hybridThreshold: number;          // Threshold for hybrid category detection (0.7 = 70%)
  minimumScoreThreshold: number;    // Minimum score to show recommendations
  weights: {
    touchTechnology: number;
    size: number;
    features: number;
    resolution: number;
  };
}

export interface QuizNavigationConfig {
  allowBackNavigation: boolean;
  showProgressIndicator: boolean;
  autoAdvanceOnSelection: boolean;
  confirmBeforeSubmit: boolean;
}

export interface QuizCategoryConfig {
  categories: CategoryType[];
  defaultCategory: CategoryType;
  categoryColors: Record<CategoryType, string>;
  categoryLabels: Record<CategoryType, string>;
}

/**
 * Main quiz configuration object
 */
export const QUIZ_CONFIG = {
  // Display settings
  display: {
    maxProductsPerResult: 3,
    maxFeaturesPerProduct: 6,
    maxSecondaryRecommendations: 2,
    animationDuration: 300,
    showScores: false,
    enableHybridDetection: true
  } as QuizDisplayConfig,

  // Scoring algorithm settings
  scoring: {
    hybridThreshold: 0.7,
    minimumScoreThreshold: 0.3,
    weights: {
      touchTechnology: 30,
      size: 25,
      features: 30,
      resolution: 15
    }
  } as QuizScoringConfig,

  // Navigation behavior
  navigation: {
    allowBackNavigation: false,
    showProgressIndicator: true,
    autoAdvanceOnSelection: false,
    confirmBeforeSubmit: true
  } as QuizNavigationConfig,

  // Category configuration
  categories: {
    categories: ['education', 'corporate', 'creative', 'general'] as CategoryType[],
    defaultCategory: 'general' as CategoryType,
    categoryColors: {
      education: 'var(--color-accent-primary)',
      corporate: 'var(--color-accent-secondary)', 
      creative: '#ff6b6b',
      general: '#666'
    },
    categoryLabels: {
      education: 'Education',
      corporate: 'Corporate',
      creative: 'Creative',
      general: 'General Use'
    }
  } as QuizCategoryConfig

} as const;

/**
 * Helper functions for working with quiz configuration
 */
export class QuizConfigHelper {
  /**
   * Get category color for styling
   */
  static getCategoryColor(category: string): string {
    return QUIZ_CONFIG.categories.categoryColors[category as CategoryType] 
      || QUIZ_CONFIG.categories.categoryColors.general;
  }

  /**
   * Get human-readable category label
   */
  static getCategoryLabel(category: string): string {
    return QUIZ_CONFIG.categories.categoryLabels[category as CategoryType] 
      || category;
  }

  /**
   * Check if category is valid
   */
  static isValidCategory(category: string): category is CategoryType {
    return QUIZ_CONFIG.categories.categories.includes(category as CategoryType);
  }

  /**
   * Get hybrid detection threshold
   */
  static getHybridThreshold(): number {
    return QUIZ_CONFIG.scoring.hybridThreshold;
  }

  /**
   * Get scoring weights for product matching
   */
  static getScoringWeights() {
    return QUIZ_CONFIG.scoring.weights;
  }

  /**
   * Check if hybrid detection is enabled
   */
  static isHybridDetectionEnabled(): boolean {
    return QUIZ_CONFIG.display.enableHybridDetection;
  }
}
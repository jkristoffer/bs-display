/**
 * Quiz System - Main export file
 * 
 * Centralized exports for the quiz system components, services, and utilities.
 * This provides a clean API for importing quiz functionality.
 */

// Main Components
export { FinalQuiz } from './Quiz';

// Sub-components
export { QuizIntro } from './components/QuizIntro';
export { QuizQuestions } from './components/QuizQuestions';
export { QuizResultHeader } from './components/QuizResultHeader';
export { ProductRecommendations } from './components/ProductRecommendations';
export { AlternativeRecommendations } from './components/AlternativeRecommendations';
export { CategoryScores } from './components/CategoryScores';
export { QuizErrorBoundary, withQuizErrorBoundary } from './components/QuizErrorBoundary';

// Services
export { ProductMatchingService } from './services/ProductMatchingService';

// Configuration
export { QUIZ_CONFIG, QuizConfigHelper } from './config/QuizConfig';

// Hooks
export { useQuizState } from './hooks';

// Types
export type {
  QuizData,
  Question,
  Option,
  Result,
  QuizResult,
  QuizState,
  QuizAction,
  Product,
  CategoryType,
  CategoryScores,
  HybridCategoryResult,
  SecondaryRecommendation
} from './types';

// Utilities (for advanced usage)
export {
  findMatchingProducts,
  getProductsForQuizResult,
  getRelevantFeatures
} from './utils/productMatcher';
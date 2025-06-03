/**
 * TypeScript definitions for the quiz component
 */

// Quiz Data Types
export interface QuizData {
  title: string;
  questions: Question[];
  results: { [key: string]: Result };
}

export interface Question {
  id: string;
  question: string;
  type: 'single' | 'multi';
  maxSelections?: number;
  weight?: number;
  options: Option[];
}

export interface Option {
  id?: string;
  label: string;
  value: string; // category this option contributes to
}

export interface Result {
  title: string;
  description: string;
  recommendation: {
    display: string;
    touch: string;
    camera: string;
    features: string[];
  };
  productIds: string[];
  cta: string[];
}

// Secondary Recommendation Type
export interface SecondaryRecommendation {
  category: string;
  score: number;
  scorePercent: number;
  reason: string;
}

// Category Scores Type
export type CategoryScores = {
  [category: string]: number;
};

// Category Types
export type CategoryType = 'education' | 'corporate' | 'creative' | 'general';

// Hybrid Category Keys
export type HybridCategoryKey = 
  | 'corporate-creative'
  | 'corporate-education'
  | 'corporate-general'
  | 'creative-education'
  | 'creative-general'
  | 'education-general';

// Hybrid Result Types
export interface HybridCategoryResult {
  // Core hybrid result properties
  topCategory: string;
  scores: CategoryScores;
  isHybrid: boolean;
  secondCategory?: string;
  
  // Detailed hybrid analysis properties
  key?: HybridCategoryKey;
  categories?: [CategoryType, CategoryType];
  primaryCategory?: CategoryType;
  secondaryCategory?: CategoryType;
  primaryScore?: number;
  secondaryScore?: number;
  scoreRatio?: number;
  
  // Advanced metrics for UI presentation
  primaryRatio?: number; // Ratio of primary score to total score (0.0-1.0)
  secondaryRatio?: number; // Ratio of secondary score to total score (0.0-1.0)
  balanceFactor?: number; // How balanced the hybrid is (0.0 = perfectly balanced, 1.0 = totally imbalanced)
}

// Quiz State Types
export interface QuizState {
  selectedOptionIds: { [questionId: string]: string[] };
  currentScreen: 'intro' | 'questions' | 'results';
  result: string | null;
  isHybridResult: boolean;
  categoryScores: CategoryScores | null;
  secondaryCategory: string | null;
  secondaryRecommendations: SecondaryRecommendation[];
  activeTab: 'primary' | 'alternatives';
}

// Quiz Action Types
export type QuizAction =
  | { type: 'START_QUIZ' }
  | {
      type: 'TOGGLE_OPTION';
      questionId: string;
      option: Option;
      isMulti: boolean;
      maxSelections: number;
    }
  | { type: 'SUBMIT_QUIZ' }
  | { type: 'SET_ACTIVE_TAB'; tab: 'primary' | 'alternatives' }
  | { type: 'VIEW_ALTERNATIVE'; category: string };

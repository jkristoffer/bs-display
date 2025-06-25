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

// Simple Result Types
export interface HybridCategoryResult {
  topCategory: string;
  scores: CategoryScores;
  isHybrid: boolean;
  secondCategory?: string;
  primaryRatio?: number;
  secondaryRatio?: number;
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
  primaryRatio?: number;
  secondaryRatio?: number;
}

// Product Type
export interface Product {
  id: string;
  brand: string;
  model: string;
  size: number;
  touchTechnology?: string;
  resolution?: string;
  features?: string[];
  image?: string;
  matchPercentage?: number;
  matchScore?: number;
}

// Export alias for backwards compatibility
export type QuizResult = Result;

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
  | { type: 'SUBMIT_QUIZ'; quizData?: QuizData }
  | { type: 'SET_ACTIVE_TAB'; tab: 'primary' | 'alternatives' }
  | { type: 'VIEW_ALTERNATIVE'; category: string };

// Type definitions for quiz components

export interface QuizOption {
  label: string;
  value: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'single' | 'multi';
  maxSelections?: number;
  weight?: number; // Weight factor for scoring algorithm (1-5)
  options: QuizOption[];
}

export interface ResultRecommendation {
  display: string;
  touch: string;
  features: string[];
  camera: string;
}

export interface ResultType {
  title: string;
  description: string;
  recommendation: ResultRecommendation;
  cta: string[];
  productIds: string[];
}

export interface CategoryScores {
  education: number;
  corporate: number;
  creative: number;
  general: number;
}

export interface HybridCategoryResult {
  topCategory: string;
  secondCategory?: string;
  scores: CategoryScores;
  isHybrid: boolean;
}

export interface QuizData {
  title: string;
  questions: QuizQuestion[];
  results: Record<string, ResultType>;
}

export interface UserAnswers {
  [questionId: string]: string | string[];
}

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
}

export interface QuizData {
  title: string;
  questions: QuizQuestion[];
  results: Record<string, ResultType>;
}

export interface UserAnswers {
  [questionId: string]: string | string[];
}

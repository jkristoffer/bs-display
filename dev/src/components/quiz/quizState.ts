import { useReducer, useMemo } from 'react';
import type {
  QuizState,
  QuizAction,
  QuizData,
  Option,
  CategoryScores,
  HybridCategoryResult,
  SecondaryRecommendation
} from './types';

/**
 * Initial state for the quiz
 */
const initialState: QuizState = {
  selectedOptionIds: {},
  currentScreen: 'intro',
  result: null,
  isHybridResult: false,
  categoryScores: null,
  secondaryCategory: null,
  secondaryRecommendations: [],
  activeTab: 'primary',
  primaryRatio: undefined,
  secondaryRatio: undefined
};

/**
 * Reducer function to handle all quiz state transitions
 */
function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'START_QUIZ':
      return {
        ...initialState,
        currentScreen: 'questions'
      };

    case 'TOGGLE_OPTION': {
      const { questionId, option, isMulti, maxSelections } = action;
      const optionId = option.id || `${questionId}-option-${option.label}`;
      const currentSelections = state.selectedOptionIds[questionId] || [];
      const isSelected = currentSelections.includes(optionId);
      
      let newSelections: string[];
      
      if (!isMulti) {
        // For single select, just set this option
        newSelections = [optionId];
      } else {
        // For multi-select, toggle this option
        if (isSelected) {
          // Remove if already selected
          newSelections = currentSelections.filter(id => id !== optionId);
        } else if (currentSelections.length < maxSelections) {
          // Add if under max selections
          newSelections = [...currentSelections, optionId];
        } else {
          // Don't change if max selections reached
          newSelections = currentSelections;
        }
      }
      
      return {
        ...state,
        selectedOptionIds: {
          ...state.selectedOptionIds,
          [questionId]: newSelections
        }
      };
    }

    case 'SUBMIT_QUIZ': {
      const submitAction = action as QuizAction & { quizData: QuizData };
      const { quizData } = submitAction;
      
      // Calculate results
      const hybridResult = calculateHybridResults(
        state.selectedOptionIds,
        quizData
      );
      
      // Generate secondary recommendations
      const secondaryRecs = generateSecondaryRecommendations(
        hybridResult.scores,
        hybridResult.topCategory
      );
      
      return {
        ...state,
        currentScreen: 'results',
        result: hybridResult.topCategory,
        isHybridResult: hybridResult.isHybrid,
        categoryScores: hybridResult.scores,
        secondaryCategory: hybridResult.secondCategory || null,
        secondaryRecommendations: secondaryRecs,
        activeTab: 'primary',
        primaryRatio: hybridResult.primaryRatio,
        secondaryRatio: hybridResult.secondaryRatio
      };
    }

    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        activeTab: action.tab
      };

    case 'VIEW_ALTERNATIVE':
      return {
        ...state,
        result: action.category,
        secondaryCategory: null,
        activeTab: 'primary'
      };

    default:
      return state;
  }
}

/**
 * Generate secondary recommendations based on score proximity
 */
function generateSecondaryRecommendations(
  scores: CategoryScores, 
  primaryCategory: string
): SecondaryRecommendation[] {
  // Define close score threshold (15% of top score)
  const topScore = scores[primaryCategory];
  const closeScoreThreshold = topScore * 0.85;
  
  // Sort all categories except the primary by score (descending)
  const sortedCategories = Object.entries(scores)
    .filter(([category]) => category !== primaryCategory)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
  
  // Take up to 3 categories that meet the threshold
  const closeCategories = sortedCategories
    .filter(([, score]) => score >= closeScoreThreshold)
    .slice(0, 3);
  
  // Generate explanations for each close category
  return closeCategories.map(([category, score]) => {
    const scorePercent = Math.round((score / topScore) * 100);
    let reason = '';
    
    // Generate different reasons based on the category and score percentage
    if (scorePercent > 95) {
      reason = `This is an excellent alternative with ${scorePercent}% compatibility with your needs.`;
    } else if (scorePercent > 90) {
      reason = `This is a strong alternative that addresses most of your requirements.`;
    } else {
      reason = `This option covers many of your needs but with some trade-offs.`;
    }
    
    // Add category-specific reasoning
    switch(category) {
      case 'education':
        reason += ' It excels in teaching and learning environments.';
        break;
      case 'corporate':
        reason += ' It provides robust business and collaboration features.';
        break;
      case 'creative':
        reason += ' It offers precision tools for design and creative work.';
        break;
      case 'general':
        reason += ' It provides flexibility for diverse use cases.';
        break;
    }
    
    return {
      category,
      score,
      scorePercent,
      reason
    };
  });
}

/**
 * Calculate simple results based on the user's selections
 * 
 * @param selectedOptionIds - User's selected options for each question
 * @param quizData - The complete quiz data
 * @returns A simple result object
 */
function calculateHybridResults(
  selectedOptionIds: { [questionId: string]: string[] },
  quizData: QuizData
): HybridCategoryResult {
  // Calculate the weighted scores across all categories
  const scores = calculateWeightedScores(selectedOptionIds, quizData);
  
  // Sort categories by score (descending)
  const sortedCategories = Object.entries(scores)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .filter(([, score]) => score > 0); // Only consider categories with scores
  
  // If no scores, return general as default
  if (sortedCategories.length === 0) {
    return {
      topCategory: 'general',
      scores,
      isHybrid: false
    };
  }
  
  const [topCategory, topScore] = sortedCategories[0];
  const [secondCategory, secondScore] = sortedCategories[1] || [null, 0];
  
  // Simple hybrid detection: if second category is within 70% of top score
  const isHybrid = sortedCategories.length >= 2 && secondScore >= (topScore * 0.7);
  
  if (isHybrid && secondCategory) {
    // Check if we have a specific hybrid template
    const categories = [topCategory, secondCategory].sort();
    const hybridKey = `${categories[0]}-${categories[1]}`;
    
    // If hybrid template exists, use it
    if (quizData.results[hybridKey]) {
      const totalScore = topScore + secondScore;
      return {
        topCategory: hybridKey,
        scores,
        isHybrid: true,
        primaryRatio: topScore / totalScore,
        secondaryRatio: secondScore / totalScore
      };
    }
    
    // Otherwise show primary with secondary as alternative
    const totalScore = topScore + secondScore;
    return {
      topCategory,
      secondCategory,
      scores,
      isHybrid: true,
      primaryRatio: topScore / totalScore,
      secondaryRatio: secondScore / totalScore
    };
  }
  
  // Single category result
  return {
    topCategory,
    scores,
    isHybrid: false
  };
}

/**
 * Calculate simple weighted scores for all categories
 * 
 * @param selectedOptionIds The user's selected options by question ID
 * @param quizData The complete quiz data structure
 * @returns An object containing scores for each category
 */
function calculateWeightedScores(
  selectedOptionIds: { [questionId: string]: string[] },
  quizData: QuizData
): CategoryScores {
  // Initialize score object for each category
  const categoryScores = {
    education: 0,
    corporate: 0,
    creative: 0,
    general: 0
  };
  
  // Process each question with its weight
  quizData.questions.forEach((question) => {
    // Get question weight - default to 1 if not specified
    const questionWeight = question.weight || 1;
    
    // Get user's selections for this question
    const selectedIds = selectedOptionIds[question.id] || [];
    
    // Skip if no selections for this question
    if (selectedIds.length === 0) return;
    
    // SINGLE SELECT QUESTIONS
    if (question.type === 'single' && selectedIds.length === 1) {
      const optionId = selectedIds[0];
      const option = question.options.find((opt) => {
        const thisOptionId = opt.id || `${question.id}-option-${opt.label}`;
        return thisOptionId === optionId;
      });
      
      if (option && categoryScores[option.value] !== undefined) {
        categoryScores[option.value] += questionWeight;
      }
    } 
    // MULTI-SELECT QUESTIONS
    else if (question.type === 'multi' && selectedIds.length > 0) {
      // For multi-select, distribute weight equally among selected options
      const weightPerSelection = questionWeight / selectedIds.length;
      
      selectedIds.forEach((optionId) => {
        const option = question.options.find((opt) => {
          const thisOptionId = opt.id || `${question.id}-option-${opt.label}`;
          return thisOptionId === optionId;
        });
        
        if (option && categoryScores[option.value] !== undefined) {
          categoryScores[option.value] += weightPerSelection;
        }
      });
    }
  });
  
  return categoryScores;
}

/**
 * Custom hook for quiz state management
 */
export function useQuizState(quizData: QuizData) {
  // Setup reducer with initial state
  const [state, dispatch] = useReducer(quizReducer, initialState);
  
  // Create memoized action dispatchers
  const actions = useMemo(() => {
    return {
      // Start or restart quiz
      startQuiz: () => {
        dispatch({ type: 'START_QUIZ' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      
      // Toggle option selection
      toggleOption: (
        questionId: string,
        option: Option,
        isMulti: boolean,
        maxSelections: number
      ) => {
        dispatch({
          type: 'TOGGLE_OPTION',
          questionId,
          option,
          isMulti,
          maxSelections
        });
      },
      
      // Submit quiz to get results
      submitQuiz: () => {
        // We need to pass quizData to the reducer
        dispatch({ 
          type: 'SUBMIT_QUIZ',
          quizData // Pass quizData to access questions and results
        } as QuizAction);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      
      // Set active tab
      setActiveTab: (tab: 'primary' | 'alternatives') => {
        dispatch({ type: 'SET_ACTIVE_TAB', tab });
      },
      
      // View alternative recommendation
      viewAlternative: (category: string) => {
        dispatch({ type: 'VIEW_ALTERNATIVE', category });
      }
    };
  }, [quizData]);
  
  // Create memoized helper functions
  const helpers = useMemo(() => {
    return {
      // Check if an option is selected
      isOptionSelected: (questionId: string, option: Option): boolean => {
        if (!state.selectedOptionIds[questionId]) return false;
        
        // Get the option's unique ID
        const optionId = option.id || `${questionId}-option-${option.label}`;
        
        return state.selectedOptionIds[questionId].includes(optionId);
      },
      
      // Get number of selections for a question
      getSelectionCount: (questionId: string): number => {
        return state.selectedOptionIds[questionId]?.length || 0;
      },
      
      // Check if all questions have been answered
      get allQuestionsAnswered(): boolean {
        return quizData.questions.every(
          (q) => (state.selectedOptionIds[q.id]?.length || 0) > 0
        );
      }
    };
  }, [quizData, state.selectedOptionIds]);
  
  // Return combined state, actions, and helpers
  return {
    ...state,
    ...actions,
    ...helpers
  };
}

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
  activeTab: 'primary'
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
      const { quizData } = action as any; // Passing quiz data implicitly
      
      // Calculate results
      const { topCategory, secondCategory, scores, isHybrid } = calculateHybridResults(
        state.selectedOptionIds,
        quizData
      );
      
      // Generate secondary recommendations
      const secondaryRecs = generateSecondaryRecommendations(
        scores,
        topCategory
      );
      
      return {
        ...state,
        currentScreen: 'results',
        result: topCategory,
        isHybridResult: isHybrid,
        categoryScores: scores,
        secondaryCategory: secondCategory || null,
        secondaryRecommendations: secondaryRecs,
        activeTab: 'primary'
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
 * Determine if a result should be considered hybrid based on score proximity
 */
function calculateHybridResults(
  selectedOptionIds: { [questionId: string]: string[] },
  quizData: QuizData
): HybridCategoryResult {
  // First calculate the raw weighted scores
  const scores = calculateWeightedScores(selectedOptionIds, quizData);
  
  // Sort categories by score (descending)
  const sortedCategories = Object.entries(scores)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .map(([category]) => category);
  
  const topCategory = sortedCategories[0];
  const secondHighestCategory = sortedCategories[1];
  
  const topScore = scores[topCategory];
  const secondScore = scores[secondHighestCategory];
  
  // Calculate the threshold for hybrid classification (80% of top score)
  const hybridThreshold = topScore * 0.8;
  
  // Check if second score is close enough to top score for hybrid classification
  const isHybrid = secondScore >= hybridThreshold;
  
  // If scores are close, create a hybrid result key
  if (isHybrid) {
    // Form the hybrid key by alphabetically sorting the two categories
    const hybridKey = [topCategory, secondHighestCategory].sort().join('-');
    
    // Check if this hybrid category exists in the results
    if (quizData.results[hybridKey]) {
      return {
        topCategory: hybridKey,
        scores,
        isHybrid: true
      };
    }
    
    // If the specific hybrid doesn't exist, return the individual categories
    return {
      topCategory,
      secondCategory: secondHighestCategory,
      scores,
      isHybrid: true
    };
  }
  
  // If scores aren't close enough, return single category
  return {
    topCategory,
    scores,
    isHybrid: false
  };
}

/**
 * Calculate weighted scores for all categories
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
  
  // Track total possible weighted points for percentage calculation
  let totalPossiblePoints = 0;
  let totalEarnedPoints = 0;
  
  // Process each question with its weight
  quizData.questions.forEach((question) => {
    const questionWeight = question.weight || 1; // Default to 1 if weight not specified
    totalPossiblePoints += questionWeight;
    
    const selectedIds = selectedOptionIds[question.id] || [];
    
    // Skip if no selections for this question
    if (selectedIds.length === 0) return;
    
    // For single-select questions, apply full weight
    if (question.type === 'single' && selectedIds.length === 1) {
      const optionId = selectedIds[0];
      const option = question.options.find((opt) => {
        const thisOptionId = opt.id || `${question.id}-option-${opt.label}`;
        return thisOptionId === optionId;
      });
      
      if (option && categoryScores[option.value] !== undefined) {
        categoryScores[option.value] += questionWeight;
        totalEarnedPoints += questionWeight;
      }
    } 
    // For multi-select questions, distribute weight among selected options
    else if (question.type === 'multi' && selectedIds.length > 0) {
      // Calculate points per selection for this question
      const pointsPerSelection = questionWeight / selectedIds.length;
      
      // Track category counts for this question to calculate distribution
      const questionCategoryCounts = {
        education: 0,
        corporate: 0,
        creative: 0,
        general: 0
      };
      
      // First pass: count selections by category
      selectedIds.forEach((optionId) => {
        const option = question.options.find((opt) => {
          const thisOptionId = opt.id || `${question.id}-option-${opt.label}`;
          return thisOptionId === optionId;
        });
        
        if (option && questionCategoryCounts[option.value] !== undefined) {
          questionCategoryCounts[option.value]++;
        }
      });
      
      // Second pass: distribute points proportionally
      Object.entries(questionCategoryCounts).forEach(([category, count]) => {
        if (count > 0) {
          const categoryPoints = pointsPerSelection * count;
          categoryScores[category] += categoryPoints;
          totalEarnedPoints += categoryPoints;
        }
      });
    }
  });
  
  // Calculate category with highest weighted score
  let topCategory = 'general'; // Default fallback
  let topScore = 0;
  
  Object.entries(categoryScores).forEach(([category, score]) => {
    if (score > topScore) {
      topScore = score;
      topCategory = category;
    }
  });
  
  // If scoring is very close between top categories (within 15%),
  // consider user's primary use case (q1) as tiebreaker
  const scoreThreshold = topScore * 0.85;
  const closeCategories = Object.entries(categoryScores)
    .filter(([category, score]) => score >= scoreThreshold && category !== topCategory)
    .map(([category]) => category);
  
  if (closeCategories.length > 0) {
    // Check primary use case question (q1) as tiebreaker
    const primaryUseSelection = selectedOptionIds['q1']?.[0];
    if (primaryUseSelection) {
      const primaryOption = quizData.questions[0].options.find((opt) => {
        const optionId = opt.id || `q1-option-${opt.label}`;
        return optionId === primaryUseSelection;
      });
      
      if (primaryOption && closeCategories.includes(primaryOption.value)) {
        // Override with primary use case if it's one of the close categories
        topCategory = primaryOption.value;
      }
    }
  }
  
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
      startQuiz: () => dispatch({ type: 'START_QUIZ' }),
      
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

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
 * Detect if quiz results should show a hybrid category result
 * 
 * This function analyzes category scores to determine if the user's answers
 * indicate a hybrid use case that spans multiple categories. It looks for:
 * 
 * 1. Close scores between top categories (within threshold)
 * 2. Significant scores in both categories (above minimum threshold)
 * 3. Valid hybrid category combinations in our predefined map
 * 4. Meaningful differentiation from other categories
 * 
 * @param scores - The calculated category scores
 * @returns A hybrid category result object or null if no hybrid detected
 */
function detectHybridCategory(scores: CategoryScores): HybridCategoryResult | null {
  // Get all categories with their scores, sorted by score (descending)
  const sortedScores = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, score]) => score > 0); // Only consider categories with scores
  
  // Need at least two categories with scores to detect a hybrid
  if (sortedScores.length < 2) return null;
  
  const [topCategory, topScore] = sortedScores[0];
  const [secondCategory, secondScore] = sortedScores[1];
  
  // Absolute minimum score threshold - ensures meaningful scores
  // This prevents hybrid results when secondary category has very low absolute score
  const minimumScoreThreshold = 1.0;
  
  // Adaptive threshold based on top score - second category must be within this percentage
  // The threshold is adaptive: higher top scores require closer second scores
  const relativeThreshold = topScore >= 5 ? 0.85 : 0.80;
  const thresholdScore = topScore * relativeThreshold;
  
  // Check if third score is significantly lower than second score
  // This ensures clear differentiation between top two and remaining categories
  let hasSignificantGap = true;
  if (sortedScores.length >= 3) {
    const thirdScore = sortedScores[2][1];
    const secondToThirdRatio = thirdScore / secondScore;
    hasSignificantGap = secondToThirdRatio < 0.75; // Third score should be <75% of second
  }
  
  // Check all hybrid detection conditions
  if (secondScore >= thresholdScore && 
      secondScore >= minimumScoreThreshold && 
      hasSignificantGap) {
    // Sort categories alphabetically for consistent hybrid key lookup
    const categories = [topCategory, secondCategory].sort();
    const hybridKey = `${categories[0]}-${categories[1]}`;
    
    // Check if we have a predefined hybrid result for these categories
    // This assumes hybrid results exist in the quizData with combined keys
    if (hybridKey === 'corporate-creative' || 
        hybridKey === 'corporate-education' || 
        hybridKey === 'corporate-general' || 
        hybridKey === 'creative-education' || 
        hybridKey === 'creative-general' || 
        hybridKey === 'education-general') {
      
      // Calculate additional metrics for the hybrid result
      const scoreSum = topScore + secondScore;
      const primaryRatio = topScore / scoreSum;
      const secondaryRatio = secondScore / scoreSum;
      
      return {
        key: hybridKey as HybridCategoryKey,
        categories: [categories[0], categories[1]] as [CategoryType, CategoryType],
        primaryCategory: topCategory as CategoryType,
        secondaryCategory: secondCategory as CategoryType,
        primaryScore: topScore,
        secondaryScore: secondScore,
        // Add more detailed metrics for potential UI use
        scoreRatio: secondScore / topScore,
        primaryRatio,
        secondaryRatio,
        // Balance factor: 0.5 means perfectly balanced, higher is more imbalanced
        balanceFactor: Math.abs(primaryRatio - 0.5) * 2
      };
    }
  }
  
  return null;
}

/**
 * Determine if a result should be considered hybrid based on score proximity
 */
/**
 * Calculate hybrid results based on the user's selections
 * 
 * This function handles the main logic for determining whether the user's
 * quiz results indicate a hybrid category or single category recommendation.
 * 
 * @param selectedOptionIds - User's selected options for each question
 * @param quizData - The complete quiz data
 * @returns A hybrid category result object with detailed analysis
 */
function calculateHybridResults(
  selectedOptionIds: { [questionId: string]: string[] },
  quizData: QuizData
): HybridCategoryResult {
  // Calculate the weighted scores across all categories
  const scores = calculateWeightedScores(selectedOptionIds, quizData);
  
  // First check if we detect a hybrid category using the enhanced algorithm
  const hybridResult = detectHybridCategory(scores);
  
  // If we detected a valid hybrid combination with our algorithm, use it
  if (hybridResult) {
    // Check if this hybrid combination has a specific template in our quiz data
    const hybridKey = hybridResult.key;
    const hasSpecificHybridTemplate = !!quizData.results[hybridKey];
    
    return {
      // If we have a specific template, use that as the top category key
      // Otherwise, use the individual top category and track secondary separately
      topCategory: hasSpecificHybridTemplate ? hybridKey : hybridResult.primaryCategory,
      scores,
      isHybrid: true,
      secondCategory: hasSpecificHybridTemplate ? undefined : hybridResult.secondaryCategory,
      // Include additional hybrid analysis data for UI presentation
      primaryCategory: hybridResult.primaryCategory,
      secondaryCategory: hybridResult.secondaryCategory,
      primaryScore: hybridResult.primaryScore,
      secondaryScore: hybridResult.secondaryScore,
      scoreRatio: hybridResult.scoreRatio,
      primaryRatio: hybridResult.primaryRatio,
      secondaryRatio: hybridResult.secondaryRatio,
      balanceFactor: hybridResult.balanceFactor,
      // Note whether we're using a specific hybrid template
      isSpecificHybrid: hasSpecificHybridTemplate,
      hybridKey
    };
  }
  
  // If our advanced hybrid detection didn't find a match,
  // fall back to simpler sorting-based approach
  
  // Sort categories by score (descending)
  const sortedCategories = Object.entries(scores)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .map(([category]) => category);
  
  const topCategory = sortedCategories[0];
  const secondCategory = sortedCategories[1];
  const topScore = scores[topCategory];
  const secondScore = scores[secondCategory];
  
  // Only consider a hybrid if we have at least two categories with scores
  if (sortedCategories.length < 2 || secondScore === 0) {
    return {
      topCategory,
      scores,
      isHybrid: false
    };
  }
  
  // Calculate the threshold for hybrid classification (80% of top score)
  // This is a simpler fallback when our main algorithm doesn't detect a hybrid
  const hybridThreshold = topScore * 0.8;
  const isHybrid = secondScore >= hybridThreshold;
  
  // If scores are close, check for a hybrid template
  if (isHybrid) {
    // Form the hybrid key by alphabetically sorting the two categories
    const categories = [topCategory, secondCategory].sort();
    const hybridKey = `${categories[0]}-${categories[1]}` as HybridCategoryKey;
    
    // Check if this hybrid category exists in the results
    if (quizData.results[hybridKey]) {
      return {
        topCategory: hybridKey,
        scores,
        isHybrid: true,
        isSpecificHybrid: true,
        hybridKey,
        primaryCategory: topCategory as CategoryType,
        secondaryCategory: secondCategory as CategoryType,
        primaryScore: topScore,
        secondaryScore: secondScore,
        scoreRatio: secondScore / topScore,
        primaryRatio: topScore / (topScore + secondScore),
        secondaryRatio: secondScore / (topScore + secondScore),
        balanceFactor: Math.abs((topScore / (topScore + secondScore)) - 0.5) * 2
      };
    }
    
    // If the specific hybrid doesn't exist, return the individual categories
    return {
      topCategory,
      secondCategory,
      scores,
      isHybrid: true,
      isSpecificHybrid: false,
      primaryCategory: topCategory as CategoryType,
      secondaryCategory: secondCategory as CategoryType,
      primaryScore: topScore,
      secondaryScore: secondScore,
      scoreRatio: secondScore / topScore,
      primaryRatio: topScore / (topScore + secondScore),
      secondaryRatio: secondScore / (topScore + secondScore),
      balanceFactor: Math.abs((topScore / (topScore + secondScore)) - 0.5) * 2
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
 * 
 * This algorithm uses a sophisticated weighted scoring system with the following features:
 * 1. Question-level weights - Each question has a weight reflecting its importance
 * 2. Multi-select distribution - Points are distributed proportionally for multi-select questions
 * 3. Question type adjustment - Different question types get different weight treatments
 * 4. First question emphasis - The primary use case question gets special consideration as a tiebreaker
 * 5. Weight normalization - Ensuring balanced scoring across categories
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
  
  // Calculate the total available weight across all questions for normalization
  const totalAvailableWeight = quizData.questions.reduce((sum, q) => sum + (q.weight || 1), 0);
  
  // Track the total number of questions for proportional scoring
  const totalQuestions = quizData.questions.length;
  
  // Process each question with its weight
  quizData.questions.forEach((question, questionIndex) => {
    // Get question weight - default to 1 if not specified
    const questionWeight = question.weight || 1;
    
    // Calculate normalized weight as a percentage of total weight
    // This ensures that the weights are proportional to their importance
    const normalizedWeight = questionWeight / totalAvailableWeight;
    
    // Calculate position weight - earlier questions can have slightly more impact
    // This creates a subtle bias toward the beginning of the quiz
    const positionFactor = 1 - (questionIndex * 0.02);
    
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
        // Apply the full weight to the selected category
        // Multiply by normalizedWeight and positionFactor for balanced scoring
        const score = questionWeight * normalizedWeight * positionFactor;
        
        // Special handling for primary question (first question)
        // Apply extra weight if this is the first question (primary use case)
        const isPrimaryQuestion = question.id === 'q1' || questionIndex === 0;
        const primaryBonus = isPrimaryQuestion ? 1.2 : 1.0;
        
        categoryScores[option.value] += score * primaryBonus;
      }
    } 
    // MULTI-SELECT QUESTIONS
    else if (question.type === 'multi' && selectedIds.length > 0) {
      // For multi-select, we distribute the weight based on selection count
      // But we apply a stronger per-category emphasis
      
      // Track category counts for this question
      const questionCategoryCounts = {
        education: 0,
        corporate: 0,
        creative: 0,
        general: 0
      };
      
      // Enhanced multi-select scoring: we evaluate each selection independently
      // but adjust the weight distribution to emphasize concentration in a category
      selectedIds.forEach((optionId) => {
        const option = question.options.find((opt) => {
          const thisOptionId = opt.id || `${question.id}-option-${opt.label}`;
          return thisOptionId === optionId;
        });
        
        if (option && questionCategoryCounts[option.value] !== undefined) {
          questionCategoryCounts[option.value]++;
        }
      });
      
      // Calculate the total selections across all categories
      const totalSelections = Object.values(questionCategoryCounts).reduce((sum, count) => sum + count, 0);
      
      // Apply scores to each category with selections
      Object.entries(questionCategoryCounts).forEach(([category, count]) => {
        if (count > 0) {
          // Base points proportional to selection count
          const selectionRatio = count / totalSelections;
          
          // Apply non-linear scaling to emphasize when multiple options in same category are selected
          // This rewards concentration in a single category more than evenly distributed selections
          const concentrationBonus = count > 1 ? 1.15 : 1.0;
          
          // Calculate final points for this category from this question
          const categoryPoints = questionWeight * normalizedWeight * positionFactor * 
                               selectionRatio * concentrationBonus;
          
          categoryScores[category] += categoryPoints;
        }
      });
    }
  });
  
  // Primary use case question (q1) tiebreaker logic
  // If scores are very close, give preference to the primary use case answer
  const categoryScoreEntries = Object.entries(categoryScores);
  const sortedScores = [...categoryScoreEntries].sort((a, b) => b[1] - a[1]);
  
  const topCategory = sortedScores[0][0];
  const topScore = sortedScores[0][1];
  
  // Define the threshold for considering scores to be "close"
  // 85% of top score is considered close enough for tiebreaker consideration
  const closeThreshold = topScore * 0.85;
  
  // Find categories that are close to the top score
  const closeCategories = categoryScoreEntries
    .filter(([category, score]) => score >= closeThreshold && category !== topCategory)
    .map(([category]) => category);
  
  // Apply tiebreaker if we have close categories
  if (closeCategories.length > 0) {
    // Get the primary use case question's selection
    const primaryUseSelection = selectedOptionIds['q1']?.[0];
    if (primaryUseSelection) {
      // Find the selected option from the first question
      const primaryOption = quizData.questions[0].options.find((opt) => {
        const optionId = opt.id || `q1-option-${opt.label}`;
        return optionId === primaryUseSelection;
      });
      
      // If the primary use case selection matches one of our close categories,
      // give it a small boost to potentially become the top category
      if (primaryOption && closeCategories.includes(primaryOption.value)) {
        const boostAmount = topScore * 0.05; // 5% boost
        categoryScores[primaryOption.value] += boostAmount;
      }
    }
  }
  
  // Return the final category scores after all calculations
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

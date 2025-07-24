import { useCallback, useEffect } from 'react';
import { 
  useQuizState,
  ProductMatchingService,
  QuizConfigHelper,
  QuizIntro,
  QuizQuestions,
  QuizResultHeader,
  ProductRecommendations,
  AlternativeRecommendations,
  CategoryScores
} from './index';
import type { QuizData, Option } from './types';
import { Analytics } from '@utils/analytics/client';
import styles from './Quiz.module.scss';

/**
 * Utility function to get a consistent color for each category
 */
function getCategoryColor(category: string): string {
  return QuizConfigHelper.getCategoryColor(category);
}

interface FinalQuizProps {
  quizData: QuizData;
}

/**
 * Quiz component with identity-based selection to prevent multi-select issues
 * when options share the same category value
 */
export function FinalQuiz({ quizData }: FinalQuizProps) {
  // Use the centralized state management hook
  const {
    // State
    currentScreen,
    result,
    isHybridResult,
    categoryScores,
    secondaryCategory,
    secondaryRecommendations,
    activeTab,

    // Actions
    startQuiz,
    toggleOption,
    submitQuiz,
    setActiveTab,
    viewAlternative,

    // Derived state
    isOptionSelected,
    getSelectionCount,
    allQuestionsAnswered
  } = useQuizState(quizData);

  const { title, questions, results } = quizData;

  // Track quiz start
  useEffect(() => {
    if (currentScreen === 'questions') {
      Analytics.quizEvent('start', {
        quizType: 'product_recommendation',
        totalQuestions: questions.length
      });
    }
  }, [currentScreen, questions.length]);

  // Track quiz completion
  useEffect(() => {
    if (currentScreen === 'results' && result) {
      Analytics.quizEvent('complete', {
        result,
        isHybrid: isHybridResult,
        primaryCategory: result,
        secondaryCategory: secondaryCategory || null,
        scores: categoryScores
      });

      // Track as conversion
      Analytics.conversion('quiz_completion', 1, {
        category: result,
        isHybrid: isHybridResult
      });
    }
  }, [currentScreen, result, isHybridResult, secondaryCategory, categoryScores]);

  // Memoized product fetching functions for performance
  const getProductsForQuizResult = useCallback(
    (resultKey: string) => ProductMatchingService.getRecommendations(resultKey),
    []
  );

  const getRelevantFeatures = useCallback(
    (product: any, context?: string) => ProductMatchingService.getRelevantFeatures(product, context),
    []
  );

  // Track option selection
  const handleToggleOption = useCallback((questionId: string, option: Option, isMulti: boolean, maxSelections: number) => {
    const optionId = option.id || `${questionId}-option-${option.label}`;
    Analytics.quizEvent('question', {
      questionId,
      optionId,
      action: isOptionSelected(questionId, option) ? 'deselect' : 'select'
    });
    toggleOption(questionId, option, isMulti, maxSelections);
  }, [toggleOption, isOptionSelected]);


  return (
    <div className={styles.quizContainer}>
      {/* Intro Screen */}
      {currentScreen === 'intro' && (
        <QuizIntro
          title={title}
          onStart={startQuiz}
          startButtonText="Start Quiz"
          description="Not sure which smartboard is right for you? Answer a few questions and we'll match you with the best option."
        />
      )}

      {/* Questions Screen */}
      {currentScreen === 'questions' && (
        <QuizQuestions
          questions={questions}
          isOptionSelected={isOptionSelected}
          getSelectionCount={getSelectionCount}
          toggleOption={handleToggleOption}
          allQuestionsAnswered={allQuestionsAnswered}
          onSubmit={submitQuiz}
        />
      )}

      {/* Results Screen */}
      {currentScreen === 'results' && result && (
        <div className="quiz-results">
          <QuizResultHeader
            title={results[result].title}
            description={results[result].description}
            isHybridResult={isHybridResult}
            result={result}
            getCategoryColor={getCategoryColor}
            secondaryCategory={secondaryCategory || undefined}
          />

          {/* Simple hybrid indicator */}
          {isHybridResult && secondaryCategory && (
            <div className="hybrid-notice">
              <p>This recommendation also has strong compatibility with <strong>{secondaryCategory}</strong> needs.</p>
            </div>
          )}

          {secondaryRecommendations.length > 0 && (
            <div className="recommendation-tabs">
              <button
                className={`tab-button ${activeTab === 'primary' ? 'active' : ''}`}
                onClick={() => setActiveTab('primary')}
              >
                Primary Recommendation
              </button>
              <button
                className={`tab-button ${activeTab === 'alternatives' ? 'active' : ''}`}
                onClick={() => setActiveTab('alternatives')}
              >
                Alternative Options ({secondaryRecommendations.length})
              </button>
            </div>
          )}

          {activeTab === 'primary' ? (
            <div className="recommendation-details primary-recommendation">
              <h5>Recommended Setup:</h5>
              <ul>
                <li>
                  <strong>Display:</strong>{' '}
                  {results[result].recommendation.display}
                </li>
                <li>
                  <strong>Touch Technology:</strong>{' '}
                  {results[result].recommendation.touch}
                </li>
                <li>
                  <strong>Camera:</strong>{' '}
                  {results[result].recommendation.camera}
                </li>
                <li>
                  <strong>Key Features:</strong>{' '}
                  {results[result].recommendation.features.join(', ')}
                </li>
              </ul>

              {isHybridResult &&
                !result.includes('-') &&
                secondaryCategory &&
                results[secondaryCategory] && (
                  <div className="alternative-recommendation">
                    <h5>Alternative to Consider:</h5>
                    <p>
                      Based on your mixed needs, you might also be interested
                      in:
                    </p>
                    <div className="secondary-option">
                      <h6>{results[secondaryCategory].title}</h6>
                      <p>
                        {results[secondaryCategory].recommendation.features[0]},{' '}
                        {results[secondaryCategory].recommendation.features[1]}
                      </p>
                      <button
                        className="secondary-cta"
                        onClick={() => viewAlternative(secondaryCategory)}
                      >
                        View This Option
                      </button>
                    </div>
                  </div>
                )}

              <ProductRecommendations 
                result={result} 
                getProductsForQuizResult={getProductsForQuizResult}
                getRelevantFeatures={getRelevantFeatures}
              />
            </div>
          ) : (
            <AlternativeRecommendations
              secondaryRecommendations={secondaryRecommendations}
              results={results}
              getProductsForQuizResult={getProductsForQuizResult}
              getRelevantFeatures={getRelevantFeatures}
            />
          )}

          {categoryScores && (
            <>
              <CategoryScores 
                categoryScores={categoryScores} 
                getCategoryColor={getCategoryColor} 
              />
              <p className="score-explanation">
                This recommendation is based on your quiz answers.
                {isHybridResult && secondaryCategory &&
                  ` You may also want to consider ${secondaryCategory} options.`}
              </p>
            </>
          )}

        </div>
      )}
    </div>
  );
}

import { useQuizState } from './quizState';
import type { QuizData } from './types';
import {
  getProductsForQuizResult,
  getRelevantFeatures
} from './utils/productMatcher';
import { QuizIntro } from './components/QuizIntro';
import { QuizQuestions } from './components/QuizQuestions';
import { QuizResultHeader } from './components/QuizResultHeader';
import { ProductRecommendations } from './components/ProductRecommendations';
import { AlternativeRecommendations } from './components/AlternativeRecommendations';
import { CategoryScores } from './components/CategoryScores';
import './quiz-styles.scss';

/**
 * Utility function to get a consistent color for each category
 */
function getCategoryColor(category: string): string {
  const colorMap: Record<string, string> = {
    education: 'var(--color-accent-primary)',
    corporate: 'var(--color-accent-secondary)',
    creative: '#e91e63',
    general: '#9e9e9e'
  };

  // For hybrid categories, return the color of the first category
  if (category.includes('-')) {
    const firstCategory = category.split('-')[0];
    return colorMap[firstCategory] || colorMap.general;
  }

  return colorMap[category] || colorMap.general;
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

  return (
    <div className="quiz-container">
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
          toggleOption={toggleOption}
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
            secondaryCategory={secondaryCategory}
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
            <div className="score-breakdown">
              <h5>Compatibility Score Breakdown:</h5>
              <CategoryScores 
                categoryScores={categoryScores} 
                getCategoryColor={getCategoryColor} 
              />
              <p className="score-explanation">
                This recommendation is based on your quiz answers.
                {isHybridResult && secondaryCategory &&
                  ` You may also want to consider ${secondaryCategory} options.`}
              </p>
            </div>
          )}

          <div className="result-ctas">
            {results[result].cta.map((ctaText, index) => (
              <button
                key={index}
                className="cta-button"
                onClick={() => {
                  const textLower = ctaText.toLowerCase();
                  if (textLower.includes('model')) {
                    window.location.href = '/products';
                  } else if (textLower.includes('demo')) {
                    window.location.href = '/contact?subject=DemoRequest';
                  } else if (
                    textLower.includes('quote') ||
                    textLower.includes('pricing')
                  ) {
                    window.location.href = '/contact?subject=QuoteRequest';
                  } else {
                    window.location.href = '/contact';
                  }
                }}
              >
                {ctaText}
              </button>
            ))}
          </div>

          <button className="cta-button secondary" onClick={startQuiz}>
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}

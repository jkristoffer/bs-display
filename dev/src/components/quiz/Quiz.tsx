import { useQuizState } from './quizState';
import type { QuizData, CategoryType } from './types';
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
    selectedOptionIds,
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
        <div className="quiz-intro">
          <h2>{title}</h2>
          <p>
            Not sure which smartboard is right for you? Answer a few questions
            and we'll match you with the best option.
          </p>
          <button onClick={startQuiz} className="cta-button">
            Start Quiz
          </button>
        </div>
      )}

      {/* Questions Screen */}
      {currentScreen === 'questions' && (
        <div className="questions-container">
          {/* Progress Indicator */}
          <div className="quiz-progress">
            {questions.filter((q) => getSelectionCount(q.id) > 0).length} of{' '}
            {questions.length} questions answered
          </div>

          {/* All Questions (Vertical Layout) */}
          {questions.map((question, index) => {
            const isAnswered = getSelectionCount(question.id) > 0;
            const isMulti = question.type === 'multi';
            const maxSelections = question.maxSelections || 1;

            return (
              <div
                key={question.id}
                className={`quiz-question ${isAnswered ? 'question-answered' : ''}`}
              >
                <div className="question-header">
                  <h3>Question {index + 1}</h3>
                  <div className="question-status">
                    {isAnswered ? 'Answered' : 'Needs answer'}
                  </div>
                </div>

                <p>{question.question}</p>

                <div className="options-container">
                  {question.options.map((option, optionIndex) => {
                    const optionId =
                      option.id || `${question.id}-option-${optionIndex}`;
                    const isSelected = isOptionSelected(question.id, option);

                    return (
                      <button
                        key={option.id || `${question.id}-option-${optionIndex}`}
                        className={`option-button ${isSelected ? 'selected' : ''}`}
                        onClick={() =>
                          toggleOption(
                            question.id,
                            option,
                            isMulti,
                            maxSelections
                          )
                        }
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>

                {isMulti && (
                  <div className="selection-info">
                    <p className="selection-hint">
                      Select up to {maxSelections} options
                    </p>
                  </div>
                )}

                <hr className="question-divider" />
              </div>
            );
          })}

          {/* Submit Button */}
          <div className="quiz-submit-container">
            <button
              className="cta-button"
              disabled={!allQuestionsAnswered}
              onClick={submitQuiz}
            >
              See Your Results
            </button>
            {!allQuestionsAnswered && (
              <p className="submit-hint">
                Please answer all questions to see your results.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Results Screen */}
      {currentScreen === 'results' && result && (
        <div className="quiz-results">
          <div className="result-header">
            <h4>{results[result].title}</h4>
            
            {/* Add hybrid badge for hybrid results */}
            {isHybridResult && (
              <div className="hybrid-badge" style={{ backgroundColor: getCategoryColor(result) }}>
                <span className="hybrid-badge-label">
                  {result.includes('-') ? 'Hybrid Solution' : 'Mixed Use Case'}
                </span>
              </div>
            )}
            
            <p>{results[result].description}</p>
            
            {/* Enhanced hybrid explanation */}
            {isHybridResult && (
              <div className="hybrid-explanation">
                {result.includes('-') ? (
                  /* For dedicated hybrid templates */
                  <p className="hybrid-note">
                    <strong>Why this recommendation:</strong> Your answers indicate needs that span multiple use cases.
                    This specialized hybrid solution is designed specifically for environments that combine
                    <span className="category-highlight" style={{ color: getCategoryColor(result.split('-')[0]) }}> {result.split('-')[0]}</span> and
                    <span className="category-highlight" style={{ color: getCategoryColor(result.split('-')[1]) }}> {result.split('-')[1]}</span> requirements.
                  </p>
                ) : secondaryCategory ? (
                  /* For hybrid without specific template */
                  <div>
                    <p className="hybrid-note">
                      <strong>Mixed Use Case Detected:</strong> Your answers show needs that span both
                      <span className="category-highlight" style={{ color: getCategoryColor(result) }}> {result}</span> and
                      <span className="category-highlight" style={{ color: getCategoryColor(secondaryCategory) }}> {secondaryCategory}</span> categories.
                    </p>
                    
                    {/* Visual hybrid breakdown bar */}
                    <div className="hybrid-balance">
                      <div className="balance-label">Category Balance:</div>
                      <div className="balance-bars">
                        <div 
                          className="primary-bar" 
                          style={{ 
                            width: `${primaryRatio ? Math.round(primaryRatio * 100) : 60}%`,
                            backgroundColor: getCategoryColor(result)
                          }}
                        >
                          <span className="bar-label">{result}</span>
                        </div>
                        <div 
                          className="secondary-bar"
                          style={{ 
                            width: `${secondaryRatio ? Math.round(secondaryRatio * 100) : 40}%`,
                            backgroundColor: getCategoryColor(secondaryCategory)
                          }}
                        >
                          <span className="bar-label">{secondaryCategory}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
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
          </div>

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
                  <strong>Camera:</strong> {results[result].recommendation.camera}
                </li>
                <li>
                  <strong>Key Features:</strong>{' '}
                  {results[result].recommendation.features.join(', ')}
                </li>
              </ul>
              
              {isHybridResult && !result.includes('-') && secondaryCategory && results[secondaryCategory] && (
                <div className="alternative-recommendation">
                  <h5>Alternative to Consider:</h5>
                  <p>Based on your mixed needs, you might also be interested in:</p>
                  <div className="secondary-option">
                    <h6>{results[secondaryCategory].title}</h6>
                    <p>{results[secondaryCategory].recommendation.features[0]}, {results[secondaryCategory].recommendation.features[1]}</p>
                    <button 
                      className="secondary-cta"
                      onClick={() => viewAlternative(secondaryCategory)}
                    >
                      View This Option
                    </button>
                  </div>
                </div>
              )}
              
              <div className="product-recommendations">
                <h5>Recommended Products:</h5>
                <div className="product-list">
                  {results[result].productIds.map((productId, index) => (
                    <div key={productId} className="product-item">
                      <div className="product-placeholder">
                        <div className="product-image-placeholder" />
                        <div className="product-name">Model {productId}</div>
                      </div>
                      <button 
                        className="view-product-button"
                        onClick={() => window.location.href = `/products/${productId}`}
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="recommendation-details alternative-recommendations">
              <h5>Alternative Options Based On Your Answers</h5>
              <p className="alternatives-explanation">
                Based on your answers, these solutions might also be suitable with some trade-offs.
                Each option is scored based on how well it matches your specific needs.
              </p>
              
              <div className="alternatives-list">
                {secondaryRecommendations.map((rec) => (
                  <div key={rec.category} className="alternative-item">
                    <div className="alternative-header">
                      <h6>{results[rec.category].title}</h6>
                      <div className="match-score">
                        <div className="score-pill">{rec.scorePercent}% Match</div>
                      </div>
                    </div>
                    
                    <p className="alternative-reason">{rec.reason}</p>
                    
                    <div className="alternative-features">
                      <h6>Key Features:</h6>
                      <ul>
                        {results[rec.category].recommendation.features.slice(0, 3).map((feature, i) => (
                          <li key={i}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="alternative-product">
                      <div className="product-placeholder">
                        <div className="product-image-placeholder" />
                        <div className="product-name">Model {results[rec.category].productIds[0]}</div>
                      </div>
                      
                      <div className="alternative-actions">
                        <button 
                          className="view-details-button"
                          onClick={() => viewAlternative(rec.category)}
                        >
                          View Full Details
                        </button>
                        <button 
                          className="product-button"
                          onClick={() => window.location.href = `/products/${results[rec.category].productIds[0]}`}
                        >
                          See Product
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                className="back-to-primary"
                onClick={() => setActiveTab('primary')}
              >
                Back to Primary Recommendation
              </button>
            </div>
          )}
          
          {categoryScores && (
            <div className="score-breakdown">
              <h5>Compatibility Score Breakdown:</h5>
              <div className="score-bars">
                {Object.entries(categoryScores).map(([category, score]) => {
                  // Calculate percentage for visual representation
                  const maxScore = Math.max(...Object.values(categoryScores));
                  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
                  const isTopScore = score === maxScore;
                  
                  return (
                    <div key={category} className="score-bar-container">
                      <div className="score-label">
                        <span className="category-name">
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </span>
                        <span className="score-value">
                          {score.toFixed(1)}
                        </span>
                      </div>
                      <div className="score-bar-wrapper">
                        <div 
                          className={`score-bar ${isTopScore ? 'top-score' : ''}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="score-explanation">
                This recommendation is based on weighted analysis of your answers.
                {isHybridResult && result.includes('-') && (
                  ' This hybrid solution addresses your mixed needs across multiple categories.'
                )}
                {isHybridResult && !result.includes('-') && secondaryCategory && (
                  ` Consider exploring our ${secondaryCategory} options as well for supplementary features.`
                )}
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

import { useState } from 'react';
import type { QuizData, CategoryScores, HybridCategoryResult } from './types';

interface SecondaryRecommendation {
  category: string;
  score: number;
  scorePercent: number;
  reason: string;
}

interface FinalQuizProps {
  quizData: QuizData;
}

/**
 * Quiz component with identity-based selection to prevent multi-select issues
 * when options share the same category value
 */
export function FinalQuiz({ quizData }: FinalQuizProps) {
  // Track selections by unique identifiers (NOT values)
  const [selectedOptionIds, setSelectedOptionIds] = useState<{
    [questionId: string]: string[];
  }>({});
  const [currentScreen, setCurrentScreen] = useState<
    'intro' | 'questions' | 'results'
  >('intro');
  const [result, setResult] = useState<string | null>(null);
  const [isHybridResult, setIsHybridResult] = useState<boolean>(false);
  const [categoryScores, setCategoryScores] = useState<CategoryScores | null>(null);
  const [secondaryCategory, setSecondaryCategory] = useState<string | null>(null);
  const [secondaryRecommendations, setSecondaryRecommendations] = useState<SecondaryRecommendation[]>([]);
  const [activeTab, setActiveTab] = useState<'primary' | 'alternatives'>('primary');

  const { title, questions, results } = quizData;

  // Start the quiz
  function startQuiz() {
    setSelectedOptionIds({});
    setCurrentScreen('questions');
  }

  // Toggle an option by its unique ID
  function toggleOption(
    questionId: string,
    option: any,
    isMulti: boolean,
    maxSelections: number
  ) {
    // Get a unique identifier for this option
    const optionId = option.id || `${questionId}-option-${option.label}`;

    setSelectedOptionIds((prev) => {
      // Create a new object for immutability
      const newSelections = { ...prev };

      // Initialize question array if needed
      if (!newSelections[questionId]) {
        newSelections[questionId] = [];
      }

      // Check if this option is already selected
      const isSelected = newSelections[questionId].includes(optionId);

      if (!isMulti) {
        // For single select, just set this option
        newSelections[questionId] = [optionId];
      } else {
        // For multi-select, toggle this option
        if (isSelected) {
          // Remove if already selected
          newSelections[questionId] = newSelections[questionId].filter(
            (id) => id !== optionId
          );
        } else if (newSelections[questionId].length < maxSelections) {
          // Add if under max selections
          newSelections[questionId] = [...newSelections[questionId], optionId];
        }
      }

      return newSelections;
    });
  }

  // Check if an option is selected by its ID
  function isOptionSelected(questionId: string, option: any): boolean {
    if (!selectedOptionIds[questionId]) return false;

    // Get the option's unique ID
    const optionId = option.id || `${questionId}-option-${option.label}`;

    return selectedOptionIds[questionId].includes(optionId);
  }

  // Get the selection count for a question
  function getSelectionCount(questionId: string): number {
    return selectedOptionIds[questionId]?.length || 0;
  }

  // Generate secondary recommendations based on score proximity
  function generateSecondaryRecommendations(scores: CategoryScores, primaryCategory: string): SecondaryRecommendation[] {
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
  
  // Determine if a result should be considered hybrid based on score proximity
  function calculateHybridResults(): HybridCategoryResult {
    // First calculate the raw weighted scores
    const scores = calculateWeightedScores();
    
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
      if (results[hybridKey]) {
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
  
  // Calculate weighted scores for all categories
  function calculateWeightedScores(): CategoryScores {
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
    questions.forEach((question) => {
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
        const primaryOption = questions[0].options.find((opt) => {
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

  // Submit the quiz
  function submitQuiz() {
    const { topCategory, secondCategory, scores, isHybrid } = calculateHybridResults();
    setResult(topCategory);
    setSecondaryCategory(secondCategory || null);
    setIsHybridResult(isHybrid);
    setCategoryScores(scores);
    
    // Generate secondary recommendations
    const secondaryRecs = generateSecondaryRecommendations(scores, topCategory);
    setSecondaryRecommendations(secondaryRecs);
    
    setCurrentScreen('results');
    setActiveTab('primary');
  }

  // Check if all questions are answered
  const allQuestionsAnswered = questions.every(
    (q) => (selectedOptionIds[q.id]?.length || 0) > 0
  );

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
                        key={optionId}
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
            <p>{results[result].description}</p>
            {isHybridResult && secondaryCategory && !result.includes('-') && (
              <div className="hybrid-indicator">
                <p className="hybrid-note">
                  <strong>Note:</strong> Your answers show mixed needs between {result} and {secondaryCategory} use cases.
                </p>
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
                      onClick={() => {
                        setResult(secondaryCategory);
                        setSecondaryCategory(null);
                      }}
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
                          onClick={() => {
                            setResult(rec.category);
                            setActiveTab('primary');
                          }}
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

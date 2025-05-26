import { useState } from 'react';
import type { QuizData } from './types';

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

  // Calculate results - convert selectedOptionIds to values for calculation
  function calculateResults(): string {
    // Convert selected option IDs to their values for calculation
    const valuesByCategory = {
      education: 0,
      corporate: 0,
      creative: 0,
      general: 0
    };

    // Process each question
    questions.forEach((question) => {
      const selectedIds = selectedOptionIds[question.id] || [];

      // Skip if no selections
      if (selectedIds.length === 0) return;

      // Find the selected options and count their values
      selectedIds.forEach((optionId) => {
        // Find the option that matches this ID
        const option = question.options.find((opt) => {
          const thisOptionId = opt.id || `${question.id}-option-${opt.label}`;
          return thisOptionId === optionId;
        });

        // If found, increment its value category
        if (option && valuesByCategory[option.value] !== undefined) {
          valuesByCategory[option.value]++;
        }
      });
    });

    // Find the category with the highest count
    let topCategory = 'general';
    let topCount = 0;

    Object.entries(valuesByCategory).forEach(([category, count]) => {
      if (count > topCount) {
        topCount = count;
        topCategory = category;
      }
    });

    return topCategory;
  }

  // Submit the quiz
  function submitQuiz() {
    const topCategory = calculateResults();
    setResult(topCategory);
    setCurrentScreen('results');
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
          </div>

          <div className="recommendation-details">
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
          </div>

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

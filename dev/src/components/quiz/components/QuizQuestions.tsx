import type { FC } from 'react';
import { useEffect, useState } from 'react';
import type { Question, Option } from '../types';

interface QuizQuestionsProps {
  questions: Question[];
  isOptionSelected: (questionId: string, option: Option) => boolean;
  getSelectionCount: (questionId: string) => number;
  toggleOption: (
    questionId: string,
    option: Option,
    isMulti: boolean,
    maxSelections: number
  ) => void;
  allQuestionsAnswered: boolean;
  onSubmit: () => void;
}

/**
 * Modern QuizQuestions component with enhanced design and interactions.
 */
export const QuizQuestions: FC<QuizQuestionsProps> = ({
  questions,
  isOptionSelected,
  getSelectionCount,
  toggleOption,
  allQuestionsAnswered,
  onSubmit
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProgressAnimation, setShowProgressAnimation] = useState(false);

  const answeredCount = questions.filter((q) => getSelectionCount(q.id) > 0).length;
  const progressPercentage = (answeredCount / questions.length) * 100;

  // Trigger progress animation when progress changes
  useEffect(() => {
    setShowProgressAnimation(true);
    const timer = setTimeout(() => setShowProgressAnimation(false), 600);
    return () => clearTimeout(timer);
  }, [answeredCount]);

  const handleSubmit = async () => {
    if (!allQuestionsAnswered) return;
    
    setIsSubmitting(true);
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    onSubmit();
    setIsSubmitting(false);
  };


  return (
    <div className="modern-questions-container">
      {/* Modern Progress Bar */}
      <div className="modern-progress-section">
        <div className="progress-header">
          <h3 className="progress-title">Your Progress</h3>
          <div className="progress-counter">
            <span className="answered-count">{answeredCount}</span>
            <span className="total-count">/{questions.length}</span>
          </div>
        </div>
        
        <div className="progress-bar-container">
          <div 
            className={`progress-bar-fill ${showProgressAnimation ? 'animate' : ''}`}
            style={{ 
              width: `${progressPercentage}%`,
              background: progressPercentage === 100 
                ? 'linear-gradient(90deg, #10b981 0%, #22c55e 100%)'
                : 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)'
            }}
          />
          <div className="progress-percentage">
            {Math.round(progressPercentage)}%
          </div>
        </div>
        
        {progressPercentage === 100 && (
          <div className="progress-celebration">
            <span className="celebration-icon">🎉</span>
            <span className="celebration-text">All questions answered!</span>
          </div>
        )}
      </div>

      {/* All Questions (Vertical Layout) */}
      <div className="questions-grid">
        {questions.map((question, index) => {
          const isAnswered = getSelectionCount(question.id) > 0;
          const isMulti = question.type === 'multi';
          const maxSelections = question.maxSelections || 1;
          const selectionCount = getSelectionCount(question.id);

          return (
            <div
              key={question.id}
              id={`question-${question.id}`}
              className={`modern-question-card ${isAnswered ? 'answered' : ''}`}
            >
              <div className="question-card-header">
                <div className="question-number-badge">
                  <span className="question-number">{index + 1}</span>
                </div>
                <div className="question-status-indicator">
                  {isAnswered ? (
                    <div className="status-answered">
                      <span className="check-icon">✓</span>
                      <span>Answered</span>
                    </div>
                  ) : (
                    <div className="status-pending">
                      <span className="pending-icon">◯</span>
                      <span>Pending</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="question-content">
                <h3 className="question-title">{question.question}</h3>
                
                {isMulti && (
                  <div className="selection-guidance">
                    <span className="selection-text">
                      Select up to {maxSelections} options
                    </span>
                    {selectionCount > 0 && (
                      <span className="selection-count">
                        ({selectionCount}/{maxSelections} selected)
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="modern-options-container">
                {question.options.map((option, optionIndex) => {
                  const optionId =
                    option.id || `${question.id}-option-${optionIndex}`;
                  const isSelected = isOptionSelected(question.id, option);

                  return (
                    <button
                      key={optionId}
                      className={`modern-option-button ${isSelected ? 'selected' : ''}`}
                      onClick={() =>
                        toggleOption(question.id, option, isMulti, maxSelections)
                      }
                      style={{ 
                        animationDelay: `${optionIndex * 0.1}s` 
                      }}
                    >
                      <div className="option-content">
                        <div className="option-text">
                          {option.label}
                        </div>
                        <div className="option-indicator">
                          {isMulti ? (
                            <div className={`checkbox-indicator ${isSelected ? 'checked' : ''}`}>
                              {isSelected && <span className="checkmark">✓</span>}
                            </div>
                          ) : (
                            <div className={`radio-indicator ${isSelected ? 'selected' : ''}`}>
                              {isSelected && <span className="dot" />}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {isSelected && (
                        <div className="selection-overlay" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modern Submit Section */}
      <div className="modern-submit-section">
        <div className="submit-card">
          <div className="submit-header">
            <h3 className="submit-title">Ready to See Your Results?</h3>
            <p className="submit-description">
              Get personalized recommendations based on your answers
            </p>
          </div>

          <div className="submit-actions">
            <button
              className={`modern-submit-button ${allQuestionsAnswered ? 'ready' : 'disabled'} ${isSubmitting ? 'submitting' : ''}`}
              disabled={!allQuestionsAnswered || isSubmitting}
              onClick={handleSubmit}
            >
              <span className="submit-text">
                {isSubmitting ? 'Analyzing Your Answers...' : 'See Your Results'}
              </span>
              <span className="submit-icon">
                {isSubmitting ? (
                  <div className="loading-spinner" />
                ) : (
                  <span className="arrow-icon">→</span>
                )}
              </span>
            </button>

            {!allQuestionsAnswered && (
              <div className="submit-hint">
                <span className="hint-icon">ℹ️</span>
                <span className="hint-text">
                  Please answer all {questions.length} questions to continue
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

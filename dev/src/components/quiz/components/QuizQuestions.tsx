import type { FC } from 'react';
import { useEffect, useState } from 'react';
import type { Question, Option } from '../types';
import styles from './QuizQuestions.module.scss';

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
    <div className={styles.questionsContainer}>
      {/* Modern Progress Bar */}
      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <h3 className={styles.progressTitle}>Your Progress</h3>
          <div className={styles.progressCounter}>
            <span className={styles.answeredCount}>{answeredCount}</span>
            <span className={styles.totalCount}>/{questions.length}</span>
          </div>
        </div>
        
        <div className={styles.progressBar}>
          <div 
            className={`${styles.progressFill} ${showProgressAnimation ? styles.animate : ''} ${progressPercentage === 100 ? styles.complete : ''}`}
            style={{ 
              '--progress-width': `${progressPercentage}%`
            } as React.CSSProperties}
          />
          <div className={styles.progressText}>
            {Math.round(progressPercentage)}%
          </div>
        </div>
        
        {progressPercentage === 100 && (
          <div className={styles.progressCelebration}>
            <span className={styles.celebrationIcon}>🎉</span>
            <span className={styles.celebrationText}>All questions answered!</span>
          </div>
        )}
      </div>

      {/* All Questions (Vertical Layout) */}
      <div className={styles.questionsGrid}>
        {questions.map((question, index) => {
          const isAnswered = getSelectionCount(question.id) > 0;
          const isMulti = question.type === 'multi';
          const maxSelections = question.maxSelections || 1;
          const selectionCount = getSelectionCount(question.id);

          return (
            <div
              key={question.id}
              id={`question-${question.id}`}
              className={`${styles.quizQuestion} ${isAnswered ? styles.questionAnswered : ''}`}
            >
              <div className={styles.questionHeader}>
                <div className={styles.questionNumberBadge}>
                  <span className={styles.questionNumber}>{index + 1}</span>
                </div>
                <div className={styles.questionStatus}>
                  {isAnswered ? (
                    <div className={styles.statusAnswered}>
                      <span className={styles.checkIcon}>✓</span>
                      <span>Answered</span>
                    </div>
                  ) : (
                    <div className={styles.statusPending}>
                      <span className={styles.pendingIcon}>◯</span>
                      <span>Pending</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.questionContent}>
                <h3 className={styles.questionTitle}>{question.question}</h3>
                
                {isMulti && (
                  <div className={styles.selectionInfo}>
                    <span className={styles.selectionText}>
                      Select up to {maxSelections} options
                    </span>
                    {selectionCount > 0 && (
                      <span className={styles.selectionCount}>
                        ({selectionCount}/{maxSelections} selected)
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className={styles.optionsContainer}>
                {question.options.map((option, optionIndex) => {
                  const optionId =
                    option.id || `${question.id}-option-${optionIndex}`;
                  const isSelected = isOptionSelected(question.id, option);

                  return (
                    <button
                      key={optionId}
                      className={`${styles.optionButton} ${isSelected ? styles.selected : ''}`}
                      onClick={() =>
                        toggleOption(question.id, option, isMulti, maxSelections)
                      }
                      style={{ 
                        '--animation-delay': `${optionIndex * 0.1}s` 
                      } as React.CSSProperties}
                    >
                      <div className={styles.optionContent}>
                        <div className={styles.optionText}>
                          {option.label}
                        </div>
                        <div className={styles.optionIndicator}>
                          {isMulti ? (
                            <div className={`${styles.checkboxIndicator} ${isSelected ? styles.checked : ''}`}>
                              {isSelected && <span className={styles.checkmark}>✓</span>}
                            </div>
                          ) : (
                            <div className={`${styles.radioIndicator} ${isSelected ? styles.selected : ''}`}>
                              {isSelected && <span className={styles.dot} />}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {isSelected && (
                        <div className={styles.selectionOverlay} />
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
      <div className={styles.submitContainer}>
        <div className={styles.submitCard}>
          <div className={styles.submitHeader}>
            <h3 className={styles.submitTitle}>Ready to See Your Results?</h3>
            <p className={styles.submitDescription}>
              Get personalized recommendations based on your answers
            </p>
          </div>

          <div className={styles.submitActions}>
            <button
              className={`${styles.submitButton} ${allQuestionsAnswered ? styles.ready : styles.disabled} ${isSubmitting ? styles.submitting : ''}`}
              disabled={!allQuestionsAnswered || isSubmitting}
              onClick={handleSubmit}
            >
              <span className={styles.submitText}>
                {isSubmitting ? 'Analyzing Your Answers...' : 'See Your Results'}
              </span>
              <span className={styles.submitIcon}>
                {isSubmitting ? (
                  <div className={styles.loadingSpinner} />
                ) : (
                  <span className={styles.arrowIcon}>→</span>
                )}
              </span>
            </button>

            {!allQuestionsAnswered && (
              <div className={styles.submitHint}>
                <span className={styles.hintIcon}>ℹ️</span>
                <span className={styles.hintText}>
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

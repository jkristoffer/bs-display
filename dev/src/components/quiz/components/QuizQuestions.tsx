import type { FC } from 'react';
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
 * QuizQuestions component that displays all the quiz questions and handles user interactions.
 */
export const QuizQuestions: FC<QuizQuestionsProps> = ({
  questions,
  isOptionSelected,
  getSelectionCount,
  toggleOption,
  allQuestionsAnswered,
  onSubmit
}) => {
  return (
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
                      toggleOption(question.id, option, isMulti, maxSelections)
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
          onClick={onSubmit}
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
  );
};

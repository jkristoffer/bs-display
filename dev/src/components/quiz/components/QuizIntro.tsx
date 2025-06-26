import { type FC, memo } from 'react';

interface QuizIntroProps {
  title: string;
  onStart: () => void;
  startButtonText?: string;
  description?: string;
}

/**
 * QuizIntro component that displays the introduction screen for the quiz
 * with a title, description, and start button.
 */
export const QuizIntro: FC<QuizIntroProps> = memo(({
  title,
  onStart,
  startButtonText = 'Start Quiz',
  description = "Not sure which smartboard is right for you? Answer a few questions and we'll match you with the best option."
}) => {
  return (
    <div className="quiz-intro">
      <h2>{title}</h2>
      <p>{description}</p>
      <button onClick={onStart} className="cta-button">
        {startButtonText}
      </button>
    </div>
  );
});

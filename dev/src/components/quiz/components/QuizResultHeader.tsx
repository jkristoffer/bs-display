import type { FC } from 'react';

interface QuizResultHeaderProps {
  title: string;
  description: string;
  isHybridResult: boolean;
  result: string;
  getCategoryColor: (category: string) => string;
  secondaryCategory?: string;
}

/**
 * QuizResultHeader component that displays the header section of the quiz results,
 * including the result title, description, and hybrid result indicators if applicable.
 */
export const QuizResultHeader: FC<QuizResultHeaderProps> = ({
  title,
  description,
  isHybridResult,
  result,
  getCategoryColor,
  secondaryCategory,
}) => {
  return (
    <header className="result-header" role="banner" aria-labelledby="quiz-result-title">
      <h4 id="quiz-result-title" aria-live="polite">{title}</h4>
      
      {/* Add hybrid badge for hybrid results */}
      {isHybridResult && (
        <div 
          className="hybrid-badge" 
          style={{ backgroundColor: getCategoryColor(result) }}
          role="status"
          aria-label={`${result.includes('-') ? 'Hybrid Solution' : 'Mixed Use Case'} recommendation`}
        >
          <span className="hybrid-badge-label">
            {result.includes('-') ? 'Hybrid Solution' : 'Mixed Use Case'}
          </span>
        </div>
      )}
      
      <p aria-describedby="quiz-result-title">{description}</p>
      
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
              <div className="hybrid-breakdown">
                <div 
                  className="hybrid-segment primary" 
                  style={{ 
                    width: '70%', 
                    backgroundColor: getCategoryColor(result) 
                  }}
                >
                  {result} (70%)
                </div>
                <div 
                  className="hybrid-segment secondary"
                  style={{ 
                    width: '30%', 
                    backgroundColor: getCategoryColor(secondaryCategory) 
                  }}
                >
                  {secondaryCategory} (30%)
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </header>
  );
};

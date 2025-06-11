import type { FC } from 'react';

interface CategoryScoresProps {
  categoryScores: Record<string, number> | null;
  getCategoryColor: (category: string) => string;
}

/**
 * CategoryScores component that displays a visual representation of category scores
 * from the quiz results.
 */
export const CategoryScores: FC<CategoryScoresProps> = ({
  categoryScores,
  getCategoryColor,
}) => {
  if (!categoryScores) {
    return null;
  }

  // Convert categoryScores to an array and sort by score (descending)
  const sortedScores = Object.entries(categoryScores).sort(
    ([, scoreA], [, scoreB]) => scoreB - scoreA
  );

  // Calculate the maximum score for percentage calculations
  const maxScore = Math.max(...Object.values(categoryScores));

  return (
    <div className="category-scores">
      <h5>Your Category Scores:</h5>
      <div className="scores-container">
        {sortedScores.map(([category, score]) => {
          const percentage = (score / maxScore) * 100;
          
          return (
            <div key={category} className="score-item">
              <div className="score-category">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </div>
              <div className="score-bar-container">
                <div
                  className="score-bar-fill"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: getCategoryColor(category),
                  }}
                >
                  <span className="score-value">{score}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

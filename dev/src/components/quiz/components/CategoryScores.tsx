import React, { type FC, memo, useMemo } from 'react';
import '../quiz-styles.scss';

interface CategoryScoresProps {
  categoryScores: Record<string, number> | null;
  getCategoryColor: (category: string) => string;
}

// Pure function for category icons mapping
const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    creative: '🎨',
    corporate: '🏢',
    education: '📚',
    general: '⚙️',
    retail: '🛒',
    healthcare: '🏥',
    hospitality: '🏨',
    religious: '⛪',
    government: '🏛️',
    entertainment: '🎭',
    sports: '⚽',
    manufacturing: '🏭',
    collaboration: '🤝',
    presentation: '📊',
    training: '🎓',
  };
  return icons[category.toLowerCase()] || '📊';
};

// Pure function to calculate compatibility level
const getCompatibilityLevel = (percentage: number): string => {
  if (percentage >= 90) return 'Excellent Match';
  if (percentage >= 70) return 'Good Match';
  if (percentage >= 50) return 'Fair Match';
  return 'Poor Match';
};

// Pure function to generate category routes
const getCategoryRoute = (category: string): string => {
  const categoryRoutes: Record<string, string> = {
    creative: '/products?category=creative',
    corporate: '/products?category=corporate',
    education: '/products?category=education',
    general: '/products',
  };
  return categoryRoutes[category.toLowerCase()] || '/products';
};

// Pure function to calculate score data
const calculateScoreData = (categoryScores: Record<string, number>) => {
  const entries = Object.entries(categoryScores);
  const sortedScores = [...entries].sort(
    ([, scoreA], [, scoreB]) => scoreB - scoreA
  );
  const maxScore = Math.max(...Object.values(categoryScores));
  
  return { sortedScores, maxScore };
};

/**
 * Modern CategoryScores component that displays a visual representation of category scores
 * from the quiz results with enhanced design and animations.
 */
export const CategoryScores: FC<CategoryScoresProps> = memo(({
  categoryScores,
  getCategoryColor,
}) => {
  // Memoized score calculations
  const scoreData = useMemo(() => {
    if (!categoryScores) return null;
    return calculateScoreData(categoryScores);
  }, [categoryScores]);

  if (!categoryScores || !scoreData) {
    return null;
  }

  const { sortedScores, maxScore } = scoreData;

  return (
    <div className="modern-category-scores">
      <ScoresHeader />
      <ScoreCards 
        sortedScores={sortedScores} 
        maxScore={maxScore} 
        getCategoryColor={getCategoryColor}
      />
      <ActionButtons sortedScores={sortedScores} />
      <BackgroundElements />
    </div>
  );
});

// Header component
const ScoresHeader: FC = memo(() => (
  <div className="scores-header">
    <div className="header-badge">
      <span className="badge-icon">📊</span>
      <span className="badge-text">Compatibility Analysis</span>
    </div>
    <h2 className="scores-title">
      <span className="title-gradient">Your Category Scores</span>
    </h2>
    <p className="scores-subtitle">
      Based on your quiz responses, here's how well different display categories match your needs
    </p>
  </div>
));

// Score Cards component
interface ScoreCardsProps {
  sortedScores: [string, number][];
  maxScore: number;
  getCategoryColor: (category: string) => string;
}

const ScoreCards: FC<ScoreCardsProps> = memo(({ 
  sortedScores, 
  maxScore, 
  getCategoryColor 
}) => (
  <div className="modern-scores-container">
    {sortedScores.map(([category, score], index) => {
      const percentage = (score / maxScore) * 100;
      const isTopScore = index === 0;
      
      return (
        <div 
          key={category} 
          className={`modern-score-card ${isTopScore ? 'top-score' : ''}`}
          style={{
            '--animation-delay': `${index * 0.1}s`,
            '--score-percentage': `${percentage}%`,
          } as React.CSSProperties}
        >
          <div className="score-card-header">
            <div className="category-info">
              <span className="category-icon">{getCategoryIcon(category)}</span>
              <div className="category-details">
                <h3 className="category-name">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h3>
                {isTopScore && (
                  <div className="best-match-badge">
                    <span className="badge-icon">🏆</span>
                    <span className="badge-text">Best Match</span>
                  </div>
                )}
              </div>
            </div>
            <div className="score-display">
              <div className="score-number">{score}</div>
              <div className="score-label">points</div>
            </div>
          </div>

          <div className="modern-progress-container">
            <div className="progress-track">
              <div 
                className="progress-fill"
                style={{
                  width: `${percentage}%`,
                  background: `linear-gradient(90deg, ${getCategoryColor(category)}, ${getCategoryColor(category)}99)`,
                }}
              >
                <div className="progress-shine"></div>
              </div>
            </div>
            <div className="progress-percentage">{Math.round(percentage)}%</div>
          </div>

          <div className="score-card-footer">
            <div className="compatibility-level">
              <span className="compatibility-text">
                {getCompatibilityLevel(percentage)}
              </span>
              <div className="compatibility-stars">
                {[...Array(5)].map((_, starIndex) => (
                  <span 
                    key={starIndex}
                    className={`star ${starIndex < Math.ceil(percentage / 20) ? 'filled' : ''}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>
));

// Action Buttons component
interface ActionButtonsProps {
  sortedScores: [string, number][];
}

const ActionButtons: FC<ActionButtonsProps> = memo(({ sortedScores }) => (
  <div className="scores-actions">
    <button 
      className="modern-action-btn primary"
      onClick={() => {
        const topCategory = sortedScores[0][0];
        window.location.href = getCategoryRoute(topCategory);
      }}
    >
      <span className="btn-icon">🎯</span>
      <span className="btn-text">Compare {sortedScores[0][0]} Displays</span>
      <div className="btn-shine"></div>
    </button>

    <button 
      className="modern-action-btn secondary"
      onClick={() => {
        window.location.href = '/contact?subject=DemoRequest';
      }}
    >
      <span className="btn-icon">🚀</span>
      <span className="btn-text">Schedule Demo</span>
      <div className="btn-shine"></div>
    </button>

    <button 
      className="modern-action-btn secondary"
      onClick={() => {
        window.location.href = '/contact?subject=QuoteRequest';
      }}
    >
      <span className="btn-icon">💰</span>
      <span className="btn-text">Get Pricing</span>
      <div className="btn-shine"></div>
    </button>

    <button 
      className="modern-action-btn outline"
      onClick={() => {
        window.location.reload();
      }}
    >
      <span className="btn-icon">🔄</span>
      <span className="btn-text">Start Over</span>
      <div className="btn-shine"></div>
    </button>
  </div>
));

// Background Elements component  
const BackgroundElements: FC = memo(() => (
  <div className="bg-elements">
    <div className="bg-gradient-1"></div>
    <div className="bg-gradient-2"></div>
    <div className="bg-pattern"></div>
  </div>
));

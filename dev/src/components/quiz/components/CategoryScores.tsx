import React, { type FC, memo, useMemo } from 'react';
import styles from './CategoryScores.module.scss';

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
    <div className={styles.modernCategoryScores}>
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
  <div className={styles.scoresHeader}>
    <div className={styles.headerBadge}>
      <span className={styles.badgeIcon}>📊</span>
      <span className={styles.badgeText}>Compatibility Analysis</span>
    </div>
    <h2 className={styles.scoresTitle}>
      <span className={styles.titleGradient}>Your Category Scores</span>
    </h2>
    <p className={styles.scoresSubtitle}>
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
  <div className={styles.modernScoresContainer}>
    {sortedScores.map(([category, score], index) => {
      const percentage = (score / maxScore) * 100;
      const isTopScore = index === 0;
      
      return (
        <div 
          key={category} 
          className={`${styles.modernScoreCard} ${isTopScore ? styles.topScore : ''}`}
          style={{
            '--animation-delay': `${index * 0.1}s`,
            '--score-percentage': `${percentage}%`,
          } as React.CSSProperties}
        >
          <div className={styles.scoreCardHeader}>
            <div className={styles.categoryInfo}>
              <span className={styles.categoryIcon}>{getCategoryIcon(category)}</span>
              <div className={styles.categoryDetails}>
                <h3 className={styles.categoryName}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h3>
                {isTopScore && (
                  <div className={styles.bestMatchBadge}>
                    <span className={styles.badgeIcon}>🏆</span>
                    <span className={styles.badgeText}>Best Match</span>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.scoreDisplay}>
              <div className={styles.scoreNumber}>{score}</div>
              <div className={styles.scoreLabel}>points</div>
            </div>
          </div>

          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{
                  '--progress-width': `${percentage}%`,
                  '--progress-color': getCategoryColor(category),
                } as React.CSSProperties}
              >
                <div className={styles.progressShine}></div>
              </div>
            </div>
            <div className={styles.scorePercentage}>{Math.round(percentage)}%</div>
          </div>

          <div className={styles.scoreCardFooter}>
            <div className={styles.compatibilityLevel}>
              <span className={styles.compatibilityText}>
                {getCompatibilityLevel(percentage)}
              </span>
              <div className={styles.compatibilityStars}>
                {[...Array(5)].map((_, starIndex) => (
                  <span 
                    key={starIndex}
                    className={`${styles.star} ${starIndex < Math.ceil(percentage / 20) ? styles.filled : ''}`}
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
  <div className={styles.scoresActions}>
    <button 
      className={`${styles.actionButton} ${styles.primary}`}
      onClick={() => {
        const topCategory = sortedScores[0][0];
        window.location.href = getCategoryRoute(topCategory);
      }}
    >
      <span className={styles.btnIcon}>🎯</span>
      <span className={styles.btnText}>Compare {sortedScores[0][0]} Displays</span>
      <div className={styles.btnShine}></div>
    </button>

    <button 
      className={`${styles.actionButton} ${styles.secondary}`}
      onClick={() => {
        window.location.href = '/contact?subject=DemoRequest';
      }}
    >
      <span className={styles.btnIcon}>🚀</span>
      <span className={styles.btnText}>Schedule Demo</span>
      <div className={styles.btnShine}></div>
    </button>

    <button 
      className={`${styles.actionButton} ${styles.secondary}`}
      onClick={() => {
        window.location.href = '/contact?subject=QuoteRequest';
      }}
    >
      <span className={styles.btnIcon}>💰</span>
      <span className={styles.btnText}>Get Pricing</span>
      <div className={styles.btnShine}></div>
    </button>

    <button 
      className={`${styles.actionButton} ${styles.outline}`}
      onClick={() => {
        window.location.reload();
      }}
    >
      <span className={styles.btnIcon}>🔄</span>
      <span className={styles.btnText}>Start Over</span>
      <div className={styles.btnShine}></div>
    </button>
  </div>
));

// Background Elements component  
const BackgroundElements: FC = memo(() => (
  <div className={styles.bgElements}>
    <div className={styles.bgGradient1}></div>
    <div className={styles.bgGradient2}></div>
    <div className={styles.bgPattern}></div>
  </div>
));

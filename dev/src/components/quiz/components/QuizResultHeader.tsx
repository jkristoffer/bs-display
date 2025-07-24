import type { FC } from 'react';
import styles from './QuizResultHeader.module.scss';

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
    <header className={styles.resultHeader} role="banner" aria-labelledby="quiz-result-title">
      <h4 id="quiz-result-title" aria-live="polite">{title}</h4>
      
      {/* Add hybrid badge for hybrid results */}
      {isHybridResult && (
        <div 
          className={styles.hybridBadge}
          style={{ '--badge-color': getCategoryColor(result) } as React.CSSProperties}
          role="status"
          aria-label={`${result.includes('-') ? 'Hybrid Solution' : 'Mixed Use Case'} recommendation`}
        >
          <span className={styles.hybridBadgeLabel}>
            {result.includes('-') ? 'Hybrid Solution' : 'Mixed Use Case'}
          </span>
        </div>
      )}
      
      <p aria-describedby="quiz-result-title">{description}</p>
      
      {/* Enhanced hybrid explanation */}
      {isHybridResult && (
        <div className={styles.hybridExplanation}>
          {result.includes('-') ? (
            /* For dedicated hybrid templates */
            <p className={styles.hybridNote}>
              <strong>Why this recommendation:</strong> Your answers indicate needs that span multiple use cases.
              This specialized hybrid solution is designed specifically for environments that combine
              <span 
                className={styles.categoryHighlight} 
                style={{ '--highlight-color': getCategoryColor(result.split('-')[0]) } as React.CSSProperties}
              > {result.split('-')[0]}</span> and
              <span 
                className={styles.categoryHighlight} 
                style={{ '--highlight-color': getCategoryColor(result.split('-')[1]) } as React.CSSProperties}
              > {result.split('-')[1]}</span> requirements.
            </p>
          ) : secondaryCategory ? (
            /* For hybrid without specific template */
            <div>
              <p className={styles.hybridNote}>
                <strong>Mixed Use Case Detected:</strong> Your answers show needs that span both
                <span 
                  className={styles.categoryHighlight} 
                  style={{ '--highlight-color': getCategoryColor(result) } as React.CSSProperties}
                > {result}</span> and
                <span 
                  className={styles.categoryHighlight} 
                  style={{ '--highlight-color': getCategoryColor(secondaryCategory) } as React.CSSProperties}
                > {secondaryCategory}</span> categories.
              </p>
              
              {/* Visual hybrid breakdown bar */}
              <div className={styles.hybridBreakdown}>
                <div 
                  className={`${styles.hybridSegment} ${styles.primary}`}
                  style={{ '--segment-color': getCategoryColor(result) } as React.CSSProperties}
                >
                  {result} (70%)
                </div>
                <div 
                  className={`${styles.hybridSegment} ${styles.secondary}`}
                  style={{ '--segment-color': getCategoryColor(secondaryCategory) } as React.CSSProperties}
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

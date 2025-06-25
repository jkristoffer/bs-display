import type { FC } from 'react';
import type { QuizResult, Product } from '../types';
import { ProductRecommendations } from '../index';

interface AlternativeRecommendationsProps {
  secondaryRecommendations: Array<{
    category: string;
    scorePercent: number;
    reason: string;
  }>;
  results: Record<string, QuizResult>;
  getProductsForQuizResult: (result: string) => { products: Product[]; allFeatures?: string[] };
  getRelevantFeatures: (product: Product, context?: string) => string[];
}

/**
 * AlternativeRecommendations component that displays alternative product recommendations
 * based on the user's quiz answers.
 */
export const AlternativeRecommendations: FC<AlternativeRecommendationsProps> = ({
  secondaryRecommendations,
  results,
  getProductsForQuizResult,
  getRelevantFeatures,
}) => {
  if (secondaryRecommendations.length === 0) {
    return null;
  }

  return (
    <div className="recommendation-details alternative-recommendations">
      <h5>Alternative Options Based On Your Answers</h5>
      <p className="alternatives-explanation">
        Based on your answers, these solutions might also be suitable with some
        trade-offs. Each option is scored based on how well it matches your
        specific needs.
      </p>

      <div className="alternatives-list">
        {secondaryRecommendations.map((rec) => (
          <div key={rec.category} className="alternative-item">
            <div className="alternative-header">
              <h6>{results[rec.category]?.title || rec.category}</h6>
              <div className="match-score">
                <div className="score-pill">{rec.scorePercent}% Match</div>
              </div>
            </div>

            <p className="alternative-reason">{rec.reason}</p>

            <div className="alternative-features">
              <h6>Key Features:</h6>
              <ul>
                {results[rec.category]?.recommendation?.features
                  ?.slice(0, 3)
                  .map((feature: string, i: number) => (
                    <li key={i}>{feature}</li>
                  ))}
              </ul>
            </div>

            <div className="alternative-product">
              <ProductRecommendations
                result={rec.category}
                getProductsForQuizResult={getProductsForQuizResult}
                getRelevantFeatures={getRelevantFeatures}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

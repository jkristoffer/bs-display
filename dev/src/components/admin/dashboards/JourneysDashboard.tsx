import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import ChartWrapper from '../charts/ChartWrapper';
import MetricCard from '../MetricCard/MetricCard';
import LoadingState from '../LoadingState/LoadingState';
import styles from './JourneysDashboard.module.scss';

interface JourneyData {
  funnel: {
    stages: Array<{
      name: string;
      count: number;
      percentage: number;
      avgDuration: string;
    }>;
  };
  avgJourneyDuration: {
    overall: string;
    byStage: Record<string, string>;
  };
  topPaths: Array<{
    path: string;
    count: number;
    conversionRate: number;
    avgDuration: string;
  }>;
  dropOffPoints: Array<{
    page: string;
    dropOffRate: number;
    reason: string;
    avgTimeBeforeDrop: string;
    suggestions: string[];
  }>;
  leadScoring: {
    distribution: Array<{
      range: string;
      count: number;
      percentage: number;
    }>;
    avgScore: number;
    highValueLeads: number;
    scoringFactors: Array<{
      factor: string;
      weight: number;
      avgContribution: number;
    }>;
  };
  conversionProbability: {
    byScore: Array<{
      scoreRange: string;
      probability: number;
    }>;
    byStage: Array<{
      stage: string;
      probability: number;
    }>;
  };
}

export default function JourneysDashboard() {
  const [data, setData] = useState<JourneyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJourneyData();
  }, []);

  const fetchJourneyData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/analytics/journeys');
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to load journey data');
      }
    } catch (err) {
      setError('Failed to fetch journey data');
      console.error('Journey fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Loading journey analytics..." />;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!data) return <div className={styles.error}>No data available</div>;

  const getStageColor = (stage: string): string => {
    const colors: Record<string, string> = {
      'Awareness': '#4299e1',
      'Interest': '#48bb78',
      'Consideration': '#ed8936',
      'Decision': '#9f7aea',
      'Customer': '#f56565',
    };
    return colors[stage] || '#718096';
  };

  return (
    <div className={styles.journeysDashboard}>
      <h1>Customer Journey Analytics</h1>

      <div className={styles.metricsRow}>
        <MetricCard
          title="Avg. Journey Duration"
          value={data.avgJourneyDuration.overall}
          icon="⏱️"
        />
        <MetricCard
          title="Avg. Lead Score"
          value={data.leadScoring.avgScore}
          icon="📊"
        />
        <MetricCard
          title="High-Value Leads"
          value={data.leadScoring.highValueLeads.toLocaleString()}
          change={23.5}
          icon="⭐"
          color="success"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${data.funnel.stages[4].percentage.toFixed(1)}%`}
          change={-5.2}
          icon="🎯"
          color="warning"
        />
      </div>

      <div className={styles.funnelSection}>
        <div className={styles.funnelChart}>
          <h3>Conversion Funnel</h3>
          <div className={styles.funnelStages}>
            {data.funnel.stages.map((stage) => (
              <div key={stage.name} className={styles.funnelStage}>
                <div 
                  className={styles.funnelBar}
                  style={{ 
                    width: `${stage.percentage}%`,
                    backgroundColor: getStageColor(stage.name)
                  }}
                >
                  <div className={styles.funnelLabel}>
                    <span className={styles.stageName}>{stage.name}</span>
                    <span className={styles.stageCount}>{stage.count.toLocaleString()}</span>
                  </div>
                </div>
                <div className={styles.stageDetails}>
                  <span className={styles.stagePercentage}>{stage.percentage}%</span>
                  <span className={styles.stageDuration}>{stage.avgDuration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.funnelStats}>
          <h3>Stage Conversion Rates</h3>
          {data.funnel.stages.slice(0, -1).map((stage, index) => {
            const nextStage = data.funnel.stages[index + 1];
            const conversionRate = ((nextStage.count / stage.count) * 100).toFixed(1);
            
            return (
              <div key={stage.name} className={styles.stageConversion}>
                <div className={styles.stageNames}>
                  <span>{stage.name}</span>
                  <span>→</span>
                  <span>{nextStage.name}</span>
                </div>
                <div className={styles.conversionBar}>
                  <div 
                    className={styles.conversionFill}
                    style={{ 
                      width: `${conversionRate}%`, 
                      backgroundColor: getStageColor(nextStage.name) 
                    }}
                  />
                  <span className={styles.conversionLabel}>{conversionRate}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.pathsSection}>
        <div className={styles.topPaths}>
          <h3>Top Conversion Paths</h3>
          <div className={styles.pathsList}>
            {data.topPaths.map((path, index) => (
              <div key={index} className={styles.pathItem}>
                <div className={styles.pathRank}>#{index + 1}</div>
                <div className={styles.pathInfo}>
                  <div className={styles.pathRoute}>{path.path}</div>
                  <div className={styles.pathStats}>
                    <span>{path.count} journeys</span>
                    <span className={styles.convRate}>{path.conversionRate}% conversion</span>
                    <span className={styles.avgDuration}>{path.avgDuration} avg</span>
                  </div>
                </div>
                <div className={styles.pathBar}>
                  <div 
                    className={styles.pathFill}
                    style={{ width: `${(path.count / data.topPaths[0].count) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.dropOffPoints}>
          <h3>Major Drop-off Points</h3>
          <div className={styles.dropOffList}>
            {data.dropOffPoints.map((point, index) => (
              <div key={index} className={styles.dropOffItem}>
                <div className={styles.dropOffHeader}>
                  <div className={styles.dropOffPage}>{point.page}</div>
                  <div className={styles.dropOffRate}>
                    <span className={styles.rateValue}>{point.dropOffRate}%</span>
                    <span className={styles.rateLabel}>drop-off</span>
                  </div>
                </div>
                <div className={styles.dropOffDetails}>
                  <div className={styles.dropOffReason}>
                    <strong>Reason:</strong> {point.reason}
                  </div>
                  <div className={styles.dropOffTime}>
                    <strong>Avg. time before drop:</strong> {point.avgTimeBeforeDrop}
                  </div>
                  <div className={styles.dropOffSuggestions}>
                    <strong>Suggestions:</strong>
                    <ul>
                      {point.suggestions.map((suggestion, i) => (
                        <li key={i}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.leadScoringSection}>
        <div className={styles.scoreDistribution}>
          <h3>Lead Score Distribution</h3>
          <ChartWrapper title="Score Distribution" height={250}>
            <BarChart data={data.leadScoring.distribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="range" stroke="#718096" />
              <YAxis stroke="#718096" />
              <Tooltip />
              <Bar 
                dataKey="count" 
                fill="#4299e1"
                name="Leads"
              />
            </BarChart>
          </ChartWrapper>
        </div>

        <div className={styles.scoringFactors}>
          <h3>Scoring Factors</h3>
          <div className={styles.factorsList}>
            {data.leadScoring.scoringFactors.map((factor, index) => (
              <div key={index} className={styles.factorItem}>
                <div className={styles.factorName}>{factor.factor}</div>
                <div className={styles.factorWeight}>
                  Weight: {factor.weight}%
                </div>
                <div className={styles.factorContribution}>
                  Avg. contribution: {factor.avgContribution}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.probabilitySection}>
        <div className={styles.probabilityByScore}>
          <h3>Conversion Probability by Score</h3>
          <ChartWrapper title="Conversion Probability" height={250}>
            <BarChart data={data.conversionProbability.byScore}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="scoreRange" stroke="#718096" />
              <YAxis stroke="#718096" />
              <Tooltip formatter={(value) => `${value}%`} />
              <Bar 
                dataKey="probability" 
                fill="#48bb78"
                name="Probability %"
              />
            </BarChart>
          </ChartWrapper>
        </div>
      </div>
    </div>
  );
}
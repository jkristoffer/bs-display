import React, { useState } from 'react';
import { allModels } from '../../../data/models/models.all.js';
import './TouchComparison.scss';

interface Technology {
  id: string;
  name: string;
  precision: number;
  speed: number;
  cost: number;
  multiTouch: boolean;
  penRequired: boolean | string;
  pros: string[];
  cons: string[];
  bestFor: string;
  priceRange: string;
  examples: any[];
}

const TouchComparison: React.FC = () => {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [compareTechs, setCompareTechs] = useState<string[]>([]);

  // Technology data - simplified and focused
  const technologies: Technology[] = [
    {
      id: 'ir',
      name: 'Infrared (IR)',
      precision: 3,
      speed: 3,
      cost: 1,
      multiTouch: true,
      penRequired: false,
      pros: ['Cost-effective', 'Works with any object', 'Multi-touch support'],
      cons: ['Lower precision', 'Affected by light', 'Slower response'],
      bestFor: 'Education & Budget-conscious buyers',
      priceRange: '$500 - $1,500',
      examples: allModels.filter(m => 
        m.touchTechnology?.toLowerCase().includes('infrared') || 
        m.touchTechnology?.toLowerCase().includes('ir')
      ).slice(0, 2)
    },
    {
      id: 'emr',
      name: 'EMR',
      precision: 5,
      speed: 5,
      cost: 5,
      multiTouch: true,
      penRequired: true,
      pros: ['Highest precision', 'Pressure sensitive', 'Natural writing'],
      cons: ['Requires special pen', 'Higher cost', 'Pen-only input'],
      bestFor: 'Design & Professional Art',
      priceRange: '$12,000+',
      examples: allModels.filter(m => 
        m.touchTechnology?.toLowerCase().includes('emr')
      ).slice(0, 2)
    },
    {
      id: 'capacitive',
      name: 'Capacitive',
      precision: 5,
      speed: 5,
      cost: 4,
      multiTouch: true,
      penRequired: 'optional',
      pros: ['High precision', 'Fast response', 'Smartphone-like feel'],
      cons: ['Higher cost', 'Requires conductive touch'],
      bestFor: 'Business & Interactive Apps',
      priceRange: '$6,000 - $12,000',
      examples: allModels.filter(m => 
        m.touchTechnology?.toLowerCase().includes('capacitive') || 
        m.touchTechnology?.toLowerCase().includes('pcap')
      ).slice(0, 2)
    },
    {
      id: 'optical',
      name: 'Optical',
      precision: 3,
      speed: 2,
      cost: 3,
      multiTouch: true,
      penRequired: false,
      pros: ['Works with any object', 'Good for large screens', 'Object recognition'],
      cons: ['Slower response', 'Affected by lighting'],
      bestFor: 'Large Displays & Public Spaces',
      priceRange: '$3,000 - $6,000',
      examples: allModels.filter(m => 
        m.touchTechnology?.toLowerCase().includes('optical')
      ).slice(0, 2)
    },
    {
      id: 'resistive',
      name: 'Resistive',
      precision: 2,
      speed: 2,
      cost: 1,
      multiTouch: false,
      penRequired: false,
      pros: ['Very low cost', 'Works with any object', 'Durable'],
      cons: ['Poor precision', 'Single touch only', 'Requires pressure'],
      bestFor: 'Basic Applications & Harsh Environments',
      priceRange: '$500 - $1,500',
      examples: allModels.filter(m => 
        m.touchTechnology?.toLowerCase().includes('resistive')
      ).slice(0, 2)
    }
  ];

  const handleTechClick = (techId: string) => {
    setSelectedTech(selectedTech === techId ? null : techId);
  };

  const handleCompareToggle = (techId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (compareTechs.includes(techId)) {
      setCompareTechs(compareTechs.filter(id => id !== techId));
    } else if (compareTechs.length < 3) {
      setCompareTechs([...compareTechs, techId]);
    }
  };

  const renderMetricBar = (value: number, max: number = 5, label: string) => {
    const percentage = (value / max) * 100;
    const color = value >= 4 ? '#48bb78' : value >= 3 ? '#4299e1' : '#ed8936';
    
    return (
      <div className="metric-bar">
        <span className="metric-label">{label}</span>
        <div className="bar-container">
          <div 
            className="bar-fill" 
            style={{ 
              width: `${percentage}%`,
              backgroundColor: color
            }}
          />
          <span className="bar-value">{value}/{max}</span>
        </div>
      </div>
    );
  };

  const renderCostIndicator = (cost: number) => {
    return (
      <div className="cost-indicator">
        <span className="cost-label">Cost</span>
        <div className="cost-symbols">
          {[...Array(5)].map((_, i) => (
            <span 
              key={i} 
              className={`dollar ${i < cost ? 'active' : ''}`}
            >
              $
            </span>
          ))}
        </div>
      </div>
    );
  };

  const getRecommendation = () => {
    return (
      <div className="recommendations">
        <h3>Quick Recommendations</h3>
        <div className="recommendation-grid">
          <div className="rec-card">
            <span className="rec-icon">🎯</span>
            <h4>Best Precision</h4>
            <p>EMR or Capacitive</p>
          </div>
          <div className="rec-card">
            <span className="rec-icon">💰</span>
            <h4>Best Value</h4>
            <p>Infrared (IR)</p>
          </div>
          <div className="rec-card">
            <span className="rec-icon">⚡</span>
            <h4>Best Performance</h4>
            <p>Capacitive</p>
          </div>
          <div className="rec-card">
            <span className="rec-icon">📏</span>
            <h4>Large Displays</h4>
            <p>Optical</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="comparison" className="touch-comparison">
      <div className="container">
        <div className="comparison-header">
          <h2>Touch Technology Comparison</h2>
          <p>Visual comparison of 5 major touch technologies</p>
          
          {compareTechs.length > 0 && (
            <div className="compare-status">
              <span>{compareTechs.length} selected for comparison</span>
              <button 
                className="clear-btn"
                onClick={() => setCompareTechs([])}
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Main Comparison Grid */}
        <div className="comparison-grid">
          {technologies.map(tech => {
            const isSelected = selectedTech === tech.id;
            const isComparing = compareTechs.includes(tech.id);
            
            return (
              <div
                key={tech.id}
                className={`tech-card ${isSelected ? 'selected' : ''} ${isComparing ? 'comparing' : ''}`}
                onClick={() => handleTechClick(tech.id)}
              >
                <div className="tech-header">
                  <h3>{tech.name}</h3>
                  <span className="price-range">{tech.priceRange}</span>
                  <label 
                    className="compare-checkbox"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isComparing}
                      onChange={(e) => handleCompareToggle(tech.id, e as any)}
                      disabled={!isComparing && compareTechs.length >= 3}
                    />
                    <span className="checkbox-label">Compare</span>
                  </label>
                </div>

                <div className="tech-metrics">
                  {renderMetricBar(tech.precision, 5, 'Precision')}
                  {renderMetricBar(tech.speed, 5, 'Speed')}
                  {renderCostIndicator(tech.cost)}
                </div>

                <div className="tech-features">
                  <div className={`feature ${tech.multiTouch ? 'yes' : 'no'}`}>
                    <span className="feature-icon">{tech.multiTouch ? '✓' : '✗'}</span>
                    Multi-touch
                  </div>
                  <div className={`feature ${tech.penRequired === false ? 'yes' : tech.penRequired === true ? 'no' : 'maybe'}`}>
                    <span className="feature-icon">
                      {tech.penRequired === false ? '✓' : tech.penRequired === true ? '✗' : '~'}
                    </span>
                    {tech.penRequired === true ? 'Pen Required' : 
                     tech.penRequired === false ? 'No Pen Needed' : 
                     'Pen Optional'}
                  </div>
                </div>

                <div className="tech-best-for">
                  <span className="label">Best for:</span>
                  <span className="value">{tech.bestFor}</span>
                </div>

                {/* Expanded Details (on hover/selection) */}
                {isSelected && (
                  <div className="tech-details">
                    <div className="pros-cons">
                      <div className="pros">
                        <h4>Pros:</h4>
                        <ul>
                          {tech.pros.map((pro, i) => (
                            <li key={i}>{pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="cons">
                        <h4>Cons:</h4>
                        <ul>
                          {tech.cons.map((con, i) => (
                            <li key={i}>{con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    {tech.examples.length > 0 && (
                      <div className="product-examples">
                        <h4>Example Products:</h4>
                        {tech.examples.map((product, i) => (
                          <div key={i} className="example-product">
                            <span className="product-name">{product.brand} {product.size}"</span>
                            {product.price && <span className="product-price">${product.price}</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* Floating Comparison Panel */}
        {compareTechs.length >= 2 && (
          <div className="floating-comparison-panel">
            <div className="panel-header">
              <h3>Comparing {compareTechs.length} Technologies</h3>
              <button 
                className="close-panel-btn"
                onClick={() => setCompareTechs([])}
                title="Close comparison panel"
              >
                ×
              </button>
            </div>
            <div className="compared-techs">
              {compareTechs.map(techId => {
                const tech = technologies.find(t => t.id === techId);
                if (!tech) return null;
                return (
                  <div key={techId} className="compared-tech-mini">
                    <span className="tech-name">{tech.name}</span>
                    <button 
                      className="remove-btn"
                      onClick={() => setCompareTechs(compareTechs.filter(id => id !== techId))}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
            <button 
              className="view-comparison-btn"
              onClick={() => {
                const element = document.querySelector('.comparison-summary');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View Full Comparison ↓
            </button>
          </div>
        )}

        {/* Comparison Summary */}
        {compareTechs.length >= 2 && (
          <div className="comparison-summary">
            <h3>Comparison Summary</h3>
            <div className="summary-grid">
              <div className="summary-row">
                <span className="summary-label">Best Precision:</span>
                <span className="summary-value">
                  {technologies
                    .filter(t => compareTechs.includes(t.id))
                    .sort((a, b) => b.precision - a.precision)[0]?.name}
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Best Speed:</span>
                <span className="summary-value">
                  {technologies
                    .filter(t => compareTechs.includes(t.id))
                    .sort((a, b) => b.speed - a.speed)[0]?.name}
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Most Affordable:</span>
                <span className="summary-value">
                  {technologies
                    .filter(t => compareTechs.includes(t.id))
                    .sort((a, b) => a.cost - b.cost)[0]?.name}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {getRecommendation()}
      </div>
    </section>
  );
};

export default TouchComparison;
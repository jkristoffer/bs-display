import React from 'react';
import styles from './EmptyState.module.scss';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  suggestions?: string[];
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon,
  action,
  suggestions
}) => {
  return (
    <div className={styles.container} role="status" aria-label="No results">
      {icon && (
        <div className={styles.icon} aria-hidden="true">
          {icon}
        </div>
      )}
      
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      
      {suggestions && suggestions.length > 0 && (
        <div className={styles.suggestions}>
          <h4 className={styles.suggestionsTitle}>Try:</h4>
          <ul className={styles.suggestionsList}>
            {suggestions.map((suggestion, index) => (
              <li key={index} className={styles.suggestionItem}>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {action && (
        <button 
          className={styles.actionButton}
          onClick={action.onClick}
          type="button"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
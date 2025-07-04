import React from 'react';
import styles from './BrochureCard.module.scss';

export interface BrochureCardProps {
  readonly title: string;
  readonly description: string;
  readonly brochureUrl: string;
  readonly className?: string;
  readonly displayMode?: 'iframe' | 'button';
  readonly iframeHeight?: string;
}

const createBrochureHandler = (url: string) => {
  return () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
};

const getBrochureIcon = () => '📋';

const getBrochureButtonText = () => 'View Digital Brochure';

export const BrochureCard: React.FC<BrochureCardProps> = ({
  title,
  description,
  brochureUrl,
  className = '',
  displayMode = 'button',
  iframeHeight = '600px'
}) => {
  const handleBrochureClick = createBrochureHandler(brochureUrl);
  const brochureIcon = getBrochureIcon();
  const buttonText = getBrochureButtonText();

  const renderContent = () => {
    if (displayMode === 'iframe') {
      return (
        <div className={styles.iframeContainer}>
          <iframe
            src={brochureUrl}
            className={styles.brochureIframe}
            style={{ height: iframeHeight }}
            title={title}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      );
    }

    return (
      <button
        onClick={handleBrochureClick}
        className={styles.brochureButton}
        type="button"
        aria-label={`Open ${title} in new tab`}
      >
        {buttonText}
      </button>
    );
  };

  return (
    <div className={`${styles.brochureCard} ${displayMode === 'iframe' ? styles.iframeMode : ''} ${className}`}>
      <div className={styles.brochureContent}>
        <div className={styles.brochureHeader}>
          <div className={styles.brochureIcon}>{brochureIcon}</div>
          <h2 className={styles.brochureTitle}>{title}</h2>
        </div>
        <p className={styles.brochureDescription}>{description}</p>
        {renderContent()}
      </div>
    </div>
  );
};

export default BrochureCard;
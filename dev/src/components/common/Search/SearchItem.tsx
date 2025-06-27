import React from 'react';
import type { SearchResult } from './useSearch';
import styles from './SearchItem.module.scss';

interface SearchItemProps {
  result: SearchResult;
  query: string;
  onClick: () => void;
  tabIndex?: number;
  role?: string;
  'aria-describedby'?: string;
}

const SearchItem: React.FC<SearchItemProps> = ({
  result,
  query,
  onClick,
  tabIndex = 0,
  role = "button",
  'aria-describedby': ariaDescribedBy
}) => {
  const handleClick = () => {
    onClick();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  // Highlight search terms in text
  const highlightText = (text: string, searchQuery: string): React.ReactNode => {
    if (!searchQuery || searchQuery.length < 2) {
      return text;
    }

    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      const isMatch = regex.test(part);
      return isMatch ? (
        <mark key={index} className={styles.searchItem__highlight}>
          {part}
        </mark>
      ) : (
        part
      );
    });
  };

  // Get type-specific styling and icons
  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'product':
        return {
          icon: '📺',
          className: styles.searchItem_product,
          badge: result.brand
        };
      case 'blog':
        return {
          icon: '📖',
          className: styles.searchItem_blog,
          badge: 'Article'
        };
      case 'usecase':
        return {
          icon: '💼',
          className: styles.searchItem_usecase,
          badge: 'Use Case'
        };
      case 'page':
        return {
          icon: '📄',
          className: styles.searchItem_page,
          badge: 'Guide'
        };
      default:
        return {
          icon: '📄',
          className: '',
          badge: 'Page'
        };
    }
  };

  const typeConfig = getTypeConfig(result.type);

  return (
    <div
      className={`${styles.searchItem} ${typeConfig.className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={tabIndex}
      role={role}
      aria-describedby={ariaDescribedBy}
    >
      <div className={styles.searchItem__content}>
        {/* Image for products */}
        {result.type === 'product' && result.image && (
          <div className={styles.searchItem__imageWrapper}>
            <img
              src={result.image}
              alt={result.title}
              className={styles.searchItem__image}
              loading="lazy"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Icon for non-product items */}
        {result.type !== 'product' && (
          <div className={styles.searchItem__icon}>
            {typeConfig.icon}
          </div>
        )}

        <div className={styles.searchItem__details}>
          {/* Type badge */}
          <div className={styles.searchItem__meta}>
            <span className={styles.searchItem__badge}>
              {typeConfig.badge}
            </span>
            {result.category && (
              <span className={styles.searchItem__category}>
                {result.category}
              </span>
            )}
          </div>

          {/* Title with highlighting */}
          <h4 className={styles.searchItem__title}>
            {highlightText(result.title, query)}
          </h4>

          {/* Description with highlighting */}
          <p className={styles.searchItem__description}>
            {highlightText(result.description, query)}
          </p>

          {/* Keywords preview for products */}
          {result.type === 'product' && result.keywords && (
            <div className={styles.searchItem__keywords}>
              {result.keywords.slice(0, 3).map((keyword, index) => (
                <span key={index} className={styles.searchItem__keyword}>
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action indicator */}
        <div className={styles.searchItem__action}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Hover overlay for better visual feedback */}
      <div className={styles.searchItem__overlay}></div>
    </div>
  );
};

export default SearchItem;
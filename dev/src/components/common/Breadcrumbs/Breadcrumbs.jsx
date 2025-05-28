import React from 'react';
import styles from './Breadcrumbs.module.scss';

/**
 * Reusable breadcrumbs component that can be used across the site
 * Each item can be a link (with path) or just text (without path)
 * The last item is automatically styled as active
 */
function Breadcrumbs({ items, className = '' }) {
  return (
    <nav aria-label="Breadcrumb" className={`${styles.breadcrumbs} ${className}`}>
      <ol>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li 
              key={`${item.label}-${index}`} 
              className={isLast ? styles.active : ''}
              {...(isLast ? { 'aria-current': 'page' } : {})}
            >
              {!isLast && item.path ? (
                <a href={item.path}>{item.label}</a>
              ) : (
                <span>{item.label}</span>
              )}
              {!isLast && <span className={styles.separator}>&gt;</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;

import { useState, useEffect } from 'react';
import styles from './Breadcrumbs.module.scss';

/**
 * Modern breadcrumbs component with responsive truncation
 * Shows all items on desktop, truncates to Home > ... > Current on mobile
 */
function Breadcrumbs({ items, className = '' }) {
  const [isMobile, setIsMobile] = useState(false);
  
  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Make sure items array exists and has items
  if (!items || !items.length) {
    return null;
  }

  // Determine if we should truncate
  const shouldTruncate = isMobile && items.length > 3;
  const truncatedClass = shouldTruncate ? styles.truncated : '';

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`${styles.breadcrumbs} ${truncatedClass} ${className}`}
    >
      <ol itemScope itemType="https://schema.org/BreadcrumbList">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;
          const isSecondToLast = index === items.length - 2;
          
          // For mobile truncation: show first, ellipsis, second-to-last, and last
          if (shouldTruncate && !isFirst && !isLast && !isSecondToLast) {
            // Show ellipsis only after the first item
            if (index === 1) {
              return (
                <li key="ellipsis" className={styles.ellipsis}>
                  <span aria-label="Hidden breadcrumb items">...</span>
                  <span className={styles.separator} aria-hidden="true">/</span>
                </li>
              );
            }
            // Hide other middle items
            return null;
          }
          
          return (
            <li 
              key={`${item.label}-${index}`} 
              className={isLast ? styles.active : ''}
              {...(isLast ? { 'aria-current': 'page' } : {})}
              itemProp="itemListElement" 
              itemScope 
              itemType="https://schema.org/ListItem"
            >
              {!isLast && item.path ? (
                <a 
                  href={item.path} 
                  itemProp="item"
                  title={item.label}
                >
                  <span itemProp="name">{item.label}</span>
                </a>
              ) : (
                <span itemProp="name" title={item.label}>
                  {item.label}
                </span>
              )}
              <meta itemProp="position" content={index + 1} />
              {!isLast && <span className={styles.separator} aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;

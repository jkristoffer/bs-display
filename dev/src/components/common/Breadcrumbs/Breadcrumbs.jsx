import styles from './Breadcrumbs.module.scss';

/**
 * Reusable breadcrumbs component that can be used across the site
 * Each item can be a link (with path) or just text (without path)
 * The last item is automatically styled as active
 */
function Breadcrumbs({ items, className = '' }) {
  // Make sure items array exists and has items
  if (!items || !items.length) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={`${styles.breadcrumbs} ${className}`}>
      <ol itemScope itemType="https://schema.org/BreadcrumbList">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
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
                <a href={item.path} itemProp="item">
                  <span itemProp="name">{item.label}</span>
                </a>
              ) : (
                <span itemProp="name">{item.label}</span>
              )}
              <meta itemProp="position" content={index + 1} />
              {!isLast && <span className={styles.separator} aria-hidden="true">›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;

import React from 'react';
import type { NavSectionProps } from '../../../types/navigation';
import { NavButton } from './NavButton';
import styles from './NavSection.module.scss';

/**
 * NavSection - Organized section component for mobile navigation grid
 * 
 * Features:
 * - Flexible grid layout with configurable columns
 * - Section headers with semantic HTML
 * - Animation delays for staggered entrance
 * - Responsive design adaptation
 * - Accessibility with proper heading hierarchy
 */
const NavSection = React.forwardRef<HTMLElement, NavSectionProps>(function NavSection({
  section,
  currentPath,
  onItemClick,
  className = '',
  columns = 2,
  gap = 'md',
  animationDelay = 0,
  headingLevel = 2,
  ...props
}, ref) {
  
  const handleItemClick = (item: typeof section.items[0]) => {
    onItemClick?.(item);
  };

  const isItemActive = (item: typeof section.items[0]) => {
    if (!currentPath) return false;
    return item.path === currentPath;
  };

  // Generate heading component based on level
  const HeadingComponent = React.createElement;

  // Generate CSS classes
  const sectionClasses = [
    styles.navSection,
    styles[`columns-${columns}`],
    styles[`gap-${gap}`],
    className
  ].filter(Boolean).join(' ');

  // Animation delay styling
  const animationStyle = {
    '--animation-delay': `${animationDelay}ms`,
  } as React.CSSProperties;

  return (
    <section 
      ref={ref}
      className={sectionClasses}
      style={animationStyle}
      data-section-id={section.id}
      aria-labelledby={`section-heading-${section.id}`}
      {...props}
    >
      {/* Section Header */}
      {section.showTitle !== false && (
        <header className={styles.sectionHeader}>
{HeadingComponent(
            `h${headingLevel}`,
            {
              id: `section-heading-${section.id}`,
              className: styles.sectionTitle,
            },
            section.title
          )}
          
          {section.description && (
            <p className={styles.sectionDescription}>
              {section.description}
            </p>
          )}
        </header>
      )}

      {/* Navigation Items Grid */}
      <div 
        className={styles.itemsGrid}
        role="group"
        aria-labelledby={`section-heading-${section.id}`}
      >
        {section.items.map((item, index) => (
          <NavButton
            key={item.id}
            item={item}
            isActive={isItemActive(item)}
            onClick={handleItemClick}
            variant={item.priority === 'high' ? 'featured' : 'standard'}
            size="md"
            showDescription={false}
            showIcon={true}
            showImage={true}
            iconPosition="top"
            style={{
              '--item-animation-delay': `${animationDelay + (index * 50)}ms`,
            } as React.CSSProperties}
            data-testid={`nav-item-${item.id}`}
          />
        ))}
      </div>
    </section>
  );
});

export { NavSection };
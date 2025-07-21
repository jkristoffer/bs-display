import React, { useRef, useImperativeHandle } from 'react';
import type { 
  MobileMenuGridProps, 
  MobileMenuGridRef,
  MobileNavItem 
} from '../../../types/navigation';
import { NavSection } from './NavSection';
import styles from './MobileMenuGrid.module.scss';

/**
 * MobileMenuGrid - Responsive grid layout for mobile navigation
 * 
 * Features:
 * - Adaptive grid columns (2-3 based on screen size)
 * - Touch-optimized interactions
 * - ARIA accessibility support
 * - Smooth animations with stagger effects
 * - Performance optimized for mobile devices
 */
const MobileMenuGrid = React.forwardRef<MobileMenuGridRef, MobileMenuGridProps>(function MobileMenuGrid({
  sections,
  isOpen,
  onClose,
  onItemClick,
  currentPath,
  className = '',
  defaultColumns = 2,
  adaptiveColumns = true,
  ariaLabel = 'Mobile navigation menu',
  ariaDescribedBy,
  animationDuration = 300,
  staggerDelay = 50,
  hapticFeedback = true,
  touchSensitivity = 'medium',
  ...props
}, ref) {
  const gridRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  // Imperative methods for parent components
  useImperativeHandle(ref, () => ({
    open: () => {
      // Focus management when opening
      requestAnimationFrame(() => {
        const firstButton = gridRef.current?.querySelector('button');
        firstButton?.focus();
      });
    },
    close: () => {
      onClose();
    },
    toggle: () => {
      if (isOpen) {
        onClose();
      } else {
        // Parent should handle opening
      }
    },
    focusFirstItem: () => {
      const firstButton = gridRef.current?.querySelector('button');
      firstButton?.focus();
    },
    focusLastItem: () => {
      const buttons = gridRef.current?.querySelectorAll('button');
      const lastButton = buttons?.[buttons.length - 1] as HTMLButtonElement;
      lastButton?.focus();
    },
    scrollToSection: (sectionId: string) => {
      const section = sectionsRef.current.find(
        el => el?.getAttribute('data-section-id') === sectionId
      );
      section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }));

  const handleItemClick = (item: MobileNavItem) => {
    // Haptic feedback for supported devices
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10); // Short haptic feedback
    }

    onItemClick?.(item);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  // Generate CSS custom properties for animation
  const animationVars = {
    '--animation-duration': `${animationDuration}ms`,
    '--stagger-delay': `${staggerDelay}ms`,
    '--touch-sensitivity': touchSensitivity,
  } as React.CSSProperties;

  const gridClasses = [
    styles.mobileMenuGrid,
    styles[`columns-${defaultColumns}`],
    adaptiveColumns && styles.adaptive,
    isOpen && styles.open,
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      ref={gridRef}
      className={gridClasses}
      style={animationVars}
      role="navigation"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <div className={styles.gridContainer}>
        {sections.map((section, index) => (
          <NavSection
            key={section.id}
            ref={(el: HTMLElement | null) => {
              sectionsRef.current[index] = el;
            }}
            section={section}
            currentPath={currentPath}
            onItemClick={handleItemClick}
            columns={section.columns || defaultColumns}
            animationDelay={index * staggerDelay}
            data-section-id={section.id}
          />
        ))}
      </div>
    </div>
  );
});

export { MobileMenuGrid };
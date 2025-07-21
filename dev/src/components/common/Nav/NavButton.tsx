import React from 'react';
import type { ReactNode } from 'react';
import styles from './NavButton.module.scss';

interface NavButtonProps {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  expanded?: boolean;
  'aria-label'?: string;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
  className?: string;
}

const NavButton: React.FC<NavButtonProps> = ({ 
  children, 
  onClick,
  active = false,
  expanded = false,
  'aria-label': ariaLabel,
  'aria-expanded': ariaExpanded,
  'aria-controls': ariaControls,
  className = ''
}) => {
  const buttonClass = [
    styles.nav__dropdown_trigger,
    active && styles.nav__dropdown_trigger_active,
    expanded && styles.nav__dropdown_trigger_expanded,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={buttonClass}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded ?? expanded}
      aria-controls={ariaControls}
      aria-haspopup="menu"
    >
      <span className={styles.nav__dropdown_content}>
        {children}
      </span>
      <span className={styles.nav__dropdown_arrow}>▾</span>
    </button>
  );
};

export default NavButton;
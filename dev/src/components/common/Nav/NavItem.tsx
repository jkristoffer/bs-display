import React, { useMemo } from 'react';
import type { ReactNode } from 'react';
import styles from './NavItem.module.scss';

interface NavItemProps {
  href: string;
  active?: boolean;
  cta?: boolean;
  children: ReactNode;
  onClick?: () => void;
  'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | boolean;
}

const NavItem: React.FC<NavItemProps> = ({ 
  href, 
  active = false, 
  cta = false, 
  children, 
  onClick,
  'aria-current': ariaCurrent 
}) => {
  const linkClass = useMemo(() => [
    styles.nav__link,
    active && styles.nav__link_active,
    cta && styles.nav__link_cta
  ].filter(Boolean).join(' '), [active, cta]);

  return (
    <a
      href={href}
      className={linkClass}
      onClick={onClick}
      aria-current={active ? (ariaCurrent || 'page') : undefined}
      role={cta ? 'button' : undefined}
    >
      {children}
    </a>
  );
};

export default NavItem;
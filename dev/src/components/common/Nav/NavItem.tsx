import React, { useMemo } from 'react';
import type { ReactNode } from 'react';
import styles from './NavItem.module.scss';

interface NavItemProps {
  href: string;
  active?: boolean;
  cta?: boolean;
  children: ReactNode;
}

const NavItem = React.memo<NavItemProps>(({ href, active = false, cta = false, children }) => {
  const linkClass = useMemo(() => [
    styles.nav__link,
    active && styles.nav__link_active,
    cta && styles.nav__link_cta
  ].filter(Boolean).join(' '), [active, cta]);

  return (
    <a
      href={href}
      className={linkClass}
    >
      {children}
    </a>
  );
});

export default NavItem;

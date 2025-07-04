import { useMemo, forwardRef } from 'react';
import type { ReactNode } from 'react';
import styles from './NavItem.module.scss';

interface NavItemProps {
  href: string;
  active?: boolean;
  cta?: boolean;
  children: ReactNode;
}

const NavItem = forwardRef<HTMLAnchorElement, NavItemProps>(({ href, active = false, cta = false, children }, ref) => {
  const linkClass = useMemo(() => [
    styles.nav__link,
    active && styles.nav__link_active,
    cta && styles.nav__link_cta
  ].filter(Boolean).join(' '), [active, cta]);

  return (
    <a
      ref={ref}
      href={href}
      className={linkClass}
    >
      {children}
    </a>
  );
});

NavItem.displayName = 'NavItem';

export default NavItem;

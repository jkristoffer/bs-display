import type { ReactNode } from 'react';
import styles from './NavItem.module.scss';

interface NavItemProps {
  href: string;
  active?: boolean;
  cta?: boolean;
  children: ReactNode;
}

function NavItem({ href, active = false, cta = false, children }: NavItemProps) {
  const linkClass = [
    styles.nav__link,
    active && styles.nav__link_active,
    cta && styles.nav__link_cta
  ].filter(Boolean).join(' ');

  return (
    <a
      href={href}
      className={linkClass}
    >
      {children}
    </a>
  );
}

export default NavItem;

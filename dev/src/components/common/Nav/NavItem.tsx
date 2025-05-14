import type { ReactNode } from 'react';
import styles from './NavItem.module.scss';

interface NavItemProps {
  href: string;
  active?: boolean;
  children: ReactNode;
}

function NavItem({ href, active = false, children }: NavItemProps) {
  return (
    <a
      href={href}
      className={`${styles.nav__link} ${active ? styles.nav__link_active : ''}`}
    >
      {children}
    </a>
  );
}

export default NavItem;

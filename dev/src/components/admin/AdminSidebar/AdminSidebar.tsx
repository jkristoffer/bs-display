import { useState, useEffect } from 'react';
import styles from './AdminSidebar.module.scss';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    label: 'Overview',
    href: '/admin',
    icon: '📊',
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
    icon: '📈',
    children: [
      { label: 'Real-time', href: '/admin/analytics/realtime', icon: '⚡' },
      { label: 'Products', href: '/admin/analytics/products', icon: '📦' },
      { label: 'Customer Journeys', href: '/admin/analytics/journeys', icon: '🛤️' },
      { label: 'Conversions', href: '/admin/analytics/conversions', icon: '🎯' },
    ],
  },
  {
    label: 'Reports',
    href: '/admin/reports',
    icon: '📄',
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: '⚙️',
  },
];

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>(['Analytics']);
  const [currentPath, setCurrentPath] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const handleNavClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const isActive = currentPath === item.href || 
                    (item.href !== '/admin' && currentPath.startsWith(item.href));
    const isExpanded = expandedItems.includes(item.label);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <li key={item.href} className={styles.navItem}>
        <a
          href={hasChildren ? undefined : item.href}
          className={`${styles.navLink} ${isActive ? styles.active : ''}`}
          style={{ paddingLeft: `${20 + level * 20}px` }}
          onClick={(e) => {
            if (hasChildren) {
              e.preventDefault();
              toggleExpanded(item.label);
            } else {
              handleNavClick();
            }
          }}
        >
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
          {hasChildren && (
            <span className={styles.chevron}>
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
        </a>
        {hasChildren && isExpanded && (
          <ul className={styles.subNav}>
            {item.children?.map(child => renderNavItem(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <>
      <button
        className={styles.mobileToggle}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>
      {isMobile && isOpen && (
        <div 
          className={styles.mobileOverlay} 
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2>BI Dashboard</h2>
          {!isMobile && (
            <button
              className={styles.collapseToggle}
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {isOpen ? '◀' : '▶'}
            </button>
          )}
        </div>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navItems.map(item => renderNavItem(item))}
          </ul>
        </nav>
        <div className={styles.sidebarFooter}>
          <a href="/" className={styles.backToSite}>
            ← Back to Site
          </a>
        </div>
      </aside>
    </>
  );
}
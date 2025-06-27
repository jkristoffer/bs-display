import React, { useState, useEffect, useCallback, useMemo } from 'react';
import NavItem from './NavItem.tsx';
import ProductsMegaMenu from './ProductsMegaMenu.tsx';
import { Search } from '../Search';
import styles from './Nav.module.scss';

interface NavItemType {
  path?: string;
  label: string;
  dropdown?: boolean;
  megaMenu?: boolean;
  cta?: boolean;
  items?: {
    path: string;
    label: string;
  }[];
}

// Pure function for navigation configuration
const createNavigationConfig = (): ReadonlyArray<NavItemType> => [
  { path: '/', label: 'Home' },
  {
    label: 'Products',
    dropdown: true,
    path: '/products',
    megaMenu: true,
    items: [
      { path: '/products/smartboards', label: 'Smart Boards' },
      { path: '/products/lecterns', label: 'Lecterns' }
    ]
  },
  {
    label: 'Resources',
    dropdown: true,
    items: [
      { path: '/blog', label: 'Expert Articles' },
      { path: '/use-cases', label: 'Customer Stories' },
      { path: '/smart-whiteboard-buying-guide', label: 'Buying Guide' },
      { path: '/quiz', label: 'Product Finder' }
    ]
  },
  { path: '/contact', label: 'Get Quote', cta: true }
] as const;

// Pure function for active route detection
const isActiveRoute = (currentPath: string, itemPath?: string): boolean => 
  currentPath === itemPath;

// Pure function for CTA detection
const isCTAItem = (item: NavItemType): boolean => Boolean(item.cta);

interface NavProps {
  currentPath?: string;
}

const Nav = React.memo<NavProps>(({ currentPath = window.location.pathname }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [activeDropdowns, setActiveDropdowns] = useState<
    Record<number, boolean>
  >({});
  const [showProductsMegaMenu, setShowProductsMegaMenu] = useState(false);

  // Memoized navigation items
  const navItems = useMemo(() => createNavigationConfig(), []);

  // Check if viewport is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Memoized event handlers
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const toggleDropdown = useCallback((index: number) => {
    if (isMobile) {
      setActiveDropdowns(prev => ({
        ...prev,
        [index]: !prev[index]
      }));
    }
  }, [isMobile]);

  const handleProductsMouseEnter = useCallback(() => {
    if (!isMobile) {
      setShowProductsMegaMenu(true);
    }
  }, [isMobile]);

  const handleProductsMouseLeave = useCallback(() => {
    if (!isMobile) {
      setShowProductsMegaMenu(false);
    }
  }, [isMobile]);

  const toggleMobileSearch = useCallback(() => {
    setMobileSearchOpen(prev => {
      const newSearchOpen = !prev;
      // Close mobile menu when opening search
      if (newSearchOpen) {
        setMobileMenuOpen(false);
      }
      return newSearchOpen;
    });
  }, []);

  const closeMobileSearch = useCallback(() => {
    setMobileSearchOpen(false);
  }, []);


  // Close all dropdowns when mobile menu is closed
  useEffect(() => {
    if (!mobileMenuOpen) {
      setActiveDropdowns({});
      setShowProductsMegaMenu(false);
    }
  }, [mobileMenuOpen]);

  // Close mobile search when mobile menu is opened
  useEffect(() => {
    if (mobileMenuOpen) {
      setMobileSearchOpen(false);
    }
  }, [mobileMenuOpen]);

  return (
    <nav className={styles.nav}>
      <div className={styles.nav__container}>
        <div className={styles.nav__logo}>
          <a href="/" className={styles.nav__logo_link}>
            <img
              src="/assets/logo3.png"
              alt="Big Shine Display Logo"
              className={styles.nav__logo_image}
            />
          </a>
        </div>

        <div
          className={`${styles.nav__items} ${mobileMenuOpen ? styles.nav__items_active : ''}`}
        >
          {navItems.map((item, index) =>
            item.dropdown ? (
              <div
                key={`dropdown-${index}`}
                className={`${styles.nav__dropdown} ${activeDropdowns[index] ? styles.nav__dropdown_active : ''}`}
                onMouseEnter={item.megaMenu ? handleProductsMouseEnter : undefined}
                onMouseLeave={item.megaMenu ? handleProductsMouseLeave : undefined}
              >
                <div
                  className={styles.nav__dropdown_trigger}
                  onClick={() => toggleDropdown(index)}
                >
                  {item.label}{' '}
                  <span className={styles.nav__dropdown_arrow}>▾</span>
                </div>
                {item.megaMenu ? (
                  <ProductsMegaMenu isVisible={showProductsMegaMenu} />
                ) : (
                  <div className={styles.nav__dropdown_menu}>
                    {item.items?.map((subItem, subIndex) => (
                      <NavItem
                        key={`dropdown-item-${index}-${subIndex}`}
                        href={subItem.path}
                        active={isActiveRoute(currentPath, subItem.path)}
                      >
                        {subItem.label}
                      </NavItem>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavItem
                key={`nav-item-${index}`}
                href={item.path || '#'}
                active={isActiveRoute(currentPath, item.path)}
                cta={isCTAItem(item)}
              >
                {item.label}
              </NavItem>
            )
          )}
        </div>

        {/* Desktop Search */}
        <div className={styles.nav__search}>
          <Search 
            className={styles.nav__searchComponent}
            placeholder="Search products, articles..."
          />
        </div>

        {/* Mobile controls */}
        <div className={styles.nav__mobileControls}>
          {/* Mobile search button */}
          <button
            type="button"
            className={styles.nav__searchButton}
            aria-label="Open search"
            onClick={toggleMobileSearch}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>

          {/* Mobile menu toggle */}
          <button
            id="mobile-menu-toggle"
            className={`${styles.nav__mobile_toggle} ${mobileMenuOpen ? styles.nav__mobile_toggle_active : ''}`}
            aria-label="Toggle menu"
            onClick={toggleMobileMenu}
          >
            <span className={styles.nav__mobile_toggle_bar}></span>
            <span className={styles.nav__mobile_toggle_bar}></span>
            <span className={styles.nav__mobile_toggle_bar}></span>
          </button>
        </div>

        {/* Mobile Search Overlay */}
        {mobileSearchOpen && (
          <Search
            isMobile={true}
            autoFocus={true}
            onClose={closeMobileSearch}
            placeholder="Search products, articles..."
          />
        )}
      </div>

    </nav>
  );
});

export default Nav;

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import NavItem from './NavItem.tsx';
import ProductsMegaMenu from './ProductsMegaMenu.tsx';
import { MobileMenuGrid } from './MobileMenuGrid';
import { Search } from '../Search';
import { mobileNavigationConfig } from '../../../data/navigation';
import type { MobileNavItem } from '../../../types/navigation';
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
      { path: '/products', label: 'All Products' },
      { path: '/products/smartboards', label: 'Smart Boards' },
      { path: '/products/lecterns', label: 'Lecterns' },
      { path: '/products/accessories', label: 'Accessories' },
      { path: '/products/collaboration', label: 'Collaboration' }
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

const Nav = React.memo<NavProps>(({ currentPath }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [activeDropdowns, setActiveDropdowns] = useState<
    Record<number, boolean>
  >({});
  const [showProductsMegaMenu, setShowProductsMegaMenu] = useState(false);
  const useMobileGrid = true; // Always use mobile grid for mobile navigation
  
  // Refs for focus management
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const firstMenuItemRef = useRef<HTMLAnchorElement>(null);

  // Memoized navigation items
  const navItems = useMemo(() => createNavigationConfig(), []);

  // Initialize currentPath from window if not provided
  const actualCurrentPath = currentPath || (typeof window !== 'undefined' ? window.location.pathname : '/');

  // Check if viewport is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Close mobile menu when switching to desktop
      if (!mobile && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [mobileMenuOpen]);

  // Body scroll lock utility
  const lockBodyScroll = useCallback(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
  }, []);
  
  const unlockBodyScroll = useCallback(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }, []);

  // Memoized event handlers
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => {
      const newState = !prev;
      
      if (newState) {
        lockBodyScroll();
        // Focus first menu item after animation
        setTimeout(() => {
          firstMenuItemRef.current?.focus();
        }, 100);
      } else {
        unlockBodyScroll();
        // Return focus to menu button
        menuButtonRef.current?.focus();
      }
      
      return newState;
    });
  }, [lockBodyScroll, unlockBodyScroll]);

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

  // Handle mobile navigation item clicks
  const handleMobileNavItemClick = useCallback((item: MobileNavItem) => {
    if (item.path) {
      // Navigate to the path (this will be handled by router/astro)
      window.location.href = item.path;
    }
    
    // Close mobile menu
    setMobileMenuOpen(false);
    unlockBodyScroll();
  }, [unlockBodyScroll]);

  const closeMobileSearch = useCallback(() => {
    setMobileSearchOpen(false);
  }, []);
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
        unlockBodyScroll();
      }
    };
    
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (mobileMenuOpen) {
          setMobileMenuOpen(false);
          unlockBodyScroll();
          menuButtonRef.current?.focus();
        }
        if (mobileSearchOpen) {
          setMobileSearchOpen(false);
        }
      }
    };
    
    if (mobileMenuOpen || mobileSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [mobileMenuOpen, mobileSearchOpen, unlockBodyScroll]);


  // Close all dropdowns when mobile menu is closed
  useEffect(() => {
    if (!mobileMenuOpen) {
      setActiveDropdowns({});
      setShowProductsMegaMenu(false);
      unlockBodyScroll();
    }
  }, [mobileMenuOpen, unlockBodyScroll]);

  // Close mobile search when mobile menu is opened
  useEffect(() => {
    if (mobileMenuOpen) {
      setMobileSearchOpen(false);
    }
  }, [mobileMenuOpen]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      unlockBodyScroll();
    };
  }, [unlockBodyScroll]);

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
          ref={mobileMenuRef}
          id="mobile-navigation"
          className={`${styles.nav__items} ${mobileMenuOpen ? styles.nav__items_active : ''}`}
          role="navigation"
          aria-label="Main navigation"
          aria-hidden={!mobileMenuOpen}
        >
          {/* Mobile Grid Navigation (768px and below) */}
          {isMobile && useMobileGrid ? (
            <MobileMenuGrid
              sections={mobileNavigationConfig.sections}
              isOpen={mobileMenuOpen}
              onClose={() => {
                setMobileMenuOpen(false);
                unlockBodyScroll();
              }}
              onItemClick={handleMobileNavItemClick}
              currentPath={actualCurrentPath}
              className={styles.nav__mobileGrid}
              defaultColumns={2}
              adaptiveColumns={true}
              ariaLabel="Mobile navigation grid"
              animationDuration={300}
              staggerDelay={50}
              hapticFeedback={true}
              touchSensitivity="medium"
            />
          ) : (
            /* Fallback: Original Mobile Navigation (for desktop hover menus) */
            <>
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
                      // On mobile, show dropdown menu instead of mega menu
                      isMobile ? (
                        <div className={styles.nav__dropdown_menu}>
                          {item.items?.map((subItem, subIndex) => (
                            <NavItem
                              key={`dropdown-item-${index}-${subIndex}`}
                              href={subItem.path}
                              active={isActiveRoute(actualCurrentPath, subItem.path)}
                            >
                              {subItem.label}
                            </NavItem>
                          ))}
                        </div>
                      ) : (
                        <ProductsMegaMenu isVisible={showProductsMegaMenu} />
                      )
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
                    active={isActiveRoute(actualCurrentPath, item.path)}
                    cta={isCTAItem(item)}
                    ref={index === 0 ? firstMenuItemRef : undefined}
                  >
                    {item.label}
                  </NavItem>
                )
              )}
            </>
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
            ref={menuButtonRef}
            id="mobile-menu-toggle"
            className={`${styles.nav__mobile_toggle} ${mobileMenuOpen ? styles.nav__mobile_toggle_active : ''}`}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={toggleMobileMenu}
          >
            <span className={styles.nav__mobile_toggle_bar}></span>
            <span className={styles.nav__mobile_toggle_bar}></span>
            <span className={styles.nav__mobile_toggle_bar}></span>
          </button>
        </div>

        {/* Mobile Search Overlay */}
        {mobileSearchOpen && (
          <div className={styles.nav__mobileSearchOverlay}>
            <Search
              isMobile={true}
              autoFocus={true}
              onClose={closeMobileSearch}
              placeholder="Search products, articles..."
            />
          </div>
        )}
        
        {/* Mobile Menu Backdrop */}
        {mobileMenuOpen && (
          <div 
            className={styles.nav__mobileBackdrop}
            onClick={() => {
              setMobileMenuOpen(false);
              unlockBodyScroll();
            }}
            aria-hidden="true"
          />
        )}
      </div>

    </nav>
  );
});

export default Nav;

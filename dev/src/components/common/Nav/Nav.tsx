import React, { useState } from 'react';
import NavItem from './NavItem';
import NavButton from './NavButton';
import ProductsMegaMenu from './ProductsMegaMenu';
import SimpleSearch from './SimpleSearch';
import styles from './Nav.module.scss';
import { useResponsiveNav, useScrollLock, useKeyboardNavigation, useClickOutside } from './hooks';

interface NavProps {
  currentPath?: string;
}

interface NavItem {
  href: string;
  label: string;
  hasDropdown?: boolean;
  isCTA?: boolean;
}

// No forwardRef, no useImperativeHandle - fixing hydration error
export default function Nav({ currentPath = '/' }: NavProps) {
  // State management
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Custom hooks for complex logic
  const { isMobile, mobileMenuOpen, setMobileMenuOpen, toggleMobileMenu } = useResponsiveNav();

  // Navigation items configuration
  const navItems: NavItem[] = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products', hasDropdown: true },
    { href: '/blog', label: 'Resources', hasDropdown: true },
    { href: '/contact', label: 'Get Quote', isCTA: true }
  ];

  // Resources dropdown items
  const resourcesItems = [
    { href: '/blog', label: 'Expert Articles' },
    { href: '/use-cases', label: 'Customer Stories' },
    { href: '/smart-whiteboard-buying-guide', label: 'Buying Guide' },
    { href: '/quiz', label: 'Product Finder' }
  ];

  // Hook integrations - replacing complex useEffect blocks
  useScrollLock(mobileMenuOpen);
  
  useKeyboardNavigation({
    activeDropdown,
    isMobile,
    onCloseDropdown: () => setActiveDropdown(null),
    onCloseSearch: () => setSearchOpen(false),
    onCloseMobileMenu: () => setMobileMenuOpen(false)
  });
  
  useClickOutside({
    isActive: activeDropdown !== null,
    onClickOutside: () => setActiveDropdown(null),
    containerSelector: `.${styles.nav}`
  });

  // Check if a path is active
  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  // Toggle dropdown
  const toggleDropdown = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };


  return (
    <nav className={styles.nav} role="navigation" aria-label="Main navigation">
      <div className={styles.nav__container}>
        {/* Logo */}
        <div className={styles.nav__logo}>
          <a href="/" className={styles.nav__logo_link}>
            <img
              src="/assets/logo3.png"
              alt="Big Shine Display Logo"
              className={styles.nav__logo_image}
            />
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className={styles.nav__items} role="menubar" aria-label="Primary navigation">
          {navItems.map((item, index) => (
            item.hasDropdown ? (
              <div 
                key={`dropdown-${index}`} 
                className={styles.nav__dropdown}
                onMouseEnter={() => !isMobile && setActiveDropdown(item.label)}
                onMouseLeave={() => !isMobile && setActiveDropdown(null)}
              >
                <NavButton
                  onClick={() => isMobile && toggleDropdown(item.label)}
                  expanded={activeDropdown === item.label}
                  aria-controls={`dropdown-${item.label.toLowerCase()}`}
                  aria-label={`${item.label} menu`}
                >
                  {item.label}
                </NavButton>
                
                {/* Products Dropdown */}
                {item.label === 'Products' && (
                  <ProductsMegaMenu 
                    isOpen={activeDropdown === 'Products'}
                    onClose={() => setActiveDropdown(null)}
                  />
                )}
                
                {/* Resources Dropdown */}
                {item.label === 'Resources' && activeDropdown === 'Resources' && (
                  <div 
                    className={styles.nav__dropdown_menu}
                    id="dropdown-resources"
                    role="menu"
                    aria-label="Resources menu"
                  >
                    {resourcesItems.map((resource) => (
                      <NavItem
                        key={resource.href}
                        href={resource.href}
                        active={isActive(resource.href)}
                        role="menuitem"
                      >
                        {resource.label}
                      </NavItem>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavItem
                key={`nav-${index}`}
                href={item.href}
                active={isActive(item.href)}
                cta={item.isCTA}
              >
                {item.label}
              </NavItem>
            )
          ))}
        </div>

        {/* Desktop Search */}
        <div className={styles.nav__search}>
          <button
            type="button"
            className={styles.nav__searchButton}
            onClick={() => setSearchOpen(true)}
            aria-label="Open search dialog"
          >
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M9 17A8 8 0 109 1a8 8 0 000 16zM19 19l-4.35-4.35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Mobile controls */}
        <div className={styles.nav__mobileControls}>
          {/* Mobile search button */}
          <button
            type="button"
            className={styles.nav__searchButton}
            aria-label="Open search dialog"
            onClick={() => setSearchOpen(true)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <span className={styles['sr-only']}>Search products and articles</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            id="mobile-menu-toggle"
            className={`${styles.nav__mobile_toggle} ${mobileMenuOpen ? styles.nav__mobile_toggle_active : ''}`}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-haspopup="dialog"
            onClick={toggleMobileMenu}
            type="button"
          >
            <span className={styles.nav__mobile_toggle_bar}></span>
            <span className={styles.nav__mobile_toggle_bar}></span>
            <span className={styles.nav__mobile_toggle_bar}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - Full Screen */}
      {mobileMenuOpen && (
        <div 
          className={`${styles.nav__mobileOverlay} ${mobileMenuOpen ? styles.nav__mobileOverlay_active : ''}`}
          aria-hidden={!mobileMenuOpen}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
          data-focus-trap="true"
        >
          {/* Backdrop */}
          <div 
            className={styles.nav__mobileBackdrop}
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          
          {/* Content Container */}
          <div className={styles.nav__mobileContent}>
            {/* Header */}
            <div className={styles.nav__mobileHeader}>
              <div className={styles.nav__mobileLogo}>
                <a href="/" onClick={() => setMobileMenuOpen(false)}>
                  <img
                    src="/assets/logo3.png"
                    alt="Big Shine Display Logo"
                    className={styles.nav__logo_image}
                  />
                </a>
              </div>
              
              <button
                className={styles.nav__mobileClose}
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                type="button"
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none"
                  aria-hidden="true"
                >
                  <path 
                    d="M18 6L6 18M6 6l12 12" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Main Navigation Content */}
            <nav 
              className={styles.nav__mobileNav}
              id="mobile-menu-title"
              role="navigation"
              aria-label="Mobile navigation"
            >
              {/* Mobile Navigation Grid */}
              <div className={styles.nav__mobileGrid} role="list" aria-label="Navigation sections">
                {/* Main Section */}
                <div 
                  className={styles.nav__mobileSection}
                  style={{ '--section-index': 0 } as React.CSSProperties}
                  role="listitem"
                >
                  <h3 className={styles.nav__mobileSectionTitle} id="main-section">Main</h3>
                  <div className={styles.nav__mobileSectionLinks} role="list" aria-labelledby="main-section">
                    <NavItem 
                      href="/" 
                      active={isActive('/')}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Home
                    </NavItem>
                    <NavItem 
                      href="/products" 
                      active={isActive('/products')}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      All Products
                    </NavItem>
                    <NavItem 
                      href="/contact" 
                      active={isActive('/contact')}
                      cta={true}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Quote
                    </NavItem>
                  </div>
                </div>

                {/* Products Section */}
                <div 
                  className={styles.nav__mobileSection}
                  style={{ '--section-index': 1 } as React.CSSProperties}
                  role="listitem"
                >
                  <h3 className={styles.nav__mobileSectionTitle} id="products-section">Products</h3>
                  <div className={styles.nav__mobileSectionLinks} role="list" aria-labelledby="products-section">
                    <NavItem 
                      href="/products/smartboards" 
                      active={isActive('/products/smartboards')}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Smart Boards
                    </NavItem>
                    <NavItem 
                      href="/products/lecterns" 
                      active={isActive('/products/lecterns')}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Lecterns
                    </NavItem>
                    <NavItem 
                      href="/products/accessories" 
                      active={isActive('/products/accessories')}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Accessories
                    </NavItem>
                    <NavItem 
                      href="/products/collaboration" 
                      active={isActive('/products/collaboration')}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Collaboration
                    </NavItem>
                  </div>
                </div>

                {/* Resources Section */}
                <div 
                  className={styles.nav__mobileSection}
                  style={{ '--section-index': 2 } as React.CSSProperties}
                  role="listitem"
                >
                  <h3 className={styles.nav__mobileSectionTitle} id="resources-section">Resources</h3>
                  <div className={styles.nav__mobileSectionLinks} role="list" aria-labelledby="resources-section">
                    {resourcesItems.map((resource) => (
                      <NavItem 
                        key={resource.href}
                        href={resource.href} 
                        active={isActive(resource.href)}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {resource.label}
                      </NavItem>
                    ))}
                  </div>
                </div>
              </div>
            </nav>
            
            {/* Footer or additional content can be added here */}
            <div className={styles.nav__mobileFooter}>
              <p className={styles.nav__mobileFooterText}>
                © 2024 BigShine Display
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      <SimpleSearch 
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </nav>
  );
}
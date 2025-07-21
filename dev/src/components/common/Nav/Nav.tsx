import React, { useState, useEffect } from 'react';
import ProductsMegaMenu from './ProductsMegaMenu';
import SimpleSearch from './SimpleSearch';
import styles from './Nav.module.scss';

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
  // All state consolidated here
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

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

  // Responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Apply scroll lock
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore scroll position
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [mobileMenuOpen]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key - close all overlays
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setSearchOpen(false);
        setMobileMenuOpen(false);
      }
      
      // Enter key on dropdown buttons
      if (e.key === 'Enter' && e.target instanceof HTMLElement) {
        const button = e.target.closest('button[aria-expanded]');
        if (button) {
          e.preventDefault();
          button.click();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const nav = document.querySelector(`.${styles.nav}`);
      if (nav && !nav.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    
    if (activeDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeDropdown]);

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
    <nav className={styles.nav}>
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
        <div className={styles.nav__items}>
          {navItems.map((item, index) => (
            item.hasDropdown ? (
              <div 
                key={`dropdown-${index}`} 
                className={styles.nav__dropdown}
                onMouseEnter={() => !isMobile && setActiveDropdown(item.label)}
                onMouseLeave={() => !isMobile && setActiveDropdown(null)}
              >
                <button
                  className={styles.nav__dropdown_trigger}
                  onClick={() => isMobile && toggleDropdown(item.label)}
                  aria-expanded={activeDropdown === item.label}
                >
                  {item.label}
                  <span className={styles.nav__dropdown_arrow}>▾</span>
                </button>
                
                {/* Products Dropdown */}
                {item.label === 'Products' && (
                  <ProductsMegaMenu 
                    isOpen={activeDropdown === 'Products'}
                    onClose={() => setActiveDropdown(null)}
                  />
                )}
                
                {/* Resources Dropdown */}
                {item.label === 'Resources' && activeDropdown === 'Resources' && (
                  <div className={styles.nav__dropdown_menu}>
                    {resourcesItems.map((resource) => (
                      <a
                        key={resource.href}
                        href={resource.href}
                        className={styles.nav__dropdown_item}
                      >
                        {resource.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a
                key={`nav-${index}`}
                href={item.href}
                className={`${styles.nav__link} ${isActive(item.href) ? styles.nav__link_active : ''} ${item.isCTA ? styles.nav__link_cta : ''}`}
              >
                {item.label}
              </a>
            )
          ))}
        </div>

        {/* Desktop Search */}
        <div className={styles.nav__search}>
          <button
            className={styles.nav__searchButton}
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
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
            aria-label="Open search"
            onClick={() => setSearchOpen(true)}
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
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className={styles.nav__mobile_toggle_bar}></span>
            <span className={styles.nav__mobile_toggle_bar}></span>
            <span className={styles.nav__mobile_toggle_bar}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <div className={styles.mobileMenuOverlay}>
          <div className={styles.mobileMenuContent}>
            <div className={styles.mobileMenuHeader}>
              <a href="/" className={styles.mobileLogo}>
                BigShine Display
              </a>
              <button
                className={styles.closeButton}
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                ×
              </button>
            </div>

            <nav className={styles.mobileNav}>
              {/* Mobile Search */}
              <button 
                className={styles.mobileSearchButton}
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchOpen(true);
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M9 17A8 8 0 109 1a8 8 0 000 16zM19 19l-4.35-4.35"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span>Search</span>
              </button>

              {/* Mobile Navigation Grid */}
              <div className={styles.mobileNavGrid}>
                {/* Main Section */}
                <div className={styles.mobileNavSection}>
                  <h3 className={styles.sectionTitle}>Main</h3>
                  <div className={styles.sectionLinks}>
                    <a href="/" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
                      Home
                    </a>
                    <a href="/products" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
                      All Products
                    </a>
                    <a href="/contact" className={`${styles.mobileNavLink} ${styles.cta}`} onClick={() => setMobileMenuOpen(false)}>
                      Get Quote
                    </a>
                  </div>
                </div>

                {/* Products Section */}
                <div className={styles.mobileNavSection}>
                  <h3 className={styles.sectionTitle}>Products</h3>
                  <div className={styles.sectionLinks}>
                    <a href="/products/smartboards" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
                      Smart Boards
                    </a>
                    <a href="/products/lecterns" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
                      Lecterns
                    </a>
                    <a href="/products/accessories" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
                      Accessories
                    </a>
                    <a href="/products/collaboration" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
                      Collaboration
                    </a>
                  </div>
                </div>

                {/* Resources Section */}
                <div className={styles.mobileNavSection}>
                  <h3 className={styles.sectionTitle}>Resources</h3>
                  <div className={styles.sectionLinks}>
                    <a href="/blog" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
                      Expert Articles
                    </a>
                    <a href="/use-cases" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
                      Customer Stories
                    </a>
                    <a href="/smart-whiteboard-buying-guide" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
                      Buying Guide
                    </a>
                    <a href="/quiz" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
                      Product Finder
                    </a>
                  </div>
                </div>
              </div>
            </nav>
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
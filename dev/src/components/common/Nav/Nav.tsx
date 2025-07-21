import React, { useState, useEffect } from 'react';
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

  // Close dropdowns on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setSearchOpen(false);
        setMobileMenuOpen(false);
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

  // Simple NavLink component (no forwardRef)
  const NavLink = ({ href, children, isActive: active, isCTA }: {
    href: string;
    children: React.ReactNode;
    isActive?: boolean;
    isCTA?: boolean;
  }) => {
    const className = `${styles.navLink} ${active ? styles.active : ''} ${isCTA ? styles.cta : ''}`;
    return <a href={href} className={className}>{children}</a>;
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        {/* Logo */}
        <a href="/" className={styles.logo}>
          BigShine Display
        </a>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div className={styles.desktopNav}>
            {navItems.map((item) => (
              <div key={item.href} className={styles.navItemWrapper}>
                {item.hasDropdown ? (
                  <>
                    <button
                      className={`${styles.navLink} ${isActive(item.href) ? styles.active : ''}`}
                      onClick={() => toggleDropdown(item.label)}
                      aria-expanded={activeDropdown === item.label}
                    >
                      {item.label}
                      <span className={styles.dropdownIcon}>▼</span>
                    </button>
                    
                    {/* Products Dropdown */}
                    {item.label === 'Products' && activeDropdown === 'Products' && (
                      <div className={styles.dropdown}>
                        <div className={styles.megaMenu}>
                          <div className={styles.megaMenuContent}>
                            <div className={styles.productCategory}>
                              <h3>Smart Boards</h3>
                              <a href="/products/smartboards">View All Smart Boards</a>
                            </div>
                            <div className={styles.productCategory}>
                              <h3>Lecterns</h3>
                              <a href="/products/lecterns">View All Lecterns</a>
                            </div>
                            <div className={styles.productCategory}>
                              <h3>Accessories</h3>
                              <a href="/products/accessories">View Accessories</a>
                            </div>
                            <div className={styles.productCategory}>
                              <h3>Collaboration</h3>
                              <a href="/products/collaboration">Collaboration Tools</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Resources Dropdown */}
                    {item.label === 'Resources' && activeDropdown === 'Resources' && (
                      <div className={styles.dropdown}>
                        {resourcesItems.map((resource) => (
                          <a
                            key={resource.href}
                            href={resource.href}
                            className={styles.dropdownItem}
                          >
                            {resource.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <NavLink
                    href={item.href}
                    isActive={isActive(item.href)}
                    isCTA={item.isCTA}
                  >
                    {item.label}
                  </NavLink>
                )}
              </div>
            ))}
            
            {/* Search Button */}
            <button
              className={styles.searchButton}
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
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            className={styles.mobileMenuButton}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={styles.hamburger}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        )}
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
              {/* Mobile navigation content - simplified for Phase 2 */}
              <div className={styles.mobileNavSection}>
                <a href="/" className={styles.mobileNavLink}>Home</a>
                <a href="/products" className={styles.mobileNavLink}>All Products</a>
                <a href="/contact" className={`${styles.mobileNavLink} ${styles.cta}`}>
                  Get Quote
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Search Overlay - Placeholder for Phase 3 */}
      {searchOpen && (
        <div className={styles.searchOverlay}>
          <div className={styles.searchContent}>
            <button
              className={styles.searchClose}
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
            >
              ×
            </button>
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Search products..."
              autoFocus
            />
          </div>
        </div>
      )}
    </nav>
  );
}
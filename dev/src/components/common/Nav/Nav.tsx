import { useState, useEffect } from 'react';
import NavItem from './NavItem.tsx';
import styles from './Nav.module.scss';

interface NavItemType {
  path?: string;
  label: string;
  dropdown?: boolean;
  items?: {
    path: string;
    label: string;
  }[];
}

interface NavProps {
  currentPath?: string;
}

function Nav({ currentPath = window.location.pathname }: NavProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdowns, setActiveDropdowns] = useState<
    Record<number, boolean>
  >({});

  const navItems: NavItemType[] = [
    { path: '/', label: 'Home' },
    {
      label: 'Products',
      dropdown: true,
      path: '/products',
      items: [
        { path: '/products/smartboards', label: 'Smart Boards' },
        { path: '/products/lecterns', label: 'Lecterns' }
      ]
    },
    {
      label: 'Learn',
      dropdown: true,
      items: [
        { path: '/blog', label: 'Blog' },
        {
          path: '/smart-whiteboard-buying-guide',
          label: 'Buying Guide'
        },
        {
          path: '/quiz',
          label: 'Quiz'
        }
      ]
    },
    { path: '/contact', label: 'Contact' }
  ];

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

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Toggle dropdown on mobile
  const toggleDropdown = (index: number) => {
    if (isMobile) {
      setActiveDropdowns((prev) => ({
        ...prev,
        [index]: !prev[index]
      }));
    }
  };

  // Close all dropdowns when mobile menu is closed
  useEffect(() => {
    if (!mobileMenuOpen) {
      setActiveDropdowns({});
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
              >
                <div
                  className={styles.nav__dropdown_trigger}
                  onClick={() => toggleDropdown(index)}
                >
                  {item.label}{' '}
                  <span className={styles.nav__dropdown_arrow}>▾</span>
                </div>
                <div className={styles.nav__dropdown_menu}>
                  {item.items?.map((subItem, subIndex) => (
                    <NavItem
                      key={`dropdown-item-${index}-${subIndex}`}
                      href={subItem.path}
                      active={currentPath === subItem.path}
                    >
                      {subItem.label}
                    </NavItem>
                  ))}
                </div>
              </div>
            ) : (
              <NavItem
                key={`nav-item-${index}`}
                href={item.path || '#'}
                active={currentPath === item.path}
              >
                {item.label}
              </NavItem>
            )
          )}
        </div>

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
    </nav>
  );
}

export default Nav;

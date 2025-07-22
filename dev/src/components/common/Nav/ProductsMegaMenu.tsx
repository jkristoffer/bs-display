import React from 'react';
import styles from './ProductsMegaMenu.module.scss';

interface ProductCategory {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
  badge?: string;
}

interface FeaturedProduct {
  id: string;
  brand: string;
  model: string;
  image: string;
  href: string;
  price?: string;
}

interface ProductsMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Enhanced functional component with full backup restoration
export default function ProductsMegaMenu({ isOpen, onClose }: ProductsMegaMenuProps) {
  if (!isOpen) return null;

  const productCategories: ProductCategory[] = [
    {
      id: 'smartboards',
      title: 'Smart Boards',
      description: 'Interactive displays for classrooms and meeting rooms',
      image: '/assets/models/metz-interactive-board-h-series.webp',
      href: '/products/smartboards',
      badge: 'Popular'
    },
    {
      id: 'lecterns',
      title: 'Smart Lecterns',
      description: 'Digital podiums for presentations and lectures',
      image: '/assets/lecterns/Maxhub_Smart_Lectern.jpg',
      href: '/products/lecterns'
    },
    {
      id: 'accessories',
      title: 'Accessories',
      description: 'Stands, mounts, and enhancement tools',
      image: '/assets/images/marketing/interactive-board.png',
      href: '/products/accessories'
    },
    {
      id: 'collaboration',
      title: 'Collaboration',
      description: 'Video conferencing and collaboration devices',
      image: '/assets/images/marketing/conference_room_interactive_display_16x9.jpeg',
      href: '/products/collaboration'
    }
  ];

  const featuredProducts: FeaturedProduct[] = [
    {
      id: 'metz-h-series',
      brand: 'METZ',
      model: 'H Series 65" UHD',
      image: '/assets/models/metz-interactive-board-h-series.webp',
      href: '/products/smartboards/metz/metz-h-series-65'
    },
    {
      id: 'infinity-pro-x',
      brand: 'Infinity Pro',
      model: 'X Series 55" UHD',
      image: '/assets/models/InfinityPro-X-Series-Interactive-Display-1.webp',
      href: '/products/smartboards/infinitypro/infinitypro-x-series-55'
    },
    {
      id: 'smart-6000s',
      brand: 'SMART',
      model: '6000S V3 Series',
      image: '/assets/models/SMARTBoard-6000S-V3.webp',
      href: '/products/smartboards/smart/smart-6000s-v3-65'
    },
    {
      id: 'maxhub-v5-classic-65',
      brand: 'MAXHUB',
      model: 'V5 Classic Series 65" UHD',
      image: '/assets/models/maxhub-v5-classic.png',
      href: '/products/smartboards/maxhub/maxhub-v5-classic-65'
    }
  ];

  const quickActions = [
    { label: 'All Products', href: '/products', icon: '🏢' },
    { label: 'Get Quote', href: '/contact', icon: '💬' },
    { label: 'Book Demo', href: '/demo', icon: '📋' },
    { label: 'Compare', href: '/compare', icon: '⚖️' },
    { label: 'Take Quiz', href: '/quiz', icon: '🎯' }
  ];

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <div className={styles.megaMenu} role="menu" aria-label="Products navigation">
      <div className={styles.megaMenuContainer}>
        <div className={styles.megaMenuSection} role="group" aria-labelledby="categories-heading">
          <h3 id="categories-heading" className={styles.megaMenuSectionTitle}>
            <span className={styles.megaMenuTitleText}>Product Categories</span>
            <div className={styles.megaMenuTitleGradient}></div>
          </h3>
          <div className={styles.megaMenuCategories}>
            {productCategories.map((category) => (
              <a
                key={category.id}
                href={category.href}
                className={styles.megaMenuCategoryCard}
                aria-label={`Browse ${category.title} - ${category.description}`}
                onClick={handleLinkClick}
              >
                <div className={styles.megaMenuCategoryImage}>
                  <img
                    src={category.image}
                    alt={category.title}
                    loading="lazy"
                  />
                  {category.badge && (
                    <span className={styles.megaMenuBadge}>
                      {category.badge}
                    </span>
                  )}
                </div>
                <div className={styles.megaMenuCategoryContent}>
                  <h4 className={styles.megaMenuCategoryTitle}>
                    {category.title}
                  </h4>
                  <p className={styles.megaMenuCategoryDescription}>
                    {category.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className={styles.megaMenuSection} role="group" aria-labelledby="featured-heading">
          <h3 id="featured-heading" className={styles.megaMenuSectionTitle}>
            <span className={styles.megaMenuTitleText}>Featured Products</span>
            <div className={styles.megaMenuTitleGradient}></div>
          </h3>
          <div className={styles.megaMenuFeatured}>
            {featuredProducts.map((product) => (
              <a
                key={product.id}
                href={product.href}
                className={styles.megaMenuProductCard}
                aria-label={`View ${product.brand} ${product.model}`}
                onClick={handleLinkClick}
              >
                <div className={styles.megaMenuProductImage}>
                  <img
                    src={product.image}
                    alt={`${product.brand} ${product.model}`}
                    loading="lazy"
                  />
                </div>
                <div className={styles.megaMenuProductInfo}>
                  <span className={styles.megaMenuProductBrand}>
                    {product.brand}
                  </span>
                  <h4 className={styles.megaMenuProductModel}>
                    {product.model}
                  </h4>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className={styles.megaMenuSection} role="group" aria-labelledby="actions-heading">
          <h3 id="actions-heading" className={styles.megaMenuSectionTitle}>
            <span className={styles.megaMenuTitleText}>Quick Actions</span>
            <div className={styles.megaMenuTitleGradient}></div>
          </h3>
          <div className={styles.megaMenuActions}>
            {quickActions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                className={styles.megaMenuActionButton}
                aria-label={action.label}
                onClick={handleLinkClick}
              >
                <span className={styles.megaMenuActionIcon}>
                  {action.icon}
                </span>
                {action.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
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
  isVisible: boolean;
}

const ProductsMegaMenu: React.FC<ProductsMegaMenuProps> = ({ isVisible }) => {
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

  if (!isVisible) return null;

  return (
    <div className={styles.megaMenu}>
      <div className={styles.megaMenu__container}>
        <div className={styles.megaMenu__section}>
          <h3 className={styles.megaMenu__sectionTitle}>Product Categories</h3>
          <div className={styles.megaMenu__categories}>
            {productCategories.map((category) => (
              <a
                key={category.id}
                href={category.href}
                className={styles.megaMenu__categoryCard}
              >
                <div className={styles.megaMenu__categoryImage}>
                  <img
                    src={category.image}
                    alt={category.title}
                    loading="lazy"
                  />
                  {category.badge && (
                    <span className={styles.megaMenu__badge}>
                      {category.badge}
                    </span>
                  )}
                </div>
                <div className={styles.megaMenu__categoryContent}>
                  <h4 className={styles.megaMenu__categoryTitle}>
                    {category.title}
                  </h4>
                  <p className={styles.megaMenu__categoryDescription}>
                    {category.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className={styles.megaMenu__section}>
          <h3 className={styles.megaMenu__sectionTitle}>Featured Products</h3>
          <div className={styles.megaMenu__featured}>
            {featuredProducts.map((product) => (
              <a
                key={product.id}
                href={product.href}
                className={styles.megaMenu__productCard}
              >
                <div className={styles.megaMenu__productImage}>
                  <img
                    src={product.image}
                    alt={`${product.brand} ${product.model}`}
                    loading="lazy"
                  />
                </div>
                <div className={styles.megaMenu__productInfo}>
                  <span className={styles.megaMenu__productBrand}>
                    {product.brand}
                  </span>
                  <h4 className={styles.megaMenu__productModel}>
                    {product.model}
                  </h4>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className={styles.megaMenu__section}>
          <h3 className={styles.megaMenu__sectionTitle}>Quick Actions</h3>
          <div className={styles.megaMenu__actions}>
            {quickActions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                className={styles.megaMenu__actionButton}
              >
                <span className={styles.megaMenu__actionIcon}>
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
};

export default ProductsMegaMenu;
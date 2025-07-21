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

interface ProductsMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Simple functional component without forwardRef
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
      title: 'Collaboration Tools',
      description: 'Software and hardware for team collaboration',
      image: '/assets/images/marketing/collaboration-tools.png',
      href: '/products/collaboration'
    }
  ];

  const featuredProducts = [
    {
      id: 'metz-86',
      brand: 'Metz',
      model: '86" Interactive Display',
      href: '/products/smartboards/metz/86-inch-display'
    },
    {
      id: 'i3-pro',
      brand: 'i3-Technologies',
      model: 'i3TOUCH E-ONE',
      href: '/products/smartboards/i3/touch-e-one'
    }
  ];

  return (
    <div className={styles.megaMenu}>
      <div className={styles.megaMenuContainer}>
        <div className={styles.categoriesSection}>
          <h3 className={styles.sectionTitle}>Product Categories</h3>
          <div className={styles.categoriesGrid}>
            {productCategories.map((category) => (
              <a
                key={category.id}
                href={category.href}
                className={styles.categoryCard}
                onClick={onClose}
              >
                <div className={styles.categoryImage}>
                  <img src={category.image} alt={category.title} loading="lazy" />
                  {category.badge && (
                    <span className={styles.badge}>{category.badge}</span>
                  )}
                </div>
                <div className={styles.categoryContent}>
                  <h4>{category.title}</h4>
                  <p>{category.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className={styles.featuredSection}>
          <h3 className={styles.sectionTitle}>Featured Products</h3>
          <div className={styles.featuredList}>
            {featuredProducts.map((product) => (
              <a
                key={product.id}
                href={product.href}
                className={styles.featuredItem}
                onClick={onClose}
              >
                <span className={styles.brand}>{product.brand}</span>
                <span className={styles.model}>{product.model}</span>
              </a>
            ))}
          </div>
          <a href="/products" className={styles.viewAllLink} onClick={onClose}>
            View All Products →
          </a>
        </div>
      </div>
    </div>
  );
}
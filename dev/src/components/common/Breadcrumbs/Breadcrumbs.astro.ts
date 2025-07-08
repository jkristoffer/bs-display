import BreadcrumbsComponent from './Breadcrumbs.jsx';

export interface Props {
  productType?: string;
  brand?: string;
  brandLabel?: string;
  productId?: string;
  productLabel?: string;
  className?: string;
  items?: Array<{label: string; path?: string}>;
}

const {
  productType,
  brand,
  brandLabel,
  productId,
  productLabel,
  className = '',
  items
} = Astro.props;

// If items are directly provided, use them
// Otherwise, generate product breadcrumbs
const breadcrumbItems = items || (() => {
  const createSlug = (text: string) => {
    if (typeof text !== 'string') return '';
    return text.toLowerCase().replace(/\s+/g, '-');
  };

  const items: Array<{label: string; path?: string}> = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products/' }
  ];

  // Add product type breadcrumb
  if (productType) {
    let label = 'Products';
    switch (productType) {
      case 'smartboards':
        label = 'Smart Boards';
        break;
      case 'lecterns':
        label = 'Lecterns';
        break;
      case 'accessories':
        label = 'Accessories';
        break;
      case 'collaboration':
        label = 'Collaboration';
        break;
    }
    items.push({
      label,
      path: `/products/${productType}/`
    });
  }

  // Add brand breadcrumb if provided
  if (brand && brandLabel) {
    const brandSlug = typeof brand === 'string' ? createSlug(brand) : brand;
    items.push({
      label: brandLabel,
      path: `/products/${productType}/${brandSlug}/`
    });
  }

  // Add product breadcrumb if provided (no path for current page)
  if (productId && productLabel) {
    items.push({
      label: productLabel
    });
  }

  return items;
})();
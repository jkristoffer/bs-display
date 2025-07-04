import type { ProductModel } from '../types/product';

export const CATEGORY_BREADCRUMB_CONFIG = {
  smartboards: { label: 'Smart Boards', path: '/products/smartboards/' },
  lecterns: { label: 'Lecterns', path: '/products/lecterns/' },
  accessories: { label: 'Accessories', path: '/products/accessories/' },
  collaboration: { label: 'Collaboration', path: '/products/collaboration/' }
} as const;

export type ProductCategory = keyof typeof CATEGORY_BREADCRUMB_CONFIG;

export const generateProductBreadcrumbs = (
  model: ProductModel,
  productType: ProductCategory
): Array<{ label: string; path?: string }> => {
  const categoryConfig = CATEGORY_BREADCRUMB_CONFIG[productType];
  
  return [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products/' },
    { label: categoryConfig.label, path: categoryConfig.path },
    { 
      label: model.brand,
      path: `${categoryConfig.path}${model.brand.toLowerCase().replace(/\s+/g, '-')}/`
    },
    { label: model.model }
  ];
};
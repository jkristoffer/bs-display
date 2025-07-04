export interface ProductAction {
  label: string;
  action: 'quote' | 'demo' | 'specs' | 'contact';
  primary: boolean;
  className?: string;
}

export const PRODUCT_ACTION_CONFIG = {
  smartboards: [
    { label: 'Request Quote', action: 'quote', primary: true },
    { label: 'Book a Demo', action: 'demo', primary: false }
  ],
  lecterns: [
    { label: 'Request Quote', action: 'quote', primary: true },
    { label: 'Download Specs', action: 'specs', primary: false }
  ],
  accessories: [
    { label: 'Request Quote', action: 'quote', primary: true }
  ],
  collaboration: [
    { label: 'Request Quote', action: 'quote', primary: true },
    { label: 'Book a Demo', action: 'demo', primary: false }
  ]
} as const;

export type ProductCategory = keyof typeof PRODUCT_ACTION_CONFIG;

export const getProductActions = (
  productType: ProductCategory,
  customActions?: ProductAction[]
): ProductAction[] => {
  return customActions || PRODUCT_ACTION_CONFIG[productType];
};
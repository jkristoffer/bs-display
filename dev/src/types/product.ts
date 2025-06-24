/**
 * TypeScript interfaces for product data
 */

export interface ProductModel {
  id: string;
  brand: string;
  model: string;
  size: number;
  resolution?: string;
  os?: string;
  touchTechnology?: string;
  features: string[];
  warranty?: string;
  priceRange?: string;
  image?: string;
  brightness?: string;
  contrastRatio?: string;
  viewingAngle?: string;
  responseTime?: string;
  panelLife?: string;
  audioOutput?: string;
  powerConsumption?: string;
}

export interface FilterState {
  brands: string[];
  sizes: number[];
  touchTechs: string[];
  contrastRatios: string[];
}

export interface FilterCounts {
  [key: string]: number;
}

export interface FilterPanelProps {
  allModels: ProductModel[];
  onFilterChange: (filters: FilterState) => void;
}

export interface ModelDisplayProps {
  models: ProductModel[];
  productType?: string;
}

export interface ModelCardProps {
  model: ProductModel;
  displayMode?: 'grid-3' | 'grid-2' | 'list';
  productType?: string;
}

export interface ProductDetailsProps {
  model: ProductModel;
  productType?: string;
}

export interface FilterUIProps {
  allModels: ProductModel[];
  productType?: string;
}

export interface FilterOptionProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  count?: number;
  disabled?: boolean;
}

export type SortOption = 'default' | 'price-low' | 'price-high' | 'size-small' | 'size-large';
export type DisplayMode = 'grid-3' | 'grid-2' | 'list';
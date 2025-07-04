/**
 * TypeScript interfaces for dynamic filtering system
 */

import type { ProductModel } from './product';

export interface FilterConfig {
  id: string;
  type: 'single' | 'multi' | 'range' | 'boolean';
  label: string;
  accessor: (model: ProductModel) => any;
  formatter?: (value: any) => string;
  defaultExpanded?: boolean;
  sortOrder?: 'alpha' | 'numeric' | 'custom';
  customSort?: (a: any, b: any) => number;
}

export interface DynamicFilterState {
  [filterId: string]: any[];
}

export interface ProductFilterPreset {
  productType: 'smartboards' | 'lecterns' | 'accessories';
  filters: FilterConfig[];
}

export interface DynamicFilterPanelProps {
  allModels: ProductModel[];
  filterConfig: FilterConfig[];
  onFilterChange: (filters: DynamicFilterState) => void;
}

export interface FilterCounts {
  [key: string]: number;
}

export interface ExpandedState {
  [filterId: string]: boolean;
}
import type { FilterConfig } from '../../../../types/filter.types';

export const smartBoardFilters: FilterConfig[] = [
  {
    id: 'brand',
    type: 'multi',
    label: 'Brands',
    accessor: (model) => model.brand,
    defaultExpanded: true,
    sortOrder: 'alpha'
  },
  {
    id: 'size',
    type: 'multi',
    label: 'Screen Size',
    accessor: (model) => model.size,
    formatter: (value) => `${value}"`,
    defaultExpanded: true,
    sortOrder: 'numeric'
  },
  {
    id: 'touchTechnology',
    type: 'multi',
    label: 'Touch Technology',
    accessor: (model) => model.touchTechnology,
    defaultExpanded: false,
    sortOrder: 'alpha'
  },
  {
    id: 'contrastRatio',
    type: 'multi',
    label: 'Contrast Ratio',
    accessor: (model) => model.contrastRatio,
    defaultExpanded: false,
    sortOrder: 'alpha'
  }
];

export const lecternFilters: FilterConfig[] = [
  {
    id: 'brand',
    type: 'multi',
    label: 'Brands',
    accessor: (model) => model.brand,
    defaultExpanded: true,
    sortOrder: 'alpha'
  },
  {
    id: 'size',
    type: 'multi',
    label: 'Screen Size',
    accessor: (model) => model.size,
    formatter: (value) => `${value}"`,
    defaultExpanded: true,
    sortOrder: 'numeric'
  },
  {
    id: 'motorizedFeatures',
    type: 'multi',
    label: 'Motorized Features',
    accessor: (model) => model.motorizedFeatures,
    defaultExpanded: true,
    sortOrder: 'alpha'
  },
  {
    id: 'microphoneType',
    type: 'multi',
    label: 'Microphone Type',
    accessor: (model) => model.microphone?.type,
    defaultExpanded: false,
    sortOrder: 'alpha'
  }
];

export const accessoryFilters: FilterConfig[] = [
  {
    id: 'brand',
    type: 'multi',
    label: 'Brands',
    accessor: (model) => model.brand,
    defaultExpanded: true,
    sortOrder: 'alpha'
  },
  {
    id: 'category',
    type: 'multi',
    label: 'Category',
    accessor: (model) => model.category,
    formatter: (value) => value ? value.charAt(0).toUpperCase() + value.slice(1) : '',
    defaultExpanded: true,
    sortOrder: 'alpha'
  },
  {
    id: 'compatibility',
    type: 'multi',
    label: 'Compatible With',
    accessor: (model) => model.compatibility,
    defaultExpanded: true,
    sortOrder: 'alpha'
  }
];

export const filterPresets: Record<string, FilterConfig[]> = {
  smartboards: smartBoardFilters,
  lecterns: lecternFilters,
  accessories: accessoryFilters
};

export const getFilterConfigForProductType = (productType: string): FilterConfig[] => {
  return filterPresets[productType] || smartBoardFilters;
};
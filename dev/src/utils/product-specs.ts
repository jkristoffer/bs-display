import type { ProductModel } from '../types/product';

export const PRODUCT_SPEC_CONFIG = {
  smartboards: {
    displayOrder: ['size', 'resolution', 'os', 'touchTechnology', 'brightness', 'contrastRatio', 'viewingAngle', 'responseTime', 'panelLife', 'audioOutput', 'powerConsumption', 'warranty'],
    fieldLabels: {
      size: 'Screen Size',
      resolution: 'Resolution',
      os: 'Operating System',
      touchTechnology: 'Touch Technology',
      brightness: 'Brightness',
      contrastRatio: 'Contrast Ratio',
      viewingAngle: 'Viewing Angle',
      responseTime: 'Response Time',
      panelLife: 'Panel Life',
      audioOutput: 'Audio Output',
      powerConsumption: 'Power Consumption',
      warranty: 'Warranty'
    },
    formatters: {
      size: (value: number) => `${value}"`,
      resolution: (value: string) => value,
      os: (value: string) => value,
      touchTechnology: (value: string) => value,
      brightness: (value: string) => value,
      contrastRatio: (value: string) => value,
      viewingAngle: (value: string) => value,
      responseTime: (value: string) => value,
      panelLife: (value: string) => value,
      audioOutput: (value: string) => value,
      powerConsumption: (value: string) => value,
      warranty: (value: string) => value
    }
  },
  lecterns: {
    displayOrder: ['size', 'resolution', 'os', 'motorizedFeatures', 'microphone', 'audio', 'warranty'],
    fieldLabels: {
      size: 'Screen Size',
      resolution: 'Resolution',
      os: 'Operating System',
      motorizedFeatures: 'Motorized Features',
      microphone: 'Microphone',
      audio: 'Audio System',
      warranty: 'Warranty'
    },
    formatters: {
      size: (value: number) => `${value}"`,
      resolution: (value: string) => value,
      os: (value: string) => value,
      motorizedFeatures: (value: string[]) => value.join(', '),
      microphone: (value: { type: string; quantity: number }) => `${value.type} (${value.quantity})`,
      audio: (value: { amplifier?: string; speakers?: string }) => [value.amplifier, value.speakers].filter(Boolean).join(', '),
      warranty: (value: string) => value
    }
  },
  accessories: {
    displayOrder: ['category', 'compatibility', 'priceRange', 'features'],
    fieldLabels: {
      category: 'Category',
      compatibility: 'Compatibility',
      priceRange: 'Price Range',
      features: 'Features'
    },
    formatters: {
      category: (value: string) => value,
      compatibility: (value: string[]) => value.join(', '),
      priceRange: (value: string) => value,
      features: (value: string[]) => value.join(', ')
    }
  },
  collaboration: {
    displayOrder: ['category', 'type', 'features', 'compatibility'],
    fieldLabels: {
      category: 'Category',
      type: 'Type',
      features: 'Features',
      compatibility: 'Compatibility'
    },
    formatters: {
      category: (value: string) => value,
      type: (value: string) => value,
      features: (value: string[]) => value.join(', '),
      compatibility: (value: string[]) => value.join(', ')
    }
  }
} as const;

export type ProductCategory = keyof typeof PRODUCT_SPEC_CONFIG;

export const generateProductSpecifications = (
  model: ProductModel,
  productType: ProductCategory
): Array<{ label: string; value: string }> => {
  const config = PRODUCT_SPEC_CONFIG[productType];
  
  return config.displayOrder
    .map(field => ({
      field,
      value: model[field as keyof ProductModel]
    }))
    .filter(({ value }) => value !== undefined && value !== null && value !== '')
    .map(({ field, value }) => {
      const formatters = config.formatters as Record<string, ((value: any) => string) | undefined>;
      const formatter = formatters[field];
      return {
        label: config.fieldLabels[field as keyof typeof config.fieldLabels],
        value: formatter && typeof formatter === 'function'
          ? formatter(value)
          : String(value)
      };
    });
};
import allModels from '../../../data/models/models.all.js';

interface Props {
  limit?: number;
  itemsPerPage?: number;
}

interface ProductModel {
  id: string;
  brand: string;
  model: string;
  size: number;
  resolution: string;
  os: string;
  touchTechnology: string;
  features: string[];
  warranty: string;
  priceRange: string;
  image: string;
  brightness: string;
  contrast: string;
  connectivity: string;
  powerConsumption: string;
  [key: string]: any; // Index signature for dynamic property access
}

// Get props with default values
const { limit = 50, itemsPerPage = 8 } = Astro.props;

// Get models with limit
const allDisplayedModels = (allModels as unknown as ProductModel[]).slice(0, limit);

// Calculate total number of pages
const totalPages = Math.ceil(allDisplayedModels.length / itemsPerPage);

// Initialize with first page of items
const initialModels = allDisplayedModels.slice(0, itemsPerPage);

// Define displayed properties
const displayProperties = [
  'brand',
  'model',
  'size',
  'os',
  'touchTechnology'
];

// Format property name for display
function formatPropertyName(prop: string): string {
  return prop.charAt(0).toUpperCase() + prop.slice(1);
}
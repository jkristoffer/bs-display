import allModels from '../../../data/models/models.all.js';
import Button from '../../common/Button/Button.astro';

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
const { limit = 50, itemsPerPage = 6 } = Astro.props;

// Get models with limit
const allDisplayedModels = (allModels as unknown as ProductModel[]).slice(0, limit);

// Calculate total number of pages
const totalPages = Math.ceil(allDisplayedModels.length / itemsPerPage);

// Initialize with first page of items
const initialModels = allDisplayedModels.slice(0, itemsPerPage);

// Define displayed properties with more details
const displayProperties = [
  { key: 'brand', label: 'Brand', icon: '🏢' },
  { key: 'model', label: 'Model', icon: '📱' },
  { key: 'size', label: 'Size', icon: '📏', suffix: '"' },
  { key: 'resolution', label: 'Resolution', icon: '🎯' },
  { key: 'touchTechnology', label: 'Touch Tech', icon: '👆' },
  { key: 'priceRange', label: 'Price', icon: '💰' }
];

// Get popular brands
const popularBrands = [...new Set(allDisplayedModels.map(model => model.brand))].slice(0, 4);
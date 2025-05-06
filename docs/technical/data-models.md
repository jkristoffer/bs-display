# BS Display - Data Models & Schemas

This document outlines the data structures used throughout the BS Display application, including product data models, UI state models, and guidelines for future data expansion.

## 1. Product Data Model

The core data model of the application is the product model, which represents interactive smart boards from various brands. The data is currently stored in JSON files in the `dev/src/data/` directory.

### 1.1 Product Schema

```typescript
interface Product {
  id: string; // Unique identifier for the product
  brand: string; // Brand name (e.g., "METZ", "SMART", "Infinity Pro")
  model: string; // Model name/number
  size: number; // Screen size in inches
  resolution: string; // Display resolution (e.g., "3840x2160")
  os: string; // Operating system(s) supported
  touchTechnology: string; // Touch technology type
  features: string[]; // Array of product features
  warranty: string; // Warranty information
  priceRange: string; // Price range as a string (e.g., "$2,000 - $2,500")
  image: string; // URL to product image
  brightness: string; // Display brightness (e.g., "450 cd/m²")
  contrastRatio: string; // Display contrast ratio (e.g., "5000:1")
  viewingAngle: string; // Viewing angle (e.g., "178°")
  responseTime: string; // Response time (e.g., "8 ms")
  panelLife: string; // Expected panel life (e.g., "50000 hours")
  audioOutput: string; // Audio output specifications
  powerConsumption: string; // Power consumption information
}
```

### 1.2 Data Organization

Product data is organized in several JSON files:

- `models.all.json` - Contains all product models
- `models.infinitypro.json` - Infinity Pro brand models
- `models.metz.json` - METZ brand models
- `models.smart6000sv3.json` - SMART 6000S v3 models
- `models.smartmxv5.json` - SMART MX v5 models
- `models.v2.schema.json` - JSON schema definition

This organization allows for:

- Easy filtering by brand
- Simplified data management
- Potential for incremental loading in the future

## 2. UI State Models

The application maintains several UI state models to manage user interactions and filtering.

### 2.1 Filter State Model

```typescript
interface FilterState {
  brands: string[]; // Selected brand filters
  sizes: number[]; // Selected size filters
  touchTechs: string[]; // Selected touch technology filters
  contrastRatios: string[]; // Selected contrast ratio filters
  priceRanges: string[]; // Selected price range filters
}
```

This state is managed in the `FilterUI` component and used to filter the product data.

### 2.2 Sort State Model

```typescript
type SortOption =
  | 'default'
  | 'price-low'
  | 'price-high'
  | 'size-small'
  | 'size-large';

interface SortState {
  sortBy: SortOption;
}
```

This state is managed in the `ModelDisplay` component and used to sort the filtered products.

### 2.3 Mobile UI State

```typescript
interface MobileUIState {
  mobileFiltersVisible: boolean; // Whether filters are visible on mobile
}
```

This state is used to control the visibility of filters on mobile devices.

## 3. Data Flow

### 3.1 Data Loading Flow

1. JSON data is imported at build time in Astro pages
2. Data is passed to React components as props
3. Components render based on the provided data

Example:

```javascript
// In an Astro page
import allModels from '../data/models.all.json';

// Pass to React component
<FilterUI allModels={allModels} client:visible />;
```

### 3.2 Filtering Flow

1. User interacts with filter components
2. Filter state is updated in the `FilterUI` component
3. Filtering logic is applied to the product data
4. Filtered results are passed to the `ModelDisplay` component

```javascript
// Filtering logic example
const filtered = allModels.filter((model) => {
  const matchBrand =
    filters.brands.length === 0 || filters.brands.includes(model.brand);
  const matchSize =
    filters.sizes.length === 0 || filters.sizes.includes(model.size);
  // Additional filter criteria...

  return matchBrand && matchSize && /* other criteria */;
});
```

### 3.3 Sorting Flow

1. User selects a sort option
2. Sort state is updated in the `ModelDisplay` component
3. Sorting logic is applied to the filtered products
4. Sorted results are displayed

```javascript
// Sorting logic example
const sortedModels = [...filtered].sort((a, b) => {
  switch (sortBy) {
    case 'price-low':
      return extractPrice(a.priceRange) - extractPrice(b.priceRange);
    case 'price-high':
      return extractPrice(b.priceRange) - extractPrice(a.priceRange);
    // Additional sort options...
    default:
      return a.brand.localeCompare(b.brand);
  }
});
```

## 4. Data Validation

Currently, data validation is performed at build time through TypeScript interfaces. In the future, a more robust validation system could be implemented using JSON Schema or a validation library.

### 4.1 Required Fields

The following fields are required for all product models:

- `id`
- `brand`
- `model`
- `size`
- `features`

### 4.2 Field Format Validation

- `id`: Alphanumeric string with hyphens, no spaces
- `size`: Numeric value
- `features`: Array of strings
- `image`: Valid URL or relative path

## 5. Data Relationships

### 5.1 Brand to Products Relationship

Each product belongs to a brand, creating a one-to-many relationship between brands and products.

```
Brand (METZ) ──┬─► Product (METZ H Series 65")
               ├─► Product (METZ H Series 75")
               └─► Product (METZ H Series 86")
```

### 5.2 Product to Features Relationship

Each product has multiple features, creating a one-to-many relationship between products and features.

```
Product ──┬─► Feature 1
          ├─► Feature 2
          ├─► Feature 3
          └─► Feature n
```

## 6. Future Data Expansion

### 6.1 API Integration

The current data model is designed to be compatible with future API integration. The static JSON files could be replaced with API calls without changing the component structure.

Potential API endpoints:

- `GET /api/products` - Get all products
- `GET /api/products?brand=METZ` - Filter products by brand
- `GET /api/products/{id}` - Get a specific product

### 6.2 Additional Data Models

Future expansion could include additional data models:

#### 6.2.1 User Model

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  savedProducts: string[]; // Array of product IDs
}
```

#### 6.2.2 Order/Quote Model

```typescript
interface Quote {
  id: string;
  userId: string;
  products: {
    productId: string;
    quantity: number;
  }[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  notes: string;
}
```

#### 6.2.3 Content Model

```typescript
interface ContentBlock {
  id: string;
  type: 'hero' | 'feature' | 'testimonial';
  title: string;
  content: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
}
```

### 6.3 Data Migration Strategy

When expanding the data model:

1. Create new TypeScript interfaces for the new data structures
2. Implement backward compatibility for existing data
3. Create migration utilities if needed
4. Update components to handle both old and new data formats
5. Gradually transition to the new data format

## 7. Data Flow Diagrams

### 7.1 Product Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  JSON Files │────►│  Astro      │────►│  React      │
│  (Data)     │     │  Pages      │     │  Components │
└─────────────┘     └─────────────┘     └─────────────┘
```

### 7.2 Filter Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  User       │────►│  FilterPanel│────►│  FilterUI   │
│  Interaction│     │  Components │     │  State      │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Displayed  │◄────│  ModelDisplay    │◄────│  Filtered  │
│  Products   │     │  Component  │     │  Products   │
└─────────────┘     └─────────────┘     └─────────────┘
```

## 8. Schema Evolution Guidelines

When evolving the data schema:

1. **Backward Compatibility**: Ensure new schemas are backward compatible with existing data
2. **Versioning**: Consider versioning schemas (e.g., `v1`, `v2`) for major changes
3. **Documentation**: Update this document with new schema definitions
4. **Migration**: Provide migration scripts for existing data
5. **Testing**: Test components with both old and new data formats

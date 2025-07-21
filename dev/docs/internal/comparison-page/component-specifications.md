# Comparison Page Component Specifications

## Component Architecture Overview

Each component follows the established functional programming patterns and component standards of the project.

## 1. SpecsTable Component

### Purpose
Display technical specifications side-by-side with highlighted differences.

### Props Interface
```typescript
interface SpecsTableProps {
  productA: Product;
  productB: Product;
  categories: SpecCategory[];
  highlightDifferences?: boolean;
  expandable?: boolean;
}

interface SpecCategory {
  id: string;
  name: string;
  specs: SpecItem[];
  priority: number;
}

interface SpecItem {
  key: string;
  label: string;
  valueA: string | number;
  valueB: string | number;
  unit?: string;
  type: 'text' | 'number' | 'boolean' | 'range';
  important?: boolean;
}
```

### Features
- **Difference Highlighting**: Color-coded differences (green for better, red for worse)
- **Expandable Sections**: Collapsible spec categories
- **Responsive Design**: Mobile-first table layout
- **Sorting**: User-configurable sorting by importance/category

### Files
- `src/components/comparison/SpecsTable/SpecsTable.tsx`
- `src/components/comparison/SpecsTable/SpecsTable.module.scss`
- `src/components/comparison/SpecsTable/SpecsTable.test.tsx`

## 2. FeatureMatrix Component

### Purpose
Checkmark grid showing feature availability across both products.

### Props Interface
```typescript
interface FeatureMatrixProps {
  productA: Product;
  productB: Product;
  featureCategories: FeatureCategory[];
  showTooltips?: boolean;
}

interface FeatureCategory {
  id: string;
  name: string;
  features: Feature[];
  icon?: string;
}

interface Feature {
  id: string;
  name: string;
  description: string;
  availableA: boolean;
  availableB: boolean;
  importance: 'high' | 'medium' | 'low';
}
```

### Features
- **Visual Indicators**: Checkmarks, X marks, partial support indicators
- **Tooltips**: Feature explanations on hover
- **Filtering**: By category or importance level
- **Responsive Grid**: Mobile-optimized layout

### Files
- `src/components/comparison/FeatureMatrix/FeatureMatrix.tsx`
- `src/components/comparison/FeatureMatrix/FeatureMatrix.module.scss`
- `src/components/comparison/FeatureMatrix/FeatureMatrix.test.tsx`

## 3. UseCaseRecommendations Component

### Purpose
Scenario-based recommendations for different use cases.

### Props Interface
```typescript
interface UseCaseRecommendationsProps {
  productA: Product;
  productB: Product;
  useCases: UseCase[];
}

interface UseCase {
  id: string;
  name: string;
  description: string;
  icon: string;
  factors: string[];
  recommendation: {
    winner: 'A' | 'B' | 'tie';
    reason: string;
    confidence: number;
  };
}
```

### Features
- **Scenario Cards**: Visual representation of use cases
- **Recommendation Logic**: Algorithm-based suggestions
- **Confidence Indicators**: Visual confidence scoring
- **Interactive Elements**: Expandable reasoning

### Files
- `src/components/comparison/UseCaseRecommendations/UseCaseRecommendations.tsx`
- `src/components/comparison/UseCaseRecommendations/UseCaseRecommendations.module.scss`
- `src/components/comparison/UseCaseRecommendations/UseCaseRecommendations.test.tsx`

## 4. ProsConsSection Component

### Purpose
Side-by-side advantages and disadvantages analysis.

### Props Interface
```typescript
interface ProsConsSectionProps {
  productA: Product;
  productB: Product;
  analysis: ProsCons;
}

interface ProsCons {
  productA: {
    pros: ProConItem[];
    cons: ProConItem[];
  };
  productB: {
    pros: ProConItem[];
    cons: ProConItem[];
  };
}

interface ProConItem {
  id: string;
  text: string;
  category: string;
  importance: number;
  evidence?: string;
}
```

### Features
- **Balanced Layout**: Equal visual weight for both products
- **Category Grouping**: Organized by feature categories
- **Importance Weighting**: Visual indicators for critical factors
- **Evidence Links**: Supporting documentation

### Files
- `src/components/comparison/ProsConsSection/ProsConsSection.tsx`
- `src/components/comparison/ProsConsSection/ProsConsSection.module.scss`
- `src/components/comparison/ProsConsSection/ProsConsSection.test.tsx`

## 5. WinnerBadges Component

### Purpose
Category-based awards and scoring visualization.

### Props Interface
```typescript
interface WinnerBadgesProps {
  productA: Product;
  productB: Product;
  categories: BadgeCategory[];
}

interface BadgeCategory {
  id: string;
  name: string;
  description: string;
  winner: 'A' | 'B' | 'tie';
  scoreA: number;
  scoreB: number;
  maxScore: number;
  reasoning: string;
}
```

### Features
- **Visual Badges**: Award-style indicators
- **Score Comparison**: Numerical and visual scoring
- **Detailed Reasoning**: Expandable explanations
- **Category Variety**: Performance, value, features, etc.

### Files
- `src/components/comparison/WinnerBadges/WinnerBadges.tsx`
- `src/components/comparison/WinnerBadges/WinnerBadges.module.scss`
- `src/components/comparison/WinnerBadges/WinnerBadges.test.tsx`

## 6. SizeVisualizer Component

### Purpose
Interactive room visualization with scale-accurate panel overlays.

### Props Interface
```typescript
interface SizeVisualizerProps {
  productA: Product;
  productB: Product;
  roomOptions: RoomOption[];
  defaultRoom?: string;
}

interface RoomOption {
  id: string;
  name: string;
  image: string;
  dimensions: {
    width: number;
    height: number;
  };
  scale: number;
}
```

### Features
- **Room Selection**: Multiple background environments
- **Scale Accuracy**: Precise size representation
- **Interactive Positioning**: Drag and drop panels
- **Measurement Tools**: Distance and size indicators

### Files
- `src/components/comparison/SizeVisualizer/SizeVisualizer.tsx`
- `src/components/comparison/SizeVisualizer/SizeVisualizer.module.scss`
- `src/components/comparison/SizeVisualizer/SizeVisualizer.test.tsx`

## 7. StickyComparisonBar Component

### Purpose
Always-visible summary of key differences during scroll.

### Props Interface
```typescript
interface StickyComparisonBarProps {
  productA: Product;
  productB: Product;
  keyDifferences: KeyDifference[];
  navigationLinks: NavigationLink[];
}

interface KeyDifference {
  category: string;
  difference: string;
  advantage: 'A' | 'B' | 'neutral';
}

interface NavigationLink {
  id: string;
  label: string;
  section: string;
}
```

### Features
- **Sticky Positioning**: Fixed during scroll
- **Key Highlights**: Most important differences
- **Quick Navigation**: Jump to sections
- **Minimal Design**: Non-intrusive UI

### Files
- `src/components/comparison/StickyComparisonBar/StickyComparisonBar.tsx`
- `src/components/comparison/StickyComparisonBar/StickyComparisonBar.module.scss`
- `src/components/comparison/StickyComparisonBar/StickyComparisonBar.test.tsx`

## 8. ExportControls Component

### Purpose
PDF generation and sharing functionality.

### Props Interface
```typescript
interface ExportControlsProps {
  comparisonData: ComparisonData;
  customization: ExportCustomization;
  onExport: (format: ExportFormat) => void;
}

interface ExportCustomization {
  includeSections: string[];
  layout: 'compact' | 'detailed';
  branding: boolean;
}

type ExportFormat = 'pdf' | 'print' | 'share';
```

### Features
- **PDF Generation**: Client-side PDF creation
- **Print Optimization**: Print-friendly layouts
- **Share Functionality**: URL sharing and social media
- **Customization Options**: Section selection and formatting

### Files
- `src/components/comparison/ExportControls/ExportControls.tsx`
- `src/components/comparison/ExportControls/ExportControls.module.scss`
- `src/components/comparison/ExportControls/ExportControls.test.tsx`

## Shared Types and Utilities

### Common Types
```typescript
// src/types/comparison.ts
export interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  specifications: Record<string, any>;
  features: string[];
  images: string[];
  price?: number;
}

export interface ComparisonData {
  productA: Product;
  productB: Product;
  analysis: ComparisonAnalysis;
  metadata: ComparisonMetadata;
}
```

### Utility Functions
```typescript
// src/utils/comparison.ts
export const calculateDifferences = (productA: Product, productB: Product): Difference[];
export const generateRecommendations = (products: Product[], useCases: UseCase[]): Recommendation[];
export const calculateScores = (product: Product, categories: Category[]): CategoryScore[];
```

## Styling Standards

### SCSS Architecture
- **Component Modules**: Scoped styles per component
- **Shared Variables**: Consistent spacing, colors, typography
- **Responsive Mixins**: Mobile-first breakpoints
- **Animation Utilities**: Smooth transitions and interactions

### Design System Integration
- **Gradient System**: Enhanced gradient utilities
- **Component Library**: Existing Card, Button, Form components
- **Typography**: Consistent font sizing and hierarchy
- **Color Palette**: Brand-consistent color usage

## Testing Strategy

### Unit Tests
- Component rendering and props handling
- State management and user interactions
- Utility function accuracy
- Accessibility compliance

### Integration Tests
- Component communication
- Data flow between components
- Export functionality
- Mobile responsiveness

### Performance Tests
- Load time optimization
- Memory usage monitoring
- Render performance
- Image optimization

## Accessibility Requirements

### WCAG 2.1 AA Compliance
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and roles
- **Color Contrast**: Sufficient contrast ratios
- **Focus Management**: Logical tab order

### Mobile Accessibility
- **Touch Targets**: Minimum 44px touch areas
- **Responsive Design**: Proper scaling and layout
- **Performance**: Fast load times on mobile networks
- **Gestures**: Alternative input methods
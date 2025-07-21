# Comparison Page Data Structure

## Overview
This document defines the data structures and schemas required for the interactive panel comparison functionality.

## Core Data Types

### Product Data Structure
```typescript
interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: 'smartboards' | 'lecterns' | 'accessories' | 'collaboration';
  
  // Core specifications
  specifications: {
    display: DisplaySpecs;
    connectivity: ConnectivitySpecs;
    performance: PerformanceSpecs;
    physical: PhysicalSpecs;
    software: SoftwareSpecs;
    warranty: WarrantySpecs;
  };
  
  // Feature flags
  features: string[];
  
  // Media assets
  images: ProductImage[];
  videos?: ProductVideo[];
  documents?: ProductDocument[];
  
  // Pricing and availability
  pricing?: PricingInfo;
  availability: AvailabilityInfo;
  
  // Metadata
  metadata: ProductMetadata;
}
```

### Detailed Specification Interfaces

#### Display Specifications
```typescript
interface DisplaySpecs {
  screenSize: {
    diagonal: number; // inches
    width: number; // mm
    height: number; // mm
  };
  resolution: {
    width: number; // pixels
    height: number; // pixels
    standard: '4K' | 'FHD' | '8K' | 'QHD';
  };
  touchTechnology: {
    type: 'infrared' | 'capacitive' | 'optical' | 'electromagnetic';
    points: number; // simultaneous touch points
    accuracy: string; // e.g., "±1mm"
    responsiveness: number; // ms
  };
  brightness: number; // nits
  contrast: string; // e.g., "1200:1"
  viewingAngle: {
    horizontal: number; // degrees
    vertical: number; // degrees
  };
  colorGamut: string; // e.g., "NTSC 85%"
  antiGlare: boolean;
  blueLight: boolean;
}
```

#### Connectivity Specifications
```typescript
interface ConnectivitySpecs {
  hdmi: {
    ports: number;
    version: string; // e.g., "HDMI 2.0"
    features: string[]; // e.g., ["4K@60Hz", "ARC"]
  };
  usb: {
    typeA: number;
    typeC: number;
    version: string; // e.g., "USB 3.0"
    powerDelivery?: number; // watts
  };
  ethernet: {
    ports: number;
    speed: string; // e.g., "1Gbps"
  };
  wifi: {
    standard: string; // e.g., "Wi-Fi 6"
    frequency: string[]; // e.g., ["2.4GHz", "5GHz"]
  };
  bluetooth: {
    version: string; // e.g., "5.0"
    range: number; // meters
  };
  audio: {
    input: string[]; // e.g., ["3.5mm", "XLR"]
    output: string[]; // e.g., ["3.5mm", "optical"]
    speakers: SpeakerSpecs;
  };
  serial: {
    rs232: number;
    other: string[];
  };
  wireless: {
    miracast: boolean;
    airplay: boolean;
    chromecast: boolean;
    customProtocols: string[];
  };
}

interface SpeakerSpecs {
  count: number;
  power: number; // watts per speaker
  frequency: string; // e.g., "50Hz-20kHz"
  position: string; // e.g., "front-firing"
}
```

#### Performance Specifications
```typescript
interface PerformanceSpecs {
  processor: {
    type: string; // e.g., "ARM Cortex-A73"
    cores: number;
    speed: number; // GHz
  };
  memory: {
    ram: number; // GB
    storage: number; // GB
    type: string; // e.g., "eMMC", "SSD"
  };
  os: {
    name: string; // e.g., "Android", "Windows", "Chrome OS"
    version: string;
    customization?: string;
  };
  graphics: {
    chipset: string;
    memory?: number; // MB
  };
  powerConsumption: {
    operational: number; // watts
    standby: number; // watts
    energyRating?: string;
  };
  bootTime: number; // seconds
  responseTime: number; // ms for touch
}
```

#### Physical Specifications
```typescript
interface PhysicalSpecs {
  dimensions: {
    width: number; // mm
    height: number; // mm
    depth: number; // mm
    weight: number; // kg
  };
  mounting: {
    vesa: string; // e.g., "400x400"
    wallMount: boolean;
    mobile: boolean;
    floorStand: boolean;
    options: string[];
  };
  materials: {
    frame: string; // e.g., "aluminum"
    screen: string; // e.g., "tempered glass"
    finish: string; // e.g., "matte black"
  };
  environmental: {
    operatingTemp: {
      min: number; // celsius
      max: number; // celsius
    };
    humidity: {
      min: number; // percentage
      max: number; // percentage
    };
    certification: string[]; // e.g., ["IP65", "FCC"]
  };
}
```

#### Software Specifications
```typescript
interface SoftwareSpecs {
  preInstalled: SoftwarePackage[];
  compatibility: {
    windows: boolean;
    macos: boolean;
    ios: boolean;
    android: boolean;
    chromeos: boolean;
    linux: boolean;
  };
  cloudServices: {
    included: string[];
    optional: string[];
    storage: number; // GB
  };
  management: {
    mdm: string[]; // Mobile Device Management systems
    remoteControl: boolean;
    monitoring: boolean;
    updates: 'automatic' | 'manual' | 'scheduled';
  };
  security: {
    encryption: string[];
    authentication: string[];
    compliance: string[];
  };
}

interface SoftwarePackage {
  name: string;
  category: string;
  version?: string;
  license: 'included' | 'trial' | 'subscription';
  duration?: number; // months for trial/subscription
}
```

#### Warranty Specifications
```typescript
interface WarrantySpecs {
  standard: {
    duration: number; // years
    coverage: string[];
    limitations: string[];
  };
  extended: {
    available: boolean;
    options: WarrantyOption[];
  };
  support: {
    phone: boolean;
    email: boolean;
    chat: boolean;
    onsite: boolean;
    remote: boolean;
    hours: string; // e.g., "24/7", "business hours"
  };
}

interface WarrantyOption {
  duration: number; // years
  cost: number; // currency units
  coverage: string[];
  benefits: string[];
}
```

## Comparison-Specific Data Structures

### Comparison Configuration
```typescript
interface ComparisonConfig {
  categories: ComparisonCategory[];
  scoring: ScoringConfig;
  useCases: UseCase[];
  badges: BadgeConfig[];
}

interface ComparisonCategory {
  id: string;
  name: string;
  description: string;
  specs: string[]; // keys from Product.specifications
  weight: number; // for overall scoring
  displayOrder: number;
  icon?: string;
}

interface ScoringConfig {
  algorithm: 'weighted' | 'categorical' | 'hybrid';
  weights: Record<string, number>;
  normalization: 'minmax' | 'zscore' | 'none';
  penalties: ScoringPenalty[];
}

interface ScoringPenalty {
  condition: string; // e.g., "missing feature"
  penalty: number; // points deducted
  category?: string;
}
```

### Use Case Definitions
```typescript
interface UseCase {
  id: string;
  name: string;
  description: string;
  icon: string;
  
  // Scenario details
  environment: 'classroom' | 'boardroom' | 'auditorium' | 'collaboration' | 'public';
  userCount: {
    min: number;
    max: number;
    typical: number;
  };
  usage: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'occasional';
    duration: number; // hours per session
    intensity: 'light' | 'moderate' | 'heavy';
  };
  
  // Requirements
  requirements: {
    essential: string[]; // must-have features
    important: string[]; // nice-to-have features
    optional: string[]; // bonus features
  };
  
  // Scoring factors
  factors: UseCaseFactor[];
}

interface UseCaseFactor {
  spec: string; // key from Product.specifications
  importance: number; // 1-10 scale
  direction: 'higher' | 'lower' | 'specific'; // better direction
  target?: any; // specific target value if direction is 'specific'
}
```

### Comparison Analysis Results
```typescript
interface ComparisonAnalysis {
  overall: OverallComparison;
  categories: CategoryComparison[];
  useCases: UseCaseComparison[];
  recommendations: Recommendation[];
  badges: Badge[];
}

interface OverallComparison {
  winner: 'A' | 'B' | 'tie';
  scoreA: number;
  scoreB: number;
  maxScore: number;
  confidence: number; // 0-1
  summary: string;
}

interface CategoryComparison {
  category: string;
  winner: 'A' | 'B' | 'tie';
  scoreA: number;
  scoreB: number;
  differences: Difference[];
  summary: string;
}

interface Difference {
  spec: string;
  valueA: any;
  valueB: any;
  significance: 'major' | 'minor' | 'negligible';
  advantage: 'A' | 'B' | 'neutral';
  explanation: string;
}

interface UseCaseComparison {
  useCase: string;
  winner: 'A' | 'B' | 'tie';
  scoreA: number;
  scoreB: number;
  reasoning: string;
  confidence: number;
}

interface Recommendation {
  type: 'general' | 'usecase' | 'budget' | 'feature';
  text: string;
  reasoning: string;
  confidence: number;
  priority: 'high' | 'medium' | 'low';
}

interface Badge {
  category: string;
  title: string;
  winner: 'A' | 'B' | 'tie';
  description: string;
  criteria: string;
  icon?: string;
}
```

## Data Sources and Integration

### Existing Data Integration
```typescript
// Extend existing product data structure
interface ProductDataIntegration {
  // From existing models.*.json files
  baseProduct: any; // existing product structure
  
  // Enhanced for comparison
  comparisonSpecs: Product['specifications'];
  comparisonFeatures: string[];
  comparisonMetadata: ProductMetadata;
}

interface ProductMetadata {
  lastUpdated: string; // ISO date
  dataSource: string;
  accuracy: number; // 0-1 confidence in data
  missingFields: string[]; // known missing specifications
  notes: string[];
}
```

### Static Configuration Files
```typescript
// src/data/comparison/config.json
interface ComparisonConfigFile {
  categories: ComparisonCategory[];
  useCases: UseCase[];
  scoring: ScoringConfig;
  badges: BadgeConfig[];
  roomOptions: RoomOption[];
}

// src/data/comparison/scoring-weights.json
interface ScoringWeights {
  [category: string]: {
    [spec: string]: number;
  };
}
```

### Dynamic Data Generation
```typescript
// Utils for generating comparison data
interface ComparisonDataGenerator {
  generateAnalysis: (productA: Product, productB: Product, config: ComparisonConfig) => ComparisonAnalysis;
  calculateScores: (product: Product, config: ComparisonConfig) => CategoryScore[];
  generateRecommendations: (analysis: ComparisonAnalysis, useCases: UseCase[]) => Recommendation[];
  assignBadges: (analysis: ComparisonAnalysis, badges: BadgeConfig[]) => Badge[];
}
```

## Export Data Structures

### PDF Export Format
```typescript
interface ExportData {
  metadata: {
    title: string;
    products: string[];
    generatedAt: string;
    version: string;
  };
  content: {
    summary: ExportSummary;
    specifications: ExportSpecifications;
    analysis: ExportAnalysis;
    recommendations: ExportRecommendations;
  };
  formatting: {
    layout: 'compact' | 'detailed';
    includeSections: string[];
    branding: boolean;
  };
}

interface ExportSummary {
  winner: string;
  keyDifferences: string[];
  priceComparison?: string;
  recommendation: string;
}
```

## Validation and Quality Assurance

### Data Validation Schema
```typescript
interface DataValidation {
  required: string[]; // required fields for comparison
  constraints: Record<string, ValidationRule>;
  relationships: RelationshipRule[];
}

interface ValidationRule {
  type: 'range' | 'enum' | 'pattern' | 'custom';
  params: any;
  message: string;
}

interface RelationshipRule {
  fields: string[];
  rule: string; // e.g., "screenSize.diagonal must match dimensions"
  severity: 'error' | 'warning';
}
```

### Data Quality Metrics
```typescript
interface DataQuality {
  completeness: number; // 0-1, percentage of fields populated
  accuracy: number; // 0-1, confidence in data accuracy
  freshness: number; // days since last update
  consistency: number; // 0-1, consistency across related fields
  coverage: string[]; // list of supported comparison categories
}
```

This data structure provides a comprehensive foundation for the comparison page functionality while maintaining flexibility for future enhancements and ensuring consistency with the existing codebase architecture.
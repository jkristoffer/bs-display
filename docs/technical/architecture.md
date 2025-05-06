# BS Display - Architecture Document

## 1. System Overview

BS Display is a web application for showcasing and filtering interactive smart boards from various brands. The application allows users to browse products, filter by various criteria, view detailed product information, and contact the company for quotes or demos.

The application follows a component-based architecture with a clear separation of concerns, organized by feature. It uses Astro as the main framework with React components for interactive elements.

## 2. Technology Stack

- **Framework**: [Astro](https://astro.build/) - A modern static site builder with excellent performance characteristics
- **UI Library**: [React](https://reactjs.org/) - Used for interactive components
- **Styling**: CSS Modules - For component-scoped styling
- **Routing**: Astro's file-based routing with dynamic routes
- **Data Storage**: Static JSON files (with potential for API integration in the future)
- **Build Tool**: Astro's built-in build system

## 3. Component Architecture

The application follows a feature-based component architecture, organized into the following main directories:

```
dev/src/
├── components/
│   ├── common/          # Shared components
│   ├── home/            # Home page components
│   └── products/        # Product-related components
├── layouts/             # Page layouts
├── pages/               # Astro pages including dynamic routes
├── data/                # Data files and models
├── services/            # Data services
├── utils/               # Utility functions
└── styles/              # Global styles and variables
```

### 3.1 Component Hierarchy

#### Common Components

- `Button` - Reusable button component with multiple variants
- `Nav` - Main navigation component
  - `NavItem` - Individual navigation item

#### Home Page Components

- `Banner` - Hero banner for the home page
- `BrandsSection` - Displays brand cards
  - `BrandCard` - Individual brand card
- `UsecasesSection` - Displays use cases for smart boards
  - `UsecaseItem` - Individual use case item

#### Product Components

- `FilterUI` - Main product filtering interface
  - `FilterPanel` - Side panel with filtering options
    - `FilterOption` - Individual filter option
  - `ModelDisplay` - Displays filtered products
    - `ModelCard` - Individual product card
- `ProductDetails` - Detailed product information page

### 3.2 Data Flow

The application follows a unidirectional data flow pattern:

1. Data is stored in static JSON files in the `data/` directory
2. Pages load data and pass it to components as props
3. Interactive components (React) manage local state for user interactions
4. Filter state is managed at the `FilterUI` level and passed down to child components
5. When filter criteria change, the filtered data is recalculated and passed to the `ModelDisplay` component

For example, in the product filtering flow:

- `FilterPanel` components emit filter changes
- `FilterUI` receives these changes and updates its state
- Filtered products are calculated based on the current filter state
- `ModelDisplay` receives and displays the filtered products

## 4. Routing Structure

The application uses Astro's file-based routing system with both static and dynamic routes:

### 4.1 Static Routes

- `/` - Home page
- `/products` - All products listing
- `/contact` - Contact page
- `/lecterns` - Lecterns page (placeholder for future content)

### 4.2 Dynamic Routes

- `/products/[brand]` - Brand-specific product listings
- `/products/[brand]/[id]` - Individual product details

Dynamic routes are generated at build time using the `getStaticPaths` function in Astro, which processes the product data to create all necessary routes.

## 5. Layout System

The application uses a hierarchical layout system:

- `BaseLayout` - Core HTML structure with minimal styling
  - `MainLayout` - Adds navigation and common page elements
    - `ProductLayout` - Specialized layout for product pages

This approach allows for consistent page structure while enabling specialized layouts for different sections of the site.

## 6. Styling Architecture

The styling system uses a combination of:

- Global CSS variables (in `styles/variables.css`)
- CSS utility mixins (in `styles/mixins.css`)
- Component-scoped CSS using CSS Modules

This approach provides:

- Consistent theming across the application
- Encapsulated component styles to prevent conflicts
- Reusable styling patterns through mixins

## 7. Build & Deployment

The application is built using Astro's build system, which:

1. Processes all Astro and React components
2. Generates static HTML for all routes
3. Bundles and optimizes JavaScript for interactive components
4. Processes and optimizes CSS

The resulting static site can be deployed to any static hosting service.

## 8. Performance Considerations

The application is designed with performance in mind:

- Static site generation for fast initial page loads
- Minimal JavaScript sent to the client
- React components hydrated only when needed (using Astro's client directives)
- Responsive images and lazy loading
- CSS optimization through scoped styles

## 9. Future Architecture Considerations

### 9.1 API Integration

The current architecture uses static JSON files for data, but is designed to easily transition to API-based data fetching in the future. The `services/` directory is prepared for this purpose.

### 9.2 State Management

As the application grows, more sophisticated state management solutions like Context API or Redux could be integrated.

### 9.3 Internationalization

The component structure is designed to support internationalization in the future, with text content that can be easily extracted and localized.

### 9.4 Authentication

If needed, authentication could be added for admin features like product management.

## 10. Diagrams

### 10.1 Component Relationship Diagram

```
┌─────────────────────────────────────┐
│              Pages                  │
│  ┌─────────┐ ┌────────┐ ┌────────┐  │
│  │  Home   │ │Products│ │Contact │  │
│  └────┬────┘ └────┬───┘ └────┬───┘  │
└───────┼──────────┼─────────┼────────┘
        │          │         │
        ▼          ▼         ▼
┌─────────────────────────────────────┐
│              Layouts                │
│  ┌─────────┐ ┌────────────────┐     │
│  │BaseLayout│◄─┐MainLayout    │     │
│  └─────────┘  └─┬─────────────┘     │
│                 │ ┌────────────┐    │
│                 └►│ProductLayout│    │
│                   └────────────┘    │
└─────────────────────────────────────┘
        │          │         │
        ▼          ▼         ▼
┌─────────────────────────────────────┐
│            Components               │
│  ┌─────────┐ ┌────────┐ ┌────────┐  │
│  │  Home   │ │Products│ │Common  │  │
│  │Components│ │Components│Components│ │
│  └─────────┘ └────────┘ └────────┘  │
└─────────────────────────────────────┘
```

### 10.2 Data Flow Diagram

```
┌─────────────┐     ┌─────────────┐
│  JSON Data  │────►│  Pages      │
└─────────────┘     └──────┬──────┘
                           │
                           ▼
┌─────────────┐     ┌─────────────┐
│  User       │◄───►│  React      │
│  Interaction│     │  Components │
└─────────────┘     └──────┬──────┘
                           │
                           ▼
┌─────────────┐     ┌─────────────┐
│  Updated    │◄────│  Component  │
│  UI State   │     │  State      │
└─────────────┘     └─────────────┘
```

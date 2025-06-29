# Template Usage Examples

## Quick Start

### 1. React Component
```bash
# Simple component
python orchestrator/run.py compile "Create a ProductCard component that displays product name, price, and image"

# Complex component with specific requirements
python orchestrator/run.py compile "Create a FilterPanel component with:
- Category dropdown (categories: electronics, furniture, accessories)
- Price range slider (0-10000)
- Sort options (price, name, rating)
- Apply and Reset buttons
- Emits filter change events"
```

### 2. API Endpoint
```bash
# Basic endpoint
python orchestrator/run.py compile "Create POST /api/contact endpoint that accepts name, email, message and sends email"

# Complex endpoint with validation
python orchestrator/run.py compile "Create PUT /api/products/:id endpoint that:
- Validates product data (name required, price > 0)
- Checks authorization
- Updates product in database
- Returns updated product with timestamp"
```

### 3. Utility Function
```bash
# Simple utility
python orchestrator/run.py compile "Create formatCurrency function that formats numbers as USD currency"

# Complex utility with edge cases
python orchestrator/run.py compile "Create deepMerge function that:
- Recursively merges two objects
- Arrays are concatenated, not merged
- Null values are preserved
- Functions are copied by reference
- Handles circular references"
```

### 4. Data Integration
```bash
# API to component integration
python orchestrator/run.py compile "Create integration that:
- Fetches products from /api/products
- Transforms snake_case to camelCase
- Adds calculated fields (discountPercentage)
- Provides useProducts hook for React components"
```

### 5. Add Types Refactor
```bash
# Add types to existing file
python orchestrator/run.py compile "Add TypeScript types to src/utils/helpers.js"
```

## Template Variable Mapping

The orchestrator should parse these natural language requests and map to template variables:

### React Component Example
Input: "Create a ProductCard component that displays product name, price, and image"

Maps to:
```yaml
template: feature/react-component
variables:
  component_name: "ProductCard"
  component_description: "Displays product name, price, and image"
  category: "products"
  props:
    - name: "product"
      type: "IProduct"
      description: "Product data to display"
  ui_elements:
    - "Product image"
    - "Product name"
    - "Product price"
  behavior_description: "Renders product information in a card layout"
```

### API Endpoint Example
Input: "Create POST /api/contact endpoint that accepts name, email, message"

Maps to:
```yaml
template: feature/api-endpoint
variables:
  endpoint_name: "Contact Form Submission"
  endpoint_description: "Accepts contact form data and sends email"
  http_method: "POST"
  endpoint_path: "contact"
  auth_required: false
  request_schema: |
    interface ContactRequest {
      name: string;
      email: string;
      message: string;
    }
  response_schema: |
    interface ContactResponse {
      success: boolean;
      message: string;
      id?: string;
    }
```

## Multi-Step Task Example

For complex features, break into multiple tasks:

```bash
# Main goal
python orchestrator/run.py compile "Build a product search feature with filters"

# Generates taskgraph.json:
{
  "tasks": [
    {
      "id": "01-search-api",
      "template": "feature/api-endpoint",
      "description": "Create search API endpoint",
      "dependencies": []
    },
    {
      "id": "02-search-types",
      "template": "function/utility",
      "description": "Create type definitions and interfaces",
      "dependencies": []
    },
    {
      "id": "03-search-integration",
      "template": "feature/data-integration",
      "description": "Create data fetching and transformation",
      "dependencies": ["02-search-types"]
    },
    {
      "id": "04-filter-component",
      "template": "feature/react-component",
      "description": "Create SearchFilters component",
      "dependencies": ["02-search-types"]
    },
    {
      "id": "05-results-component",
      "template": "feature/react-component", 
      "description": "Create SearchResults component",
      "dependencies": ["02-search-types", "03-search-integration"]
    },
    {
      "id": "06-search-page",
      "template": "feature/react-component",
      "description": "Create main Search page combining all components",
      "dependencies": ["04-filter-component", "05-results-component"]
    }
  ]
}
```

## Template Customization

### Adding Project-Specific Context
Before running templates, the orchestrator should inject:

1. **Available types/interfaces** from `src/types/`
2. **Existing utilities** from `src/utils/`
3. **Component library** from `src/components/`
4. **API patterns** from existing endpoints
5. **Styling variables** from SCSS files

### Dynamic Template Selection
Based on keywords in the task:
- "component" → react-component template
- "API" or "endpoint" → api-endpoint template
- "fetch" + "transform" → data-integration template
- "function" or "helper" → utility template
- "add types" → add-types template

## Validation After Generation

Each generated file should be validated:

```bash
# 1. TypeScript check
npx tsc --noEmit tasks/01-search-api/output/api/search.ts

# 2. Functional programming check
node scripts/code-review-agent.js --file tasks/01-search-api/output/api/search.ts --ai-mode --format minimal

# 3. Linting
npx eslint tasks/01-search-api/output/

# 4. Test generation (if applicable)
npm test tasks/01-search-api/output/
```

## Best Practices

1. **Start with single tasks** to test templates
2. **Review generated code** before merging
3. **Iterate on templates** based on output quality
4. **Build template library** from successful patterns
5. **Version control templates** for consistency
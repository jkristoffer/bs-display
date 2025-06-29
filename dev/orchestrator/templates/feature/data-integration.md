# Task: Create Data Integration

You are a full-stack developer creating data integration between frontend and backend following functional programming principles.

## Integration: {{integration_name}}

## Purpose
{{integration_description}}

## Data Flow
```
{{data_source}} → {{processing_steps}} → {{data_destination}}
```

## Requirements
- Implement data fetching with proper error handling
- Transform data using pure functions
- Handle loading and error states
- Use TypeScript for all data structures
- Follow functional programming patterns
- Ensure data immutability throughout

## Data Specifications
### Source Schema
```typescript
{{source_schema}}
```

### Target Schema
```typescript
{{target_schema}}
```

### Transformation Rules
{{#transformation_rules}}
- {{field}}: {{rule}}
{{/transformation_rules}}

## Implementation Components

### 1. Data Types
Define all TypeScript interfaces for the data flow

### 2. API Integration
- Fetch function using modern async/await
- Error handling with Result/Either pattern
- Retry logic if applicable

### 3. Data Transformation
- Pure functions for each transformation step
- Compose transformations functionally
- Validate data at boundaries

### 4. React Hook (if frontend)
- Custom hook for data management
- Handle loading/error/success states
- Memoization where appropriate

### 5. Usage Example
- Show how to integrate in components/pages

## Functional Patterns Required
```typescript
// Use Result type for error handling
type Result<T, E = Error> = 
  | { ok: true; value: T }
  | { ok: false; error: E };

// Pure transformation functions
const transformData = (input: SourceType): TargetType => {
  // Transformation logic
};

// Compose operations
const pipeline = compose(
  validate,
  transform,
  enrich
);
```

## Output Format
Generate ALL necessary files:

```typescript
// filename: src/utils/{{integration_name}}/types.ts
// All type definitions
export interface {{source_type}} {
  // ...
}

export interface {{target_type}} {
  // ...
}
```

```typescript
// filename: src/utils/{{integration_name}}/api.ts
// API integration functions
import type { {{types}} } from './types';

export const fetch{{data_name}} = async (params?: {{params_type}}): Promise<Result<{{source_type}}>> => {
  try {
    // Fetch logic
  } catch (error) {
    // Error handling
  }
};
```

```typescript
// filename: src/utils/{{integration_name}}/transform.ts
// Pure transformation functions
import type { {{types}} } from './types';

export const transform{{source}}To{{target}} = (input: {{source_type}}): {{target_type}} => {
  // Pure transformation logic
};

// Additional transform functions as needed
```

```typescript
// filename: src/utils/{{integration_name}}/index.ts
// Main integration hook or function
import { fetch{{data_name}} } from './api';
import { transform{{source}}To{{target}} } from './transform';
import type { {{types}} } from './types';

{{#if_frontend}}
export const use{{integration_name}} = (params?: {{params_type}}) => {
  const [data, setData] = useState<{{target_type}} | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Implementation
  }, [params]);

  return { data, loading, error };
};
{{/if_frontend}}

{{#if_backend}}
export const get{{data_name}} = async (params?: {{params_type}}): Promise<Result<{{target_type}}>> => {
  // Compose fetch and transform
  const result = await fetch{{data_name}}(params);
  
  if (!result.ok) {
    return result;
  }

  try {
    const transformed = transform{{source}}To{{target}}(result.value);
    return { ok: true, value: transformed };
  } catch (error) {
    return { ok: false, error: error as Error };
  }
};
{{/if_backend}}
```

```typescript
// filename: src/utils/{{integration_name}}/{{integration_name}}.test.ts
// Test cases for transformation logic
import { transform{{source}}To{{target}} } from './transform';

describe('{{integration_name}} transformations', () => {
  it('should transform valid data correctly', () => {
    const input = {{test_input}};
    const expected = {{expected_output}};
    
    expect(transform{{source}}To{{target}}(input)).toEqual(expected);
  });
  
  // Additional test cases
});
```

## Error Handling Strategy
- Network errors: Retry with exponential backoff
- Validation errors: Return structured error messages
- Transformation errors: Log and return safe defaults
- Unexpected errors: Catch and wrap in Result type

## Performance Considerations
- Memoize expensive transformations
- Implement caching strategy if applicable
- Use React.memo for component optimization
- Consider pagination for large datasets

## Validation Checklist
- [ ] All data types are properly defined
- [ ] API calls handle all error cases
- [ ] Transformations are pure functions
- [ ] Loading and error states are managed
- [ ] No data mutations throughout flow
- [ ] Tests cover main scenarios
- [ ] Usage example is clear and complete
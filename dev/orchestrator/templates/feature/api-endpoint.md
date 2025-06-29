# Task: Create API Endpoint

You are a backend developer creating an API endpoint following functional programming principles.

## Endpoint: {{endpoint_name}}

## Purpose
{{endpoint_description}}

## Specifications
- **Method**: {{http_method}}
- **Path**: `/api/{{endpoint_path}}`
- **Authentication**: {{auth_required}}

## Request/Response Schema
### Request Body
```typescript
{{request_schema}}
```

### Response Format
```typescript
{{response_schema}}
```

### Error Responses
- 400: Invalid input
- 401: Unauthorized (if auth required)
- 500: Server error

## Requirements
- Use functional programming patterns
- Proper input validation
- Error handling with appropriate status codes
- TypeScript types for all data
- Follow RESTful conventions
- Secure against common vulnerabilities

## Project Context
- **Framework**: Astro API routes
- **Validation**: Use built-in validation or Zod
- **Database**: {{database_type}}
- **Authentication**: {{auth_method}}

## Implementation Pattern
```typescript
// Use this functional pattern
import type { APIRoute } from 'astro';

export const {{http_method}}: APIRoute = async ({ request, params }) => {
  // 1. Parse and validate input
  // 2. Process request (pure functions)
  // 3. Return appropriate response
};
```

## Functional Programming Requirements
- NO direct mutations of request/response objects
- Use pure functions for business logic
- Separate validation, processing, and response formatting
- Handle errors functionally (no throw in business logic)

## Security Checklist
- [ ] Input validation implemented
- [ ] SQL injection prevention (if applicable)
- [ ] Rate limiting considered
- [ ] Sensitive data not logged
- [ ] CORS headers appropriate

## Output Format
Generate the complete API endpoint file:

```typescript
// filename: src/pages/api/{{endpoint_path}}.ts
import type { APIRoute } from 'astro';

// Type definitions
interface {{request_type}} {
  // Request types
}

interface {{response_type}} {
  // Response types
}

// Validation functions (pure)
const validate{{request_type}} = (data: unknown): {{request_type}} | null => {
  // Validation logic
};

// Business logic (pure functions)
const process{{business_logic}} = (input: {{request_type}}): {{response_type}} => {
  // Core logic here
};

// API handler
export const {{http_method}}: APIRoute = async ({ request, params }) => {
  try {
    // 1. Parse request
    const body = await request.json();
    
    // 2. Validate
    const validatedInput = validate{{request_type}}(body);
    if (!validatedInput) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 3. Process
    const result = process{{business_logic}}(validatedInput);
    
    // 4. Return response
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```

## Example Usage
```bash
curl -X {{http_method}} http://localhost:3000/api/{{endpoint_path}} \
  -H "Content-Type: application/json" \
  -d '{{example_request}}'
```

## Testing Considerations
- Test with valid input
- Test with invalid input
- Test error scenarios
- Test edge cases
- Verify response format
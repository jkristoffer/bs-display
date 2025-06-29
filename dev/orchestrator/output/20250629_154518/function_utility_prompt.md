# Task: Create Utility Function

You are a functional programming expert creating a utility function for the project.

## Function: searchFAQs

## Purpose
Searches FAQ items by question or answer content

## Function Signature
```typescript
(faqs: FAQ[], searchTerm: string): FAQ[]
```

## Detailed Specifications
### Inputs
- `faqs`: FAQ[] - Array of FAQ items to search Non-empty array
- `searchTerm`: string - Search query string Case-insensitive search

### Output
- **Type**: FAQ[]
- **Description**: Filtered FAQ items matching search term

### Behavior
Performs case-insensitive search across question and answer fields. Returns empty array if no matches. Trims search term before matching.

### Edge Cases
- Empty search term: Return all FAQs
- No matches found: Return empty array

## Requirements
- MUST be a pure function (no side effects)
- Full TypeScript type annotations
- Handle null/undefined gracefully
- Include JSDoc documentation
- Follow functional programming principles
- Include at least 3 test cases in comments

## Implementation Guidelines
### Functional Patterns to Use
- Use const for all variables
- Prefer array methods (map, filter, reduce) over loops
- Use spread operators for immutability
- Return early for guard clauses
- Compose smaller functions if complexity grows

### Anti-patterns to Avoid
- NO mutations of input parameters
- NO external dependencies (file system, network, etc.)
- NO random values or timestamps inside function
- NO console.log or debugging statements
- NO use of 'any' type

## Code Structure
```typescript
/**
 * Searches FAQ items by question or answer content
 * @param {{param_name}} - {{param_description}}
 * @returns {{return_description}}
 * @example
 * {{example_usage}}
 */
export const searchFAQs = ({{parameters}}): {{return_type}} => {
  // Implementation
};
```

## Output Format
Generate the complete utility function with tests:

```typescript
// filename: src/utils/searchFAQs.ts
{{#imports_needed}}
import { {{.}} } from '{{source}}';
{{/imports_needed}}

/**
 * Searches FAQ items by question or answer content
 * 
 * @param {{param_documentation}}
 * @returns {{return_documentation}}
 * 
 * @example
 * ```typescript
 * const result = searchFAQs({{example_input}});
 * console.log(result); // {{example_output}}
 * ```
 */
export const searchFAQs = ({{typed_parameters}}): {{return_type}} => {
  // Guard clauses first
  
  // Core logic (functional approach)
  
  // Return result
};

// Type guards or helper functions if needed
{{#helper_functions}}
const {{helper_name}} = ({{helper_params}}): {{helper_return}} => {
  // Helper implementation
};
{{/helper_functions}}

/* Test cases (for reference)
describe('searchFAQs', () => {
  it('should handle normal case', () => {
    expect(searchFAQs({{test_input_1}})).toEqual({{expected_1}});
  });
  
  it('should handle edge case', () => {
    expect(searchFAQs({{test_input_2}})).toEqual({{expected_2}});
  });
  
  it('should handle error case', () => {
    expect(searchFAQs({{test_input_3}})).toEqual({{expected_3}});
  });
});
*/
```

## Examples
### Input/Output Examples
**Input**: `[{question: 'What is a smartboard?', answer: '...'}, {question: 'How to install?', answer: '...'}], 'smart'`
**Output**: `[{question: 'What is a smartboard?', answer: '...'}]`
**Explanation**: Matches 'smart' in question

## Performance Considerations
- Time complexity should be: O(n)
- Space complexity should be: O(n)
- Optimize for: Readability and accuracy

## Validation Checklist
- [ ] Function is pure (no side effects)
- [ ] All parameters have explicit types
- [ ] Return type is explicit
- [ ] JSDoc is complete and accurate
- [ ] Edge cases are handled
- [ ] No mutations of inputs
- [ ] Test cases cover main scenarios
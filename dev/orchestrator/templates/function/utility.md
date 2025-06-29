# Task: Create Utility Function

You are a functional programming expert creating a utility function for the project.

## Function: {{function_name}}

## Purpose
{{function_description}}

## Function Signature
```typescript
{{function_signature}}
```

## Detailed Specifications
### Inputs
{{#inputs}}
- `{{name}}`: {{type}} - {{description}} {{constraints}}
{{/inputs}}

### Output
- **Type**: {{output_type}}
- **Description**: {{output_description}}

### Behavior
{{detailed_behavior}}

### Edge Cases
{{#edge_cases}}
- {{condition}}: {{expected_behavior}}
{{/edge_cases}}

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
 * {{function_description}}
 * @param {{param_name}} - {{param_description}}
 * @returns {{return_description}}
 * @example
 * {{example_usage}}
 */
export const {{function_name}} = ({{parameters}}): {{return_type}} => {
  // Implementation
};
```

## Output Format
Generate the complete utility function with tests:

```typescript
// filename: src/utils/{{function_name}}.ts
{{#imports_needed}}
import { {{.}} } from '{{source}}';
{{/imports_needed}}

/**
 * {{function_description}}
 * 
 * @param {{param_documentation}}
 * @returns {{return_documentation}}
 * 
 * @example
 * ```typescript
 * const result = {{function_name}}({{example_input}});
 * console.log(result); // {{example_output}}
 * ```
 */
export const {{function_name}} = ({{typed_parameters}}): {{return_type}} => {
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
describe('{{function_name}}', () => {
  it('should handle normal case', () => {
    expect({{function_name}}({{test_input_1}})).toEqual({{expected_1}});
  });
  
  it('should handle edge case', () => {
    expect({{function_name}}({{test_input_2}})).toEqual({{expected_2}});
  });
  
  it('should handle error case', () => {
    expect({{function_name}}({{test_input_3}})).toEqual({{expected_3}});
  });
});
*/
```

## Examples
### Input/Output Examples
{{#examples}}
**Input**: `{{input}}`
**Output**: `{{output}}`
**Explanation**: {{explanation}}

{{/examples}}

## Performance Considerations
- Time complexity should be: {{time_complexity}}
- Space complexity should be: {{space_complexity}}
- Optimize for: {{optimization_priority}}

## Validation Checklist
- [ ] Function is pure (no side effects)
- [ ] All parameters have explicit types
- [ ] Return type is explicit
- [ ] JSDoc is complete and accurate
- [ ] Edge cases are handled
- [ ] No mutations of inputs
- [ ] Test cases cover main scenarios
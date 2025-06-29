#!/usr/bin/env python3
"""
Test utility function template
"""

import json
from pathlib import Path

# Test case data for groupBy utility
test_case = {
    "id": "test-004",
    "template": "function/utility",
    "input": {
        "function_name": "groupBy",
        "function_description": "Groups array items by a key selector function",
        "function_signature": "<T, K extends string | number>(items: T[], keySelector: (item: T) => K): Record<K, T[]>",
        "inputs": [
            {
                "name": "items",
                "type": "T[]",
                "description": "Array to group",
                "constraints": "Can contain null/undefined values"
            },
            {
                "name": "keySelector",
                "type": "(item: T) => K",
                "description": "Function to extract grouping key",
                "constraints": "Must return string or number"
            }
        ],
        "output_type": "Record<K, T[]>",
        "output_description": "Object with arrays grouped by key",
        "detailed_behavior": "Groups array elements by the key returned from keySelector. Filters out null/undefined items. Returns empty object for empty input.",
        "edge_cases": [
            {
                "condition": "Empty array",
                "expected_behavior": "Returns empty object {}"
            },
            {
                "condition": "Null/undefined items",
                "expected_behavior": "Filters out null/undefined before grouping"
            }
        ],
        "examples": [
            {
                "input": "[{name: 'John', age: 25}, {name: 'Jane', age: 25}, {name: 'Bob', age: 30}]",
                "output": "{ 25: [{name: 'John', age: 25}, {name: 'Jane', age: 25}], 30: [{name: 'Bob', age: 30}] }",
                "explanation": "Groups people by age"
            }
        ],
        "time_complexity": "O(n)",
        "space_complexity": "O(n)",
        "optimization_priority": "Readability and type safety"
    }
}

def test_utility_template():
    """Test utility function template"""
    print("🧪 Testing Utility Function Template")
    print("="*50)
    
    # Load template
    template_path = Path("../templates/function/utility.md")
    
    if not template_path.exists():
        print(f"❌ Template not found: {template_path}")
        return
        
    with open(template_path, 'r') as f:
        template = f.read()
    
    print(f"✅ Template loaded: {template_path}")
    print(f"📏 Template size: {len(template)} characters")
    
    # Basic variable substitution
    test_vars = {
        "{{function_name}}": test_case["input"]["function_name"],
        "{{function_description}}": test_case["input"]["function_description"],
        "{{function_signature}}": test_case["input"]["function_signature"],
        "{{output_type}}": test_case["input"]["output_type"],
        "{{output_description}}": test_case["input"]["output_description"],
        "{{detailed_behavior}}": test_case["input"]["detailed_behavior"],
        "{{time_complexity}}": test_case["input"]["time_complexity"],
        "{{space_complexity}}": test_case["input"]["space_complexity"],
        "{{optimization_priority}}": test_case["input"]["optimization_priority"]
    }
    
    rendered = template
    for var, value in test_vars.items():
        count = rendered.count(var)
        if count > 0:
            rendered = rendered.replace(var, value)
            print(f"✅ Replaced {var} ({count} occurrences)")
    
    # Save rendered template
    output_path = Path("test-runs/test-004-rendered.md")
    output_path.parent.mkdir(exist_ok=True)
    
    with open(output_path, 'w') as f:
        f.write(rendered)
    
    print(f"\n💾 Saved rendered template to: {output_path}")
    
    # Generate mock output
    mock_output = generate_mock_utility()
    
    # Save mock output
    output_files = Path("test-runs/test-004-output")
    output_files.mkdir(parents=True, exist_ok=True)
    
    # Save utility file
    utility_file = output_files / "groupBy.ts"
    with open(utility_file, 'w') as f:
        f.write(mock_output["utility"])
    
    print(f"✅ Created mock utility: {utility_file}")
    
    # Run validation
    print("\n🔍 Running Validation Checks:")
    
    content = utility_file.read_text()
    checks = {
        "Has export const": "export const groupBy" in content,
        "Has generic types": "<T, K extends" in content,
        "Has JSDoc": "/**" in content and "*/" in content,
        "Uses reduce": ".reduce(" in content,
        "No mutations": "push(" not in content or "acc[key] = acc[key] || []" in content,
        "No for loops": "for (" not in content,
        "No any type": ": any" not in content
    }
    
    for check, passed in checks.items():
        print(f"{'✅' if passed else '❌'} {check}")
    
    # Calculate score
    passed_checks = sum(1 for p in checks.values() if p)
    score = (passed_checks / len(checks)) * 100
    
    print(f"\n📊 Validation Score: {score:.0f}/100")
    print(f"   Status: {'✅ PASSED' if score >= 70 else '❌ FAILED'}")

def generate_mock_utility():
    """Generate mock utility function output"""
    utility = """/**
 * Groups array items by a key selector function
 * 
 * @param items - Array to group (Can contain null/undefined values)
 * @param keySelector - Function to extract grouping key (Must return string or number)
 * @returns Object with arrays grouped by key
 * 
 * @example
 * const people = [{name: 'John', age: 25}, {name: 'Jane', age: 25}, {name: 'Bob', age: 30}];
 * const grouped = groupBy(people, person => person.age);
 * // Result: { 25: [{name: 'John', age: 25}, {name: 'Jane', age: 25}], 30: [{name: 'Bob', age: 30}] }
 * 
 * @complexity Time: O(n), Space: O(n)
 */
export const groupBy = <T, K extends string | number>(
    items: T[],
    keySelector: (item: T) => K
): Record<K, T[]> => {
    return items
        .filter((item): item is T => item !== null && item !== undefined)
        .reduce((acc, item) => {
            const key = keySelector(item);
            return {
                ...acc,
                [key]: [...(acc[key] || []), item]
            };
        }, {} as Record<K, T[]>);
};
"""
    
    return {"utility": utility}

if __name__ == "__main__":
    test_utility_template()
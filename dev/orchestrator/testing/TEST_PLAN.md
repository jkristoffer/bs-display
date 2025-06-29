# AI Task Compiler Template Testing Plan

## 📋 Overview

This plan outlines the systematic testing of all templates, cleanup procedures, and scoring metrics to validate template quality and effectiveness.

## 🎯 Testing Goals

1. **Validate template output quality** - Does it generate correct, working code?
2. **Measure functional programming compliance** - Does it follow FP principles?
3. **Verify project standards adherence** - Does it match existing patterns?
4. **Assess completeness** - Are all required files generated?
5. **Evaluate Claude comprehension** - Can Claude understand and use the templates?

## 🧪 Test Structure

### Test Directory
```
orchestrator/testing/
├── test-runs/              # Temporary test outputs
│   ├── test-001-react-component/
│   ├── test-002-api-endpoint/
│   └── ...
├── test-cases/             # Input scenarios
│   ├── react-component.yaml
│   ├── api-endpoint.yaml
│   └── ...
├── results/                # Test results and scores
│   ├── test-001-results.json
│   └── summary.json
├── TEST_PLAN.md           # This file
├── run-tests.py           # Test runner script
└── cleanup.sh             # Cleanup script
```

## 📊 Scoring Metrics

### 1. **Code Quality Score (40%)**
- **Syntax Validity** (10%): Does it compile/parse without errors?
- **Type Safety** (10%): Are all TypeScript types properly defined?
- **Functional Programming** (20%): Score from code review agent

### 2. **Completeness Score (30%)**
- **Required Files** (15%): All expected files generated?
- **Code Completeness** (15%): All required sections present?

### 3. **Standards Compliance (20%)**
- **Naming Conventions** (10%): Follow project patterns?
- **File Structure** (10%): Correct directory placement?

### 4. **Usability Score (10%)**
- **Example Usage** (5%): Is example code provided?
- **Documentation** (5%): Are comments/docs adequate?

### Total Score Calculation
```
Total = (Code Quality × 0.4) + (Completeness × 0.3) + (Standards × 0.2) + (Usability × 0.1)
```

### Score Thresholds
- **90-100**: Production Ready ✅
- **80-89**: Minor Issues ⚠️
- **70-79**: Needs Work ⚠️
- **Below 70**: Major Issues ❌

## 🔄 Test Cases

### Test Case 1: React Component (Simple)
```yaml
id: test-001
template: feature/react-component
input:
  component_name: "TestButton"
  component_description: "A simple button component for testing"
  category: "common"
  props:
    - name: "label"
      type: "string"
      description: "Button text"
    - name: "onClick"
      type: "() => void"
      description: "Click handler"
  behavior_description: "Renders a button with label and handles clicks"
  ui_elements:
    - "Button element"
    - "Optional loading spinner"
expected_outputs:
  - "src/components/common/TestButton/TestButton.tsx"
  - "src/components/common/TestButton/TestButton.module.scss"
  - "src/components/common/TestButton/index.ts"
```

### Test Case 2: React Component (Complex)
```yaml
id: test-002
template: feature/react-component
input:
  component_name: "ProductFilter"
  component_description: "Advanced filtering component with multiple controls"
  category: "products"
  props:
    - name: "categories"
      type: "Category[]"
      description: "Available categories"
    - name: "priceRange"
      type: "{ min: number; max: number }"
      description: "Price filter range"
    - name: "onFilterChange"
      type: "(filters: ProductFilters) => void"
      description: "Filter change callback"
  behavior_description: "Complex filtering with state management and validation"
  ui_elements:
    - "Category checkboxes"
    - "Price range slider"
    - "Search input"
    - "Reset button"
    - "Apply button"
```

### Test Case 3: API Endpoint
```yaml
id: test-003
template: feature/api-endpoint
input:
  endpoint_name: "Product Search"
  endpoint_description: "Search products with filters"
  http_method: "POST"
  endpoint_path: "products/search"
  auth_required: false
  request_schema: |
    interface SearchRequest {
      query?: string;
      categories?: string[];
      priceRange?: { min: number; max: number };
      limit?: number;
      offset?: number;
    }
  response_schema: |
    interface SearchResponse {
      products: Product[];
      total: number;
      page: number;
      pageSize: number;
    }
```

### Test Case 4: Utility Function
```yaml
id: test-004
template: function/utility
input:
  function_name: "groupBy"
  function_description: "Groups array items by a key selector function"
  function_signature: "<T, K extends string | number>(items: T[], keySelector: (item: T) => K): Record<K, T[]>"
  inputs:
    - name: "items"
      type: "T[]"
      description: "Array to group"
    - name: "keySelector"
      type: "(item: T) => K"
      description: "Function to extract grouping key"
  output_type: "Record<K, T[]>"
  output_description: "Object with arrays grouped by key"
  detailed_behavior: "Groups array elements by the key returned from keySelector"
  edge_cases:
    - condition: "Empty array"
      expected_behavior: "Returns empty object"
    - condition: "Null/undefined items"
      expected_behavior: "Filters out null/undefined"
```

### Test Case 5: Add Types
```yaml
id: test-005
template: refactor/add-types
input:
  file_path: "test-files/untyped-utils.js"
  goals:
    - "Add TypeScript types to all functions"
    - "Create interfaces for complex objects"
  issues:
    - "No type annotations"
    - "Using 'any' implicitly"
  type_hints:
    - variable: "products"
      suggested_type: "Product[]"
      reason: "Array of product objects"
```

## 🔧 Test Execution Process

### 1. Setup Phase
```bash
# Create test environment
mkdir -p orchestrator/testing/test-runs
mkdir -p orchestrator/testing/results

# Copy test files if needed
cp orchestrator/testing/test-files/* orchestrator/testing/test-runs/
```

### 2. Execution Phase
```python
# run-tests.py
for test_case in test_cases:
    # 1. Create test directory
    test_dir = f"test-runs/{test_case.id}-{test_case.template}"
    
    # 2. Generate prompt from template
    prompt = render_template(test_case.template, test_case.input)
    
    # 3. Execute with Claude
    output = run_claude_cli(prompt)
    
    # 4. Save outputs
    save_outputs(test_dir, output)
    
    # 5. Run validations
    scores = run_validations(test_dir, test_case)
    
    # 6. Save results
    save_results(test_case.id, scores)
```

### 3. Validation Phase

#### Code Quality Validation
```bash
# TypeScript check
npx tsc --noEmit test-runs/test-001/TestButton.tsx

# Functional programming check
node scripts/code-review-agent.js --file test-runs/test-001/TestButton.tsx --ai-mode --format json

# Linting
npx eslint test-runs/test-001/
```

#### Completeness Validation
```python
def check_completeness(test_dir, expected_outputs):
    scores = {}
    for expected_file in expected_outputs:
        file_path = os.path.join(test_dir, expected_file)
        if os.path.exists(file_path):
            scores[expected_file] = 100
            # Check for required sections
            content = read_file(file_path)
            if is_typescript_file(file_path):
                if not has_types(content):
                    scores[expected_file] -= 20
                if not has_exports(content):
                    scores[expected_file] -= 10
        else:
            scores[expected_file] = 0
    return sum(scores.values()) / len(scores)
```

## 🧹 Cleanup Plan

### Automated Cleanup Script
```bash
#!/bin/bash
# cleanup.sh

# Configuration
KEEP_RESULTS=true
KEEP_SUCCESSFUL_OUTPUTS=false
ARCHIVE_FAILED_TESTS=true

echo "🧹 Starting cleanup process..."

# 1. Archive test results
if [ "$KEEP_RESULTS" = true ]; then
    timestamp=$(date +%Y%m%d_%H%M%S)
    mkdir -p orchestrator/testing/archives/$timestamp
    cp -r orchestrator/testing/results/* orchestrator/testing/archives/$timestamp/
    echo "✅ Results archived to archives/$timestamp"
fi

# 2. Process test runs
for test_dir in orchestrator/testing/test-runs/*; do
    if [ -d "$test_dir" ]; then
        test_id=$(basename "$test_dir")
        result_file="orchestrator/testing/results/${test_id}-results.json"
        
        if [ -f "$result_file" ]; then
            score=$(jq -r '.total_score' "$result_file")
            
            if (( $(echo "$score >= 90" | bc -l) )); then
                # Successful test
                if [ "$KEEP_SUCCESSFUL_OUTPUTS" = true ]; then
                    echo "✅ Keeping successful test: $test_id (score: $score)"
                else
                    rm -rf "$test_dir"
                    echo "🗑️  Removed successful test: $test_id"
                fi
            else
                # Failed test
                if [ "$ARCHIVE_FAILED_TESTS" = true ]; then
                    mkdir -p orchestrator/testing/failed-tests
                    mv "$test_dir" orchestrator/testing/failed-tests/
                    echo "📦 Archived failed test: $test_id (score: $score)"
                else
                    rm -rf "$test_dir"
                    echo "🗑️  Removed failed test: $test_id"
                fi
            fi
        fi
    fi
done

# 3. Clean temporary files
find orchestrator/testing -name "*.tmp" -delete
find orchestrator/testing -name ".DS_Store" -delete

# 4. Generate summary report
echo "📊 Generating summary report..."
python orchestrator/testing/generate-summary.py

echo "✅ Cleanup complete!"
```

### Manual Cleanup Checklist
- [ ] Review failed tests for template improvements
- [ ] Update templates based on common failures
- [ ] Archive successful test outputs as examples
- [ ] Clear Claude conversation history if needed
- [ ] Update test cases based on findings

## 📈 Results Tracking

### Individual Test Result Format
```json
{
  "test_id": "test-001",
  "template": "feature/react-component",
  "timestamp": "2024-01-20T10:30:00Z",
  "scores": {
    "code_quality": {
      "syntax_validity": 100,
      "type_safety": 90,
      "functional_programming": 85,
      "total": 87.5
    },
    "completeness": {
      "required_files": 100,
      "code_completeness": 95,
      "total": 97.5
    },
    "standards_compliance": {
      "naming_conventions": 100,
      "file_structure": 90,
      "total": 95
    },
    "usability": {
      "example_usage": 100,
      "documentation": 80,
      "total": 90
    },
    "total_score": 91.5
  },
  "issues": [
    "Missing JSDoc for some functions",
    "Could use more specific types instead of 'unknown'"
  ],
  "recommendations": [
    "Add more comprehensive error handling",
    "Include unit test examples"
  ]
}
```

### Summary Report Format
```json
{
  "test_run_id": "2024-01-20-run-001",
  "total_tests": 10,
  "passed": 8,
  "failed": 2,
  "average_score": 86.3,
  "by_template": {
    "feature/react-component": {
      "tests": 3,
      "average_score": 92.1,
      "common_issues": ["Missing loading states"]
    },
    "feature/api-endpoint": {
      "tests": 2,
      "average_score": 88.5,
      "common_issues": ["Incomplete error handling"]
    }
  },
  "recommendations": [
    "Update react-component template to include loading state pattern",
    "Add more explicit error handling examples to api-endpoint template"
  ]
}
```

## 🚀 Continuous Improvement

### After Each Test Run:
1. **Analyze Failures**: Identify common patterns in failed tests
2. **Update Templates**: Improve prompts based on failures
3. **Refine Scoring**: Adjust weights if scoring seems off
4. **Document Learnings**: Keep a log of what works/doesn't work
5. **Version Templates**: Track template improvements over time

### Success Criteria
- **Initial Goal**: 80% of tests pass with score ≥ 80
- **Mature Goal**: 95% of tests pass with score ≥ 90
- **Template Stability**: <5% change in template success rate between runs

## 🔄 Test Schedule

### Initial Testing Phase (Week 1)
- Day 1-2: Test all templates with simple cases
- Day 3-4: Test with complex cases
- Day 5: Analyze results and update templates

### Ongoing Testing
- **Daily**: Quick smoke test with 1 simple case per template
- **Weekly**: Full test suite run
- **Monthly**: Add new test cases based on real usage

### Test Case Evolution
- Start with provided test cases
- Add cases from actual usage
- Create edge case tests
- Build regression test suite
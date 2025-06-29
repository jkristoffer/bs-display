# AI Task Compiler

A lean orchestrator that breaks down high-level development goals into Claude-executable subtasks using templates and functional programming principles.

## Quick Start

```bash
# Make the script executable
chmod +x run.py

# List available templates
./run.py --list-templates

# Run a simple task
./run.py --task "function/utility:function_name=debounce,function_description=Debounces function calls"

# Run with dry-run to see what would happen
./run.py --task "feature/react-component:component_name=Button,category=common" --dry-run

# Run a complete workflow
./run.py --workflow example-workflow.json

# Verbose mode for debugging
./run.py --workflow example-workflow.json --verbose
```

## How It Works

1. **Templates**: Predefined prompts with variables for common development tasks
2. **Rendering**: Variables are substituted with your inputs
3. **Execution**: Claude CLI is called with the rendered prompt
4. **Validation**: Output is checked against expected patterns
5. **Code Review**: Generated code is analyzed for quality and standards compliance

## Task Definition Format

### Single Task
```bash
./run.py --task "template_name:key1=value1,key2=value2"
```

### Workflow File
```json
{
  "name": "Feature Name",
  "tasks": [
    {
      "name": "Task 1",
      "template": "template_name",
      "inputs": {
        "key1": "value1",
        "key2": "value2"
      }
    }
  ]
}
```

## Available Templates

### feature/react-component
Creates a complete React component with TypeScript and SCSS module.

**Required inputs:**
- `component_name`: Name of the component
- `component_description`: What the component does
- `category`: Component category (e.g., common, user, products)

**Optional inputs:**
- `props`: Array of prop definitions
- `behavior_description`: Detailed behavior description
- `ui_elements`: List of UI elements in the component

### function/utility
Creates a pure utility function with TypeScript and JSDoc.

**Required inputs:**
- `function_name`: Name of the function
- `function_description`: What the function does
- `function_signature`: TypeScript signature

**Optional inputs:**
- `inputs`: Array of input parameter definitions
- `output_type`: Return type
- `detailed_behavior`: Detailed behavior description
- `edge_cases`: Array of edge case definitions
- `examples`: Usage examples

### feature/api-endpoint
Creates a RESTful API endpoint with validation.

**Required inputs:**
- `endpoint_path`: API path (e.g., /api/users)
- `method`: HTTP method (GET, POST, etc.)
- `endpoint_description`: What the endpoint does

### refactor/add-types
Adds TypeScript types to existing code.

**Required inputs:**
- `file_path`: Path to file needing types
- `type_requirements`: Description of needed types

### feature/data-integration
Creates data fetching and transformation logic.

**Required inputs:**
- `feature_name`: Name of the feature
- `data_source`: Where data comes from
- `transformation_description`: How to transform data

## Output Structure

```
output/
└── [session_id]/
    ├── results.json           # Complete results
    ├── [template]_prompt.md   # Rendered prompts
    └── [template]/            # Generated files
        ├── Component.tsx
        ├── Component.module.scss
        └── index.ts
```

## Logs

Detailed logs are saved to `logs/[session_id].log`. Use `--verbose` to see logs in console.

## Integration with Code Review

All generated code is automatically reviewed by the code review agent. Results include:
- Functional programming compliance score
- Type safety analysis
- Project standards adherence
- Overall code quality score

## Examples

### Create a Button Component
```bash
./run.py --task "feature/react-component:component_name=PrimaryButton,component_description=Primary action button with loading state,category=common"
```

### Create a Sorting Utility
```bash
./run.py --task "function/utility:function_name=sortBy,function_description=Sorts array by property accessor,function_signature=<T>(items: T[], accessor: (item: T) => any) => T[]"
```

### Run Complete Feature Workflow
```bash
./run.py --workflow example-workflow.json
```

## Troubleshooting

### Claude CLI Not Found
Ensure Claude CLI is installed and in your PATH:
```bash
which claude
```

### Template Not Found
Check available templates:
```bash
./run.py --list-templates
```

### Code Review Failing
Ensure the code review agent is accessible:
```bash
node ../scripts/code-review-agent.js --version
```

## Advanced Usage

### Custom Templates
Add new templates to `templates/` directory following the existing patterns.

### Workflow Composition
Create complex workflows by chaining multiple tasks that depend on each other.

### CI/CD Integration
Use the orchestrator in CI/CD pipelines for automated code generation:
```yaml
- name: Generate API Client
  run: python orchestrator/run.py --task "feature/api-client:api_spec=openapi.yaml"
```

## Best Practices

1. **Start Simple**: Use single tasks before creating workflows
2. **Dry Run First**: Always test with `--dry-run` for new templates
3. **Review Output**: Check generated code meets requirements
4. **Iterate Templates**: Refine templates based on output quality
5. **Version Control**: Commit successful templates and workflows

## Future Enhancements

- [ ] Template inheritance and composition
- [ ] Parallel task execution
- [ ] Dependency resolution between tasks
- [ ] Integration with project management tools
- [ ] Real-time progress monitoring
- [ ] Template marketplace
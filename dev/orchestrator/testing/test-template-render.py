#!/usr/bin/env python3
"""
Test template rendering without Claude CLI
"""

import yaml
import sys
from pathlib import Path

def render_template(template_path, inputs):
    """Simple template renderer for testing"""
    with open(template_path, 'r') as f:
        template = f.read()
    
    # Replace simple variables
    for key, value in inputs.items():
        if isinstance(value, str):
            template = template.replace(f"{{{{{key}}}}}", value)
        elif isinstance(value, list) and key == "props":
            # Handle props array
            props_text = ""
            for prop in value:
                props_text += f"- `{prop['name']}`: {prop['type']} - {prop['description']}\n"
            template = template.replace(f"{{{{#props}}}}", "").replace(f"{{{{/props}}}}", "")
            template = template.replace("{{.}}", props_text)
    
    return template

def main():
    # Load test case
    test_case_path = Path("test-cases/react-component-simple.yaml")
    with open(test_case_path, 'r') as f:
        test_case = yaml.safe_load(f)
    
    print(f"🧪 Testing template rendering for: {test_case['id']}")
    print(f"Template: {test_case['template']}")
    print("\n" + "="*50 + "\n")
    
    # Find template
    template_path = Path("../templates") / f"{test_case['template']}.md"
    
    if not template_path.exists():
        print(f"❌ Template not found: {template_path}")
        return
    
    # Render template
    rendered = render_template(template_path, test_case['input'])
    
    # Show first 1000 characters
    print("📄 Rendered template (first 1000 chars):")
    print("-"*50)
    print(rendered[:1000])
    print("...")
    print(f"\nTotal length: {len(rendered)} characters")

if __name__ == "__main__":
    main()
#!/usr/bin/env python3
"""
Simple test without external dependencies
"""

import json
from pathlib import Path

# Test case data (converted from YAML)
test_case = {
    "id": "test-001",
    "template": "feature/react-component",
    "input": {
        "component_name": "TestButton",
        "component_description": "A simple button component for testing",
        "category": "common",
        "props": [
            {
                "name": "label",
                "type": "string", 
                "description": "Button text to display"
            },
            {
                "name": "onClick",
                "type": "() => void",
                "description": "Click event handler"
            }
        ],
        "behavior_description": "Renders a button with label and handles clicks",
        "ui_elements": ["Button element", "Loading spinner"]
    }
}

def test_template_rendering():
    """Test basic template rendering"""
    print("🧪 Testing AI Task Compiler Templates")
    print("="*50)
    
    # Load template
    template_path = Path("../templates/feature/react-component.md")
    
    if not template_path.exists():
        print(f"❌ Template not found: {template_path}")
        return
        
    with open(template_path, 'r') as f:
        template = f.read()
    
    print(f"✅ Template loaded: {template_path}")
    print(f"📏 Template size: {len(template)} characters")
    
    # Basic variable substitution test
    test_vars = {
        "{{component_name}}": test_case["input"]["component_name"],
        "{{component_description}}": test_case["input"]["component_description"],
        "{{category}}": test_case["input"]["category"]
    }
    
    rendered = template
    for var, value in test_vars.items():
        count = rendered.count(var)
        rendered = rendered.replace(var, value)
        if count > 0:
            print(f"✅ Replaced {var} ({count} occurrences)")
    
    # Check if all required variables were found
    remaining_vars = rendered.count("{{")
    print(f"\n📊 Template Variables Status:")
    print(f"   Replaced: {len(test_vars)} variables")
    print(f"   Remaining: {remaining_vars} template variables")
    
    # Save rendered template
    output_path = Path("test-runs/test-001-rendered.md")
    output_path.parent.mkdir(exist_ok=True)
    
    with open(output_path, 'w') as f:
        f.write(rendered)
    
    print(f"\n💾 Saved rendered template to: {output_path}")
    
    # Simulate Claude output
    mock_output = generate_mock_claude_output(test_case["input"])
    
    # Save mock output
    output_files = Path("test-runs/test-001-output")
    output_files.mkdir(parents=True, exist_ok=True)
    
    # Save component file
    component_file = output_files / "TestButton.tsx"
    with open(component_file, 'w') as f:
        f.write(mock_output["component"])
    
    print(f"✅ Created mock component: {component_file}")
    
    # Test validation
    print("\n🔍 Running Validation Checks:")
    
    # Check 1: File exists
    if component_file.exists():
        print("✅ Component file created")
    else:
        print("❌ Component file missing")
    
    # Check 2: TypeScript syntax (basic check)
    content = component_file.read_text()
    checks = {
        "Has interface": "interface TestButtonProps" in content,
        "Has React.FC": "React.FC<TestButtonProps>" in content,
        "No any type": "any" not in content,
        "Has export": "export" in content
    }
    
    for check, passed in checks.items():
        print(f"{'✅' if passed else '❌'} {check}")
    
    # Calculate score
    passed_checks = sum(1 for p in checks.values() if p)
    score = (passed_checks / len(checks)) * 100
    
    print(f"\n📊 Validation Score: {score:.0f}/100")
    
    # Summary
    print("\n📋 Test Summary:")
    print(f"   Template: {test_case['template']}")
    print(f"   Component: {test_case['input']['component_name']}")
    print(f"   Score: {score:.0f}/100")
    print(f"   Status: {'✅ PASSED' if score >= 70 else '❌ FAILED'}")

def generate_mock_claude_output(inputs):
    """Generate mock Claude output for testing"""
    component = f"""import React from 'react';
import styles from './{inputs['component_name']}.module.scss';

interface {inputs['component_name']}Props {{
    {chr(10).join(f"{p['name']}: {p['type']};" for p in inputs.get('props', []))}
}}

export const {inputs['component_name']}: React.FC<{inputs['component_name']}Props> = ({{ 
    {', '.join(p['name'] for p in inputs.get('props', []))}
}}) => {{
    return (
        <button className={{styles.button}} onClick={{onClick}}>
            {{label}}
        </button>
    );
}};
"""
    
    return {"component": component}

if __name__ == "__main__":
    test_template_rendering()
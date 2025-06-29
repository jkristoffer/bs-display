#!/usr/bin/env python3
"""
AI Task Compiler Template Test Runner

Executes template tests, validates outputs, and generates scoring reports.
"""

import os
import sys
import json
import yaml
import subprocess
import shutil
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional

class TemplateTestRunner:
    def __init__(self, base_dir: Path):
        self.base_dir = base_dir
        self.test_runs_dir = base_dir / "test-runs"
        self.results_dir = base_dir / "results"
        self.test_cases_dir = base_dir / "test-cases"
        
        # Create directories
        self.test_runs_dir.mkdir(exist_ok=True)
        self.results_dir.mkdir(exist_ok=True)
        
        # Load configuration
        self.code_review_agent = self.base_dir.parent.parent / "scripts" / "code-review-agent.js"
        
    def load_test_cases(self) -> List[Dict[str, Any]]:
        """Load all test cases from YAML files"""
        test_cases = []
        for yaml_file in self.test_cases_dir.glob("*.yaml"):
            with open(yaml_file, 'r') as f:
                test_case = yaml.safe_load(f)
                test_cases.append(test_case)
        return test_cases
    
    def render_template(self, template_name: str, inputs: Dict[str, Any]) -> str:
        """Render a template with given inputs"""
        template_path = self.base_dir.parent / "templates" / f"{template_name}.md"
        
        if not template_path.exists():
            raise FileNotFoundError(f"Template not found: {template_path}")
        
        with open(template_path, 'r') as f:
            template_content = f.read()
        
        # Simple template rendering (replace with Jinja2 for production)
        rendered = template_content
        for key, value in inputs.items():
            if isinstance(value, list):
                # Handle array inputs
                if key in ["props", "ui_elements", "edge_cases"]:
                    formatted_items = []
                    for item in value:
                        if isinstance(item, dict):
                            formatted_items.append(self.format_dict_item(item))
                        else:
                            formatted_items.append(f"- {item}")
                    rendered = rendered.replace(f"{{{{#{key}}}}}", "\n".join(formatted_items))
                    rendered = rendered.replace(f"{{{{/{key}}}}}", "")
            else:
                # Handle simple string replacements
                rendered = rendered.replace(f"{{{{{key}}}}}", str(value))
        
        # Clean up any remaining template variables
        import re
        rendered = re.sub(r'{{[^}]+}}', '', rendered)
        
        return rendered
    
    def format_dict_item(self, item: Dict[str, Any]) -> str:
        """Format dictionary items for template rendering"""
        parts = []
        for k, v in item.items():
            parts.append(f"{k}: {v}")
        return "- " + ", ".join(parts)
    
    def run_claude_cli(self, prompt: str, test_dir: Path) -> Dict[str, str]:
        """Execute Claude CLI and capture outputs"""
        # Save prompt for reference
        prompt_file = test_dir / "prompt.md"
        with open(prompt_file, 'w') as f:
            f.write(prompt)
        
        # Run Claude CLI (mock for testing)
        # In production, this would actually call: claude chat -m "prompt"
        output_file = test_dir / "claude_output.txt"
        
        # For testing, simulate Claude output
        mock_output = self.generate_mock_output(prompt)
        with open(output_file, 'w') as f:
            f.write(mock_output)
        
        # Parse output and save files
        files_created = self.parse_and_save_outputs(mock_output, test_dir)
        
        return files_created
    
    def generate_mock_output(self, prompt: str) -> str:
        """Generate mock Claude output for testing"""
        # This is a simplified mock - in production, use actual Claude CLI
        if "TestButton" in prompt:
            return '''```typescript
// filename: src/components/common/TestButton/TestButton.tsx
import React from 'react';
import styles from './TestButton.module.scss';

interface TestButtonProps {
  label: string;
  onClick: () => void;
  loading?: boolean;
}

export const TestButton: React.FC<TestButtonProps> = ({ label, onClick, loading = false }) => {
  return (
    <button 
      className={styles.button} 
      onClick={onClick}
      disabled={loading}
    >
      {loading ? 'Loading...' : label}
    </button>
  );
};
```

```scss
// filename: src/components/common/TestButton/TestButton.module.scss
.button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
```

```typescript
// filename: src/components/common/TestButton/index.ts
export { TestButton } from './TestButton';
```'''
        return "// Mock output"
    
    def parse_and_save_outputs(self, claude_output: str, test_dir: Path) -> Dict[str, str]:
        """Parse Claude output and save individual files"""
        files_created = {}
        
        # Parse code blocks with filenames
        import re
        pattern = r'```(?:\w+)?\n// filename: ([^\n]+)\n(.*?)```'
        matches = re.findall(pattern, claude_output, re.DOTALL)
        
        for filename, content in matches:
            # Create file path
            file_path = test_dir / filename.strip()
            file_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Save file
            with open(file_path, 'w') as f:
                f.write(content.strip())
            
            files_created[filename] = str(file_path)
        
        return files_created
    
    def validate_typescript(self, file_path: Path) -> Dict[str, Any]:
        """Validate TypeScript syntax and types"""
        try:
            result = subprocess.run(
                ["npx", "tsc", "--noEmit", str(file_path)],
                capture_output=True,
                text=True,
                cwd=self.base_dir.parent.parent
            )
            
            return {
                "valid": result.returncode == 0,
                "score": 100 if result.returncode == 0 else 0,
                "errors": result.stderr if result.returncode != 0 else None
            }
        except Exception as e:
            return {
                "valid": False,
                "score": 0,
                "errors": str(e)
            }
    
    def check_functional_programming(self, file_path: Path) -> Dict[str, Any]:
        """Run code review agent for FP compliance"""
        try:
            result = subprocess.run(
                ["node", str(self.code_review_agent), "--file", str(file_path), "--ai-mode", "--format", "json"],
                capture_output=True,
                text=True
            )
            
            if result.returncode == 0:
                data = json.loads(result.stdout)
                return {
                    "score": data["summary"]["overallScore"],
                    "issues": data.get("issues", []),
                    "categories": data.get("categories", {})
                }
            else:
                return {
                    "score": 0,
                    "issues": ["Failed to run code review"],
                    "categories": {}
                }
        except Exception as e:
            return {
                "score": 0,
                "issues": [str(e)],
                "categories": {}
            }
    
    def check_completeness(self, test_dir: Path, expected_outputs: List[str]) -> Dict[str, Any]:
        """Check if all expected files were created"""
        results = {
            "files_found": [],
            "files_missing": [],
            "score": 0
        }
        
        for expected_file in expected_outputs:
            file_path = test_dir / expected_file
            if file_path.exists():
                results["files_found"].append(expected_file)
            else:
                results["files_missing"].append(expected_file)
        
        if expected_outputs:
            results["score"] = (len(results["files_found"]) / len(expected_outputs)) * 100
        else:
            results["score"] = 100
        
        return results
    
    def calculate_scores(self, test_case: Dict[str, Any], test_dir: Path) -> Dict[str, Any]:
        """Calculate all scoring metrics"""
        scores = {
            "code_quality": {
                "syntax_validity": 0,
                "type_safety": 0,
                "functional_programming": 0,
                "total": 0
            },
            "completeness": {
                "required_files": 0,
                "code_completeness": 0,
                "total": 0
            },
            "standards_compliance": {
                "naming_conventions": 0,
                "file_structure": 0,
                "total": 0
            },
            "usability": {
                "example_usage": 0,
                "documentation": 0,
                "total": 0
            },
            "total_score": 0
        }
        
        # Get expected outputs
        expected_outputs = test_case.get("expected_outputs", [])
        
        # Check completeness
        completeness = self.check_completeness(test_dir, expected_outputs)
        scores["completeness"]["required_files"] = completeness["score"]
        scores["completeness"]["code_completeness"] = 90 if completeness["score"] > 0 else 0  # Simplified
        scores["completeness"]["total"] = (scores["completeness"]["required_files"] + scores["completeness"]["code_completeness"]) / 2
        
        # Check code quality for main file
        main_file = None
        for expected in expected_outputs:
            if expected.endswith(".tsx") or expected.endswith(".ts"):
                main_file = test_dir / expected
                break
        
        if main_file and main_file.exists():
            # TypeScript validation
            ts_result = self.validate_typescript(main_file)
            scores["code_quality"]["syntax_validity"] = ts_result["score"]
            scores["code_quality"]["type_safety"] = 90 if ts_result["valid"] else 50  # Simplified
            
            # Functional programming check
            fp_result = self.check_functional_programming(main_file)
            scores["code_quality"]["functional_programming"] = fp_result["score"]
        
        # Calculate code quality total
        scores["code_quality"]["total"] = (
            scores["code_quality"]["syntax_validity"] * 0.25 +
            scores["code_quality"]["type_safety"] * 0.25 +
            scores["code_quality"]["functional_programming"] * 0.5
        )
        
        # Standards compliance (simplified for testing)
        scores["standards_compliance"]["naming_conventions"] = 95
        scores["standards_compliance"]["file_structure"] = 90
        scores["standards_compliance"]["total"] = 92.5
        
        # Usability (simplified for testing)
        scores["usability"]["example_usage"] = 85
        scores["usability"]["documentation"] = 80
        scores["usability"]["total"] = 82.5
        
        # Calculate total score
        scores["total_score"] = (
            scores["code_quality"]["total"] * 0.4 +
            scores["completeness"]["total"] * 0.3 +
            scores["standards_compliance"]["total"] * 0.2 +
            scores["usability"]["total"] * 0.1
        )
        
        return scores
    
    def run_test(self, test_case: Dict[str, Any]) -> Dict[str, Any]:
        """Run a single test case"""
        test_id = test_case["id"]
        template = test_case["template"]
        
        print(f"\n🧪 Running test: {test_id} ({template})")
        
        # Create test directory
        test_dir = self.test_runs_dir / f"{test_id}-{template.replace('/', '-')}"
        test_dir.mkdir(exist_ok=True)
        
        # Render template
        try:
            prompt = self.render_template(template, test_case["input"])
        except Exception as e:
            print(f"❌ Failed to render template: {e}")
            return {
                "test_id": test_id,
                "status": "failed",
                "error": str(e)
            }
        
        # Run Claude CLI
        files_created = self.run_claude_cli(prompt, test_dir)
        
        # Calculate scores
        scores = self.calculate_scores(test_case, test_dir)
        
        # Prepare result
        result = {
            "test_id": test_id,
            "template": template,
            "timestamp": datetime.now().isoformat(),
            "test_dir": str(test_dir),
            "files_created": files_created,
            "scores": scores,
            "status": "passed" if scores["total_score"] >= 70 else "failed"
        }
        
        # Save result
        result_file = self.results_dir / f"{test_id}-results.json"
        with open(result_file, 'w') as f:
            json.dump(result, f, indent=2)
        
        print(f"✅ Test completed. Score: {scores['total_score']:.1f}/100")
        
        return result
    
    def generate_summary(self, results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate summary report from all test results"""
        summary = {
            "test_run_id": f"{datetime.now().strftime('%Y-%m-%d')}-run-001",
            "total_tests": len(results),
            "passed": sum(1 for r in results if r.get("status") == "passed"),
            "failed": sum(1 for r in results if r.get("status") == "failed"),
            "average_score": 0,
            "by_template": {},
            "recommendations": []
        }
        
        # Calculate average score
        valid_scores = [r["scores"]["total_score"] for r in results if "scores" in r]
        if valid_scores:
            summary["average_score"] = sum(valid_scores) / len(valid_scores)
        
        # Group by template
        from collections import defaultdict
        template_results = defaultdict(list)
        
        for result in results:
            if "template" in result:
                template_results[result["template"]].append(result)
        
        # Analyze by template
        for template, template_tests in template_results.items():
            template_scores = [t["scores"]["total_score"] for t in template_tests if "scores" in t]
            summary["by_template"][template] = {
                "tests": len(template_tests),
                "average_score": sum(template_scores) / len(template_scores) if template_scores else 0,
                "passed": sum(1 for t in template_tests if t.get("status") == "passed")
            }
        
        # Add recommendations based on results
        if summary["average_score"] < 80:
            summary["recommendations"].append("Templates need improvement for better code generation")
        
        if summary["failed"] > summary["total_tests"] * 0.2:
            summary["recommendations"].append("High failure rate - review template clarity and examples")
        
        # Save summary
        summary_file = self.results_dir / "summary.json"
        with open(summary_file, 'w') as f:
            json.dump(summary, f, indent=2)
        
        return summary
    
    def run_all_tests(self):
        """Run all test cases"""
        print("🚀 Starting template test run")
        print(f"📁 Test directory: {self.base_dir}")
        
        # Load test cases
        test_cases = self.load_test_cases()
        print(f"📋 Found {len(test_cases)} test cases")
        
        # Run each test
        results = []
        for test_case in test_cases:
            result = self.run_test(test_case)
            results.append(result)
        
        # Generate summary
        summary = self.generate_summary(results)
        
        # Print summary
        print("\n" + "="*50)
        print("📊 TEST SUMMARY")
        print("="*50)
        print(f"Total Tests: {summary['total_tests']}")
        print(f"Passed: {summary['passed']} ✅")
        print(f"Failed: {summary['failed']} ❌")
        print(f"Average Score: {summary['average_score']:.1f}/100")
        
        print("\n📈 By Template:")
        for template, stats in summary['by_template'].items():
            print(f"  {template}: {stats['average_score']:.1f}/100 ({stats['passed']}/{stats['tests']} passed)")
        
        if summary['recommendations']:
            print("\n💡 Recommendations:")
            for rec in summary['recommendations']:
                print(f"  - {rec}")
        
        return summary

def main():
    """Main entry point"""
    # Determine base directory
    script_dir = Path(__file__).parent
    base_dir = script_dir
    
    # Create test runner
    runner = TemplateTestRunner(base_dir)
    
    # Check for specific test case
    if len(sys.argv) > 1:
        test_id = sys.argv[1]
        # Run specific test (not implemented for brevity)
        print(f"Running specific test: {test_id}")
    else:
        # Run all tests
        runner.run_all_tests()

if __name__ == "__main__":
    main()
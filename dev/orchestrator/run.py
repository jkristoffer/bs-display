#!/usr/bin/env python3
"""
AI Task Compiler - Main Orchestrator Script

A lean orchestrator that breaks down high-level development goals into
Claude-executable subtasks using templates and functional programming principles.
"""

import argparse
import json
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Any
import re
import tempfile
import shutil

# Import the Claude output parser after Path is imported
import os
import sys
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)
try:
    from enhanced_claude_parser import create_files_from_output
except ImportError:
    from claude_output_parser import create_files_from_output

# Constants
TEMPLATES_DIR = Path(__file__).parent / "templates"
REGISTRY_FILE = TEMPLATES_DIR / "registry.yaml"
OUTPUT_DIR = Path(__file__).parent / "output"
LOGS_DIR = Path(__file__).parent / "logs"

# Create directories
OUTPUT_DIR.mkdir(exist_ok=True)
LOGS_DIR.mkdir(exist_ok=True)

class TaskCompiler:
    """Main orchestrator for AI task compilation"""
    
    def __init__(self, dry_run: bool = False, verbose: bool = False):
        self.dry_run = dry_run
        self.verbose = verbose
        self.session_id = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.session_dir = OUTPUT_DIR / self.session_id
        self.log_file = LOGS_DIR / f"{self.session_id}.log"
        
        if not dry_run:
            self.session_dir.mkdir(exist_ok=True)
    
    def log(self, message: str, level: str = "INFO"):
        """Log message to file and optionally to console"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] [{level}] {message}"
        
        # Always log to file
        with open(self.log_file, 'a') as f:
            f.write(log_entry + "\n")
        
        # Log to console based on verbosity
        if self.verbose or level in ["ERROR", "WARNING"]:
            print(log_entry)
    
    def load_template(self, template_name: str) -> Optional[str]:
        """Load a template file"""
        template_path = TEMPLATES_DIR / f"{template_name}.md"
        
        if not template_path.exists():
            self.log(f"Template not found: {template_path}", "ERROR")
            return None
        
        with open(template_path, 'r') as f:
            return f.read()
    
    def render_template(self, template: str, inputs: Dict[str, Any]) -> str:
        """Render template with inputs"""
        rendered = template
        
        # Handle simple variable substitution
        for key, value in inputs.items():
            if isinstance(value, str):
                rendered = rendered.replace(f"{{{{{key}}}}}", value)
            elif isinstance(value, (int, float)):
                rendered = rendered.replace(f"{{{{{key}}}}}", str(value))
        
        # Handle array iterations (simplified Mustache-style)
        # Pattern: {{#array_name}}...{{/array_name}}
        array_pattern = r'\{\{#(\w+)\}\}(.*?)\{\{/\1\}\}'
        
        for match in re.finditer(array_pattern, rendered, re.DOTALL):
            array_name = match.group(1)
            array_content = match.group(2)
            
            if array_name in inputs and isinstance(inputs[array_name], list):
                array_output = []
                for item in inputs[array_name]:
                    item_content = array_content
                    if isinstance(item, dict):
                        for key, value in item.items():
                            item_content = item_content.replace(f"{{{{{key}}}}}", str(value))
                    else:
                        item_content = item_content.replace("{{.}}", str(item))
                    array_output.append(item_content.strip())
                
                rendered = rendered.replace(match.group(0), "\n".join(array_output))
        
        return rendered
    
    def execute_claude(self, prompt: str, output_dir: Optional[Path] = None) -> Tuple[bool, str]:
        """Execute Claude CLI with the given prompt and parse output to create files"""
        if self.dry_run:
            self.log("DRY RUN: Would execute Claude with prompt")
            return True, "DRY RUN OUTPUT"
        
        try:
            # Build Claude command with --print flag for non-interactive mode
            cmd = ["claude", "--print"]
            
            self.log(f"Executing: {' '.join(cmd)} (with prompt via stdin)")
            
            # Execute Claude with prompt via stdin
            result = subprocess.run(
                cmd,
                input=prompt,
                capture_output=True,
                text=True,
                check=True
            )
            
            self.log("Claude execution successful")
            
            # Log Claude's output for debugging
            if self.verbose:
                self.log(f"Claude output length: {len(result.stdout)} characters")
                self.log(f"Claude output preview: {result.stdout[:200]}...")
            
            # Save Claude's raw output for debugging
            if output_dir:
                debug_file = output_dir / "claude_raw_output.txt"
                debug_file.parent.mkdir(parents=True, exist_ok=True)
                with open(debug_file, 'w') as f:
                    f.write(result.stdout)
                self.log(f"Saved Claude raw output to: {debug_file}")
            
            # Parse output and create files if output_dir is provided
            if output_dir and result.stdout:
                self.log(f"Parsing Claude output to create files in {output_dir}")
                created_files = create_files_from_output(result.stdout, output_dir)
                
                if created_files:
                    self.log(f"Created {len(created_files)} file(s)")
                    for filename in created_files:
                        self.log(f"  - {filename}")
                else:
                    self.log("No files found in Claude output", "WARNING")
            
            return True, result.stdout
            
        except subprocess.CalledProcessError as e:
            self.log(f"Claude execution failed: {e.stderr}", "ERROR")
            return False, e.stderr
    
    def validate_output(self, template_name: str, output_dir: Path) -> Dict[str, Any]:
        """Validate generated output against template requirements"""
        validation_results = {
            "passed": True,
            "checks": [],
            "score": 0
        }
        
        # Load validation rules from template registry
        # For now, use basic file existence checks
        if template_name == "feature/react-component":
            expected_files = ["*.tsx", "*.module.scss", "index.ts"]
        elif template_name == "function/utility":
            expected_files = ["*.ts"]
        else:
            expected_files = ["*"]
        
        found_files = []
        for pattern in expected_files:
            matches = list(output_dir.glob(pattern))
            if matches:
                found_files.extend(matches)
                validation_results["checks"].append({
                    "name": f"File pattern {pattern}",
                    "passed": True
                })
            else:
                validation_results["checks"].append({
                    "name": f"File pattern {pattern}",
                    "passed": False
                })
                validation_results["passed"] = False
        
        # Calculate score
        passed_checks = sum(1 for c in validation_results["checks"] if c["passed"])
        total_checks = len(validation_results["checks"])
        validation_results["score"] = (passed_checks / total_checks * 100) if total_checks > 0 else 0
        
        return validation_results
    
    def run_code_review(self, file_path: Path) -> Dict[str, Any]:
        """Run code review agent on generated file"""
        if self.dry_run:
            return {"score": 100, "status": "DRY_RUN"}
        
        try:
            cmd = [
                "node",
                str(Path(__file__).parent.parent / "scripts" / "code-review-agent.js"),
                "--file", str(file_path),
                "--ai-mode",
                "--output-format", "json"
            ]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                check=True
            )
            
            return json.loads(result.stdout)
            
        except (subprocess.CalledProcessError, json.JSONDecodeError) as e:
            self.log(f"Code review failed: {e}", "WARNING")
            return {"score": 0, "status": "ERROR"}
    
    def compile_task(self, template_name: str, inputs: Dict[str, Any]) -> Dict[str, Any]:
        """Compile a single task using template"""
        self.log(f"Compiling task with template: {template_name}")
        
        # Load template
        template = self.load_template(template_name)
        if not template:
            return {
                "success": False,
                "error": "Template not found"
            }
        
        # Render template
        prompt = self.render_template(template, inputs)
        
        # Save rendered prompt
        prompt_file = self.session_dir / f"{template_name.replace('/', '_')}_prompt.md"
        prompt_file.parent.mkdir(parents=True, exist_ok=True)
        with open(prompt_file, 'w') as f:
            f.write(prompt)
        
        self.log(f"Saved rendered prompt to: {prompt_file}")
        
        # Execute Claude
        output_dir = self.session_dir / template_name.replace('/', '_')
        output_dir.mkdir(parents=True, exist_ok=True)
        
        success, output = self.execute_claude(prompt, output_dir)
        
        if not success:
            return {
                "success": False,
                "error": output
            }
        
        # Validate output
        validation = self.validate_output(template_name, output_dir)
        
        # Run code review on generated files
        code_review_results = []
        for file_path in output_dir.rglob("*.ts*"):
            review = self.run_code_review(file_path)
            code_review_results.append({
                "file": file_path.name,
                "score": review.get("score", 0),
                "status": review.get("status", "UNKNOWN")
            })
        
        # Calculate average code review score
        avg_score = sum(r["score"] for r in code_review_results) / len(code_review_results) if code_review_results else 0
        
        return {
            "success": True,
            "template": template_name,
            "output_dir": str(output_dir),
            "validation": validation,
            "code_review": {
                "files": code_review_results,
                "average_score": avg_score
            }
        }
    
    def compile_workflow(self, workflow: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Compile a workflow of multiple tasks"""
        self.log(f"Starting workflow compilation with {len(workflow)} tasks")
        
        results = {
            "session_id": self.session_id,
            "total_tasks": len(workflow),
            "completed_tasks": 0,
            "failed_tasks": 0,
            "tasks": []
        }
        
        for i, task in enumerate(workflow, 1):
            self.log(f"Processing task {i}/{len(workflow)}: {task.get('name', 'Unnamed')}")
            
            template = task.get("template")
            inputs = task.get("inputs", {})
            
            if not template:
                self.log("Task missing template", "ERROR")
                results["failed_tasks"] += 1
                continue
            
            # Compile task
            task_result = self.compile_task(template, inputs)
            
            if task_result["success"]:
                results["completed_tasks"] += 1
            else:
                results["failed_tasks"] += 1
            
            results["tasks"].append({
                "name": task.get("name"),
                "template": template,
                **task_result
            })
        
        # Save results
        results_file = self.session_dir / "results.json"
        with open(results_file, 'w') as f:
            json.dump(results, f, indent=2)
        
        self.log(f"Workflow complete. Results saved to: {results_file}")
        
        return results

def parse_task_definition(task_str: str) -> Dict[str, Any]:
    """Parse a task definition from string format"""
    # Simple format: template:key1=value1,key2=value2
    parts = task_str.split(":", 1)
    if len(parts) != 2:
        raise ValueError("Invalid task format. Use: template:key1=value1,key2=value2")
    
    template = parts[0]
    inputs = {}
    
    if parts[1]:
        for pair in parts[1].split(","):
            if "=" in pair:
                key, value = pair.split("=", 1)
                inputs[key.strip()] = value.strip()
    
    return {"template": template, "inputs": inputs}

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(
        description="AI Task Compiler - Break down development goals into Claude-executable tasks",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Compile a single task
  python run.py --task "feature/react-component:component_name=UserProfile,category=user"
  
  # Compile from workflow file
  python run.py --workflow workflow.json
  
  # Dry run to see what would be executed
  python run.py --task "function/utility:function_name=debounce" --dry-run
  
  # List available templates
  python run.py --list-templates
        """
    )
    
    parser.add_argument("--task", help="Single task definition (template:inputs)")
    parser.add_argument("--workflow", help="Workflow JSON file")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be done without executing")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    parser.add_argument("--list-templates", action="store_true", help="List available templates")
    
    args = parser.parse_args()
    
    # List templates
    if args.list_templates:
        print("Available templates:")
        for template_file in TEMPLATES_DIR.rglob("*.md"):
            relative_path = template_file.relative_to(TEMPLATES_DIR)
            template_name = str(relative_path).replace(".md", "")
            print(f"  - {template_name}")
        return
    
    # Initialize compiler
    compiler = TaskCompiler(dry_run=args.dry_run, verbose=args.verbose)
    
    # Execute based on mode
    if args.task:
        # Single task mode
        try:
            task = parse_task_definition(args.task)
            result = compiler.compile_task(task["template"], task["inputs"])
            
            # Print summary
            print(f"\n{'='*50}")
            print(f"Task Compilation {'(DRY RUN)' if args.dry_run else ''}")
            print(f"{'='*50}")
            print(f"Session ID: {compiler.session_id}")
            print(f"Template: {task['template']}")
            print(f"Success: {'✅' if result['success'] else '❌'}")
            
            if result['success']:
                print(f"Output: {result['output_dir']}")
                print(f"Validation Score: {result['validation']['score']:.0f}/100")
                if result.get('code_review'):
                    print(f"Code Review Score: {result['code_review']['average_score']:.0f}/100")
            else:
                print(f"Error: {result.get('error', 'Unknown error')}")
            
        except ValueError as e:
            print(f"Error: {e}")
            return 1
    
    elif args.workflow:
        # Workflow mode
        workflow_path = Path(args.workflow)
        if not workflow_path.exists():
            print(f"Error: Workflow file not found: {workflow_path}")
            return 1
        
        with open(workflow_path, 'r') as f:
            workflow_data = json.load(f)
        
        # Extract tasks from workflow structure
        if isinstance(workflow_data, dict) and "tasks" in workflow_data:
            workflow = workflow_data["tasks"]
        else:
            workflow = workflow_data
        
        result = compiler.compile_workflow(workflow)
        
        # Print summary
        print(f"\n{'='*50}")
        print(f"Workflow Compilation {'(DRY RUN)' if args.dry_run else ''}")
        print(f"{'='*50}")
        print(f"Session ID: {result['session_id']}")
        print(f"Total Tasks: {result['total_tasks']}")
        print(f"Completed: {result['completed_tasks']} ✅")
        print(f"Failed: {result['failed_tasks']} ❌")
        print(f"\nResults saved to: {compiler.session_dir / 'results.json'}")
    
    else:
        parser.print_help()
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
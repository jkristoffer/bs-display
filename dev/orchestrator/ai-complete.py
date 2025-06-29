#!/usr/bin/env python3
"""
Complete AI Assistant - Handles all types of requests with Claude integration
"""

import subprocess
import sys
import json
import tempfile
from pathlib import Path
from typing import Optional, Dict, Any, Tuple, List

class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    CYAN = '\033[96m'
    MAGENTA = '\033[95m'
    BOLD = '\033[1m'
    END = '\033[0m'

def detect_intent(request: str) -> str:
    """Detect user intent from request"""
    request_lower = request.lower()
    
    # Review keywords
    if any(word in request_lower for word in ['review', 'analyze', 'check', 'audit', 'inspect']):
        return "review"
    
    # Fix/improve keywords
    if any(word in request_lower for word in ['improve', 'fix', 'enhance', 'optimize', 'refactor']):
        return "fix"
    
    # Default to generate
    return "generate"

def get_claude_task_definition(request: str) -> Optional[Dict[str, Any]]:
    """Use Claude to understand the request and generate proper task definition"""
    
    prompt = f"""Convert this request into an AI Task Compiler task definition.

Request: "{request}"

Available templates:
- feature/react-component: For React components (pages, cards, forms, etc.)
- function/utility: For utility functions
- feature/api-endpoint: For API endpoints
- refactor/add-types: For adding TypeScript types
- feature/data-integration: For data fetching

Analyze the request and return ONLY a JSON object with the appropriate template and ALL parameters filled out.

For a FAQ page, this would be:
{{
  "template": "feature/react-component",
  "component_name": "FAQPage",
  "component_description": "FAQ page with expandable questions and search functionality",
  "category": "pages",
  "props": [
    {{"name": "faqs", "type": "FAQ[]", "description": "Array of FAQ items"}},
    {{"name": "categories", "type": "string[]", "description": "FAQ categories"}}
  ],
  "behavior_description": "Displays FAQs in expandable accordions with search/filter capability",
  "ui_elements": ["Search input", "Category filter", "FAQ accordions", "Expand/collapse buttons"]
}}

Be comprehensive and include all relevant details based on the request."""

    try:
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
            f.write(prompt)
            prompt_file = f.name
        
        # Call Claude
        result = subprocess.run(
            ['claude', prompt_file],
            capture_output=True,
            text=True,
            check=True
        )
        
        Path(prompt_file).unlink(missing_ok=True)
        
        # Extract JSON from response
        response = result.stdout.strip()
        
        # Find JSON in response
        import re
        json_match = re.search(r'\{[\s\S]*\}', response)
        if json_match:
            return json.loads(json_match.group(0))
            
    except subprocess.CalledProcessError as e:
        print(f"{Colors.RED}Error calling Claude: {e}{Colors.END}")
        if e.stderr:
            print(f"Error details: {e.stderr}")
    except json.JSONDecodeError as e:
        print(f"{Colors.RED}Error parsing JSON response: {e}{Colors.END}")
    except FileNotFoundError:
        print(f"{Colors.RED}Claude CLI not found. Please ensure it's installed.{Colors.END}")
        print(f"Install with: npm install -g @anthropic-ai/claude-cli")
    
    return None

def handle_generation(request: str, dry_run: bool = False, verbose: bool = False):
    """Handle code generation requests with Claude"""
    
    print(f"{Colors.CYAN}🤔 Understanding your request...{Colors.END}")
    
    # Get task definition from Claude
    task_def = get_claude_task_definition(request)
    
    if not task_def:
        print(f"{Colors.RED}Could not understand the request. Using fallback method.{Colors.END}")
        # Fallback to simple parsing
        return handle_generation_fallback(request, dry_run, verbose)
    
    # Display what will be created
    template = task_def.get('template', '')
    if 'component' in template:
        name = task_def.get('component_name', 'Component')
        desc = task_def.get('component_description', '')
        print(f"{Colors.GREEN}✨ Creating React component: {name}{Colors.END}")
        if desc:
            print(f"   {desc}")
    elif 'utility' in template:
        name = task_def.get('function_name', 'function')
        desc = task_def.get('function_description', '')
        print(f"{Colors.GREEN}🔧 Creating utility function: {name}{Colors.END}")
        if desc:
            print(f"   {desc}")
    elif 'api' in template:
        path = task_def.get('endpoint_path', '/api')
        method = task_def.get('method', 'GET')
        print(f"{Colors.GREEN}🌐 Creating API endpoint: {method} {path}{Colors.END}")
    
    # Build command
    cmd = [sys.executable, str(Path(__file__).parent / "run.py")]
    
    # For complex tasks with arrays/objects, use workflow mode
    if any(isinstance(v, (list, dict)) for v in task_def.values()):
        # Create temporary workflow file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
            workflow = {
                "name": "AI Generated Task",
                "tasks": [task_def]
            }
            json.dump(workflow, f)
            temp_file = f.name
        
        cmd.extend(["--workflow", temp_file])
    else:
        # Simple task string
        template = task_def.pop('template')
        params = []
        for k, v in task_def.items():
            if isinstance(v, str):
                # Escape commas
                v = v.replace(',', '\\,')
                params.append(f"{k}={v}")
            elif isinstance(v, (int, float, bool)):
                params.append(f"{k}={v}")
        
        task_string = f"{template}:{','.join(params)}"
        cmd.extend(["--task", task_string])
    
    if dry_run:
        cmd.append("--dry-run")
    if verbose:
        cmd.append("--verbose")
    
    # Execute
    print()
    try:
        subprocess.run(cmd, check=True)
        
        if not dry_run:
            print(f"\n{Colors.GREEN}✅ Done! Check output/ for generated files.{Colors.END}")
        
        # Cleanup temp file if used
        if 'temp_file' in locals():
            Path(temp_file).unlink(missing_ok=True)
            
    except subprocess.CalledProcessError:
        print(f"{Colors.RED}Task execution failed.{Colors.END}")

def handle_generation_fallback(request: str, dry_run: bool, verbose: bool):
    """Fallback generation when Claude is not available"""
    request_lower = request.lower()
    
    # Simple parsing
    cmd = [sys.executable, str(Path(__file__).parent / "run.py")]
    
    if 'faq' in request_lower or 'frequently asked' in request_lower:
        task_string = "feature/react-component:component_name=FAQPage,component_description=FAQ page with search and expandable questions,category=pages"
    elif 'button' in request_lower:
        task_string = "feature/react-component:component_name=Button,component_description=Reusable button component,category=common"
    elif 'form' in request_lower:
        task_string = "feature/react-component:component_name=Form,component_description=Form component with validation,category=forms"
    else:
        # Generic component
        task_string = f"feature/react-component:component_name=Component,component_description={request},category=common"
    
    cmd.extend(["--task", task_string])
    
    if dry_run:
        cmd.append("--dry-run")
    if verbose:
        cmd.append("--verbose")
    
    subprocess.run(cmd)

def handle_review(request: str):
    """Handle review requests"""
    # Use the review logic from ai-smart.py
    from pathlib import Path
    
    print(f"{Colors.CYAN}📊 Code Review Request{Colors.END}")
    
    # Extract target
    review_keywords = ['review', 'analyze', 'check', 'audit', 'inspect', 'the', 'code', 'for']
    words = request.lower().split()
    target_words = [w for w in words if w not in review_keywords]
    
    if not target_words:
        print(f"{Colors.RED}Please specify what to review{Colors.END}")
        return
    
    # Find files (simplified)
    search_dirs = ['src/components', 'src/pages']
    files = []
    
    for term in target_words:
        for search_dir in search_dirs:
            if Path(search_dir).exists():
                files.extend(Path(search_dir).rglob(f"*{term}*"))
    
    if not files:
        print(f"{Colors.RED}No files found for review{Colors.END}")
        return
    
    print(f"Found {len(files)} files to review")
    # ... rest of review logic

def handle_fix(request: str):
    """Handle fix/improvement requests"""
    print(f"{Colors.CYAN}🔧 Improvement Request{Colors.END}")
    
    # Extract what to improve
    words = request.split()
    target = ' '.join(words[1:3]) if len(words) > 2 else request
    
    # Suggest improvement command
    improvement = f"enhance {target} with better performance and user experience"
    print(f"\n{Colors.GREEN}Suggested improvement:{Colors.END}")
    print(f'./ai "{improvement}"')

def main():
    if len(sys.argv) < 2:
        print(f"{Colors.CYAN}{Colors.BOLD}🤖 Complete AI Assistant{Colors.END}")
        print(f"\n{Colors.YELLOW}Usage:{Colors.END}")
        print(f'  ai "build a FAQ page"              # Generate code')
        print(f'  ai "review Banner component"       # Review code')
        print(f'  ai "improve Hero performance"      # Fix/enhance')
        print(f"\n{Colors.YELLOW}Options:{Colors.END}")
        print(f"  --dry-run    Preview without generating")
        print(f"  --verbose    Show detailed output")
        sys.exit(1)
    
    # Parse arguments
    args = sys.argv[1:]
    dry_run = '--dry-run' in args
    verbose = '--verbose' in args
    
    # Remove flags
    args = [a for a in args if not a.startswith('--')]
    request = ' '.join(args)
    
    if not request:
        print(f"{Colors.RED}Please provide a request{Colors.END}")
        sys.exit(1)
    
    # Detect intent
    intent = detect_intent(request)
    
    # Route to handler
    if intent == "review":
        handle_review(request)
    elif intent == "fix":
        handle_fix(request)
    else:
        handle_generation(request, dry_run, verbose)

if __name__ == "__main__":
    main()
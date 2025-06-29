#!/usr/bin/env python3
"""
Final AI Assistant - Simple and reliable
"""

import subprocess
import sys
from pathlib import Path

class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    CYAN = '\033[96m'
    BOLD = '\033[1m'
    END = '\033[0m'

def main():
    if len(sys.argv) < 2:
        print(f"{Colors.CYAN}{Colors.BOLD}🤖 AI Assistant{Colors.END}")
        print(f"\nUsage: ai \"what you want\"")
        print(f"\nExamples:")
        print(f'  ai "build a FAQ page"')
        print(f'  ai "create a search component"')
        print(f'  ai "review Banner component"')
        sys.exit(1)
    
    request = ' '.join(sys.argv[1:]).replace('--dry-run', '').replace('--verbose', '').strip()
    request_lower = request.lower()
    
    # Detect intent
    if any(word in request_lower for word in ['review', 'analyze', 'check']):
        print(f"{Colors.CYAN}📊 Review functionality coming soon!{Colors.END}")
        print("For now, use: python3 orchestrator/review-and-fix.py <component>")
        return
    
    # Handle generation
    print(f"{Colors.CYAN}🤔 Understanding: {request}{Colors.END}")
    
    # Build task parameters based on request
    template = None
    params = {}
    
    # Detect type
    if 'faq' in request_lower:
        template = "feature/react-component"
        params = {
            "component_name": "FAQPage",
            "component_description": "FAQ page with expandable questions and search functionality",
            "category": "pages"
        }
        print(f"{Colors.GREEN}✨ Creating FAQ Page component{Colors.END}")
        
    elif any(word in request_lower for word in ['button', 'btn']):
        template = "feature/react-component"
        params = {
            "component_name": "Button",
            "component_description": request,
            "category": "common"
        }
        print(f"{Colors.GREEN}✨ Creating Button component{Colors.END}")
        
    elif any(word in request_lower for word in ['search', 'filter']):
        template = "feature/react-component"
        params = {
            "component_name": "SearchBar",
            "component_description": request,
            "category": "common"
        }
        print(f"{Colors.GREEN}✨ Creating Search component{Colors.END}")
        
    elif any(word in request_lower for word in ['form', 'input']):
        template = "feature/react-component"
        params = {
            "component_name": "Form",
            "component_description": request,
            "category": "forms"
        }
        print(f"{Colors.GREEN}✨ Creating Form component{Colors.END}")
        
    elif any(word in request_lower for word in ['function', 'utility', 'helper']):
        # Extract function name
        words = request.split()
        func_name = "utility"
        for word in words:
            if word.lower() not in ['create', 'build', 'make', 'a', 'function', 'utility']:
                func_name = word.lower()
                break
        
        template = "function/utility"
        params = {
            "function_name": func_name,
            "function_description": request
        }
        print(f"{Colors.GREEN}🔧 Creating utility function: {func_name}{Colors.END}")
        
    elif any(word in request_lower for word in ['api', 'endpoint']):
        template = "feature/api-endpoint"
        params = {
            "endpoint_path": "/api/resource",
            "method": "GET",
            "endpoint_description": request
        }
        print(f"{Colors.GREEN}🌐 Creating API endpoint{Colors.END}")
        
    else:
        # Default to component
        # Try to extract a name
        words = request.split()
        component_name = "Component"
        for i, word in enumerate(words):
            if word.lower() in ['a', 'an'] and i + 1 < len(words):
                component_name = words[i + 1].capitalize()
                break
        
        template = "feature/react-component"
        params = {
            "component_name": component_name,
            "component_description": request,
            "category": "common"
        }
        print(f"{Colors.GREEN}✨ Creating {component_name} component{Colors.END}")
    
    # Build command
    cmd = [sys.executable, "run.py", "--task"]
    
    # Build task string
    param_str = ','.join([f"{k}={v}" for k, v in params.items()])
    task_string = f"{template}:{param_str}"
    cmd.append(task_string)
    
    # Add flags
    if '--dry-run' in sys.argv:
        cmd.append('--dry-run')
    if '--verbose' in sys.argv:
        cmd.append('--verbose')
    
    # Execute
    try:
        subprocess.run(cmd, check=True)
        if '--dry-run' not in sys.argv:
            print(f"\n{Colors.GREEN}✅ Done! Check orchestrator/output/ for generated files.{Colors.END}")
    except subprocess.CalledProcessError:
        print(f"{Colors.RED}Generation failed. Check the error above.{Colors.END}")
    except Exception as e:
        print(f"{Colors.RED}Error: {e}{Colors.END}")

if __name__ == "__main__":
    main()
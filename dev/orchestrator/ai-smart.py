#!/usr/bin/env python3
"""
Smart AI Assistant - Understands generation vs review requests
"""

import subprocess
import sys
import json
from pathlib import Path
from typing import List, Tuple

class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    CYAN = '\033[96m'
    BOLD = '\033[1m'
    END = '\033[0m'

def detect_intent(request: str) -> Tuple[str, str]:
    """Simple intent detection based on keywords"""
    request_lower = request.lower()
    
    # Review keywords
    review_keywords = ['review', 'analyze', 'check', 'audit', 'inspect', 'evaluate', 'assess']
    fix_keywords = ['improve', 'fix', 'enhance', 'optimize', 'refactor', 'update', 'upgrade']
    
    # Check for review intent
    for keyword in review_keywords:
        if keyword in request_lower:
            return "review", request
    
    # Check for fix intent
    for keyword in fix_keywords:
        if keyword in request_lower:
            return "fix", request
    
    # Default to generation
    return "generate", request

def find_component_files(search_terms: List[str]) -> List[Path]:
    """Find files matching search terms"""
    files = []
    
    # Search directories
    search_dirs = [
        Path("src/components/home"),
        Path("src/components"),
        Path("src/pages"),
        Path("src/layouts")
    ]
    
    for term in search_terms:
        for search_dir in search_dirs:
            if search_dir.exists():
                # Try different patterns
                patterns = [
                    f"*{term}*",
                    f"*{term.lower()}*",
                    f"*{term.capitalize()}*",
                    f"*{term.replace(' ', '')}*"
                ]
                
                for pattern in patterns:
                    files.extend(search_dir.rglob(pattern))
    
    # Remove duplicates and non-code files
    valid_extensions = {'.astro', '.tsx', '.jsx', '.ts', '.js', '.scss', '.css'}
    files = [f for f in set(files) if f.suffix in valid_extensions]
    
    return files[:10]  # Limit to 10 files

def handle_review(request: str):
    """Handle review requests"""
    print(f"{Colors.CYAN}📊 Code Review Request{Colors.END}")
    
    # Extract what to review
    # Remove review keywords to find the target
    review_keywords = ['review', 'analyze', 'check', 'audit', 'inspect', 'the', 'code', 'for']
    target_words = request.lower().split()
    target_words = [w for w in target_words if w not in review_keywords]
    
    if not target_words:
        print(f"{Colors.RED}Please specify what to review{Colors.END}")
        return
    
    print(f"Looking for: {' '.join(target_words)}")
    
    # Find files
    files = find_component_files(target_words)
    
    if not files:
        print(f"{Colors.RED}No files found matching '{' '.join(target_words)}'{Colors.END}")
        print(f"\n{Colors.YELLOW}Available components:{Colors.END}")
        
        # Show what's available
        home_components = Path("src/components/home")
        if home_components.exists():
            components = [f.name for f in home_components.iterdir() if f.is_dir()]
            for comp in components[:10]:
                print(f"  • {comp}")
        return
    
    print(f"\n{Colors.GREEN}Found {len(files)} file(s):{Colors.END}")
    for f in files:
        print(f"  • {f}")
    
    # Perform basic analysis
    print(f"\n{Colors.BOLD}Quick Analysis:{Colors.END}")
    
    total_issues = 0
    for file_path in files[:3]:  # Analyze first 3 files
        print(f"\n{Colors.CYAN}{file_path}:{Colors.END}")
        
        try:
            with open(file_path, 'r') as f:
                content = f.read()
            
            issues = []
            
            # Performance checks
            if file_path.suffix in ['.astro', '.tsx', '.jsx']:
                if '<img' in content and 'loading=' not in content:
                    issues.append("⚡ Images missing lazy loading")
                if '.jpeg' in content or '.jpg' in content or '.png' in content:
                    if '.webp' not in content:
                        issues.append("⚡ Consider using WebP image format")
            
            # Code quality
            if 'console.log' in content:
                issues.append("🐛 Remove console.log statements")
            if 'TODO' in content or 'FIXME' in content:
                issues.append("📝 Contains TODO/FIXME comments")
            if file_path.suffix in ['.ts', '.tsx'] and ': any' in content:
                issues.append("🔍 Avoid using 'any' type")
            
            # Accessibility
            if file_path.suffix in ['.astro', '.tsx', '.jsx']:
                if '<img' in content and 'alt=' not in content:
                    issues.append("♿ Images missing alt text")
                if '<button' in content and 'aria-' not in content:
                    issues.append("♿ Buttons may need ARIA labels")
            
            # Mobile
            if file_path.suffix in ['.scss', '.css']:
                if '@media' not in content:
                    issues.append("📱 No responsive breakpoints found")
            
            if issues:
                for issue in issues:
                    print(f"  {issue}")
                total_issues += len(issues)
            else:
                print(f"  ✅ No major issues found")
                
        except Exception as e:
            print(f"  ❌ Error reading file: {e}")
    
    # Suggest improvements
    if total_issues > 0:
        print(f"\n{Colors.BOLD}💡 Suggested Improvements:{Colors.END}")
        
        suggestions = []
        
        # Based on common issues, suggest fixes
        for file_path in files[:3]:
            if file_path.suffix in ['.astro', '.tsx']:
                suggestions.append(f'./ai "improve {file_path.stem} component performance with lazy loading and WebP images"')
                break
        
        for i, suggestion in enumerate(suggestions, 1):
            print(f"{i}. {suggestion}")
        
        print(f"\n{Colors.YELLOW}Run these commands to generate improvements{Colors.END}")

def handle_fix(request: str):
    """Handle fix/improvement requests"""
    print(f"{Colors.CYAN}🔧 Code Improvement Request{Colors.END}")
    
    # Extract what to fix
    fix_keywords = ['improve', 'fix', 'enhance', 'optimize', 'refactor', 'the', 'for']
    words = request.lower().split()
    
    # Find the target (usually after the action word)
    target = None
    for i, word in enumerate(words):
        if word in ['improve', 'fix', 'enhance', 'optimize', 'refactor']:
            if i + 1 < len(words):
                # Get the next few words as target
                target = ' '.join(words[i+1:i+3])
                break
    
    if not target:
        target = request
    
    print(f"Target: {target}")
    
    # Generate improvement task
    improvement_prompt = f"enhance {target} with better performance, accessibility, and user experience"
    
    print(f"\n{Colors.GREEN}Generated improvement task:{Colors.END}")
    print(f'./ai "{improvement_prompt}"')
    
    print(f"\n{Colors.YELLOW}Press Enter to run or Ctrl+C to cancel:{Colors.END}")
    try:
        input()
        # Run the generation
        subprocess.run([sys.executable, "orchestrator/ai", improvement_prompt])
    except KeyboardInterrupt:
        print("\nCancelled")

def handle_generate(request: str):
    """Handle generation requests"""
    # Call the AI task generation script directly with Claude
    # This is the original generation functionality
    
    print(f"{Colors.CYAN}🤔 Understanding your request...{Colors.END}")
    
    # Build the command to run the original task compiler
    cmd = [sys.executable, str(Path(__file__).parent / "run.py")]
    
    # For simple requests, we can try to parse them
    request_lower = request.lower()
    
    # Try to determine template type from request
    if any(word in request_lower for word in ['component', 'button', 'card', 'form', 'modal', 'page']):
        # React component request
        # Extract component name
        words = request.split()
        component_name = None
        for i, word in enumerate(words):
            if word.lower() in ['a', 'an', 'the']:
                if i + 1 < len(words):
                    component_name = words[i + 1].capitalize()
                    if i + 2 < len(words) and words[i + 2].lower() in ['component', 'page']:
                        component_name += words[i + 2].capitalize()
                    break
        
        if not component_name:
            component_name = "Component"
            
        print(f"{Colors.GREEN}✨ Creating React component: {component_name}{Colors.END}")
        
        task_string = f"feature/react-component:component_name={component_name},component_description={request},category=common"
        cmd.extend(["--task", task_string])
        
    elif any(word in request_lower for word in ['function', 'utility', 'helper', 'util']):
        # Utility function request
        words = request.split()
        function_name = "utilityFunction"
        
        for word in words:
            if word.lower() not in ['create', 'build', 'make', 'a', 'an', 'the', 'function', 'utility']:
                function_name = word.lower()
                break
                
        print(f"{Colors.GREEN}🔧 Creating utility function: {function_name}{Colors.END}")
        
        task_string = f"function/utility:function_name={function_name},function_description={request}"
        cmd.extend(["--task", task_string])
        
    elif any(word in request_lower for word in ['api', 'endpoint', 'route']):
        # API endpoint request
        print(f"{Colors.GREEN}🌐 Creating API endpoint{Colors.END}")
        
        task_string = f"feature/api-endpoint:endpoint_path=/api/resource,method=GET,endpoint_description={request}"
        cmd.extend(["--task", task_string])
        
    else:
        # Default to component if unclear
        print(f"{Colors.GREEN}📦 Creating based on your description{Colors.END}")
        
        task_string = f"feature/react-component:component_name=Component,component_description={request},category=common"
        cmd.extend(["--task", task_string])
    
    cmd.append("--verbose")
    
    # Execute
    try:
        subprocess.run(cmd, check=True)
        print(f"\n{Colors.GREEN}✅ Done! Check output/ for generated files.{Colors.END}")
    except subprocess.CalledProcessError:
        print(f"{Colors.RED}Task execution failed.{Colors.END}")
    except FileNotFoundError:
        print(f"{Colors.RED}Could not find task compiler at {cmd[1]}{Colors.END}")

def main():
    if len(sys.argv) < 2:
        print(f"{Colors.CYAN}{Colors.BOLD}Smart AI Assistant{Colors.END}")
        print(f"\n{Colors.YELLOW}Examples:{Colors.END}")
        print(f'  ./ai "create a button component"')
        print(f'  ./ai "review the home page"')
        print(f'  ./ai "improve Banner performance"')
        print(f"\n{Colors.YELLOW}I understand:{Colors.END}")
        print(f"  • Create/Build/Make → Generate new code")
        print(f"  • Review/Analyze/Check → Review existing code")
        print(f"  • Improve/Fix/Enhance → Suggest improvements")
        sys.exit(1)
    
    request = ' '.join(sys.argv[1:])
    
    # Detect intent
    intent, processed_request = detect_intent(request)
    
    print(f"Intent: {Colors.BOLD}{intent}{Colors.END}")
    
    # Route to appropriate handler
    if intent == "review":
        handle_review(request)
    elif intent == "fix":
        handle_fix(request)
    else:
        handle_generate(request)

if __name__ == "__main__":
    main()
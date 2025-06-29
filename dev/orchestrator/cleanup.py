#!/usr/bin/env python3
"""
Cleanup script for AI Task Compiler
Removes test outputs, temp files, and organizes the orchestrator
"""

import os
import shutil
from pathlib import Path
from datetime import datetime, timedelta

class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    CYAN = '\033[96m'
    BOLD = '\033[1m'
    END = '\033[0m'

def format_size(bytes):
    """Format bytes to human readable size"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes < 1024.0:
            return f"{bytes:.1f} {unit}"
        bytes /= 1024.0
    return f"{bytes:.1f} TB"

def get_dir_size(path):
    """Get total size of directory"""
    total = 0
    for entry in Path(path).rglob('*'):
        if entry.is_file():
            total += entry.stat().st_size
    return total

def cleanup_orchestrator():
    """Main cleanup function"""
    print(f"{Colors.BOLD}{Colors.CYAN}🧹 AI Task Compiler Cleanup{Colors.END}")
    print(f"{Colors.CYAN}{'='*50}{Colors.END}\n")
    
    orchestrator_dir = Path(__file__).parent
    total_cleaned = 0
    
    # 1. Clean test outputs
    print(f"{Colors.BOLD}1. Cleaning test outputs...{Colors.END}")
    test_dirs = [
        "test_output",
        "test_enhanced_output", 
        "demo_output",
        "test_faq_output",
        "test_faq_generated"
    ]
    
    for dir_name in test_dirs:
        dir_path = orchestrator_dir / dir_name
        if dir_path.exists():
            size = get_dir_size(dir_path)
            shutil.rmtree(dir_path)
            total_cleaned += size
            print(f"  {Colors.GREEN}✓{Colors.END} Removed {dir_name} ({format_size(size)})")
    
    # 2. Clean temporary files
    print(f"\n{Colors.BOLD}2. Cleaning temporary files...{Colors.END}")
    temp_files = [
        "*.txt",
        "test_prompt.md",
        "claude_output.txt",
        "faq_output.txt",
        "direct_claude_output.txt",
        "claude_print_output.txt"
    ]
    
    for pattern in temp_files:
        for file_path in orchestrator_dir.glob(pattern):
            if file_path.name not in ["requirements.txt", "README.txt"]:  # Keep important txt files
                size = file_path.stat().st_size
                file_path.unlink()
                total_cleaned += size
                print(f"  {Colors.GREEN}✓{Colors.END} Removed {file_path.name} ({format_size(size)})")
    
    # 3. Clean old output directories (keep last 5)
    print(f"\n{Colors.BOLD}3. Cleaning old outputs...{Colors.END}")
    output_dir = orchestrator_dir / "output"
    if output_dir.exists():
        # Get all session directories sorted by date
        session_dirs = sorted([d for d in output_dir.iterdir() if d.is_dir()], 
                            key=lambda x: x.stat().st_mtime, reverse=True)
        
        # Keep only the 5 most recent
        for old_dir in session_dirs[5:]:
            size = get_dir_size(old_dir)
            shutil.rmtree(old_dir)
            total_cleaned += size
            print(f"  {Colors.GREEN}✓{Colors.END} Removed old session: {old_dir.name} ({format_size(size)})")
    
    # 4. Clean Python cache
    print(f"\n{Colors.BOLD}4. Cleaning Python cache...{Colors.END}")
    pycache_dir = orchestrator_dir / "__pycache__"
    if pycache_dir.exists():
        size = get_dir_size(pycache_dir)
        shutil.rmtree(pycache_dir)
        total_cleaned += size
        print(f"  {Colors.GREEN}✓{Colors.END} Removed __pycache__ ({format_size(size)})")
    
    # 5. Clean duplicate/test scripts
    print(f"\n{Colors.BOLD}5. Cleaning test scripts...{Colors.END}")
    test_scripts = [
        "debug-*.py",
        "test-*.py",
        "simple-*.py",
        "smart-interactive.py",
        "interactive.py",
        "run-fixed.py",
        "fix-orchestrator.py",
        "ai-universal.py"
    ]
    
    for pattern in test_scripts:
        for file_path in orchestrator_dir.glob(pattern):
            size = file_path.stat().st_size
            file_path.unlink()
            total_cleaned += size
            print(f"  {Colors.GREEN}✓{Colors.END} Removed {file_path.name} ({format_size(size)})")
    
    # 6. Organize remaining files
    print(f"\n{Colors.BOLD}6. Organizing core files...{Colors.END}")
    
    # Core files to keep
    core_files = {
        "Scripts": [
            "run.py",
            "ai-working.py",
            "ai-orchestrated.py",
            "ai-smart.py",
            "ai-complete.py",
            "ai-final.py",
            "review-and-fix.py",
            "cleanup.py"
        ],
        "Parsers": [
            "claude_output_parser.py",
            "enhanced_claude_parser.py"
        ],
        "Documentation": [
            "README.md",
            "AI_COMPLETE_GUIDE.md",
            "AI_POWERED_README.md",
            "FAQ_GENERATION_SOLUTION.md",
            "AI_WORKING_SOLUTION.md",
            "ORCHESTRATION_GUIDE.md"
        ],
        "Workflows": [
            "example-workflow.json"
        ]
    }
    
    for category, files in core_files.items():
        existing = [f for f in files if (orchestrator_dir / f).exists()]
        if existing:
            print(f"  {Colors.CYAN}{category}:{Colors.END}")
            for f in existing:
                print(f"    • {f}")
    
    # 7. Summary
    print(f"\n{Colors.BOLD}Summary:{Colors.END}")
    print(f"  {Colors.GREEN}✓{Colors.END} Total space cleaned: {format_size(total_cleaned)}")
    
    # Count remaining files
    remaining_files = list(orchestrator_dir.glob("*"))
    output_sessions = len(list((orchestrator_dir / "output").glob("*"))) if (orchestrator_dir / "output").exists() else 0
    
    print(f"  {Colors.CYAN}📁{Colors.END} Remaining files: {len(remaining_files)}")
    print(f"  {Colors.CYAN}📂{Colors.END} Output sessions kept: {output_sessions} (most recent)")
    
    # Suggest next steps
    print(f"\n{Colors.BOLD}Next Steps:{Colors.END}")
    print(f"  1. Review remaining files with: {Colors.CYAN}ls -la{Colors.END}")
    print(f"  2. Test core functionality: {Colors.CYAN}./ai \"build a button\"{Colors.END}")
    print(f"  3. Check orchestration: {Colors.CYAN}./ai-pro \"build a form\"{Colors.END}")
    
    # Create .gitignore if it doesn't exist
    gitignore_path = orchestrator_dir / ".gitignore"
    if not gitignore_path.exists():
        print(f"\n{Colors.YELLOW}Creating .gitignore...{Colors.END}")
        gitignore_content = """# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python

# Test outputs
test_*/
demo_*/
*_test/

# Temporary files
*.txt
!requirements.txt
!README.txt
*.tmp
*.temp

# IDE
.vscode/
.idea/
*.swp
*.swo

# Logs (keeping .gitignore in logs/)
logs/*.log

# Output (keeping .gitignore in output/)
output/*/
"""
        with open(gitignore_path, 'w') as f:
            f.write(gitignore_content)
        print(f"  {Colors.GREEN}✓{Colors.END} Created .gitignore")

def main():
    """Run cleanup with confirmation"""
    orchestrator_dir = Path(__file__).parent
    
    # Show what will be cleaned
    print(f"{Colors.YELLOW}This will clean:{Colors.END}")
    print("  • Test outputs and demo directories")
    print("  • Temporary text files")
    print("  • Old output sessions (keeping last 5)")
    print("  • Python cache files")
    print("  • Duplicate/test scripts")
    print()
    
    response = input(f"{Colors.BOLD}Continue with cleanup? (y/N): {Colors.END}")
    
    if response.lower() == 'y':
        cleanup_orchestrator()
        print(f"\n{Colors.GREEN}{Colors.BOLD}✅ Cleanup complete!{Colors.END}")
    else:
        print(f"{Colors.YELLOW}Cleanup cancelled.{Colors.END}")

if __name__ == "__main__":
    main()
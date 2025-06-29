#!/usr/bin/env python3
"""
AI Review & Fix - Analyze code and automatically generate improvement tasks
"""

import subprocess
import sys
import json
import tempfile
from pathlib import Path
from typing import List, Dict, Optional, Any

class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    CYAN = '\033[96m'
    BOLD = '\033[1m'
    END = '\033[0m'

def analyze_component(file_path: Path) -> Dict[str, Any]:
    """Analyze component and generate improvement suggestions"""
    
    print(f"{Colors.CYAN}📊 Analyzing {file_path.name}...{Colors.END}")
    
    # Read file
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Quick analysis
    analysis = {
        "file": str(file_path),
        "type": file_path.suffix,
        "size": len(content),
        "issues": [],
        "improvements": []
    }
    
    # Performance checks
    if "background-image: url(" in content and "webp" not in content.lower():
        analysis["issues"].append({
            "category": "performance",
            "issue": "Background images not optimized",
            "fix": "Convert images to WebP format"
        })
    
    if "<img" in content and "loading=" not in content:
        analysis["issues"].append({
            "category": "performance", 
            "issue": "Images missing lazy loading",
            "fix": "Add loading='lazy' to images below fold"
        })
    
    # Accessibility checks
    emoji_count = sum(1 for char in content if ord(char) > 127462)
    if emoji_count > 0:
        analysis["issues"].append({
            "category": "accessibility",
            "issue": f"Using {emoji_count} emojis as UI elements",
            "fix": "Replace emojis with proper SVG icons"
        })
    
    # Mobile checks
    if "@media" in content:
        if "display: none" in content:
            hidden_elements = content.count("display: none")
            analysis["issues"].append({
                "category": "mobile",
                "issue": f"{hidden_elements} elements hidden on mobile",
                "fix": "Consider progressive enhancement instead of hiding"
            })
    
    # Animation checks
    animation_count = content.count("@keyframes")
    if animation_count > 3:
        analysis["issues"].append({
            "category": "performance",
            "issue": f"{animation_count} animations may impact performance",
            "fix": "Consider reducing animations or using will-change"
        })
    
    # Generate improvements
    for issue in analysis["issues"]:
        if issue["category"] == "performance":
            if "images" in issue["issue"]:
                analysis["improvements"].append({
                    "task": f"optimize images in {file_path.name}",
                    "type": "optimization",
                    "priority": "high"
                })
        elif issue["category"] == "accessibility":
            if "emoji" in issue["issue"]:
                analysis["improvements"].append({
                    "task": f"create icon component to replace emojis in {file_path.name}",
                    "type": "component",
                    "priority": "medium"
                })
        elif issue["category"] == "mobile":
            analysis["improvements"].append({
                "task": f"improve mobile experience for {file_path.name}",
                "type": "enhancement",
                "priority": "high"
            })
    
    return analysis

def generate_fix_tasks(analysis: Dict[str, Any]) -> List[str]:
    """Generate AI task commands to fix issues"""
    tasks = []
    
    for improvement in analysis["improvements"]:
        if improvement["type"] == "component":
            # Generate component creation task
            if "icon" in improvement["task"]:
                tasks.append(
                    "./ai \"create an icon component library with SVG icons for touch, wireless, collaboration, and cloud features\""
                )
        elif improvement["type"] == "optimization":
            # Generate optimization task
            if "images" in improvement["task"]:
                tasks.append(
                    "./ai \"create an image optimization utility that converts images to WebP format\""
                )
        elif improvement["type"] == "enhancement":
            # Generate enhancement task
            if "mobile" in improvement["task"]:
                tasks.append(
                    f"./ai \"enhance {Path(analysis['file']).stem} component for better mobile experience with progressive enhancement\""
                )
    
    return tasks

def display_analysis(analysis: Dict[str, Any]):
    """Display analysis results"""
    print(f"\n{Colors.BOLD}📋 Analysis Results{Colors.END}")
    print(f"File: {analysis['file']}")
    print(f"Type: {analysis['type']} ({analysis['size']} bytes)")
    
    if analysis["issues"]:
        print(f"\n{Colors.YELLOW}🔍 Issues Found:{Colors.END}")
        for issue in analysis["issues"]:
            print(f"  [{issue['category'].upper()}] {issue['issue']}")
            print(f"    → {Colors.GREEN}{issue['fix']}{Colors.END}")
    else:
        print(f"\n{Colors.GREEN}✅ No major issues found!{Colors.END}")
    
    if analysis["improvements"]:
        print(f"\n{Colors.CYAN}💡 Suggested Improvements:{Colors.END}")
        for i, imp in enumerate(analysis["improvements"], 1):
            print(f"  {i}. {imp['task']} [{imp['priority']}]")

def main():
    if len(sys.argv) < 2:
        print(f"{Colors.BOLD}AI Review & Fix{Colors.END}")
        print("\nUsage: review-and-fix.py <component-file>")
        print("\nExample: review-and-fix.py src/components/home/Banner/Banner.astro")
        sys.exit(1)
    
    file_path = Path(sys.argv[1])
    
    if not file_path.exists():
        # Try to find it
        search_paths = [
            Path(f"src/components/home/{sys.argv[1]}/{sys.argv[1]}.astro"),
            Path(f"src/components/home/{sys.argv[1]}.astro"),
            Path(f"src/components/{sys.argv[1]}.tsx"),
        ]
        
        for sp in search_paths:
            if sp.exists():
                file_path = sp
                break
        else:
            print(f"{Colors.RED}File not found: {sys.argv[1]}{Colors.END}")
            sys.exit(1)
    
    # Analyze
    analysis = analyze_component(file_path)
    display_analysis(analysis)
    
    # Generate fix tasks
    tasks = generate_fix_tasks(analysis)
    
    if tasks:
        print(f"\n{Colors.BOLD}🔧 Auto-Fix Commands:{Colors.END}")
        for i, task in enumerate(tasks, 1):
            print(f"\n{i}. {task}")
        
        print(f"\n{Colors.YELLOW}Run these commands to generate fixes, or press Enter to run all:{Colors.END}")
        response = input(f"{Colors.GREEN}→{Colors.END} ").strip()
        
        if response == "":
            # Run all tasks
            for task in tasks:
                print(f"\n{Colors.CYAN}Running: {task}{Colors.END}")
                subprocess.run(task, shell=True)
        elif response.isdigit():
            # Run specific task
            task_num = int(response) - 1
            if 0 <= task_num < len(tasks):
                print(f"\n{Colors.CYAN}Running: {tasks[task_num]}{Colors.END}")
                subprocess.run(tasks[task_num], shell=True)
    
    # Save analysis
    report_dir = Path("orchestrator/reviews")
    report_dir.mkdir(exist_ok=True)
    
    report_file = report_dir / f"{file_path.stem}_analysis.json"
    with open(report_file, 'w') as f:
        json.dump(analysis, f, indent=2)
    
    print(f"\n{Colors.GREEN}📄 Analysis saved to: {report_file}{Colors.END}")

if __name__ == "__main__":
    main()
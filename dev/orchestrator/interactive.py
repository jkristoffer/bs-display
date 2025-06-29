#!/usr/bin/env python3
"""
Interactive mode for AI Task Compiler
"""

import subprocess
import sys
from pathlib import Path

def clear_screen():
    print("\033[2J\033[H")

def show_menu():
    print("🤖 AI Task Compiler - Interactive Mode")
    print("="*40)
    print("\n1. Create React Component")
    print("2. Create Utility Function")
    print("3. Create API Endpoint")
    print("4. Add TypeScript Types")
    print("5. Create Data Integration")
    print("6. Run Custom Task")
    print("7. Exit")
    print("\nSelect option (1-7): ", end="")

def get_component_details():
    print("\n📦 Create React Component")
    print("-"*30)
    name = input("Component name (e.g., UserCard): ").strip()
    desc = input("Description: ").strip()
    category = input("Category (common/pages/forms) [common]: ").strip() or "common"
    
    # Props
    props = []
    print("\nAdd props (press Enter with empty name to finish):")
    while True:
        prop_name = input("  Prop name: ").strip()
        if not prop_name:
            break
        prop_type = input("  Prop type: ").strip()
        prop_desc = input("  Description: ").strip()
        props.append({
            "name": prop_name,
            "type": prop_type,
            "description": prop_desc
        })
    
    return {
        "template": "feature/react-component",
        "component_name": name,
        "component_description": desc,
        "category": category,
        "props": props
    }

def get_utility_details():
    print("\n🔧 Create Utility Function")
    print("-"*30)
    name = input("Function name (e.g., formatDate): ").strip()
    desc = input("Description: ").strip()
    signature = input("TypeScript signature (optional): ").strip()
    
    return {
        "template": "function/utility",
        "function_name": name,
        "function_description": desc,
        "function_signature": signature if signature else None
    }

def get_api_details():
    print("\n🌐 Create API Endpoint")
    print("-"*30)
    path = input("Endpoint path (e.g., /api/users): ").strip()
    method = input("HTTP method (GET/POST/PUT/DELETE): ").strip().upper()
    desc = input("Description: ").strip()
    
    return {
        "template": "feature/api-endpoint",
        "endpoint_path": path,
        "method": method,
        "endpoint_description": desc
    }

def build_task_string(details):
    """Build task string from details"""
    template = details.pop("template")
    
    # Filter out None values and format
    params = []
    for key, value in details.items():
        if value is not None:
            if isinstance(value, list):
                # Skip complex props for now in interactive mode
                continue
            params.append(f"{key}={value}")
    
    return f"{template}:{','.join(params)}"

def run_task(task_string, dry_run=False):
    """Execute the orchestrator with task"""
    cmd = [
        "python3",
        str(Path(__file__).parent / "run.py"),
        "--task",
        task_string
    ]
    
    if dry_run:
        cmd.append("--dry-run")
    
    print(f"\n🚀 Running: {' '.join(cmd)}")
    print("-"*50)
    
    result = subprocess.run(cmd)
    return result.returncode == 0

def main():
    while True:
        clear_screen()
        show_menu()
        
        try:
            choice = input().strip()
            
            if choice == "1":
                details = get_component_details()
                task = build_task_string(details)
                
            elif choice == "2":
                details = get_utility_details()
                task = build_task_string(details)
                
            elif choice == "3":
                details = get_api_details()
                task = build_task_string(details)
                
            elif choice == "4":
                print("\n📝 Add TypeScript Types")
                print("-"*30)
                file_path = input("File path: ").strip()
                requirements = input("Type requirements: ").strip()
                task = f"refactor/add-types:file_path={file_path},type_requirements={requirements}"
                
            elif choice == "5":
                print("\n🔄 Create Data Integration")
                print("-"*30)
                name = input("Feature name: ").strip()
                source = input("Data source: ").strip()
                transform = input("Transformation description: ").strip()
                task = f"feature/data-integration:feature_name={name},data_source={source},transformation_description={transform}"
                
            elif choice == "6":
                print("\n✏️ Custom Task")
                print("-"*30)
                task = input("Enter task string (template:key=value,...): ").strip()
                
            elif choice == "7":
                print("\n👋 Goodbye!")
                break
                
            else:
                print("\n❌ Invalid option")
                input("\nPress Enter to continue...")
                continue
            
            # Preview and confirm
            print(f"\n📋 Task: {task}")
            confirm = input("\nRun this task? (y/n/d for dry-run) [y]: ").strip().lower() or "y"
            
            if confirm == "y":
                run_task(task)
            elif confirm == "d":
                run_task(task, dry_run=True)
            else:
                print("Cancelled")
            
            input("\nPress Enter to continue...")
            
        except KeyboardInterrupt:
            print("\n\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"\n❌ Error: {e}")
            input("\nPress Enter to continue...")

if __name__ == "__main__":
    main()
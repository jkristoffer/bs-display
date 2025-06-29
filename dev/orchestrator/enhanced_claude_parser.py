#!/usr/bin/env python3
"""
Enhanced Claude Output Parser - Handles multiple output formats
"""

import re
from pathlib import Path
from typing import List, Tuple, Dict, Optional

def parse_claude_output(output: str) -> List[Tuple[str, str]]:
    """
    Parse Claude's text output to extract filename and code content pairs.
    
    Handles multiple formats:
    1. With filename comment inside code block:
       ```typescript
       // filename: src/components/Button.tsx
       [code content]
       ```
    
    2. With heading before code block:
       ## Button.tsx
       ```typescript
       [code content]
       ```
    
    3. With filename mention before code block:
       Here's the Button.tsx file:
       ```typescript
       [code content]
       ```
    """
    files = []
    
    # Format 1: filename comment inside code block
    pattern1 = r'```(?:\w+)?\s*\n(?://|#|/\*)\s*filename:\s*([^\n]+)\n(.*?)```'
    matches1 = re.finditer(pattern1, output, re.DOTALL | re.MULTILINE)
    
    for match in matches1:
        filename = match.group(1).strip()
        content = match.group(2).strip()
        files.append((filename, content))
    
    # If we found files with format 1, return them
    if files:
        return files
    
    # Format 2: Heading with filename before code block
    # Matches: ## ComponentName.tsx\n```typescript\ncontent```
    pattern2 = r'##\s+([^\n]+\.(tsx?|jsx?|scss|css|ts|js))\s*\n```(?:\w+)?\s*\n(.*?)```'
    matches2 = re.finditer(pattern2, output, re.DOTALL | re.MULTILINE)
    
    for match in matches2:
        filename = match.group(1).strip()
        content = match.group(3).strip()
        
        # Extract base component name
        if '.module.scss' in filename:
            base_name = filename.replace('.module.scss', '')
        elif '.tsx' in filename:
            base_name = filename.replace('.tsx', '')
        elif '.ts' in filename and filename != 'index.ts':
            base_name = filename.replace('.ts', '')
        else:
            base_name = filename.split('.')[0]
        
        # Try to infer path from component name
        if 'Page' in base_name:
            path_prefix = f"src/components/pages/{base_name}/"
        elif any(x in base_name.lower() for x in ['button', 'input', 'form', 'search']):
            path_prefix = f"src/components/common/{base_name}/"
        else:
            path_prefix = f"src/components/common/{base_name}/"
        
        # Special handling for index.ts
        if filename == 'index.ts':
            # Get component name from previous matches or context
            if files and 'Page' in files[0][0]:
                component_match = re.search(r'/([^/]+)/[^/]+\.tsx$', files[0][0])
                if component_match:
                    component_name = component_match.group(1)
                    path_prefix = f"src/components/pages/{component_name}/"
            
        filename = path_prefix + filename
        files.append((filename, content))
    
    # Format 3: Filename mention before code block
    # Matches variations like "Here's FAQPage.tsx:" or "The FAQPage.module.scss file:"
    pattern3 = r'(?:Here\'s|The|Creating|File:)\s+(?:the\s+)?([^\s:]+\.(tsx?|jsx?|scss|css|ts|js))(?:\s+file)?[:\s]*\n```(?:\w+)?\s*\n(.*?)```'
    matches3 = re.finditer(pattern3, output, re.DOTALL | re.MULTILINE | re.IGNORECASE)
    
    for match in matches3:
        filename = match.group(1).strip()
        content = match.group(3).strip()
        # Avoid duplicates
        if not any(f[0].endswith(filename) for f in files):
            # Try to infer path
            base_name = filename.replace('.tsx', '').replace('.module.scss', '').replace('.ts', '')
            if 'Page' in base_name:
                path = f"src/components/pages/{base_name}/"
            else:
                path = f"src/components/common/{base_name}/"
            
            if filename.endswith('.module.scss'):
                full_filename = f"{path}{base_name}.module.scss"
            elif filename == 'index.ts':
                full_filename = f"{path}index.ts"
            else:
                full_filename = f"{path}{filename}"
                
            files.append((full_filename, content))
    
    # If still no files found, try to extract any code blocks and infer filenames
    if not files:
        # Look for any TypeScript/React code blocks
        code_pattern = r'```(?:typescript|tsx|jsx)?\s*\n(.*?)```'
        code_matches = list(re.finditer(code_pattern, output, re.DOTALL | re.MULTILINE))
        
        # Look for SCSS/CSS blocks
        style_pattern = r'```(?:scss|css)\s*\n(.*?)```'
        style_matches = list(re.finditer(style_pattern, output, re.DOTALL | re.MULTILINE))
        
        # Try to extract component name from the code
        component_name = None
        for match in code_matches:
            content = match.group(1)
            # Look for export statements or interface names
            export_match = re.search(r'export\s+(?:const|function)\s+(\w+)', content)
            interface_match = re.search(r'interface\s+(\w+)Props', content)
            
            if export_match:
                component_name = export_match.group(1)
                break
            elif interface_match:
                component_name = interface_match.group(1)
                break
        
        if component_name:
            # Main component file
            if code_matches:
                content = code_matches[0].group(1).strip()
                if 'Page' in component_name:
                    filename = f"src/components/pages/{component_name}/{component_name}.tsx"
                else:
                    filename = f"src/components/common/{component_name}/{component_name}.tsx"
                files.append((filename, content))
            
            # Style file
            if style_matches:
                content = style_matches[0].group(1).strip()
                if 'Page' in component_name:
                    filename = f"src/components/pages/{component_name}/{component_name}.module.scss"
                else:
                    filename = f"src/components/common/{component_name}/{component_name}.module.scss"
                files.append((filename, content))
            
            # Index file - create a simple export
            if component_name:
                index_content = f"export {{ {component_name} }} from './{component_name}';"
                if 'Page' in component_name:
                    filename = f"src/components/pages/{component_name}/index.ts"
                else:
                    filename = f"src/components/common/{component_name}/index.ts"
                files.append((filename, index_content))
    
    return files

def create_files_from_output(output: str, base_dir: Path) -> List[str]:
    """
    Parse Claude's output and create actual files in the specified directory.
    
    Returns list of created file paths.
    """
    created_files = []
    
    # Parse the output
    file_pairs = parse_claude_output(output)
    
    if not file_pairs:
        return created_files
    
    # Create each file
    for filename, content in file_pairs:
        # Clean up the filename
        filename = filename.strip()
        
        # Remove 'src/' prefix if present (we'll add our own base path)
        if filename.startswith('src/'):
            filename = filename[4:]
        
        # Create full path
        file_path = base_dir / filename
        
        # Create parent directories
        file_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Write the file
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
                if not content.endswith('\n'):
                    f.write('\n')  # Ensure file ends with newline
            
            created_files.append(str(file_path.relative_to(base_dir)))
            
        except Exception as e:
            print(f"Error creating {file_path}: {e}")
    
    return created_files

# Test the enhanced parser
if __name__ == "__main__":
    # Test with the actual Claude output we captured
    test_output = """I don't have write permissions to create the files. However, I can provide you with the complete React FAQ component files as requested:

## FAQPage.tsx
```typescript
import { useState } from 'react';
import styles from './FAQPage.module.scss';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQPageProps {
  faqs: FAQItem[];
  searchable?: boolean;
}

export const FAQPage: React.FC<FAQPageProps> = ({ faqs, searchable = false }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  return <div>FAQ Component</div>;
};
```

## FAQPage.module.scss
```scss
.faqPage {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}
```

## index.ts
```typescript
export { FAQPage } from './FAQPage';
```
"""
    
    print("Testing enhanced parser...")
    files = parse_claude_output(test_output)
    
    print(f"\nFound {len(files)} files:")
    for filename, content in files:
        print(f"  - {filename} ({len(content)} chars)")
    
    # Test file creation
    test_dir = Path("test_enhanced_output")
    test_dir.mkdir(exist_ok=True)
    
    created = create_files_from_output(test_output, test_dir)
    print(f"\nCreated {len(created)} files in {test_dir}")
    for f in created:
        print(f"  - {f}")
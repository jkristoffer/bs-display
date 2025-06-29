#!/usr/bin/env python3
"""
Claude Output Parser - Extracts code blocks from Claude's text output and creates files
"""

import re
from pathlib import Path
from typing import List, Tuple, Dict

def parse_claude_output(output: str) -> List[Tuple[str, str]]:
    """
    Parse Claude's text output to extract filename and code content pairs.
    
    Looks for patterns like:
    ```typescript
    // filename: src/components/Button.tsx
    [code content]
    ```
    
    Returns list of (filename, content) tuples
    """
    files = []
    
    # Pattern to match code blocks with filename comments
    # Matches: ```language\n// filename: path/to/file\ncontent```
    pattern = r'```(?:\w+)?\s*\n(?://|#|/\*)\s*filename:\s*([^\n]+)\n(.*?)```'
    
    matches = re.finditer(pattern, output, re.DOTALL | re.MULTILINE)
    
    for match in matches:
        filename = match.group(1).strip()
        content = match.group(2)
        
        # Remove leading/trailing whitespace but preserve internal formatting
        content = content.strip()
        
        files.append((filename, content))
    
    # Also check for alternative format without language specifier
    # Matches: // filename: path/to/file\n```\ncontent\n```
    alt_pattern = r'(?://|#|/\*)\s*filename:\s*([^\n]+)\s*\n```(?:\w+)?\s*\n(.*?)```'
    
    alt_matches = re.finditer(alt_pattern, output, re.DOTALL | re.MULTILINE)
    
    for match in alt_matches:
        filename = match.group(1).strip()
        content = match.group(2).strip()
        
        # Avoid duplicates
        if not any(f[0] == filename for f in files):
            files.append((filename, content))
    
    return files

def create_files_from_output(output: str, base_dir: Path) -> Dict[str, Path]:
    """
    Parse Claude's output and create actual files in the specified directory.
    
    Returns dictionary mapping relative paths to absolute paths of created files.
    """
    created_files = {}
    
    # Parse the output
    file_pairs = parse_claude_output(output)
    
    if not file_pairs:
        print("No files found in Claude's output")
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
            
            created_files[filename] = file_path
            print(f"Created: {file_path}")
            
        except Exception as e:
            print(f"Error creating {file_path}: {e}")
    
    return created_files

def extract_component_structure(output: str) -> Dict[str, str]:
    """
    Extract component structure from Claude's output.
    Useful for understanding what was generated.
    """
    structure = {
        'component_files': [],
        'style_files': [],
        'test_files': [],
        'other_files': []
    }
    
    file_pairs = parse_claude_output(output)
    
    for filename, _ in file_pairs:
        if filename.endswith('.tsx') or filename.endswith('.jsx'):
            structure['component_files'].append(filename)
        elif filename.endswith('.scss') or filename.endswith('.css'):
            structure['style_files'].append(filename)
        elif 'test' in filename.lower() or 'spec' in filename.lower():
            structure['test_files'].append(filename)
        else:
            structure['other_files'].append(filename)
    
    return structure

# Test the parser
if __name__ == "__main__":
    # Example Claude output
    test_output = """
I'll create a Button component for you.

```typescript
// filename: src/components/common/Button/Button.tsx
import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => {
  return (
    <button 
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
```

```scss
// filename: src/components/common/Button/Button.module.scss
.button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &.primary {
    background-color: #007bff;
    color: white;
  }
  
  &.secondary {
    background-color: #6c757d;
    color: white;
  }
}
```

```typescript
// filename: src/components/common/Button/index.ts
export { Button } from './Button';
```
"""
    
    print("Testing parser...")
    files = parse_claude_output(test_output)
    
    print(f"\nFound {len(files)} files:")
    for filename, content in files:
        print(f"  - {filename} ({len(content)} chars)")
    
    # Test file creation
    test_dir = Path("test_output")
    test_dir.mkdir(exist_ok=True)
    
    created = create_files_from_output(test_output, test_dir)
    print(f"\nCreated {len(created)} files in {test_dir}")
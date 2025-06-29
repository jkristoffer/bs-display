# How to Use AI Task Compiler - FAQ Page Example

This guide shows you how to use the AI Task Compiler to create a FAQ page feature.

## Step 1: Understand What You Want to Build

**Goal**: Create a FAQ page with:
- Categorized questions and answers
- Search functionality
- Expandable/collapsible answers
- Responsive design

## Step 2: Choose Your Approach

### Option A: Use the Pre-made Workflow (Recommended)
```bash
python3 orchestrator/run.py --workflow orchestrator/workflows/faq-page-workflow.json
```

### Option B: Create Individual Tasks
```bash
# Create the main FAQ page component
python3 orchestrator/run.py --task "feature/react-component:component_name=FAQPage,component_description=FAQ page with search and categories,category=pages"

# Create the search utility
python3 orchestrator/run.py --task "function/utility:function_name=searchFAQs,function_description=Search FAQ items by content,function_signature=(faqs: FAQ[], searchTerm: string): FAQ[]"

# Create the FAQ item component
python3 orchestrator/run.py --task "feature/react-component:component_name=FAQItem,component_description=Single FAQ accordion item,category=common"
```

## Step 3: Test with Dry Run First

Always test with `--dry-run` to see what will be generated:

```bash
python3 orchestrator/run.py --workflow orchestrator/workflows/faq-page-workflow.json --dry-run --verbose
```

This shows you:
- What templates will be used
- How variables will be substituted
- What files would be created
- No actual code generation happens

## Step 4: Run the Actual Generation

Remove `--dry-run` to generate real code:

```bash
python3 orchestrator/run.py --workflow orchestrator/workflows/faq-page-workflow.json --verbose
```

## Step 5: Review the Output

The orchestrator will:
1. Create a session directory: `output/20250629_HHMMSS/`
2. Generate code for each task
3. Run validation checks
4. Run code review (scoring functional programming compliance)
5. Save results summary

Check the output:
```bash
# View the session results
cat output/20250629_*/results.json

# Check generated components
ls -la output/20250629_*/feature_react-component/
ls -la output/20250629_*/function_utility/
```

## Step 6: Integrate Generated Code

1. **Review the code** - Check each generated file
2. **Copy to your project** - Move files to appropriate directories
3. **Install dependencies** - If any new ones are needed
4. **Test the feature** - Ensure it works as expected

Example integration:
```bash
# Copy FAQ page component
cp output/20250629_*/feature_react-component/FAQPage.tsx src/components/pages/
cp output/20250629_*/feature_react-component/FAQPage.module.scss src/components/pages/

# Copy search utility
cp output/20250629_*/function_utility/searchFAQs.ts src/utils/

# Copy FAQ item component
cp output/20250629_*/feature_react-component_2/FAQItem.tsx src/components/common/
```

## What Gets Generated

### 1. FAQPage Component (`FAQPage.tsx`)
```typescript
import React, { useState, useMemo } from 'react';
import { FAQItem } from '../common/FAQItem';
import { searchFAQs } from '../../utils/searchFAQs';
import styles from './FAQPage.module.scss';

interface FAQPageProps {
  categories: FAQCategory[];
}

export const FAQPage: React.FC<FAQPageProps> = ({ categories }) => {
  // Search functionality
  // Category display
  // Accordion management
  // ...
};
```

### 2. Search Utility (`searchFAQs.ts`)
```typescript
export const searchFAQs = (faqs: FAQ[], searchTerm: string): FAQ[] => {
  // Pure function for searching
  // Case-insensitive matching
  // Returns filtered results
};
```

### 3. FAQ Item Component (`FAQItem.tsx`)
```typescript
interface FAQItemProps {
  question: string;
  answer: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export const FAQItem: React.FC<FAQItemProps> = ({ ... }) => {
  // Accordion UI
  // Smooth animations
  // Click handling
};
```

## Quality Checks

The orchestrator automatically:
- ✅ Validates TypeScript syntax
- ✅ Checks functional programming compliance
- ✅ Ensures no `any` types
- ✅ Verifies proper exports
- ✅ Scores code quality (target: 90+/100)

## Tips for Success

1. **Start Simple**: Test with single tasks before workflows
2. **Use Verbose Mode**: Add `--verbose` to see detailed progress
3. **Check Logs**: Review `logs/[session_id].log` for issues
4. **Iterate**: Refine inputs based on generated output
5. **Customize Templates**: Modify templates in `templates/` for your needs

## Common Issues

### "Template not found"
```bash
# List available templates
python3 orchestrator/run.py --list-templates
```

### "Claude CLI not found"
```bash
# Ensure Claude is installed
which claude
```

### Low Code Review Score
- Check functional programming compliance
- Ensure pure functions (no side effects)
- Use immutable data patterns
- Add proper TypeScript types

## Next Steps

1. **Create your own workflows** - Combine tasks for complex features
2. **Customize templates** - Adapt to your project's patterns
3. **Add new templates** - Create templates for your common tasks
4. **Integrate with CI/CD** - Automate code generation in pipelines

## Example: Complete FAQ Page Workflow

Here's what happens when you run the FAQ workflow:

```bash
$ python3 orchestrator/run.py --workflow orchestrator/workflows/faq-page-workflow.json

==================================================
Workflow Compilation
==================================================
Session ID: 20250629_160230
Total Tasks: 3
Completed: 3 ✅
Failed: 0 ❌

Results saved to: orchestrator/output/20250629_160230/results.json

Task 1: FAQPage Component
- Score: 95/100 ✅
- Files: FAQPage.tsx, FAQPage.module.scss, index.ts

Task 2: searchFAQs Utility  
- Score: 100/100 ✅
- Files: searchFAQs.ts

Task 3: FAQItem Component
- Score: 98/100 ✅
- Files: FAQItem.tsx, FAQItem.module.scss, index.ts
```

The generated code is production-ready, follows functional programming principles, and includes proper TypeScript types!
# FAQ Page Workflow Visualization

## 🎯 Goal: Create a Complete FAQ Page

```
┌─────────────────────────────────────────────────────────────┐
│                    FAQ Page Feature                         │
│                                                             │
│  User Input: "I want to create a FAQ page"                 │
│                         ↓                                   │
│              AI Task Compiler Orchestrator                  │
│                         ↓                                   │
│              Breaks down into 3 tasks                      │
└─────────────────────────────────────────────────────────────┘
                         ↓
     ┌───────────────────┼───────────────────┐
     ↓                   ↓                   ↓
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│   Task 1    │   │   Task 2    │   │   Task 3    │
│  FAQPage    │   │ searchFAQs  │   │  FAQItem    │
│ Component   │   │  Utility    │   │ Component   │
└─────────────┘   └─────────────┘   └─────────────┘
     ↓                   ↓                   ↓
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│   Claude    │   │   Claude    │   │   Claude    │
│ Generates   │   │ Generates   │   │ Generates   │
│    Code     │   │    Code     │   │    Code     │
└─────────────┘   └─────────────┘   └─────────────┘
     ↓                   ↓                   ↓
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ Validation  │   │ Validation  │   │ Validation  │
│ Code Review │   │ Code Review │   │ Code Review │
│ Score: 95   │   │ Score: 100  │   │ Score: 98   │
└─────────────┘   └─────────────┘   └─────────────┘
     ↓                   ↓                   ↓
     └───────────────────┼───────────────────┘
                         ↓
              ┌─────────────────────┐
              │   Final Output      │
              │                     │
              │ ✅ FAQPage.tsx      │
              │ ✅ FAQPage.scss     │
              │ ✅ searchFAQs.ts    │
              │ ✅ FAQItem.tsx      │
              │ ✅ FAQItem.scss     │
              │ ✅ All tests pass   │
              └─────────────────────┘
```

## 📋 Step-by-Step Process

### 1️⃣ Define the Workflow
```json
{
  "name": "FAQ Page Feature",
  "tasks": [
    { "template": "feature/react-component", "inputs": {...} },
    { "template": "function/utility", "inputs": {...} },
    { "template": "feature/react-component", "inputs": {...} }
  ]
}
```

### 2️⃣ Run the Orchestrator
```bash
python3 orchestrator/run.py --workflow orchestrator/workflows/faq-page-workflow.json
```

### 3️⃣ What Happens Behind the Scenes

#### Task 1: FAQPage Component
```
Template: feature/react-component
    ↓
Renders with inputs:
- component_name: "FAQPage"
- props: [categories]
- behavior: "search + accordion"
    ↓
Claude receives prompt
    ↓
Generates:
- FAQPage.tsx (main component)
- FAQPage.module.scss (styles)
- index.ts (exports)
```

#### Task 2: Search Utility
```
Template: function/utility
    ↓
Renders with inputs:
- function_name: "searchFAQs"
- signature: "(faqs: FAQ[], searchTerm: string): FAQ[]"
- behavior: "case-insensitive search"
    ↓
Claude receives prompt
    ↓
Generates:
- searchFAQs.ts (pure function)
```

#### Task 3: FAQItem Component
```
Template: feature/react-component
    ↓
Renders with inputs:
- component_name: "FAQItem"
- props: [question, answer, isExpanded, onToggle]
- behavior: "accordion with animation"
    ↓
Claude receives prompt
    ↓
Generates:
- FAQItem.tsx (accordion component)
- FAQItem.module.scss (animations)
- index.ts (exports)
```

### 4️⃣ Quality Assurance
Each generated file goes through:
- ✅ TypeScript validation
- ✅ Functional programming checks
- ✅ Project standards compliance
- ✅ Code review scoring

### 5️⃣ Final Integration
```bash
# Copy generated files to your project
cp output/[session]/feature_react-component/FAQPage.* src/components/pages/
cp output/[session]/function_utility/searchFAQs.ts src/utils/
cp output/[session]/feature_react-component_2/FAQItem.* src/components/common/

# Use in your app
import { FAQPage } from '@/components/pages/FAQPage';
```

## 🎨 Generated Code Example

### FAQPage.tsx (simplified)
```typescript
import React, { useState, useMemo } from 'react';
import { FAQItem } from '../common/FAQItem';
import { searchFAQs } from '../../utils/searchFAQs';
import styles from './FAQPage.module.scss';

interface FAQPageProps {
  categories: FAQCategory[];
}

export const FAQPage: React.FC<FAQPageProps> = ({ categories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const filteredFAQs = useMemo(() => {
    const allFAQs = categories.flatMap(cat => cat.faqs);
    return searchFAQs(allFAQs, searchTerm);
  }, [categories, searchTerm]);

  const handleToggle = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={styles.faqPage}>
      <input
        type="search"
        placeholder="Search FAQs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
      
      {filteredFAQs.map(faq => (
        <FAQItem
          key={faq.id}
          question={faq.question}
          answer={faq.answer}
          isExpanded={expandedItems.has(faq.id)}
          onToggle={() => handleToggle(faq.id)}
        />
      ))}
    </div>
  );
};
```

## 🚀 Benefits of This Approach

1. **Consistency**: All components follow the same patterns
2. **Quality**: Automatic functional programming compliance
3. **Speed**: Generate complete features in minutes
4. **Modularity**: Each piece is independent and testable
5. **Documentation**: Code comes with proper types and comments

## 💡 Tips for Creating Your Own Workflows

1. **Break Down Features**: Identify distinct components/utilities
2. **Use Existing Templates**: Leverage pre-made templates
3. **Provide Clear Inputs**: Be specific about behavior and props
4. **Test Incrementally**: Run tasks individually first
5. **Iterate**: Refine based on generated output

## 🔄 Workflow Variations

### Simple FAQ (No Search)
```bash
python3 orchestrator/run.py --task "feature/react-component:component_name=SimpleFAQ,component_description=Basic FAQ list without search"
```

### FAQ with Categories Only
```bash
python3 orchestrator/run.py --task "feature/react-component:component_name=CategorizedFAQ,component_description=FAQ grouped by categories"
```

### FAQ Data Fetcher
```bash
python3 orchestrator/run.py --task "feature/data-integration:feature_name=FAQDataFetcher,data_source=API endpoint /api/faqs"
```

This visual guide shows exactly how the AI Task Compiler transforms a high-level goal ("create a FAQ page") into production-ready code through templates, Claude, and automated validation!
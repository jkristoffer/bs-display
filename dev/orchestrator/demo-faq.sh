#!/bin/bash

# AI Task Compiler Demo - Creating a FAQ Page
# This script demonstrates the complete workflow

echo "🚀 AI Task Compiler Demo - Creating a FAQ Page"
echo "=============================================="
echo ""

# Function to pause and wait for user
pause() {
    echo ""
    read -p "Press Enter to continue..."
    echo ""
}

# Step 1: Show available templates
echo "📋 Step 1: Available Templates"
echo "------------------------------"
python3 orchestrator/run.py --list-templates
pause

# Step 2: Show the FAQ workflow
echo "📋 Step 2: FAQ Workflow Contents"
echo "--------------------------------"
echo "This workflow will create:"
echo "  1. FAQPage component (main page with search)"
echo "  2. searchFAQs utility (search functionality)"
echo "  3. FAQItem component (individual Q&A accordion)"
echo ""
cat orchestrator/workflows/faq-page-workflow.json | head -20
echo "... (truncated)"
pause

# Step 3: Dry run
echo "🧪 Step 3: Dry Run (Preview what will happen)"
echo "--------------------------------------------"
python3 orchestrator/run.py --workflow orchestrator/workflows/faq-page-workflow.json --dry-run
pause

# Step 4: Check rendered prompts
echo "👀 Step 4: Example Rendered Prompt"
echo "---------------------------------"
echo "Here's what Claude will receive for the FAQItem component:"
echo ""
ls -la orchestrator/output/*/feature_react-component_prompt.md | tail -1 | xargs head -30
echo "... (truncated)"
pause

# Step 5: Actual run (commented out for safety)
echo "🏃 Step 5: Run Actual Generation"
echo "--------------------------------"
echo "To generate real code, run:"
echo ""
echo "  python3 orchestrator/run.py --workflow orchestrator/workflows/faq-page-workflow.json"
echo ""
echo "This will:"
echo "  - Send prompts to Claude"
echo "  - Generate TypeScript/React code"
echo "  - Run validation checks"
echo "  - Score code quality"
echo "  - Save all outputs to orchestrator/output/"
pause

# Step 6: Integration
echo "📦 Step 6: Integration Steps"
echo "---------------------------"
echo "After generation, integrate the code:"
echo ""
echo "  1. Review generated files in orchestrator/output/[session]/"
echo "  2. Copy components to src/components/"
echo "  3. Copy utilities to src/utils/"
echo "  4. Import and use in your pages"
echo ""
echo "Example usage in a page:"
echo ""
cat << 'EOF'
import { FAQPage } from '@/components/pages/FAQPage';

const faqCategories = [
  {
    name: "General",
    faqs: [
      { id: "1", question: "What is a smartboard?", answer: "..." },
      { id: "2", question: "How do I install it?", answer: "..." }
    ]
  },
  {
    name: "Technical",
    faqs: [
      { id: "3", question: "What are the system requirements?", answer: "..." }
    ]
  }
];

export default function FAQ() {
  return <FAQPage categories={faqCategories} />;
}
EOF
echo ""
pause

# Summary
echo "✅ Summary"
echo "----------"
echo "The AI Task Compiler:"
echo "  1. Takes high-level goals (create FAQ page)"
echo "  2. Breaks them into concrete tasks"
echo "  3. Uses templates to generate prompts"
echo "  4. Calls Claude to write the code"
echo "  5. Validates and scores the output"
echo "  6. Delivers production-ready components"
echo ""
echo "All while maintaining:"
echo "  - Functional programming principles"
echo "  - TypeScript type safety"
echo "  - Project coding standards"
echo "  - 90+ code quality scores"
echo ""
echo "🎉 Demo complete! Ready to build your own features?"
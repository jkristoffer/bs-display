# 🤖 Complete AI Assistant Guide

The AI assistant now understands THREE types of requests:
1. **Generate** - Create new code
2. **Review** - Analyze existing code
3. **Improve** - Fix/enhance existing code

## 🚀 Quick Examples

### Generate Code
```bash
./ai "create a user profile card"
./ai "build a search component with filters"
./ai "make a debounce utility function"
```

### Review Code
```bash
./ai "review Banner component"
./ai "analyze the home page"
./ai "check ProductCard for issues"
```

### Improve Code
```bash
./ai "improve Banner performance"
./ai "enhance mobile experience for Hero section"
./ai "optimize images in ProductGallery"
```

## 📊 Review Feature

When you use review keywords, the AI will:
1. **Find relevant files** automatically
2. **Analyze for common issues**:
   - ⚡ Performance (lazy loading, image formats)
   - 🐛 Code quality (console.logs, TODOs)
   - ♿ Accessibility (alt text, ARIA labels)
   - 📱 Mobile responsiveness
   - 🔍 TypeScript issues
3. **Suggest specific improvements** you can run

### Example Review Session

```bash
$ ./ai "review Banner component"

Intent: review
📊 Code Review Request
Looking for: banner component

Found 1 file(s):
  • src/components/home/Banner/Banner.astro

Quick Analysis:
src/components/home/Banner/Banner.astro:
  ⚡ Images missing lazy loading
  ⚡ Consider using WebP image format

💡 Suggested Improvements:
1. ./ai "improve Banner component performance with lazy loading and WebP images"

Run these commands to generate improvements
```

## 🔧 Improvement Workflow

Complete workflow for reviewing and improving code:

```bash
# Step 1: Review the component
./ai "review Hero section"

# Step 2: Run suggested improvement
./ai "improve Hero section performance with lazy loading and WebP images"

# Step 3: Review the generated code
ls -la orchestrator/output/*/

# Step 4: Integrate improvements
cp orchestrator/output/*/Hero* src/components/
```

## 🎯 Smart Intent Detection

The AI automatically detects your intent based on keywords:

### Review Keywords
- review, analyze, check, audit, inspect, evaluate, assess

### Improvement Keywords
- improve, fix, enhance, optimize, refactor, update, upgrade

### Generation Keywords (default)
- create, build, make, add, implement, generate

## 📝 Advanced Examples

### Full Page Review
```bash
# Review entire home page
./ai "review home page components"

# Review for specific issues
./ai "check Banner for accessibility issues"
./ai "analyze ProductList performance"
```

### Targeted Improvements
```bash
# Performance improvements
./ai "optimize Hero section for Core Web Vitals"

# Accessibility improvements
./ai "enhance ProductCard accessibility with ARIA labels"

# Mobile improvements
./ai "improve Banner mobile experience"
```

### Batch Operations
```bash
# Review multiple components
for component in Banner ProductCard CategoryNav; do
  ./ai "review $component component"
done

# Generate improvements for all issues
./ai "create optimized image component with WebP support"
./ai "build accessible icon library to replace emojis"
```

## 🛠️ Manual Review Tools

For more control, use specialized review tools:

```bash
# Detailed review with fix suggestions
python3 orchestrator/review-and-fix.py Banner

# Simple review for manual inspection
python3 orchestrator/simple-review.py Hero

# Code quality check
node scripts/code-review-agent.js --file src/components/home/Banner/Banner.astro
```

## 💡 Best Practices

### For Reviews
1. Be specific about what component/page to review
2. The AI will find files automatically
3. Check the suggested improvements before running

### For Improvements
1. Review first to understand issues
2. Run targeted improvements
3. Validate generated code meets requirements

### For Generation
1. Describe clearly what you want
2. Include technical requirements
3. Specify behavior and features

## 🎨 Complete Example: Improving Hero Section

```bash
# 1. Review current state
$ ./ai "review Banner component"
# Shows: Images need optimization, mobile issues

# 2. Generate improvements
$ ./ai "improve Banner with optimized images and better mobile experience"
# Creates: Enhanced Banner component

# 3. Review generated code
$ node scripts/code-review-agent.js --file output/*/Banner.tsx
# Score: 96/100

# 4. Additional enhancements
$ ./ai "create SVG icon set for Banner features"
# Creates: Icon components to replace emojis

# 5. Integrate everything
$ cp output/*/Banner* src/components/home/Banner/
$ cp output/*/Icons* src/components/common/Icons/
```

## 🚦 Quick Reference

| Want to... | Use... |
|------------|--------|
| Create new component | `./ai "create [component description]"` |
| Review existing code | `./ai "review [component name]"` |
| Fix/improve code | `./ai "improve [component] [what to improve]"` |
| Analyze for issues | `./ai "check [component] for [issue type]"` |
| Optimize performance | `./ai "optimize [component] performance"` |

The AI assistant now truly understands context and can help with the full development lifecycle: create → review → improve → repeat!
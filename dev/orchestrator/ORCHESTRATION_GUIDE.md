# AI Orchestration Guide

## Two Modes of Operation

### 1. Quick Generation Mode (`./ai`)
Fast, simple component generation. Best for:
- Rapid prototyping
- Learning component structures
- Quick experiments

```bash
./ai "build a FAQ page"
# Generates files in output/ directory
# You manually copy and integrate
```

### 2. Full Orchestration Mode (`./ai-pro`)
Complete pipeline with validation, testing, and PR creation. Best for:
- Production-ready components
- Team workflows
- Maintaining code quality

```bash
./ai-pro "build a FAQ page"
# 1. Generates component
# 2. Validates against standards
# 3. Runs tests
# 4. Integrates into project
# 5. Creates pull request
```

## Full Orchestration Pipeline

### What It Does

1. **Generation Phase**
   - Uses AI to generate TypeScript components
   - Creates SCSS modules with proper styling
   - Includes all necessary exports

2. **Validation Phase**
   - Checks TypeScript type safety (no `any` types)
   - Verifies functional programming patterns
   - Validates accessibility (ARIA labels)
   - Ensures SCSS module usage

3. **Testing Phase**
   - Runs component tests
   - Checks rendering without errors
   - Validates prop types
   - Tests event handlers
   - Measures code coverage

4. **Integration Phase**
   - Copies files to correct project location
   - Maintains proper directory structure
   - Updates component registry

5. **Pull Request Phase**
   - Creates feature branch
   - Commits with descriptive message
   - Prepares for PR creation

### Example Workflow

```bash
# Full orchestration
./ai-pro "build a FAQ page"

# Output:
🎭 AI Orchestration Pipeline
==================================================

Step 1/5: Generating Component
[21:45:00] [INFO] Generating FAQPage component...
[21:45:02] [SUCCESS] Generation complete

Step 2/5: Validating Standards
[21:45:02] [INFO] Validating against project standards...
- TypeScript Valid: ✅
- Functional Programming: ✅
- Accessibility: ✅
Score: 100/100

Step 3/5: Running Tests
[21:45:03] [INFO] Running component tests...
✓ Component renders without errors
✓ Props are properly typed
✓ Event handlers work correctly
✓ Accessibility tests pass
✓ Style modules are applied

Step 4/5: Integrating Files
[21:45:03] [INFO] Integrating FAQPage into project...
[21:45:03] [SUCCESS] Copied: FAQPage.tsx
[21:45:03] [SUCCESS] Copied: FAQPage.module.scss
[21:45:03] [SUCCESS] Copied: index.ts

Step 5/5: Creating Pull Request
[21:45:04] [INFO] Creating branch: feat/add-faqpage-component-20250629_214500
[21:45:04] [SUCCESS] Created commit on branch

✅ Orchestration Complete!

📊 Summary:
  • Component: FAQPage
  • Validation Score: 100/100
  • Tests Passed: 5/5
  • Files Integrated: 3

🎯 Next: gh pr create --title 'feat: add FAQPage component' --body 'AI-generated component with full validation'
```

## Orchestration Report

After each run, a detailed report is saved:
```
output/[session_id]/orchestration_report.md
```

This includes:
- Pipeline results for each phase
- Validation issues found
- Test results
- Integration details
- Git branch information
- Complete logs

## When to Use Each Mode

### Use Quick Mode (`./ai`) when:
- Experimenting with component ideas
- Learning how components are structured
- Need quick prototypes
- Working on personal projects

### Use Orchestration Mode (`./ai-pro`) when:
- Creating production components
- Working in a team
- Need quality assurance
- Want automated PR creation
- Following strict coding standards

## Configuration

The orchestration pipeline uses project settings:
- Component paths from project structure
- Validation rules from coding standards
- Test configurations
- Git workflow preferences

## Troubleshooting

### Component Not Found
```bash
# Check output directory
ls -la orchestrator/output/*/
```

### Validation Failures
- Check TypeScript types (no `any`)
- Ensure functional components
- Add ARIA labels to interactive elements

### Git Issues
```bash
# Check current branch
git branch

# Reset if needed
git checkout main
```

## Future Enhancements

1. **Automated Testing**
   - Integration with Jest/Vitest
   - E2E testing with Playwright
   - Visual regression testing

2. **Enhanced Validation**
   - Custom ESLint rules
   - Performance budgets
   - Bundle size analysis

3. **Smart Integration**
   - Auto-update component registry
   - Update routing if needed
   - Add to Storybook

4. **PR Enhancement**
   - Add screenshots
   - Include performance metrics
   - Auto-assign reviewers
# Code Review Agent - Standards Compliance System

> **Purpose**: Automated enforcement of functional programming principles and project development standards

## Quick Start

```bash
# Single file analysis
node scripts/code-review-agent.js --file src/components/MyComponent.tsx

# PR analysis  
node scripts/code-review-agent.js --pr 123

# Batch analysis
node scripts/code-review-agent.js --batch src/components/
```

## Scoring System

- **90-100**: A (Excellent) - Ready for merge
- **80-89**: B (Good) - Minor improvements recommended  
- **70-79**: C (Satisfactory) - Some issues to address
- **60-69**: D (Needs Improvement) - Significant changes required
- **0-59**: F (Major Issues) - Comprehensive refactoring needed

## Analysis Categories

| Category | Weight | Focus Areas |
|----------|--------|-------------|
| **Functional Programming** | 40% | Pure functions, immutability, composition |
| **Project Standards** | 20% | File naming, imports, SCSS modules |
| **TypeScript** | 20% | Type annotations, interfaces, avoiding `any` |
| **React Patterns** | 20% | Hooks, memoization, functional components |

## GitHub Integration

**Automatic**: Runs on PR creation/updates
**Manual**: `gh workflow run code-review-automation.yml -f pr_number=123`

### PR Features
- ✅ Detailed analysis comments
- ✅ Status checks (blocks merge if score < 60)
- ✅ Auto-labeling (`review-excellent`, `fp-compliant`, etc.)
- ✅ Score tracking and historical data

## Functional Programming Checks

### Pure Functions ✅
- No global variable mutations
- No excessive console statements  
- No non-deterministic functions (Math.random, Date.now)

### Immutability ✅
- No array mutations (push, pop, splice, etc.)
- No Object.assign mutations
- Proper spread operator usage
- Prefer const over let

### Function Composition ✅
- Functions under 50 lines
- Arrow function preference
- Higher-order function usage

### Side Effects ✅
- No direct DOM manipulation outside React
- Proper async error handling
- useEffect for side effects

## Development Workflow

```bash
# 1. Pre-commit check
node scripts/code-review-agent.js --file src/components/NewComponent.tsx

# 2. Pre-PR validation
node scripts/code-review-agent.js --batch src/components/

# 3. Automated PR review (GitHub Actions)
# 4. Address issues and re-run if needed
```

## Customization

### Scoring Weights
```javascript
// In code-review-agent.js
const weights = {
  functionalProgramming: 0.4,  // Emphasize FP compliance
  projectStandards: 0.2,
  typeScript: 0.2,
  reactPatterns: 0.2
};
```

### Failure Threshold
```yaml
# In workflow YAML
if: steps.review_pr.outputs.OVERALL_SCORE < 60  # Adjustable
```

## Troubleshooting

**GitHub CLI issues**: Check token permissions
**File analysis errors**: Verify file encoding and syntax
**Workflow failures**: Review GitHub Actions logs
**False positives**: Customize pattern detection rules

---

*For detailed implementation and advanced configuration, see the source files in `scripts/` and `.github/workflows/`*
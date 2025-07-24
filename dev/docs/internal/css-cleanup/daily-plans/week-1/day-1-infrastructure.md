# Day 1: Infrastructure Setup

**Phase**: 1 - Foundation & Quick Wins  
**Duration**: 8 hours  
**Objective**: Configure linting, analysis tools, and monitoring infrastructure

## Prerequisites

- [x] Node.js 18+ installed and verified
- [x] Repository access with write permissions
- [x] Development environment configured
- [x] Current CSS bundle backed up for rollback

## Morning Session (4 hours)

### Task 1.1: Configure Stylelint (90 minutes)

**Objective**: Set up CSS linting with custom rules for variable enforcement

**Commands to Execute**:

```bash
# Install stylelint dependencies
npm install --save-dev stylelint stylelint-scss stylelint-config-standard-scss

# Verify installation
npm list stylelint
```

**Create Configuration File**:

```bash
# Create stylelint configuration
touch .stylelintrc.json
```

**Configuration Content** (`.stylelintrc.json`):

```json
{
  "extends": ["stylelint-config-standard-scss"],
  "rules": {
    "custom-property-pattern": "^(color|spacing|font|shadow|radius|z|transition|breakpoint)-[a-z0-9-]+$",
    "declaration-property-value-disallowed-list": {
      "/.*/": ["/^#[0-9a-fA-F]{3,6}$/", "/^[0-9]+px$/"]
    },
    "scss/dollar-variable-pattern": "^(color|spacing|font|shadow|radius|z|transition|breakpoint)-[a-z0-9-]+$",
    "declaration-property-value-allowed-list": {
      "/.*/": ["/^var\\(--[a-z-]+\\)$/", "/^\\$[a-z-]+$/"]
    }
  },
  "ignoreFiles": ["node_modules/**/*", "dist/**/*", "public/**/*"]
}
```

**Validation Steps**:

```bash
# Test stylelint configuration
npx stylelint "src/**/*.scss" --dry-run

# Expected: Configuration loads without errors
# Note: Will show violations - this is expected for baseline
```

### Task 1.2: Set up CSS Bundle Analysis (90 minutes)

**Objective**: Configure tools to analyze CSS bundle composition and size

**Install Analysis Tools**:

```bash
# Install bundle analysis dependencies
npm install --save-dev webpack-bundle-analyzer css-minimizer-webpack-plugin postcss-cli
```

**Add Package.json Scripts**:

```bash
# Add CSS analysis scripts
npm pkg set scripts.analyze:css="npm run build:fast && webpack-bundle-analyzer dist/stats.json"
npm pkg set scripts.css:size="du -sh dist/**/*.css"
npm pkg set scripts.css:unused="purifycss dist/**/*.css dist/**/*.html --info"
```

**Create Analysis Script** (`scripts/css-analysis.js`):

```javascript
const fs = require('fs');
const path = require('path');

function analyzeCSSBundle() {
  const distDir = path.join(__dirname, '../dist');
  const cssFiles = fs
    .readdirSync(distDir)
    .filter((file) => file.endsWith('.css'));

  console.log('CSS Bundle Analysis:');
  cssFiles.forEach((file) => {
    const filePath = path.join(distDir, file);
    const stats = fs.statSync(filePath);
    console.log(`${file}: ${(stats.size / 1024).toFixed(2)}KB`);
  });
}

analyzeCSSBundle();
```

**Validation Steps**:

```bash
# Run initial analysis
npm run analyze:css

# Expected: Bundle analyzer opens in browser
# Note: Current bundle size for baseline measurement
```

### Task 1.3: Document Current State (60 minutes)

**Objective**: Create comprehensive baseline documentation

**Create Reports Directory**:

```bash
mkdir -p reports/baseline
```

**Generate Variable Count**:

```bash
# Count all CSS variables
find src -name "*.scss" -exec grep -h "^\$" {} \; | sort | uniq > reports/baseline/all-variables.txt
wc -l reports/baseline/all-variables.txt > reports/baseline/variable-count.txt

echo "Variable count: $(cat reports/baseline/variable-count.txt)"
```

**Find Hardcoded Values**:

```bash
# Find hex colors
grep -r "#[0-9a-fA-F]\{3,6\}" src --include="*.scss" --include="*.tsx" > reports/baseline/hardcoded-colors.txt

# Find pixel values
grep -r "[0-9]\+px" src --include="*.scss" --include="*.tsx" > reports/baseline/hardcoded-pixels.txt

# Count hardcoded values
echo "Hardcoded colors: $(wc -l < reports/baseline/hardcoded-colors.txt)"
echo "Hardcoded pixels: $(wc -l < reports/baseline/hardcoded-pixels.txt)"
```

**Create Baseline Report** (`reports/baseline/summary.md`):

```markdown
# CSS Baseline Analysis - Day 1

## Bundle Size

- Total CSS: [TO BE MEASURED]
- Largest files: [TO BE DOCUMENTED]

## Variable Count

- Total variables: [FROM variable-count.txt]
- Unique variables: [TO BE CALCULATED]

## Hardcoded Values

- Hex colors: [FROM hardcoded-colors.txt]
- Pixel values: [FROM hardcoded-pixels.txt]

## Issues Identified

- [TO BE DOCUMENTED DURING ANALYSIS]
```

## Afternoon Session (4 hours)

### Task 1.4: Component CSS Analysis (120 minutes)

**Objective**: Analyze component styling patterns and identify migration candidates

**Scan for Inline Styles**:

```bash
# Find components with inline styles
grep -r "style={{" src/components --include="*.tsx" > reports/baseline/inline-styles.txt

# Count inline style occurrences
wc -l reports/baseline/inline-styles.txt
```

**Analyze FilterUIv2 Component**:

```bash
# Extract FilterUIv2 inline styles for detailed analysis
grep -n "style={{" src/components/FilterUIv2.tsx > reports/baseline/filterui-inline-styles.txt

# Count total inline styles in FilterUIv2
echo "FilterUIv2 inline styles: $(wc -l < reports/baseline/filterui-inline-styles.txt)"
```

**Find Global Style Dependencies**:

```bash
# Find quiz-styles.scss size and usage
du -sh src/styles/quiz-styles.scss
grep -r "quiz-styles" src --include="*.tsx" --include="*.astro" > reports/baseline/quiz-styles-usage.txt
```

**Create Component Priority List** (`reports/baseline/component-migration-priority.md`):

```markdown
# Component Migration Priority List

## High Priority (Week 3)

1. FilterUIv2.tsx - [X] inline styles found
2. Quiz components - [X]KB global pollution
3. Navigation - Site-wide impact
4. Product cards - Performance critical

## Medium Priority (Week 3-4)

1. Form components
2. Layout components
3. Modal components
4. Button components

## Low Priority (Week 4)

1. Utility components
2. Content components
3. Admin components
```

### Task 1.5: Build Process Analysis (60 minutes)

**Objective**: Understand current build configuration and optimization opportunities

**Analyze Current Astro Config**:

```bash
# Review current astro configuration
cat astro.config.mjs > reports/baseline/current-astro-config.js

# Check for existing CSS optimization
grep -i "css\|postcss\|purgecss" astro.config.mjs
```

**Check Package.json Build Scripts**:

```bash
# Document current build scripts
npm run | grep -E "(build|css)" > reports/baseline/current-build-scripts.txt
```

**Test Current Build Performance**:

```bash
# Time current build process
time npm run build:fast > reports/baseline/build-performance.txt 2>&1

# Measure bundle sizes
npm run css:size >> reports/baseline/build-performance.txt
```

### Task 1.6: Create Day 1 Summary (60 minutes)

**Objective**: Document Day 1 achievements and prepare for Day 2

**Update Summary Report** (`reports/baseline/day-1-summary.md`):

```markdown
# Day 1 Summary - Infrastructure Setup

## Completed Tasks ✅

- [x] Stylelint configured with custom rules
- [x] CSS bundle analysis tools installed
- [x] Baseline documentation created
- [x] Component analysis completed

## Key Findings

- Total CSS variables: [NUMBER]
- Inline styles found: [NUMBER]
- Current bundle size: [SIZE]
- FilterUIv2 inline styles: [NUMBER]

## Issues Identified

- [LIST MAJOR ISSUES FOUND]

## Ready for Day 2

- [x] Infrastructure operational
- [x] Baseline metrics documented
- [x] Analysis tools ready

## Rollback Information

- Stylelint config: `.stylelintrc.json`
- New scripts: `analyze:css`, `css:size`, `css:unused`
- Reports: `reports/baseline/` directory
```

## Validation Checkpoints

### Infrastructure Validation

- [x] Stylelint runs without configuration errors
- [x] Bundle analyzer generates visual report
- [x] All analysis scripts execute successfully
- [x] Reports directory created with baseline data

### Baseline Documentation

- [x] Variable count documented
- [x] Hardcoded values identified and counted
- [x] Component analysis completed
- [x] Build performance baseline established

### Readiness for Day 2

- [x] All tools operational
- [x] Team trained on new scripts
- [x] Baseline metrics available for comparison
- [x] Day 1 summary report completed

## Troubleshooting

### Stylelint Configuration Issues

```bash
# If stylelint fails to load
npm install --save-dev stylelint-config-standard-scss

# Check configuration syntax
npx stylelint --print-config src/styles/main.scss
```

### Bundle Analysis Issues

```bash
# If webpack-bundle-analyzer fails
npm run build:fast
ls -la dist/  # Verify dist directory exists

# Manual bundle size check
du -sh dist/**/*.css
```

### Permission Issues

```bash
# Create reports directory manually if needed
mkdir -p reports/baseline
chmod 755 reports/baseline
```

## Rollback Procedures

### Full Rollback (if major issues)

```bash
# Remove stylelint configuration
rm .stylelintrc.json

# Remove analysis tools
npm uninstall --save-dev stylelint stylelint-scss stylelint-config-standard-scss webpack-bundle-analyzer

# Remove scripts
npm pkg delete scripts.analyze:css scripts.css:size scripts.css:unused

# Remove reports
rm -rf reports/baseline
```

---

**End of Day 1**  
**Next**: [Day 2: Analysis & Documentation](./day-2-analysis.md)  
**Status**: Infrastructure setup complete, ready for comprehensive analysis

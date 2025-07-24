# Day 3: PurgeCSS & Build Optimization

**Phase**: 1 - Foundation & Quick Wins  
**Duration**: 8 hours  
**Objective**: Fix PurgeCSS configuration and implement CSS minification for immediate bundle reduction

## Prerequisites

- [ ] Day 1 and Day 2 completed with baseline documentation
- [ ] Current build performance metrics documented
- [ ] Backup of current astro.config.mjs
- [ ] Development environment tested and ready

## Morning Session (4 hours)

### Task 3.1: Fix PurgeCSS Configuration (120 minutes)

**Objective**: Configure PurgeCSS to properly remove unused CSS without breaking functionality

**Install PostCSS Dependencies**:
```bash
# Install PurgeCSS and related tools
npm install --save-dev @fullhuman/postcss-purgecss postcss autoprefixer

# Verify installation
npm list @fullhuman/postcss-purgecss
```

**Backup Current Configuration**:
```bash
# Backup current config
cp astro.config.mjs astro.config.mjs.backup
cp package.json package.json.backup
```

**Update Astro Configuration** (`astro.config.mjs`):
```javascript
import { defineConfig } from 'astro/config';
import purgecss from '@fullhuman/postcss-purgecss';

export default defineConfig({
  vite: {
    css: {
      postcss: {
        plugins: [
          purgecss({
            content: [
              './src/**/*.{astro,html,js,jsx,ts,tsx,vue}',
              './public/**/*.html',
            ],
            safelist: [
              // Preserve dynamic classes and third-party styles
              /^swiper/,
              /^data-/,
              /^aria-/,
              /^:where/,
              /^:is/,
              // Preserve CSS module classes
              /^[a-zA-Z0-9_-]+_[a-zA-Z0-9_-]+__[a-zA-Z0-9_-]+$/,
              // Preserve utility classes
              /^(flex|grid|block|inline|hidden|visible)$/,
              // Preserve responsive classes
              /^(sm|md|lg|xl):/,
              // Preserve animation classes
              /^animate-/,
              // Preserve quiz-specific classes (temporary)
              /^quiz-/,
            ],
            variables: true,
            keyframes: true,
            fontFace: true,
          })
        ]
      }
    }
  }
});
```

**Test PurgeCSS Configuration**:
```bash
# Build with new PurgeCSS config
npm run build:fast

# Check bundle size improvement
npm run css:size

# Document size before/after
echo "Before: $(cat reports/baseline/build-performance.txt | grep 'CSS')"
echo "After: $(npm run css:size 2>/dev/null)"
```

### Task 3.2: Enable CSS Minification (90 minutes)

**Objective**: Configure CSS minification for production builds

**Install CSS Minimizer**:
```bash
# Install CSS minimization plugin
npm install --save-dev css-minimizer-webpack-plugin cssnano

# Verify installation
npm list css-minimizer-webpack-plugin
```

**Update Astro Configuration for Minification**:
```javascript
// Add to astro.config.mjs
import { defineConfig } from 'astro/config';
import purgecss from '@fullhuman/postcss-purgecss';

export default defineConfig({
  vite: {
    css: {
      postcss: {
        plugins: [
          purgecss({
            // ... existing purgecss config
          })
        ]
      }
    },
    build: {
      minify: true,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'assets/[name].[hash].min.css';
            }
            return 'assets/[name].[hash][extname]';
          }
        }
      }
    }
  }
});
```

**Create Production Build Script**:
```bash
# Add optimized build script
npm pkg set scripts.build:optimized="NODE_ENV=production npm run build"

# Test optimized build
npm run build:optimized
```

## Afternoon Session (4 hours)

### Task 3.3: Test and Validate Optimizations (120 minutes)

**Objective**: Verify optimizations work correctly without breaking functionality

**Visual Regression Testing**:
```bash
# Start development server for comparison
npm run dev &
DEV_PID=$!

# Take baseline screenshots (manual process for now)
# TODO: Implement automated screenshot comparison

# Build optimized version
npm run build:optimized

# Serve optimized build
npm run preview &
PREVIEW_PID=$!

# Manual testing checklist:
# - Homepage loads correctly
# - Navigation functions properly  
# - Product pages display correctly
# - Quiz functionality works
# - Forms submit successfully
# - Mobile responsiveness maintained

# Clean up processes
kill $DEV_PID $PREVIEW_PID
```

**Bundle Size Analysis**:
```bash
# Measure bundle improvements
echo "=== Bundle Size Analysis ===" > reports/day-3-results.txt
echo "Before optimization:" >> reports/day-3-results.txt
cat reports/baseline/build-performance.txt | grep -E "(CSS|Total)" >> reports/day-3-results.txt

echo "After optimization:" >> reports/day-3-results.txt
npm run css:size >> reports/day-3-results.txt

# Calculate improvement percentage
# Manual calculation and documentation
```

**Performance Testing**:
```bash
# Test build time improvement
echo "=== Build Performance ===" >> reports/day-3-results.txt
echo "Optimized build time:" >> reports/day-3-results.txt
time npm run build:optimized >> reports/day-3-results.txt 2>&1

# Test page load performance (manual using browser dev tools)
# Document Core Web Vitals improvements
```

### Task 3.4: Fix Any Breaking Issues (90 minutes)

**Objective**: Resolve any functionality breaks caused by optimizations

**Common Issues and Fixes**:

**Issue: Essential styles removed by PurgeCSS**
```bash
# Add to safelist in astro.config.mjs
safelist: [
  // Add specific classes that were incorrectly removed
  'essential-class-name',
  /^component-prefix-/,
]
```

**Issue: CSS modules not working**
```bash
# Verify CSS module pattern in safelist
/^[a-zA-Z0-9_-]+_[a-zA-Z0-9_-]+__[a-zA-Z0-9_-]+$/
```

**Issue: Third-party styles broken**
```bash
# Add third-party preservations
safelist: [
  /^swiper/,      // Swiper.js styles
  /^react-/,      // React component styles  
  /^astro-/,      // Astro-specific styles
]
```

**Test Each Fix**:
```bash
# After each configuration change
npm run build:optimized
npm run preview

# Manual testing of affected areas
# Document fixes in reports/day-3-fixes.txt
```

### Task 3.5: Document Optimization Results (30 minutes)

**Objective**: Create comprehensive report of Day 3 achievements

**Create Results Summary** (`reports/day-3-optimization-results.md`):
```markdown
# Day 3: PurgeCSS & Build Optimization Results

## Bundle Size Improvements
- Before: [SIZE]KB
- After: [SIZE]KB  
- Reduction: [PERCENTAGE]% ([SIZE]KB saved)

## Build Performance
- Build time before: [TIME]s
- Build time after: [TIME]s
- Improvement: [PERCENTAGE]%

## Configuration Changes
- ✅ PurgeCSS configured and operational
- ✅ CSS minification enabled
- ✅ Production build optimized
- ✅ Safelist configured for essential styles

## Issues Found and Fixed
- [LIST ANY ISSUES ENCOUNTERED]
- [DOCUMENT SOLUTIONS APPLIED]

## Functionality Validation
- ✅ Homepage functionality maintained
- ✅ Navigation working correctly
- ✅ Product pages rendering properly
- ✅ Quiz functionality operational
- ✅ Forms working correctly
- ✅ Mobile responsiveness preserved

## Files Modified
- astro.config.mjs (PurgeCSS + minification config)
- package.json (added build:optimized script)

## Rollback Information
- Backup files: astro.config.mjs.backup, package.json.backup
- To rollback: `cp astro.config.mjs.backup astro.config.mjs`
```

## Validation Checkpoints

### Optimization Success
- [ ] PurgeCSS removing unused styles without breaking functionality
- [ ] CSS minification working in production builds
- [ ] Bundle size reduced by 15-20% minimum
- [ ] Build performance improved or maintained

### Functionality Integrity  
- [ ] All pages load correctly with optimized CSS
- [ ] Interactive elements functioning properly
- [ ] Responsive design maintained across devices
- [ ] Third-party components (Swiper, etc.) working

### Documentation Complete
- [ ] Bundle size improvements documented
- [ ] Configuration changes documented
- [ ] Issues and fixes documented
- [ ] Rollback procedures tested

## Troubleshooting

### PurgeCSS Removing Essential Styles
```bash
# Debug what's being removed
npm run build:optimized -- --verbose

# Add specific patterns to safelist
# Test incrementally to find minimal safelist
```

### CSS Minification Breaking Styles
```bash
# Disable minification temporarily
# Identify specific CSS causing issues
# Add vendor prefixes if needed
```

### Build Performance Regression
```bash
# Profile build performance
time npm run build:optimized

# Identify bottlenecks
# Optimize PurgeCSS content patterns
```

## Rollback Procedures

### Full Rollback
```bash
# Restore original configuration
cp astro.config.mjs.backup astro.config.mjs
cp package.json.backup package.json

# Rebuild with original config
npm run build:fast

# Verify functionality restored
npm run preview
```

### Partial Rollback (PurgeCSS only)
```bash
# Comment out PurgeCSS in astro.config.mjs
# Keep minification enabled
# Test build and functionality
```

## Expected Outcomes

### Bundle Size Target
- **Minimum**: 15% reduction from baseline
- **Target**: 20-25% reduction
- **Ideal**: 30%+ reduction

### Performance Targets
- **Build Time**: Maintained or improved
- **Page Load**: Improved due to smaller CSS
- **Core Web Vitals**: Improved or maintained

---

**End of Day 3**  
**Next**: [Day 4: Tooling & Automation](./day-4-tooling.md)  
**Achievement**: Immediate 15-25% bundle reduction through build optimization
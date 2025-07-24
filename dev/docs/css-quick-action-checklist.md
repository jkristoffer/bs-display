# CSS Quick Action Checklist

## 🚀 Immediate Actions (Save 125KB Today)

### 1. Delete Nav Backup (5 minutes) - Save 50KB
```bash
# Check what's there first
ls -la src/components/common/Nav.backup/

# If confirmed old backup, delete it
rm -rf src/components/common/Nav.backup/

# Verify deletion
git status
```

### 2. Remove Unused Utilities (30 minutes) - Save 5KB
Edit `src/styles/mixins.scss` and remove these unused classes:
- [ ] `.gradient-bg-*` (10 variants)
- [ ] `.gradient-text-*` (8 variants)
- [ ] `.glass-*` (6 variants)
- [ ] `.animate-*` (12 variants that aren't used)

### 3. Fix PurgeCSS Config (15 minutes) - Save 20KB
Edit `astro.config.mjs`:
```javascript
// BEFORE (too broad):
safelist: [/gradient-/, /glass-/, /animate-/]

// AFTER (specific):
safelist: [
  'gradient-bg-primary',
  'glass-light',
  'animate-fade-in',
  // Only add ACTUALLY USED classes
]
```

### 4. Enable CSS Minification (10 minutes) - Save 30%
```bash
# Install cssnano
npm install --save-dev cssnano

# Add to PostCSS config in astro.config.mjs
```

## 📋 Week 1 Actions (Save Another 100KB)

### Day 1: FilterUIv2.tsx Refactor
- [ ] Create `FilterUIv2.module.scss`
- [ ] Move all inline styles to CSS module
- [ ] Replace hardcoded colors with variables
- [ ] Test thoroughly

### Day 2: Quiz Styles Modularization
- [ ] Split `quiz-styles.scss` (79KB) into modules:
  - [ ] `QuizContainer.module.scss`
  - [ ] `QuizQuestion.module.scss`
  - [ ] `QuizResults.module.scss`
- [ ] Reduce nesting to max 3 levels
- [ ] Replace hardcoded values

### Day 3: Hardcoded Color Hunt
Replace these colors wherever found:
- [ ] `#666` → `var(--color-text-secondary)`
- [ ] `#007f75` → `var(--color-accent-primary)`
- [ ] `#ddd` → `var(--color-border)`
- [ ] `#f0f0f0` → `var(--color-surface-muted)`

### Day 4: Variable Audit
- [ ] List all spacing variables actually used
- [ ] Pick ONE spacing system
- [ ] Create migration map
- [ ] Update 5 components as pilot

### Day 5: Quality Check
- [ ] Run CSS quality checker
- [ ] Document improvements
- [ ] Plan next week

## 🛠️ Tooling Setup Checklist

### Install Missing Tools
```bash
# CSS Linting
npm install --save-dev stylelint stylelint-config-standard-scss

# CSS Minification
npm install --save-dev cssnano

# Autoprefixer
npm install --save-dev autoprefixer

# CSS Stats
npm install --save-dev cssstats-cli
```

### Configure Stylelint
Create `.stylelintrc.json`:
```json
{
  "extends": "stylelint-config-standard-scss",
  "rules": {
    "selector-max-specificity": "0,3,0",
    "selector-max-compound-selectors": 3,
    "max-nesting-depth": 3,
    "declaration-no-important": true,
    "color-no-hex": true,
    "unit-disallowed-list": ["px"]
  }
}
```

### Add NPM Scripts
```json
"scripts": {
  "css:lint": "stylelint \"src/**/*.scss\"",
  "css:stats": "cssstats dist/client/_astro/*.css",
  "css:analyze": "npm run css:lint && npm run code:review:css"
}
```

## 📊 Progress Tracking

### Metrics to Monitor
- [ ] Total CSS size (target: <250KB)
- [ ] Largest CSS file (target: <20KB)
- [ ] CSS quality score (target: >85)
- [ ] Build time improvement
- [ ] Page load speed

### Weekly Targets
| Week | Focus | Target Reduction |
|------|-------|------------------|
| 1 | Quick wins + FilterUI | -125KB |
| 2 | Quiz + Components | -75KB |
| 3 | Variables + Build | -50KB |
| 4 | Polish + Testing | Final optimization |

## ⚠️ Before You Start

### Pre-flight Checklist
- [ ] Create branch: `fix/css-optimization`
- [ ] Backup current CSS build output
- [ ] Note current bundle sizes
- [ ] Take screenshots of key pages
- [ ] Inform team of changes

### Testing Checklist
After each change:
- [ ] Run build: `npm run build:fast`
- [ ] Check visual appearance
- [ ] Test responsive behavior
- [ ] Verify no console errors
- [ ] Check CSS file sizes

## 🎯 Success Criteria

### Must Achieve
- ✅ No inline styles in FilterUIv2
- ✅ Nav.backup deleted
- ✅ CSS minification enabled
- ✅ Quality score > 70

### Nice to Have
- 🎯 All components use CSS modules
- 🎯 Single spacing system
- 🎯 Zero hardcoded colors
- 🎯 Automated CSS checks

## 🆘 If Something Breaks

### Quick Rollback
```bash
# Revert specific file
git checkout HEAD -- path/to/file

# Revert all CSS changes
git checkout HEAD -- "*.scss" "*.css"

# Nuclear option - reset branch
git reset --hard origin/main
```

### Common Issues
1. **Styles missing after PurgeCSS change**
   - Add specific classes to safelist
   - Check dynamic class generation

2. **Component looks different**
   - Check for !important removal
   - Verify variable values match
   - Look for specificity changes

3. **Build fails**
   - Check for SCSS syntax errors
   - Verify all imports exist
   - Run `npm install` if needed

---
*Last updated: 2025-07-23*
*Estimated time to complete all quick actions: 1 hour*
*Estimated savings from quick actions: 125KB (25% reduction)*
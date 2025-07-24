# Phase 3: Component Migration

**Duration**: 10 days  
**Objective**: Achieve 100% CSS module adoption and eliminate all inline styles and hardcoded values

## Overview

This phase systematically migrates all components to use CSS modules with the new semantic token system, eliminates inline styles, and removes global style pollution.

## Prerequisites

- [ ] Phase 2 completed with new token system operational
- [ ] Component migration priority list available
- [ ] Visual regression testing setup operational
- [ ] Migration scripts and tooling ready

## Success Criteria

- [ ] 100% components using CSS modules exclusively
- [ ] Zero inline styles remaining in codebase
- [ ] All hardcoded values replaced with semantic tokens
- [ ] Quiz styles no longer polluting global scope
- [ ] Visual regression tests passing for all components

## Migration Priority Strategy

### High Priority (Days 11-14)
1. **FilterUIv2.tsx** - 50+ inline styles, high complexity
2. **Quiz components** - 79KB global pollution source
3. **Navigation components** - High visibility, site-wide impact
4. **Product cards** - Frequently used, performance critical

### Medium Priority (Days 15-18)  
1. **Form components** - Standardize input styling
2. **Layout components** - Header, footer, sidebars
3. **Modal and overlay components** - Z-index and positioning
4. **Button and link components** - Consistent interactive styles

### Low Priority (Days 19-20)
1. **Utility components** - Simple, low-risk migrations
2. **Content components** - Blog, article styling
3. **Admin/internal components** - Lower user visibility

## Daily Breakdown

### [Day 11: FilterUIv2 Migration](../daily-plans/week-3-4/day-11-filterui.md)
**Focus**: Migrate 50+ inline styles to CSS modules

**Morning (4 hours)**
- Audit all inline styles in FilterUIv2.tsx
- Create FilterUIv2.module.scss with extracted styles
- Convert inline styles to CSS class references

**Afternoon (4 hours)**
- Replace hardcoded values with semantic tokens
- Test component functionality and visual integrity
- Optimize CSS structure and organization

**Deliverables**
- ✅ FilterUIv2.module.scss with all extracted styles
- ✅ Zero inline styles remaining in FilterUIv2.tsx
- ✅ All hardcoded values replaced with tokens

### [Day 12: Quiz Component Refactoring](../daily-plans/week-3-4/day-12-quiz.md)
**Focus**: Break down 79KB quiz-styles.scss into component modules

**Morning (4 hours)**
- Analyze quiz-styles.scss structure and dependencies
- Identify components and create individual module files
- Extract shared quiz utilities and variables

**Afternoon (4 hours)**
- Migrate quiz components to use scoped modules
- Remove global quiz styles from main bundle
- Test quiz functionality across all quiz types

**Deliverables**
- ✅ Individual CSS modules for each quiz component
- ✅ Shared quiz utilities properly scoped
- ✅ Global quiz pollution eliminated

### [Day 13: Navigation Components](../daily-plans/week-3-4/day-13-navigation.md)
**Focus**: Migrate navigation components to CSS modules

**Morning (4 hours)**
- Migrate main navigation component
- Convert mobile menu styling to modules
- Update breadcrumb and pagination components

**Afternoon (4 hours)**
- Test navigation responsiveness and functionality
- Verify dropdown and interactive behaviors
- Cross-browser testing for navigation components

**Deliverables**
- ✅ All navigation components using CSS modules
- ✅ Responsive behavior maintained
- ✅ Interactive states functioning correctly

### [Day 14: Product Card Components](../daily-plans/week-3-4/day-14-product-cards.md)
**Focus**: Migrate product display components

**Morning (4 hours)**
- Migrate ProductCard and variant components
- Convert product grid and list view styling
- Update product comparison components

**Afternoon (4 hours)**
- Test product display across different screen sizes
- Verify image loading and lazy loading behavior
- Performance testing for product grids

**Deliverables**
- ✅ All product components using CSS modules
- ✅ Performance optimizations maintained
- ✅ Visual consistency across product displays

### [Day 15: Form Components](../daily-plans/week-3-4/day-15-forms.md)
**Focus**: Standardize form component styling

**Morning (4 hours)**
- Migrate input, textarea, and select components
- Create consistent form validation styling
- Update form layout and spacing

**Afternoon (4 hours)**
- Test form functionality and accessibility
- Verify form validation visual feedback
- Cross-browser form testing

**Deliverables**
- ✅ Standardized form component modules
- ✅ Consistent validation styling
- ✅ Accessibility features maintained

### [Day 16: Layout Components](../daily-plans/week-3-4/day-16-layout.md)
**Focus**: Migrate header, footer, and layout components

**Morning (4 hours)**
- Migrate header and footer components
- Convert sidebar and container components
- Update grid and flexbox layout utilities

**Afternoon (4 hours)**
- Test layout responsiveness
- Verify sticky positioning and scroll behavior
- Performance testing for layout shifts

**Deliverables**
- ✅ All layout components using CSS modules
- ✅ Responsive behavior maintained
- ✅ No layout shifts or positioning issues

### [Day 17: Modal and Overlay Components](../daily-plans/week-3-4/day-17-modals.md)
**Focus**: Migrate modal, tooltip, and overlay components

**Morning (4 hours)**
- Migrate modal and dialog components
- Convert tooltip and popover styling
- Update overlay and backdrop components

**Afternoon (4 hours)**
- Test modal functionality and animations
- Verify z-index layering and positioning
- Accessibility testing for overlays

**Deliverables**
- ✅ All overlay components using CSS modules
- ✅ Proper z-index management
- ✅ Animation and transition behavior maintained

### [Day 18: Interactive Components](../daily-plans/week-3-4/day-18-interactive.md)
**Focus**: Migrate buttons, links, and interactive elements

**Morning (4 hours)**
- Migrate button component variants
- Convert link styling and states
- Update interactive element hover/focus states

**Afternoon (4 hours)**
- Test interactive behaviors and accessibility
- Verify keyboard navigation and focus management
- Performance testing for interactive elements

**Deliverables**
- ✅ All interactive components using CSS modules
- ✅ Consistent interaction patterns
- ✅ Accessibility features functioning

### [Day 19: Utility and Content Components](../daily-plans/week-3-4/day-19-utilities.md)
**Focus**: Migrate remaining utility and content components

**Morning (4 hours)**
- Migrate utility components (loaders, badges, etc.)
- Convert content components (blog, articles)
- Update typography and text styling

**Afternoon (4 hours)**
- Test utility component functionality
- Verify content rendering and styling
- Final cleanup of any remaining inline styles

**Deliverables**
- ✅ All utility components using CSS modules
- ✅ Content styling consistent and modular
- ✅ Typography system fully integrated

### [Day 20: Final Validation and Cleanup](../daily-plans/week-3-4/day-20-validation.md)
**Focus**: Comprehensive testing and final cleanup

**Morning (4 hours)**
- Scan entire codebase for remaining inline styles
- Validate all components using semantic tokens
- Performance testing of complete migration

**Afternoon (4 hours)**
- Comprehensive visual regression testing
- Cross-browser and device testing
- Documentation of migration outcomes

**Deliverables**
- ✅ 100% CSS module adoption confirmed
- ✅ Zero inline styles or hardcoded values remaining
- ✅ Full visual regression testing complete

## Technical Migration Patterns

### Inline Style to CSS Module Pattern
**Before:**
```tsx
// FilterUIv2.tsx
<div 
  style={{
    backgroundColor: '#f8f9fa',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '24px'
  }}
>
  Filter Content
</div>
```

**After:**
```tsx
// FilterUIv2.tsx
import styles from './FilterUIv2.module.scss';

<div className={styles.filterContainer}>
  Filter Content
</div>
```

```scss
// FilterUIv2.module.scss
@import '../../../styles/variables';

.filterContainer {
  background-color: $color-background-light;
  padding: $spacing-md;
  border-radius: $radius-md;
  margin-bottom: $spacing-lg;
}
```

### Global to Scoped Pattern
**Before:**
```scss
// quiz-styles.scss (global)
.quiz-question {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
}

.quiz-answer {
  padding: 12px;
  background: #f0f0f0;
  border: 1px solid #ddd;
}
```

**After:**
```scss
// QuizQuestion.module.scss
@import '../../styles/variables';

.question {
  font-size: $font-size-lg;
  color: $color-text-primary;
  margin-bottom: $spacing-lg;
}

.answer {
  padding: $spacing-sm;
  background-color: $color-background-light;
  border: 1px solid $color-border-light;
}
```

### Component Structure Pattern
```
src/components/
├── common/
│   ├── ProductCard/
│   │   ├── ProductCard.tsx
│   │   ├── ProductCard.module.scss
│   │   └── index.ts
│   └── FilterUI/
│       ├── FilterUIv2.tsx
│       ├── FilterUIv2.module.scss
│       └── index.ts
```

## Quality Assurance Process

### Visual Regression Testing
1. **Baseline Screenshots**: Capture before migration
2. **Component Testing**: Test each component individually
3. **Integration Testing**: Test component combinations
4. **Cross-Browser Testing**: Verify across all supported browsers
5. **Responsive Testing**: Test all breakpoints and devices

### Performance Validation
1. **Bundle Size Tracking**: Monitor CSS size changes
2. **Render Performance**: Measure component render times
3. **Memory Usage**: Check for CSS memory leaks
4. **Paint Performance**: Validate smooth animations/transitions

### Accessibility Testing
1. **Keyboard Navigation**: Verify all interactive elements
2. **Screen Reader**: Test with assistive technologies
3. **Color Contrast**: Validate all text/background combinations
4. **Focus Management**: Ensure proper focus handling

## Common Migration Challenges

### Challenge: Complex Nested Selectors
**Problem**: Global styles with deep nesting
**Solution**: Flatten structure, use CSS modules' local scope

### Challenge: Dynamic Styles
**Problem**: Runtime style calculations
**Solution**: CSS custom properties with JavaScript updates

### Challenge: Third-Party Component Styles
**Problem**: External components with global styling
**Solution**: Wrapper components with scoped overrides

### Challenge: Animation and Transition States
**Problem**: Complex state-based styling
**Solution**: CSS modules with conditional class application

## Rollback Procedures

### Component-Level Rollback
1. Revert component file to previous version
2. Remove new CSS module file
3. Restore any global styles if removed
4. Test component functionality

### Global Rollback
1. Restore quiz-styles.scss to global import
2. Revert all component migrations for specific section
3. Restore inline styles from git history
4. Rebuild and deploy previous working state

## Dependencies for Next Phase

### Required Deliverables
- [ ] 100% CSS module adoption across all components
- [ ] Zero inline styles or hardcoded values
- [ ] All components using semantic token system
- [ ] Visual regression testing complete with zero issues

### Performance Metrics
- [ ] CSS bundle size impact measured and documented
- [ ] Component render performance validated
- [ ] Memory usage impact assessed

---

**Previous Phase**: [Phase 2: Variable Consolidation](./phase-2-variables.md)  
**Next Phase**: [Phase 4: Validation & Documentation](./phase-4-validation.md)  
**Duration**: 5 days  
**Focus**: Final testing, documentation, and knowledge transfer
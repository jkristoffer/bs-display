# SCSS Dependencies Analysis

## SCSS Files in Nav Directory

1. **Nav.module.scss** - Main navigation styles
   - Key classes: `.nav`, `.container`, `.logo`, `.desktopNav`, `.mobileMenuButton`
   - Imports: Core mixins and functions from styles directory
   - Critical: Sticky positioning, backdrop filters, transitions

2. **NavItem.module.scss** - Individual nav link styles
   - Key classes: `.navItem`, `.active`, `.cta`
   - Styling for hover states and active indicators

3. **NavButton.module.scss** - Touch-optimized button styles
   - Key classes: `.navButton`, `.pressed`, `.longPressed`
   - Touch interaction feedback styles

4. **NavSection.module.scss** - Mobile menu section styles
   - Key classes: `.section`, `.sectionTitle`, `.sectionContent`
   - Grid layout for mobile navigation

5. **MobileMenuGrid.module.scss** - Mobile menu grid container
   - Key classes: `.mobileMenuGrid`, `.overlay`, `.content`
   - Full-screen overlay and slide animations

6. **ProductsMegaMenu.module.scss** - Mega menu dropdown styles
   - Key classes: `.megaMenu`, `.productGrid`, `.category`
   - Grid layout for product categories

## Critical Classes to Preserve

### Layout Classes
- `.nav` - Main navigation container
- `.container` - Inner wrapper with max-width
- `.logo` - Logo styling
- `.desktopNav` - Desktop menu container
- `.mobileMenuButton` - Hamburger button

### State Classes
- `.active` - Active page indicator
- `.open` - Open dropdown/menu state
- `.pressed` - Touch feedback
- `.scrolled` - Sticky nav scrolled state

### Component Classes
- `.dropdown` - Dropdown container
- `.megaMenu` - Products mega menu
- `.overlay` - Mobile menu overlay
- `.mobileNav` - Mobile navigation container

## Animation Definitions
- Slide transitions: `transform` with `cubic-bezier`
- Fade effects: `opacity` transitions
- Mobile menu slide: `translateX` animations
- Dropdown reveal: `translateY` with opacity

## Imported Dependencies
- Core mixins from `src/styles/core/mixins`
- Breakpoint utilities from `src/styles/core/breakpoints`
- Function utilities from `src/styles/core/functions`
- CSS variables from global styles

## Notes for Refactoring
- Keep all class names identical for compatibility
- Preserve animation timing functions
- Maintain z-index hierarchy
- Keep responsive breakpoints at 1024px
- Preserve CSS variable usage
# Homepage Style Guide

## Overview

This document outlines the modern design system and styling patterns implemented across the Big Shine Display homepage. The design emphasizes consistency, accessibility, and modern visual effects while maintaining excellent performance.

## Design Principles

### 1. **Unified Visual Language**
- Consistent color palette and gradients
- Harmonious spacing and typography
- Cohesive animation patterns
- Responsive design across all breakpoints

### 2. **Modern Aesthetics**
- Glassmorphism and backdrop blur effects
- Gradient text and backgrounds
- 3D hover transformations
- Subtle shadow systems

### 3. **Performance-First**
- Hardware-accelerated animations
- Reduced motion support
- Optimized rendering with CSS containment
- Efficient animation timing

---

## Color System

### Primary Gradient Palette
```scss
// Main brand gradient used throughout
$primary-gradient: linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%);

// Supporting gradients
$green-gradient: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
$blue-gradient: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
$orange-gradient: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
```

### Background Colors
```scss
// Section backgrounds
$section-bg-primary: #ffffff;
$section-bg-secondary: linear-gradient(180deg, #f8fafb 0%, #ffffff 100%);
$section-bg-tertiary: linear-gradient(135deg, #f8fafb 0%, #f0f4f8 100%);
```

### Glass Effects
```scss
// Glassmorphism components
$glass-background: rgba(255, 255, 255, 0.1);
$glass-border: rgba(255, 255, 255, 0.2);
$glass-backdrop: blur(10px);
```

---

## Typography System

### Responsive Typography
```scss
// Modern clamp-based scaling
$heading-xl: clamp(32px, 5vw, 48px);     // Section titles
$heading-lg: clamp(28px, 4vw, 36px);     // Card titles
$heading-md: clamp(24px, 3.5vw, 32px);   // Subsection titles
$subtitle: clamp(18px, 2.5vw, 24px);     // Subtitles
$body-lg: clamp(16px, 2vw, 20px);        // Large body text
```

### Font Weights
```scss
$font-light: 400;      // Subtitles and descriptions
$font-medium: 500;     // Feature items
$font-semibold: 600;   // Card titles
$font-bold: 700;       // Main headings
$font-black: 900;      // Hero titles (video banner)
```

### Text Effects
```scss
// Gradient text
.title-gradient {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

// Glitch effect (video banner)
.glitch {
  position: relative;
  
  &::before,
  &::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  &::before {
    animation: glitch-1 0.5s infinite;
    color: #00ffff;
    z-index: -1;
  }
  
  &::after {
    animation: glitch-2 0.5s infinite;
    color: #ff00ff;
    z-index: -2;
  }
}
```

---

## Spacing System

### Container and Padding
```scss
// Container constraints
$container-max-width: var(--spacing-container-max-width);
$container-padding: var(--spacing-md);

// Section spacing
$section-padding-sm: calc(var(--spacing-xl) * 1.5);
$section-padding-md: calc(var(--spacing-xl) * 2);
$section-padding-lg: calc(var(--spacing-xl) * 3);
```

### Grid Systems
```scss
// Responsive grids
.three-column-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
  
  @media (max-width: $breakpoint-lg) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: $breakpoint-sm) {
    grid-template-columns: 1fr;
  }
}

// Use cases alternating layout
.alternating-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: calc(var(--spacing-xl) * 1.5);
  
  &:nth-child(even) {
    grid-template-columns: 1.2fr 1fr;
    
    .visual { order: 2; }
    .content { order: 1; }
  }
}
```

---

## Animation System

### Keyframe Animations
```scss
// Fade in from bottom
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Floating motion
@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

// Continuous rotation
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// Scroll indicator
@keyframes scroll {
  0% { opacity: 1; transform: translateX(-50%) translateY(0); }
  100% { opacity: 0; transform: translateX(-50%) translateY(15px); }
}
```

### Transition Patterns
```scss
// Standard easing
$transition-standard: all 0.3s ease;
$transition-smooth: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
$transition-bounce: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);

// Hover transformations
.hover-lift {
  transition: $transition-smooth;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  }
}

.hover-scale {
  transition: $transition-standard;
  
  &:hover {
    transform: scale(1.05);
  }
}
```

---

## Component Patterns

### Card Components
```scss
// Modern card base
.modern-card {
  background: white;
  border-radius: 24px;
  padding: calc(var(--spacing-lg) * 1.5);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  
  // Animated top border
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--gradient);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  
  &:hover::before {
    transform: scaleX(1);
  }
}

// Glass card variant
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
}
```

### Button Variants
```scss
// Glass button for video backgrounds
.button--glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }
}

// Gradient button
.button--gradient {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 50px;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  }
}
```

### Icon Containers
```scss
// Gradient icon containers
.icon-container {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient);
  color: white;
  position: relative;
  transition: transform 0.4s ease;
  
  // Glow effect
  &::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 20px;
    background: inherit;
    filter: blur(15px);
    opacity: 0.4;
    z-index: -1;
  }
  
  &:hover {
    transform: rotate(5deg) scale(1.1);
  }
}
```

---

## Section-Specific Styles

### Video Banner
```scss
.video-banner {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  
  // Video background with overlay
  .video-background {
    position: absolute;
    inset: 0;
    z-index: -2;
    
    video {
      position: absolute;
      top: 50%;
      left: 50%;
      min-width: 100%;
      min-height: 100%;
      transform: translate(-50%, -50%);
      object-fit: cover;
    }
  }
  
  .video-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.7) 0%,
      rgba(0, 0, 0, 0.3) 50%,
      rgba(11, 43, 85, 0.6) 100%
    );
    z-index: 2;
  }
}
```

### Quiz Promotion Section
```scss
.quiz-promotion {
  padding: calc(var(--spacing-xl) * 3) 0;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  position: relative;
  overflow: hidden;
  
  // Interactive phone mockup
  .phone-container {
    position: relative;
    perspective: 1000px;
    
    .phone-screen {
      background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
      border-radius: 24px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
      transform: rotateY(-5deg) rotateX(5deg);
      transition: all 0.6s ease;
      
      &:hover {
        transform: rotateY(0deg) rotateX(0deg) scale(1.05);
      }
    }
  }
  
  // Floating UI elements
  .floating-stats {
    position: absolute;
    animation: statFloat 3s ease-in-out infinite;
    
    .stat-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 12px 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
  }
}
```

### Category Navigation
```scss
.category-navigation {
  padding: calc(var(--spacing-xl) * 2) 0;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafb 100%);
  
  .category-card {
    position: relative;
    overflow: hidden;
    
    // Glow effect on hover
    .card-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 200%;
      height: 200%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0;
      transition: opacity 0.4s ease;
      pointer-events: none;
    }
    
    &:hover .card-glow {
      opacity: 0.15;
    }
  }
}
```

---

## Responsive Design

### Breakpoint System
```scss
$breakpoint-sm: 768px;
$breakpoint-md: 1024px;
$breakpoint-lg: 1200px;
$breakpoint-xl: 1440px;
```

### Mobile Optimizations
```scss
// Stack grids on mobile
@media (max-width: $breakpoint-sm) {
  .three-column-grid,
  .alternating-grid {
    grid-template-columns: 1fr;
  }
  
  // Reduce card padding
  .modern-card {
    padding: var(--spacing-lg);
  }
  
  // Simplify animations
  .floating-cards .card {
    &:nth-child(1),
    &:nth-child(3) {
      transform: translateY(-10px) rotate(0);
    }
  }
}
```

---

## Accessibility Features

### Reduced Motion Support
```scss
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  // Fallback for video banner
  .banner-video {
    display: none;
  }
  
  .video-background::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url('/assets/abstract-bg-1.jpeg');
    background-size: cover;
    background-position: center;
  }
}
```

### Focus States
```scss
// Accessible focus indicators
.interactive-element {
  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
  
  &:focus:not(:focus-visible) {
    outline: none;
  }
}
```

---

## Performance Optimizations

### CSS Containment
```scss
// Optimize rendering performance
.independent-section {
  contain: layout style;
}

.animation-container {
  contain: layout;
  will-change: transform;
}
```

### Hardware Acceleration
```scss
// Force GPU acceleration for smooth animations
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform, opacity;
}
```

---

## Implementation Notes

### Animation Delays
- Use staggered delays (0.1s, 0.15s increments) for sequential elements
- Keep total animation duration under 0.8s for perceived performance
- Use `animation-fill-mode: both` to prevent flashing

### Color Accessibility
- All text maintains WCAG AA contrast ratios
- Gradients include fallback colors for accessibility tools
- Interactive elements have clear hover and focus states

### Loading States
- Poster images for video backgrounds
- Graceful degradation for CSS-only effects
- Progressive enhancement for advanced features

---

## Usage Guidelines

### Do's
- ✅ Use consistent gradient directions (135deg)
- ✅ Apply staggered animation delays for groups
- ✅ Include reduced motion fallbacks
- ✅ Maintain color contrast ratios
- ✅ Use semantic HTML structure

### Don'ts
- ❌ Mix different easing functions in the same component
- ❌ Use animations longer than 1 second
- ❌ Apply multiple competing visual effects
- ❌ Forget mobile responsive considerations
- ❌ Override accessibility preferences

### Modern Blog Highlights Section
```scss
.blog-highlights-modern {
  padding: calc(var(--spacing-xl) * 3) 0;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafb 100%);
  position: relative;
  overflow: hidden;
  
  // Background elements
  .bg-elements {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    
    .bg-glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(120px);
      opacity: 0.1;
      animation: glow1Float 20s ease-in-out infinite;
    }
  }
  
  // Featured article layout
  .featured-article {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: calc(var(--spacing-xl) * 2);
    background: white;
    border-radius: 24px;
    padding: calc(var(--spacing-xl) * 1.5);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
    }
  }
}
```

### Product Showcase Section
```scss
.products-showcase {
  padding: calc(var(--spacing-xl) * 3) 0;
  background: linear-gradient(180deg, #fafbfc 0%, #ffffff 100%);
  position: relative;
  overflow: hidden;
  
  // Background elements
  .bg-elements {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    
    .floating-shapes {
      .shape {
        position: absolute;
        opacity: 0.1;
        animation: shapeFloat1 12s ease-in-out infinite;
      }
    }
  }
  
  // Filter section
  .filter-section {
    background: white;
    border-radius: 20px;
    padding: var(--spacing-xl);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    margin-bottom: calc(var(--spacing-xl) * 2);
  }
  
  // Product cards
  .product-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    animation: cardSlideUp 0.6s ease-out both;
    
    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
    }
  }
}
```

### Badge and Header Components
```scss
// Header badge pattern
.header-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 8px 16px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 50px;
  color: #3b82f6;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
}

// Stats row pattern
.stats-row {
  display: flex;
  justify-content: center;
  gap: calc(var(--spacing-xl) * 1.5);
  margin-top: var(--spacing-xl);
  
  .stat-item {
    text-align: center;
    
    .stat-number {
      font-size: clamp(24px, 4vw, 32px);
      font-weight: 800;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
}
```

### Newsletter and Footer Patterns
```scss
// Newsletter section
.newsletter-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  background: white;
  padding: var(--spacing-lg);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  
  .newsletter-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
}

// Section footer pattern
.section-footer {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: calc(var(--spacing-xl) * 2);
  align-items: center;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 24px;
  padding: calc(var(--spacing-xl) * 1.5);
}
```

---

## Modern Button System

### Updated Button Variants
```scss
// Primary gradient button
.button-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 50px;
  padding: 14px 28px;
  font-weight: 600;
  color: white;
  border: none;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  }
}

// Glass button variant
.button-glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  color: white;
  padding: 12px 24px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }
}

// Ghost button with gradient hover
.button-ghost {
  background: transparent;
  border: 2px solid rgba(59, 130, 246, 0.3);
  border-radius: 50px;
  color: #3b82f6;
  padding: 12px 24px;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    border-color: transparent;
  }
}
```

---

## Advanced Animation Patterns

### Card Animation Sequences
```scss
// Staggered card entrance
@keyframes cardSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Floating motion for UI elements
@keyframes statFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

// Background orb animations
@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-30px, -20px) rotate(180deg); }
}

// Shape floating animations
@keyframes shapeFloat1 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}
```

---

## Future Enhancements

### Planned Improvements
1. **Dark mode support** with CSS custom properties
2. **Advanced micro-interactions** for enhanced UX
3. **CSS Grid subgrid** when browser support improves
4. **Container queries** for component-based responsive design

### Performance Monitoring
- Track Core Web Vitals impact
- Monitor animation frame rates
- Measure perceived loading performance
- Optimize critical rendering path

---

*This style guide should be updated whenever new patterns are introduced or existing ones are modified. Consistency is key to maintaining a cohesive user experience.*
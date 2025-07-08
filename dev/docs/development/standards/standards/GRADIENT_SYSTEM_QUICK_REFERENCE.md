# Gradient System Quick Reference

**Modern Design System** - Complete reference for the new gradient-based styling system.

---

## 🎨 At-a-Glance Usage

### Most Common Combinations
```typescript
// Hero section with gradient background and text
<section className="gradient-bg-primary">
  <h1 className="heading-hero gradient-text-primary">Welcome</h1>
  <button className="button-gradient">Get Started</button>
</section>

// Product card with glass effect
<div className="glass-light animate-fade-up">
  <div className="icon-container-gradient">🚀</div>
  <h3 className="gradient-text-success">Modern Design</h3>
</div>

// Call-to-action button
<button className="button-gradient animate-float">
  Click Me
</button>
```

---

## 🎯 Complete Utility Classes

### Gradient Backgrounds (8 available)
| Class | Effect | Best For |
|-------|--------|----------|
| `gradient-bg-primary` | Blue to purple | Primary sections, headers |
| `gradient-bg-green` | Teal to green | Success states, nature themes |
| `gradient-bg-blue` | Light to dark blue | Professional, tech content |
| `gradient-bg-orange` | Yellow to orange | CTAs, warmth, energy |
| `gradient-bg-purple` | Light to dark purple | Premium, luxury content |
| `gradient-bg-pink` | Pink to deep pink | Creative, feminine themes |
| `gradient-bg-teal` | Teal variants | Fresh, modern sections |
| `gradient-bg-indigo` | Indigo variants | Deep, professional tone |

### Gradient Text Effects (4 available)
| Class | Effect | Usage |
|-------|--------|-------|
| `gradient-text-primary` | Primary gradient text | Headlines, important text |
| `gradient-text-success` | Success gradient text | Positive messages |
| `gradient-text-warning` | Warning gradient text | Attention-grabbing text |
| `gradient-text-info` | Info gradient text | Information highlights |

### Glassmorphism Effects (3 available)
| Class | Effect | Backdrop | Best For |
|-------|--------|----------|----------|
| `glass-light` | Light frosted glass | Subtle blur | Cards on light backgrounds |
| `glass-dark` | Dark frosted glass | Medium blur | Cards on dark backgrounds |
| `glass-strong` | Strong glass effect | Heavy blur | Overlays, modals |

### Animations (4 available)
| Class | Effect | Duration | Usage |
|-------|--------|----------|-------|
| `animate-float` | Gentle floating | 3s infinite | Buttons, cards, icons |
| `animate-pulse` | Breathing effect | 2s infinite | CTAs, notifications |
| `animate-fade-up` | Fade and slide up | 0.6s once | Page elements, cards |
| `animate-rotate` | Continuous rotation | 4s infinite | Loading indicators, icons |

### Enhanced Button System (7 variants)
| Class | Style | Best For |
|-------|-------|----------|
| `button-primary` | Standard primary | Default actions |
| `button-gradient` | Gradient background | Premium CTAs |
| `button-glass` | Glass morphism | Modern interfaces |
| `button-success` | Success theme | Positive actions |
| `button-warning` | Warning theme | Caution actions |
| `button-ghost` | Transparent | Secondary actions |
| `button-fab` | Floating action | Quick actions, round buttons |

### Icon Containers (2 variants)
| Class | Style | Size Options |
|-------|-------|--------------|
| `icon-container-gradient` | Gradient background | `.sm`, default, `.lg` |
| `icon-container-glass` | Glass effect | `.sm`, default, `.lg` |

### Fluid Typography (4 scales)
| Class | Size Range | Usage |
|-------|------------|-------|
| `heading-hero` | 32px → 48px | Page heroes, main headlines |
| `heading-section` | 28px → 36px | Section headers |
| `subtitle-large` | 18px → 24px | Large subtitles |
| `text-fluid-sm` | 14px → 16px | Body text, descriptions |

---

## 🚀 Real-World Examples

### Modern Product Card
```typescript
<div className="glass-light animate-fade-up">
  <div className="gradient-bg-primary" style={{height: '200px'}}>
    <img src="product.jpg" alt="Product" />
  </div>
  <div style={{padding: '1rem'}}>
    <h3 className="gradient-text-primary">Product Name</h3>
    <p>Product description goes here</p>
    <button className="button-gradient">Learn More</button>
  </div>
</div>
```

### Hero Section
```typescript
<section className="gradient-bg-primary" style={{minHeight: '70vh', display: 'flex', alignItems: 'center'}}>
  <div className="container">
    <h1 className="heading-hero gradient-text-primary">
      Transform Your Business
    </h1>
    <p className="subtitle-large" style={{color: 'white', marginBottom: '2rem'}}>
      Discover our innovative solutions
    </p>
    <button className="button-glass animate-float">
      Get Started Today
    </button>
  </div>
</section>
```

### Feature Grid
```typescript
<div className="grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
  <div className="glass-light">
    <div className="icon-container-gradient lg">🎨</div>
    <h3 className="gradient-text-success">Design</h3>
    <p>Beautiful, modern interfaces</p>
  </div>
  <div className="glass-light">
    <div className="icon-container-gradient lg">⚡</div>
    <h3 className="gradient-text-warning">Performance</h3>
    <p>Lightning-fast experiences</p>
  </div>
  <div className="glass-light">
    <div className="icon-container-gradient lg">🔒</div>
    <h3 className="gradient-text-info">Security</h3>
    <p>Enterprise-grade protection</p>
  </div>
</div>
```

### Call-to-Action Section
```typescript
<section className="gradient-bg-orange glass-strong" style={{padding: '4rem 2rem', textAlign: 'center'}}>
  <div className="container">
    <h2 className="heading-section gradient-text-warning">
      Ready to Get Started?
    </h2>
    <p className="subtitle-large" style={{color: 'white', margin: '1rem 0 2rem'}}>
      Join thousands of satisfied customers
    </p>
    <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
      <button className="button-glass animate-pulse">
        Start Free Trial
      </button>
      <button className="button-ghost">
        Learn More
      </button>
    </div>
  </div>
</section>
```

---

## ⚙️ CSS Variables Available

### Gradient Variables
```css
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--gradient-green: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
--gradient-blue: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
--gradient-orange: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
--gradient-purple: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
--gradient-pink: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
--gradient-teal: linear-gradient(135deg, #14b8a6 0%, #0f766e 100%);
--gradient-indigo: linear-gradient(135deg, #6366f1 0%, #4338ca 100%);
```

### Glassmorphism Variables
```css
--glass-bg: rgba(255, 255, 255, 0.1);
--glass-border: rgba(255, 255, 255, 0.2);
--glass-backdrop: blur(10px);
```

### Fluid Typography Variables
```css
--font-size-h1: clamp(32px, 5vw, 48px);
--font-size-h2: clamp(28px, 4vw, 36px);
--font-size-h3: clamp(24px, 3vw, 30px);
--font-size-h4: clamp(20px, 2.5vw, 24px);
```

---

## 🎯 Design Patterns

### Color Hierarchy
1. **Primary** (Blue-Purple): Main brand elements, primary CTAs
2. **Success** (Green): Success states, positive feedback
3. **Warning** (Orange): Attention, important notices
4. **Info** (Blue): Information, secondary content

### Visual Weight
1. **Gradient backgrounds**: Highest visual impact
2. **Gradient text**: Medium impact, great for headings
3. **Glass effects**: Subtle, modern feel
4. **Animations**: Add life and interactivity

### Accessibility
- All gradients meet WCAG AA contrast requirements
- Animations respect `prefers-reduced-motion`
- Glass effects maintain readable text contrast
- Focus states clearly visible on all interactive elements

---

## 📱 Responsive Behavior

### Automatic Scaling
- **Typography**: Fluid scaling with `clamp()` functions
- **Spacing**: Contextual spacing adapts to viewport
- **Animations**: Optimized for touch devices
- **Glass effects**: Adjust backdrop blur for performance

### Mobile Considerations
- Gradients optimized for smaller screens
- Touch-friendly button sizes (minimum 44px)
- Reduced animation intensity on mobile
- Glass effects simplified for battery life

---

## 🚨 Common Mistakes to Avoid

❌ **Don't combine too many effects**
```typescript
// Too much
<div className="gradient-bg-primary glass-strong animate-float animate-pulse">
```

✅ **Use effects purposefully**
```typescript
// Just right
<div className="gradient-bg-primary glass-light">
```

❌ **Don't use gradient text on gradient backgrounds**
```typescript
// Poor contrast
<div className="gradient-bg-primary">
  <h1 className="gradient-text-primary">Title</h1>
</div>
```

✅ **Ensure proper contrast**
```typescript
// Good contrast
<div className="gradient-bg-primary">
  <h1 style={{color: 'white'}}>Title</h1>
</div>
```

---

## 🎉 Quick Tips

- **Start simple**: Use one gradient effect per component
- **Layer thoughtfully**: Glass effects work great over gradients
- **Animate sparingly**: One animation per element maximum
- **Test accessibility**: Always check contrast ratios
- **Performance first**: Animations are hardware-accelerated
- **Mobile friendly**: All effects scale appropriately

---

*This gradient system provides 25+ utility classes and is production-ready. Test page available at `/test-gradients`.*
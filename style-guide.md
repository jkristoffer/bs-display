# Website Style Guide – Smart Whiteboard Reseller (Singapore & Johor Bahru)

---

## 1. Brand Tone and Voice

- **Tone:** Confident, Clean, No-nonsense
- **Voice Characteristics:**
  - Straightforward and jargon-free
  - Authority without being overbearing
  - Clear, helpful, solution-oriented
  - Minimal marketing fluff

---

## 2. Color Palette

### 🎨 Primary Colors

- **Background:** White (#FFFFFF)
- **Accent 1:** Teal-Green (#009688 or #00A896)
- **Accent 2:** Playful Orange (#FFA726 or #F6723A)

### ✅ Strengths

- White + Teal = Clean, modern, professional
- Orange adds energy and draws attention to CTAs

### ⚠️ Considerations

- Use Orange sparingly to avoid visual competition.
- Reserve Orange mainly for action buttons and key highlights.

---

## 3. Typography

- **Primary Font:** Inter, Helvetica Neue, or Poppins
- **Backup Fonts:** Arial, sans-serif
- **Font Style:** Modern Sans-Serif
- **Font Weights:** 300–700 range to create visual hierarchy

---

## 4. Logo and Brand Elements

- **Logo Status:** In development
- **Initial Direction:**
  - Wordmark with subtle abstract symbol
  - Symbol ideas: stylized smartboard, dot-grid, pen swipe
- **Logo Colors:**
  - Main: Teal
  - Accent: Playful Orange (for small detail highlights)

---

## 5. Imagery and Iconography

- **Imagery Style:**
  - Abstract backgrounds (waves, layered shapes)
  - High-resolution device mockups

- **Icon Style:**
  - Minimalist line icons
  - Recommended libraries: Feather Icons, Lucide Icons, Phosphor Light

---

## 6. Spacing and Layout System

### 6.1 Section Components

The BigShine Display site uses a comprehensive section-based layout system for consistent vertical rhythm across all pages.

#### Core Section Classes

- **`.section`**: Base section component (32px padding top/bottom)
  - Section separation: 48px margin between adjacent sections

#### Section Variants

- **`.section--with-background`**: For sections with background colors/images (48px padding)
- **`.section--narrow`**: For content-dense areas (16px padding)
- **`.section--wide`**: For showcasing important content (48px padding with horizontal padding)
- **`.section--hero`**: For hero sections (72px padding with special treatment)
- **`.section--grid-content`**: For grid-based content layouts (includes grid container)
- **`.section--animate`**: For sections with entrance animations

#### Section Implementation Pattern

```html
<section class="section [variant-modifier]">
  <div class="container">
    <!-- Section content goes here -->
  </div>
</section>
```

### 6.2 Spacing Utilities

Utility classes follow BEM convention with u- prefix for quick spacing adjustments:

#### Margin Utilities
- **Top**: `.u-margin-top-xs`, `.u-margin-top-sm`, `.u-margin-top-md`, `.u-margin-top-lg`, `.u-margin-top-xl`
- **Bottom**: `.u-margin-bottom-xs`, `.u-margin-bottom-sm`, `.u-margin-bottom-md`, `.u-margin-bottom-lg`, `.u-margin-bottom-xl`

#### Padding Utilities
- `.u-padding-xs`, `.u-padding-sm`, `.u-padding-md`, `.u-padding-lg`, `.u-padding-xl`

### 6.3 Responsive Behavior

- All sections and spacing automatically adjust for mobile devices
- Mobile breakpoint: 768px
- Desktop-to-mobile spacing reduction pattern:
  - Standard sections: 32px → 24px padding
  - Background sections: 48px → 32px padding
  - Section spacing: 48px → 32px margin

### 6.4 Animation System

For subtle entrance animations:

1. Add the `.section--animate` class to any section
2. Animation automatically triggers when section comes into view
3. Uses intersection observer for performance
4. Graceful fallback for older browsers

### 6.5 Card Components

- Inner padding within cards: typically `var(--spacing-lg)` (24px)
- Card grid spacing: `var(--spacing-md)` (16px) to `var(--spacing-lg)` (24px)
- All card components follow BEM naming convention
- Card hover states use subtle transforms for interaction

---

## 7. Button and CTA Styles

- **Button Shape:** Sharp-edged
- **Button Style:**
  - Default: Ghost outline
  - Primary CTA: Filled with Accent Orange
- **Hover Effects:** Subtle border darkening or light background fill

- **Key CTAs:**
  - Request Quote
  - Request Demo
  - Contact Us

---

## 8. Special Notes and Inspirations

- **Inspirations:**
  - Apple.com — clean, minimalistic layouts
  - WATV.org — dense yet highly readable content presentation

- **Design Strategy:**
  - Combine minimalism with high information density
  - Strong use of visual hierarchy (font sizes, weights, iconography)

---

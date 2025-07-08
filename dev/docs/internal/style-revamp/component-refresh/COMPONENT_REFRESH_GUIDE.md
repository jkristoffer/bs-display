# Component Refresh Guidelines

## Overview
This guide provides detailed specifications for refreshing all UI components to align with the new gradient design system, ensuring consistency and modern aesthetics across the BigShine Display platform.

---

## Core Component Updates

### 1. Navigation Components

#### Primary Navigation Bar
```typescript
// Navigation Component Structure
interface NavProps {
  variant: 'transparent' | 'solid' | 'glass';
  sticky?: boolean;
  showSearch?: boolean;
}

// Implementation
<nav className="nav-primary glass-light">
  <div className="nav-container">
    {/* Logo */}
    <div className="nav-logo">
      <img src="/logo.svg" alt="BigShine" className="logo-img" />
    </div>
    
    {/* Menu Items */}
    <div className="nav-menu">
      <a href="/products" className="nav-link">
        Products
        <ChevronDown className="dropdown-indicator" />
      </a>
      
      {/* Mega Menu */}
      <div className="mega-menu glass-strong">
        <div className="mega-menu-grid">
          <div className="menu-column">
            <h3 className="menu-title gradient-text-primary">Smart Boards</h3>
            <ul className="menu-list">
              <li>
                <a href="#" className="menu-item">
                  <div className="item-icon gradient-bg-primary">
                    <Monitor />
                  </div>
                  <div className="item-content">
                    <span className="item-title">Interactive Displays</span>
                    <span className="item-desc">4K touch screens</span>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    {/* Actions */}
    <div className="nav-actions">
      <button className="nav-search glass-light">
        <Search />
      </button>
      <button className="button-gradient button-sm">
        Get Quote
      </button>
    </div>
  </div>
</nav>
```

#### Mobile Navigation
```scss
.mobile-nav {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  
  &.active {
    transform: translateX(0);
  }
  
  .mobile-menu {
    padding: 2rem;
    
    .mobile-menu-item {
      padding: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      transition: all 0.2s ease;
      
      &:active {
        background: var(--gradient-primary);
      }
    }
  }
}
```

### 2. Button System Refresh

#### Button Variants
```typescript
// Button Component
interface ButtonProps {
  variant: 'primary' | 'gradient' | 'glass' | 'ghost' | 'success' | 'warning';
  size: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

// Base Button Styles
.button {
  // Base styles
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all var(--duration-normal) var(--ease-smooth);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  // Sizes
  &.button-sm {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
  
  &.button-md {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
  
  &.button-lg {
    padding: 1rem 2rem;
    font-size: 1.125rem;
  }
  
  &.button-xl {
    padding: 1.25rem 2.5rem;
    font-size: 1.25rem;
  }
  
  // Gradient variant
  &.button-gradient {
    background: var(--gradient-primary);
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
  
  // Glass variant
  &.button-glass {
    background: var(--glass-white);
    backdrop-filter: blur(10px);
    border: 1px solid var(--glass-border);
    color: var(--text-primary);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.3);
    }
  }
  
  // Loading state
  &.loading {
    pointer-events: none;
    opacity: 0.8;
    
    .button-content {
      opacity: 0;
    }
    
    &::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
  }
}
```

### 3. Card Components

#### Base Card System
```typescript
// Card variants
interface CardProps {
  variant: 'default' | 'glass' | 'gradient' | 'outlined';
  hoverable?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

// Card implementation
.card {
  border-radius: 1rem;
  overflow: hidden;
  transition: all var(--duration-normal) var(--ease-smooth);
  
  // Glass variant
  &.card-glass {
    background: var(--glass-white);
    backdrop-filter: blur(10px);
    border: 1px solid var(--glass-border);
  }
  
  // Gradient variant
  &.card-gradient {
    background: var(--gradient-primary);
    color: white;
    
    .card-title,
    .card-text {
      color: white;
    }
  }
  
  // Hover effects
  &.hoverable {
    cursor: pointer;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
      
      .card-image img {
        transform: scale(1.05);
      }
    }
  }
  
  // Card sections
  .card-image {
    position: relative;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--duration-slow) var(--ease-smooth);
    }
  }
  
  .card-content {
    padding: var(--space-card);
  }
  
  .card-footer {
    padding: var(--space-md) var(--space-card);
    border-top: 1px solid var(--border-color);
    background: rgba(0, 0, 0, 0.02);
  }
}
```

### 4. Form Components

#### Modern Input Fields
```scss
// Input field styles
.form-group {
  position: relative;
  margin-bottom: 1.5rem;
  
  .form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--text-secondary);
    transition: color 0.2s ease;
  }
  
  .form-input {
    width: 100%;
    padding: 0.75rem 1rem;
    background: var(--glass-white);
    border: 2px solid transparent;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: var(--gradient-primary-start);
      background: white;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      
      + .form-label {
        color: var(--gradient-primary-start);
      }
    }
    
    &.has-error {
      border-color: var(--color-danger);
      
      &:focus {
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
      }
    }
  }
  
  // Floating label variant
  &.floating-label {
    .form-label {
      position: absolute;
      top: 0.75rem;
      left: 1rem;
      background: white;
      padding: 0 0.25rem;
      pointer-events: none;
      transition: all 0.2s ease;
    }
    
    .form-input:focus + .form-label,
    .form-input:not(:placeholder-shown) + .form-label {
      top: -0.75rem;
      font-size: 0.875rem;
      color: var(--gradient-primary-start);
    }
  }
}

// Select dropdown
.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,..."); // Chevron down
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
}

// Checkbox and Radio
.form-check {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  
  input[type="checkbox"],
  input[type="radio"] {
    position: absolute;
    opacity: 0;
    
    + .check-mark {
      width: 1.25rem;
      height: 1.25rem;
      border: 2px solid var(--border-color);
      border-radius: 0.25rem;
      transition: all 0.2s ease;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        top: 2px;
        left: 6px;
        width: 5px;
        height: 10px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg) scale(0);
        transition: transform 0.2s ease;
      }
    }
    
    &:checked + .check-mark {
      background: var(--gradient-primary);
      border-color: transparent;
      
      &::after {
        transform: rotate(45deg) scale(1);
      }
    }
  }
  
  input[type="radio"] + .check-mark {
    border-radius: 50%;
    
    &::after {
      top: 4px;
      left: 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: white;
      border: none;
      transform: scale(0);
    }
  }
}
```

### 5. Modal Components

```typescript
// Modal implementation
<div className="modal-overlay" onClick={closeModal}>
  <div className="modal-container glass-strong animate-scale-up" onClick={e => e.stopPropagation()}>
    <div className="modal-header">
      <h2 className="modal-title gradient-text-primary">Modal Title</h2>
      <button className="modal-close glass-light" onClick={closeModal}>
        <X />
      </button>
    </div>
    
    <div className="modal-body">
      {/* Content */}
    </div>
    
    <div className="modal-footer">
      <button className="button-ghost" onClick={closeModal}>
        Cancel
      </button>
      <button className="button-gradient">
        Confirm
      </button>
    </div>
  </div>
</div>

// Modal styles
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fade-in 0.2s ease;
}

.modal-container {
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow: auto;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}
```

### 6. Toast/Notification Components

```typescript
// Toast variants
interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Toast implementation
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: slide-up 0.3s ease;
  
  &.toast-success {
    background: var(--gradient-success);
    color: white;
  }
  
  &.toast-error {
    background: var(--gradient-danger);
    color: white;
  }
  
  .toast-icon {
    width: 24px;
    height: 24px;
  }
  
  .toast-close {
    margin-left: auto;
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    opacity: 0.8;
    
    &:hover {
      opacity: 1;
    }
  }
}
```

### 7. Loading States

```scss
// Skeleton loader
.skeleton {
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.05) 25%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.05) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 0.25rem;
  
  &.skeleton-text {
    height: 1rem;
    margin-bottom: 0.5rem;
    
    &:last-child {
      width: 80%;
    }
  }
  
  &.skeleton-card {
    height: 300px;
    border-radius: 1rem;
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

// Spinner
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: var(--gradient-primary-start);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  
  &.spinner-sm {
    width: 20px;
    height: 20px;
    border-width: 2px;
  }
  
  &.spinner-lg {
    width: 60px;
    height: 60px;
    border-width: 4px;
  }
}
```

---

## Animation Guidelines

### Standard Animations
```scss
// Fade animations
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Scale animations
@keyframes scale-up {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

// Slide animations
@keyframes slide-in-right {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
```

### Animation Classes
```scss
.animate-fade-in { animation: fade-in 0.3s ease; }
.animate-fade-up { animation: fade-up 0.6s ease; }
.animate-scale-up { animation: scale-up 0.3s ease; }
.animate-slide-right { animation: slide-in-right 0.4s ease; }

// Stagger children
.stagger-children > * {
  animation: fade-up 0.6s ease both;
  
  @for $i from 1 through 10 {
    &:nth-child(#{$i}) {
      animation-delay: #{$i * 0.1}s;
    }
  }
}
```

---

## Accessibility Standards

### Focus States
```scss
// Custom focus outline
:focus-visible {
  outline: 2px solid var(--gradient-primary-start);
  outline-offset: 2px;
}

// Skip to content link
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--gradient-primary);
  color: white;
  padding: 0.5rem 1rem;
  text-decoration: none;
  border-radius: 0 0 0.5rem 0;
  
  &:focus {
    top: 0;
  }
}
```

### ARIA Labels
```typescript
// Proper labeling
<button 
  aria-label="Close dialog"
  aria-pressed={isPressed}
  aria-expanded={isExpanded}
>
  <X />
</button>

// Live regions
<div 
  role="status" 
  aria-live="polite" 
  aria-atomic="true"
>
  {statusMessage}
</div>
```

---

## Dark Mode Considerations

```scss
// Dark mode variables
@media (prefers-color-scheme: dark) {
  :root {
    --glass-white: rgba(255, 255, 255, 0.05);
    --glass-border: rgba(255, 255, 255, 0.1);
    --text-primary: #f1f5f9;
    --text-secondary: #94a3b8;
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
  }
  
  // Component adjustments
  .card-glass {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .button-glass {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
}
```

---

This component refresh guide provides comprehensive specifications for modernizing all UI components with the new gradient design system, ensuring consistency, accessibility, and modern aesthetics across the entire platform.
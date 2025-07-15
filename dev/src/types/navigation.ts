/**
 * TypeScript interfaces for mobile grid navigation components
 * Extends existing navigation patterns with mobile-first grid design
 */

import type { ReactNode } from 'react';

// Base navigation item interface extending existing NavItemType
export interface BaseNavItem {
  path?: string;
  label: string;
  icon?: string | ReactNode;
  image?: string;
  badge?: string | number;
  description?: string;
  isNew?: boolean;
  isExternal?: boolean;
  ariaLabel?: string;
  disabled?: boolean;
}

// Extended navigation item for mobile grid with additional properties
export interface MobileNavItem extends BaseNavItem {
  id: string;
  category?: string;
  priority?: 'high' | 'medium' | 'low';
  touchTarget?: 'standard' | 'large';
  gradient?: string;
  bgColor?: string;
  textColor?: string;
}

// Navigation section for organizing grid items
export interface NavSection {
  id: string;
  title: string;
  description?: string;
  items: MobileNavItem[];
  columns?: 2 | 3;
  showTitle?: boolean;
  className?: string;
  priority?: number;
}

// Main mobile menu grid component props
export interface MobileMenuGridProps {
  sections: NavSection[];
  isOpen: boolean;
  onClose: () => void;
  onItemClick?: (item: MobileNavItem) => void;
  currentPath?: string;
  className?: string;
  
  // Grid layout options
  defaultColumns?: 2 | 3;
  adaptiveColumns?: boolean;
  
  // Accessibility
  ariaLabel?: string;
  ariaDescribedBy?: string;
  
  // Animation settings
  animationDuration?: number;
  staggerDelay?: number;
  
  // Touch optimization
  hapticFeedback?: boolean;
  touchSensitivity?: 'low' | 'medium' | 'high';
}

// Individual navigation button component props
export interface NavButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  item: MobileNavItem;
  isActive?: boolean;
  onClick?: (item: MobileNavItem) => void;
  variant?: 'standard' | 'featured' | 'compact';
  size?: 'sm' | 'md' | 'lg';
  
  // Visual properties
  showIcon?: boolean;
  showImage?: boolean;
  showBadge?: boolean;
  showDescription?: boolean;
  iconPosition?: 'top' | 'left' | 'right';
  
  // Touch interaction
  pressEffect?: 'scale' | 'bounce' | 'ripple' | 'none';
  longPressAction?: () => void;
  longPressDelay?: number;
  
  // Accessibility enhancements
  role?: string;
  tabIndex?: number;
  
  // Custom styling
  className?: string;
  style?: React.CSSProperties;
}

// Navigation section component props
export interface NavSectionProps {
  section: NavSection;
  currentPath?: string;
  onItemClick?: (item: MobileNavItem) => void;
  className?: string;
  
  // Layout customization
  columns?: 2 | 3;
  gap?: 'sm' | 'md' | 'lg';
  
  // Animation
  animationDelay?: number;
  
  // Accessibility
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

// Navigation data structure for configuration
export interface NavigationConfig {
  sections: NavSection[];
  metadata: {
    version: string;
    lastUpdated: string;
    defaultColumns: 2 | 3;
    theme: 'light' | 'dark' | 'auto';
  };
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    screenReaderOptimized: boolean;
  };
}

// Event handler types
export type NavItemClickHandler = (item: MobileNavItem, event?: React.MouseEvent | React.TouchEvent) => void;
export type NavSectionChangeHandler = (sectionId: string, isVisible: boolean) => void;
export type NavMenuStateHandler = (isOpen: boolean) => void;

// Touch gesture types
export interface TouchGesture {
  type: 'tap' | 'long-press' | 'swipe';
  direction?: 'up' | 'down' | 'left' | 'right';
  velocity?: number;
  duration?: number;
}

export type TouchGestureHandler = (gesture: TouchGesture, item?: MobileNavItem) => void;

// Animation configuration
export interface AnimationConfig {
  duration: number;
  easing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | string;
  stagger: boolean;
  staggerDelay: number;
  fadeIn: boolean;
  slideDirection?: 'up' | 'down' | 'left' | 'right';
}

// Theme configuration for mobile navigation
export interface MobileNavTheme {
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: string;
    textSecondary: string;
    border: string;
    shadow: string;
    accent: string;
  };
  
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  
  animation: AnimationConfig;
}

// Responsive breakpoints
export interface BreakpointConfig {
  mobile: number;
  tablet: number;
  desktop: number;
  largeDesktop: number;
}

// Mobile navigation context state
export interface MobileNavContextState {
  isOpen: boolean;
  activeSection?: string;
  currentPath: string;
  theme: MobileNavTheme;
  config: NavigationConfig;
  breakpoints: BreakpointConfig;
  
  // Actions
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  setActiveSection: (sectionId: string) => void;
  navigateToItem: (item: MobileNavItem) => void;
  updateConfig: (config: Partial<NavigationConfig>) => void;
  updateTheme: (theme: Partial<MobileNavTheme>) => void;
}

// Hook return types
export interface UseMobileNavigationReturn {
  state: MobileNavContextState;
  handlers: {
    onItemClick: NavItemClickHandler;
    onSectionChange: NavSectionChangeHandler;
    onMenuStateChange: NavMenuStateHandler;
    onTouchGesture: TouchGestureHandler;
  };
  utils: {
    isActiveItem: (item: MobileNavItem) => boolean;
    getItemsByCategory: (category: string) => MobileNavItem[];
    getSectionById: (id: string) => NavSection | undefined;
    getAdaptiveColumns: () => 2 | 3;
  };
}

// Analytics and tracking types
export interface NavAnalyticsEvent {
  type: 'item_click' | 'section_view' | 'menu_open' | 'menu_close' | 'gesture';
  timestamp: number;
  itemId?: string;
  sectionId?: string;
  path?: string;
  gesture?: TouchGesture;
  metadata?: Record<string, any>;
}

export type NavAnalyticsHandler = (event: NavAnalyticsEvent) => void;

// Performance monitoring
export interface PerformanceMetrics {
  renderTime: number;
  animationFrames: number;
  touchResponseTime: number;
  memoryUsage?: number;
}

export type PerformanceHandler = (metrics: PerformanceMetrics) => void;

// Error handling
export interface NavError {
  code: string;
  message: string;
  component?: string;
  timestamp: number;
  stack?: string;
}

export type NavErrorHandler = (error: NavError) => void;

// Component ref types for imperative actions
export interface MobileMenuGridRef {
  open: () => void;
  close: () => void;
  toggle: () => void;
  focusFirstItem: () => void;
  focusLastItem: () => void;
  scrollToSection: (sectionId: string) => void;
}

export interface NavButtonRef {
  focus: () => void;
  blur: () => void;
  click: () => void;
  getElement: () => HTMLButtonElement | null;
}

// Utility types for type safety
export type RequiredNavItem = Required<Pick<MobileNavItem, 'id' | 'label'>> & Partial<MobileNavItem>;
export type NavItemWithPath = MobileNavItem & Required<Pick<MobileNavItem, 'path'>>;
export type NavItemWithIcon = MobileNavItem & Required<Pick<MobileNavItem, 'icon'>>;

// Union types for common patterns
export type NavItemVariant = 'standard' | 'featured' | 'compact';
export type TouchTargetSize = 'standard' | 'large';
export type GridColumns = 2 | 3;
export type PriorityLevel = 'high' | 'medium' | 'low';
export type AnimationEasing = 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';

// Conditional types for advanced type checking
export type NavItemWithRequiredPath<T extends MobileNavItem> = T extends { path: string } 
  ? T 
  : never;

export type NavItemWithOptionalIcon<T extends MobileNavItem> = T extends { icon: any }
  ? T & { showIcon: true }
  : T & { showIcon?: false };

// Template literal types for CSS classes
export type NavButtonClass = `nav-button nav-button--${NavItemVariant}` | `nav-button nav-button--${NavItemVariant} nav-button--active`;
export type GridClass = `mobile-grid mobile-grid--${GridColumns}col` | `mobile-grid mobile-grid--${GridColumns}col mobile-grid--adaptive`;

// Branded types for type safety
export type NavItemId = string & { readonly brand: unique symbol };
export type SectionId = string & { readonly brand: unique symbol };

// Export utility functions types
export interface NavigationUtils {
  createNavItem: (config: Partial<MobileNavItem> & Pick<MobileNavItem, 'id' | 'label'>) => MobileNavItem;
  createSection: (config: Partial<NavSection> & Pick<NavSection, 'id' | 'title' | 'items'>) => NavSection;
  validateNavConfig: (config: NavigationConfig) => boolean;
  mergeThemes: (base: MobileNavTheme, override: Partial<MobileNavTheme>) => MobileNavTheme;
  generateId: () => string;
  sanitizeNavItem: (item: unknown) => MobileNavItem | null;
}
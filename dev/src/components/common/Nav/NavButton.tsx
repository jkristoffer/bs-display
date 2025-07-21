import React, { useState, useRef, useImperativeHandle } from 'react';
import type { NavButtonProps, NavButtonRef } from '../../../types/navigation';
import styles from './NavButton.module.scss';

/**
 * NavButton - Touch-optimized navigation button for mobile grid
 * 
 * Features:
 * - Multiple visual variants (standard, featured, compact)
 * - Icon and image support with flexible positioning
 * - Touch feedback with configurable press effects
 * - Long press gesture support
 * - ARIA accessibility compliance
 * - Badge display for notifications/labels
 */
const NavButton = React.forwardRef<NavButtonRef, NavButtonProps>(function NavButton({
  item,
  isActive = false,
  onClick,
  variant = 'standard',
  size = 'md',
  showIcon = true,
  showImage = true,
  showBadge = true,
  showDescription = false,
  iconPosition = 'top',
  pressEffect = 'scale',
  longPressAction,
  longPressDelay = 500,
  role = 'button',
  tabIndex = 0,
  className = '',
  style,
  disabled = false,
  ...buttonProps
}, ref) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [isLongPressed, setIsLongPressed] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  // Imperative methods for parent components
  useImperativeHandle(ref, () => ({
    focus: () => buttonRef.current?.focus(),
    blur: () => buttonRef.current?.blur(),
    click: () => buttonRef.current?.click(),
    getElement: () => buttonRef.current,
  }));

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || item.disabled) return;
    
    event.preventDefault();
    onClick?.(item);
  };

  const handleTouchStart = () => {
    if (disabled || item.disabled) return;
    
    setIsPressed(true);
    
    // Start long press timer
    if (longPressAction && longPressDelay > 0) {
      longPressTimer.current = setTimeout(() => {
        setIsLongPressed(true);
        longPressAction();
        
        // Haptic feedback for long press
        if ('vibrate' in navigator) {
          navigator.vibrate([10, 50, 10]); // Pattern for long press
        }
      }, longPressDelay);
    }
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
    setIsLongPressed(false);
    
    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.(item);
    }
  };

  // Render icon element
  const renderIcon = () => {
    if (!showIcon || !item.icon) return null;
    
    if (typeof item.icon === 'string') {
      return (
        <span 
          className={styles.icon} 
          aria-hidden="true"
        >
          {item.icon}
        </span>
      );
    }
    
    return (
      <span className={styles.iconComponent} aria-hidden="true">
        {item.icon}
      </span>
    );
  };

  // Render image element
  const renderImage = () => {
    if (!showImage || !item.image) return null;
    
    return (
      <img 
        src={item.image}
        alt=""
        className={styles.image}
        loading="lazy"
        aria-hidden="true"
      />
    );
  };

  // Render badge element
  const renderBadge = () => {
    if (!showBadge || !item.badge) return null;
    
    return (
      <span 
        className={styles.badge}
        aria-label={typeof item.badge === 'number' ? `${item.badge} notifications` : item.badge}
      >
        {item.badge}
      </span>
    );
  };

  // Generate CSS classes
  const buttonClasses = [
    styles.navButton,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    styles[`icon-${iconPosition}`],
    pressEffect !== 'none' && styles[`press-${pressEffect}`],
    isActive && styles.active,
    isPressed && styles.pressed,
    isLongPressed && styles.longPressed,
    (disabled || item.disabled) && styles.disabled,
    item.isNew && styles.new,
    className
  ].filter(Boolean).join(' ');

  // Generate CSS custom properties for theming
  const customProperties = {
    '--bg-color': item.bgColor,
    '--text-color': item.textColor,
    '--gradient': item.gradient,
    '--touch-target': item.touchTarget === 'large' ? '48px' : '44px',
  } as React.CSSProperties;

  const combinedStyle = { ...customProperties, ...style };

  return (
    <button
      ref={buttonRef}
      className={buttonClasses}
      style={combinedStyle}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onKeyDown={handleKeyDown}
      disabled={disabled || item.disabled}
      role={role}
      tabIndex={tabIndex}
      aria-label={item.ariaLabel || item.label}
      aria-current={isActive ? 'page' : undefined}
      aria-pressed={isPressed ? 'true' : 'false'}
      data-testid={`nav-button-${item.id}`}
      {...buttonProps}
    >
      {/* Visual content container */}
      <span className={styles.content}>
        {/* Icon/Image container based on position */}
        {(iconPosition === 'top' || iconPosition === 'left') && (
          <span className={styles.visual}>
            {renderImage()}
            {renderIcon()}
          </span>
        )}
        
        {/* Text content */}
        <span className={styles.text}>
          <span className={styles.label}>
            {item.label}
          </span>
          
          {showDescription && item.description && (
            <span className={styles.description}>
              {item.description}
            </span>
          )}
        </span>
        
        {/* Icon for right position */}
        {iconPosition === 'right' && (
          <span className={styles.visual}>
            {renderIcon()}
          </span>
        )}
      </span>
      
      {/* Badge overlay */}
      {renderBadge()}
      
      {/* New indicator */}
      {item.isNew && (
        <span className={styles.newIndicator} aria-hidden="true">
          New
        </span>
      )}
      
      {/* Touch ripple effect container */}
      {pressEffect === 'ripple' && (
        <span className={styles.rippleContainer} aria-hidden="true" />
      )}
    </button>
  );
});

export { NavButton };
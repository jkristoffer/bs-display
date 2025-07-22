import { useEffect } from 'react';

/**
 * Custom hook for managing body scroll lock when mobile menu is open
 * Extracts scroll management logic from Nav component lines 57-90
 */
export const useScrollLock = (isLocked: boolean): void => {
  useEffect(() => {
    if (!isLocked) return;

    // Save current scroll position and focused element
    const scrollY = window.scrollY;
    const previouslyFocused = document.activeElement as HTMLElement;
    
    // Apply scroll lock styles
    const originalStyles = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      overflow: document.body.style.overflow
    };
    
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    
    // Focus management for accessibility
    const focusCloseButton = () => {
      const closeButton = document.querySelector('[class*="nav__mobileClose"]') as HTMLElement;
      closeButton?.focus();
    };
    
    const focusTimeout = setTimeout(focusCloseButton, 100);
    
    // Cleanup function
    return () => {
      // Clear timeout
      clearTimeout(focusTimeout);
      
      // Restore original styles
      document.body.style.position = originalStyles.position;
      document.body.style.top = originalStyles.top;
      document.body.style.width = originalStyles.width;
      document.body.style.overflow = originalStyles.overflow;
      
      // Restore scroll position
      window.scrollTo(0, scrollY);
      
      // Restore focus to the element that triggered the mobile menu
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, [isLocked]);
};
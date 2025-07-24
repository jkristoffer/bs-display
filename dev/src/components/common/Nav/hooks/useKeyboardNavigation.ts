import { useEffect } from 'react';

interface UseKeyboardNavigationProps {
  activeDropdown: string | null;
  isMobile: boolean;
  onCloseDropdown: () => void;
  onCloseSearch: () => void;
  onCloseMobileMenu: () => void;
}

/**
 * Custom hook for handling keyboard navigation
 * Extracts complex keyboard logic from Nav component lines 92-164
 */
export const useKeyboardNavigation = ({
  activeDropdown,
  isMobile,
  onCloseDropdown,
  onCloseSearch,
  onCloseMobileMenu
}: UseKeyboardNavigationProps): void => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key - close all overlays
      if (e.key === 'Escape') {
        onCloseDropdown();
        onCloseSearch();
        onCloseMobileMenu();
        return;
      }
      
      // Handle dropdown navigation when a dropdown is active
      if (activeDropdown && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        handleDropdownNavigation(e, activeDropdown);
        return;
      }
      
      // Enter/Space key activation for buttons and links
      if ((e.key === 'Enter' || e.key === ' ') && e.target instanceof HTMLElement) {
        handleButtonActivation(e, activeDropdown);
        return;
      }
      
      // Home/End keys for navigation items
      if ((e.key === 'Home' || e.key === 'End') && !isMobile) {
        handleNavigationJump(e);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeDropdown, isMobile, onCloseDropdown, onCloseSearch, onCloseMobileMenu]);
};

/**
 * Handle arrow key navigation within dropdowns
 */
const handleDropdownNavigation = (e: KeyboardEvent, activeDropdown: string): void => {
  e.preventDefault();
  const dropdown = document.querySelector(`#dropdown-${activeDropdown.toLowerCase()}`);
  
  if (!dropdown) return;
  
  const focusableElements = dropdown.querySelectorAll('a, button');
  const currentIndex = Array.from(focusableElements).findIndex(el => 
    el === document.activeElement
  );
  
  let nextIndex: number;
  if (e.key === 'ArrowDown') {
    nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
  } else {
    nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
  }
  
  (focusableElements[nextIndex] as HTMLElement)?.focus();
};

/**
 * Handle Enter/Space key activation for interactive elements
 */
const handleButtonActivation = (e: KeyboardEvent, activeDropdown: string | null): void => {
  // Handle dropdown buttons
  const button = e.target && (e.target as HTMLElement).closest('button[aria-expanded]');
  if (button) {
    e.preventDefault();
    button.click();
    
    // Focus first dropdown item after opening
    setTimeout(() => {
      if (activeDropdown) {
        const dropdown = document.querySelector(`#dropdown-${activeDropdown.toLowerCase()}`);
        const firstFocusable = dropdown?.querySelector('a, button') as HTMLElement;
        firstFocusable?.focus();
      }
    }, 100);
    return;
  }
  
  // Handle other interactive elements
  const interactive = e.target && (e.target as HTMLElement).closest('a, button');
  if (interactive && e.key === ' ') {
    e.preventDefault();
    (interactive as HTMLElement).click();
  }
};

/**
 * Handle Home/End key navigation
 */
const handleNavigationJump = (e: KeyboardEvent): void => {
  const navItems = document.querySelectorAll('[class*="nav__items"] a, [class*="nav__items"] button');
  
  if (navItems.length === 0) return;
  
  e.preventDefault();
  const targetIndex = e.key === 'Home' ? 0 : navItems.length - 1;
  (navItems[targetIndex] as HTMLElement)?.focus();
};
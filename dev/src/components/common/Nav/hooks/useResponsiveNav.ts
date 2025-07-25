import { useState, useEffect } from 'react';

interface UseResponsiveNavReturn {
  isMobile: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
}

/**
 * Custom hook for managing responsive navigation state
 * Extracts mobile detection and mobile menu state management
 */
export const useResponsiveNav = (): UseResponsiveNavReturn => {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Set client flag after hydration to prevent SSR mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Responsive behavior - extracted from Nav component lines 44-55
  useEffect(() => {
    if (!isClient) return;

    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Close mobile menu when switching to desktop
      if (!mobile) {
        setMobileMenuOpen(false);
      }
    };
    
    // Initial check
    checkMobile();
    
    // Listen for resize events
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [isClient]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  return {
    isMobile,
    mobileMenuOpen,
    setMobileMenuOpen,
    toggleMobileMenu
  };
};
import { useEffect } from 'react';

interface UseClickOutsideProps {
  isActive: boolean;
  onClickOutside: () => void;
  containerSelector?: string;
}

/**
 * Custom hook for handling click outside events
 * Extracts click outside logic from Nav component lines 166-179
 */
export const useClickOutside = ({
  isActive,
  onClickOutside,
  containerSelector = '.nav'
}: UseClickOutsideProps): void => {
  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (e: MouseEvent) => {
      const container = document.querySelector(containerSelector);
      
      if (container && !container.contains(e.target as Node)) {
        onClickOutside();
      }
    };
    
    // Add event listener
    document.addEventListener('click', handleClickOutside);
    
    // Cleanup
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isActive, onClickOutside, containerSelector]);
};
import React, { useState, useEffect, useRef } from 'react';
import './MobileTableOfContents.scss';

interface TocItem {
  href: string;
  text: string;
}

interface MobileTableOfContentsProps {
  items: TocItem[];
}

const MobileTableOfContents: React.FC<MobileTableOfContentsProps> = ({ items }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentSectionTitle, setCurrentSectionTitle] = useState('');
  const bottomSheetRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Show mobile TOC after scrolling past original TOC
      const originalToc = document.querySelector('.table-of-contents');
      if (originalToc) {
        const tocBottom = originalToc.getBoundingClientRect().bottom;
        setIsVisible(tocBottom < 0);
      }

      // Find active section and calculate progress
      const sections = items.map(item => item.href.substring(1));
      let foundIndex = -1;
      
      for (let i = 0; i < sections.length; i++) {
        const element = document.getElementById(sections[i]);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom > 150) {
            foundIndex = i;
            break;
          }
        }
      }

      if (foundIndex !== -1) {
        setCurrentSectionIndex(foundIndex);
        setCurrentSectionTitle(items[foundIndex].text);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  const openBottomSheet = () => {
    setIsBottomSheetOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  const closeBottomSheet = () => {
    setIsBottomSheetOpen(false);
    document.body.style.overflow = ''; // Restore background scroll
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      closeBottomSheet();
    }
  };

  const handleSectionClick = (href: string) => {
    closeBottomSheet();
    // Small delay to allow bottom sheet to close before scrolling
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  // Handle touch gestures for swipe-to-close
  useEffect(() => {
    if (!isBottomSheetOpen) return;

    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      isDragging = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;
      
      // Only allow downward swipe
      if (deltaY > 0) {
        const sheet = bottomSheetRef.current;
        if (sheet) {
          sheet.style.transform = `translateY(${deltaY}px)`;
        }
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      
      const deltaY = currentY - startY;
      const sheet = bottomSheetRef.current;
      
      if (sheet) {
        if (deltaY > 100) {
          // Swipe down threshold reached - close
          closeBottomSheet();
        } else {
          // Snap back to open position
          sheet.style.transform = 'translateY(0)';
        }
      }
    };

    const sheet = bottomSheetRef.current;
    if (sheet) {
      sheet.addEventListener('touchstart', handleTouchStart);
      sheet.addEventListener('touchmove', handleTouchMove);
      sheet.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (sheet) {
        sheet.removeEventListener('touchstart', handleTouchStart);
        sheet.removeEventListener('touchmove', handleTouchMove);
        sheet.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isBottomSheetOpen]);

  if (!isVisible) return null;

  const progress = items.length > 0 ? Math.round(((currentSectionIndex + 1) / items.length) * 100) : 0;

  return (
    <>
      {/* Floating Progress Tab */}
      <button
        className="mobile-toc-tab"
        onClick={openBottomSheet}
        aria-label={`Open table of contents. Currently in section ${currentSectionIndex + 1} of ${items.length}: ${currentSectionTitle}`}
      >
        <div className="progress-indicator">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="section-info">
          <span className="section-number">{currentSectionIndex + 1}/{items.length}</span>
          <span className="section-title">{currentSectionTitle}</span>
        </div>
        <svg className="expand-icon" viewBox="0 0 24 24" fill="none">
          <path d="M7 14L12 9L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Bottom Sheet */}
      {isBottomSheetOpen && (
        <div
          ref={backdropRef}
          className="mobile-toc-backdrop"
          onClick={handleBackdropClick}
        >
          <div
            ref={bottomSheetRef}
            className="mobile-toc-bottom-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-toc-title"
          >
            <div className="bottom-sheet-header">
              <div className="drag-handle" />
              <h3 id="mobile-toc-title">Table of Contents</h3>
              <button
                className="close-button"
                onClick={closeBottomSheet}
                aria-label="Close table of contents"
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="bottom-sheet-content">
              <ul className="mobile-toc-list">
                {items.map((item, index) => (
                  <li key={index}>
                    <button
                      className={`toc-item ${index === currentSectionIndex ? 'active' : ''}`}
                      onClick={() => handleSectionClick(item.href)}
                    >
                      <span className="item-number">{index + 1}</span>
                      <span className="item-text">{item.text}</span>
                      {index === currentSectionIndex && (
                        <span className="current-indicator">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 12L11 14L15 10"/>
                          </svg>
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileTableOfContents;
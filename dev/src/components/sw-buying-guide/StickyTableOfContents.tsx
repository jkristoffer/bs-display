import React, { useState, useEffect } from 'react';
import './StickyTableOfContents.scss';

interface TocItem {
  href: string;
  text: string;
}

interface StickyTableOfContentsProps {
  items: TocItem[];
}

const StickyTableOfContents: React.FC<StickyTableOfContentsProps> = ({ items }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky TOC after scrolling past original TOC
      const originalToc = document.querySelector('.table-of-contents');
      if (originalToc) {
        const tocBottom = originalToc.getBoundingClientRect().bottom;
        setIsVisible(tocBottom < 0);
      }

      // Find active section
      const sections = items.map(item => item.href.substring(1));
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom > 100;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(`#${currentSection}`);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  if (!isVisible) return null;

  return (
    <>
      {/* Reopen Button */}
      {isDismissed && (
        <button 
          className="reopen-toc-btn"
          onClick={() => setIsDismissed(false)}
          title="Open navigation menu"
        >
          📋
        </button>
      )}

      {/* Main TOC */}
      {!isDismissed && (
        <nav className="sticky-toc" aria-label="Sticky table of contents">
      <div className="sticky-toc-header">
        <h3>Quick Navigation</h3>
        <button 
          className="close-toc-btn"
          onClick={() => setIsDismissed(true)}
          title="Close navigation menu"
        >
          ×
        </button>
      </div>
      <ul className="sticky-toc-list">
        {items.map((item, index) => (
          <li key={index}>
            <a
              href={item.href}
              className={activeSection === item.href ? 'active' : ''}
              title={item.text}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
        </nav>
      )}
    </>
  );
};

export default StickyTableOfContents;
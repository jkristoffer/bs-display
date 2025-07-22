import React, { useState, useEffect, useRef } from 'react';
import styles from './SimpleSearch.module.scss';

interface SearchResult {
  id: number;
  title: string;
  type: 'product' | 'article' | 'page';
  href: string;
  description?: string;
  category?: string;
}

interface SimpleSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

// Enhanced search component with keyboard navigation and better UX
export default function SimpleSearch({ isOpen, onClose }: SimpleSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length >= 2) {
      setIsSearching(true);
      setSelectedIndex(-1);
      
      // Enhanced mock search with more realistic data
      const timer = setTimeout(() => {
        const mockResults: SearchResult[] = [
          { 
            id: 1, 
            title: 'Smart Board 86" Interactive Display', 
            type: 'product', 
            href: '/products/smartboards/smart-mx-v5-86',
            description: '4K UHD touch display with multi-touch support',
            category: 'Interactive Displays'
          },
          { 
            id: 2, 
            title: 'Interactive Display Buying Guide', 
            type: 'article', 
            href: '/smart-whiteboard-buying-guide',
            description: 'Complete guide to choosing the right interactive display',
            category: 'Buying Guides'
          },
          { 
            id: 3, 
            title: 'Smart Lectern Solutions', 
            type: 'product', 
            href: '/products/lecterns',
            description: 'Professional lecterns with integrated technology',
            category: 'Lecterns'
          },
          { 
            id: 4, 
            title: 'How Smart Boards Work', 
            type: 'article', 
            href: '/blog/how-smartboards-work',
            description: 'Understanding the technology behind interactive displays',
            category: 'Articles'
          },
          { 
            id: 5, 
            title: 'Product Finder Quiz', 
            type: 'page', 
            href: '/quiz',
            description: 'Find the perfect display for your needs',
            category: 'Tools'
          }
        ];

        // Filter results based on query
        const filteredResults = mockResults.filter(result =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.description?.toLowerCase().includes(query.toLowerCase()) ||
          result.category?.toLowerCase().includes(query.toLowerCase())
        );

        setResults(filteredResults.slice(0, 8)); // Limit to 8 results
        setIsSearching(false);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [query]);

  // Enhanced keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < results.length) {
            window.location.href = results[selectedIndex].href;
          } else if (query.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(query)}`;
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, query, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Navigate to search results page
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.searchOverlay} role="dialog" aria-modal="true" aria-labelledby="search-title">
      {/* Backdrop */}
      <div className={styles.searchBackdrop} onClick={onClose} aria-hidden="true" />
      
      {/* Search Container */}
      <div ref={overlayRef} className={styles.searchContainer}>
        <div className={styles.searchHeader}>
          <h2 id="search-title" className={styles.searchTitle}>Search</h2>
          <button
            className={styles.searchClose}
            onClick={onClose}
            aria-label="Close search"
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.searchForm} role="search">
          <div className={styles.searchInputWrapper}>
            <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              ref={inputRef}
              type="search"
              className={styles.searchInput}
              placeholder="Search products, articles & resources..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search products and articles"
              aria-describedby={results.length > 0 ? "search-results" : undefined}
              autoComplete="off"
              spellCheck="false"
            />
            {query && (
              <button
                type="button"
                className={styles.searchClear}
                onClick={() => {
                  setQuery('');
                  setResults([]);
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="m15 9-6 6M9 9l6 6"/>
                </svg>
              </button>
            )}
          </div>
          
          <button 
            type="submit" 
            className={styles.searchSubmit} 
            disabled={!query.trim()}
            aria-label={`Search for ${query || 'products and articles'}`}
          >
            Search
          </button>
        </form>

        {/* Loading State */}
        {isSearching && (
          <div className={styles.searchLoading} aria-live="polite">
            <div className={styles.loadingSpinner} aria-hidden="true"></div>
            <span>Searching...</span>
          </div>
        )}

        {/* Search Results */}
        {results.length > 0 && (
          <div className={styles.searchResults} id="search-results">
            <h3 className={styles.resultsTitle}>
              {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </h3>
            <ul className={styles.resultsList} role="listbox" aria-label="Search results">
              {results.map((result, index) => (
                <li key={result.id} role="option" aria-selected={index === selectedIndex}>
                  <a 
                    href={result.href} 
                    className={`${styles.searchResultItem} ${index === selectedIndex ? styles.selected : ''}`}
                    onClick={onClose}
                  >
                    <div className={styles.resultContent}>
                      <div className={styles.resultHeader}>
                        <span className={`${styles.resultType} ${styles[`type-${result.type}`]}`}>
                          {result.type}
                        </span>
                        <span className={styles.resultCategory}>{result.category}</span>
                      </div>
                      <h4 className={styles.resultTitle}>{result.title}</h4>
                      {result.description && (
                        <p className={styles.resultDescription}>{result.description}</p>
                      )}
                    </div>
                    <svg className={styles.resultArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* No Results */}
        {query.length >= 2 && results.length === 0 && !isSearching && (
          <div className={styles.noResults}>
            <svg className={styles.noResultsIcon} width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <h3>No results found</h3>
            <p>Try searching for products like "smart board" or "lectern"</p>
          </div>
        )}

        {/* Search Suggestions */}
        {query.length === 0 && (
          <div className={styles.searchSuggestions}>
            <h3>Popular searches</h3>
            <div className={styles.suggestionTags}>
              {['Smart Boards', 'Interactive Displays', 'Lecterns', 'Buying Guide', '86 inch'].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className={styles.suggestionTag}
                  onClick={() => setQuery(suggestion.toLowerCase())}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
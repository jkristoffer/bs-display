import React, { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import SearchInput from './SearchInput';
import SearchResults from './SearchResults';
import { useSearch } from './useSearch';
import styles from './Search.module.scss';

interface SearchProps {
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
  isMobile?: boolean;
  onClose?: () => void;
}

interface SearchRef {
  closeSearch: () => void;
}

const Search = forwardRef<SearchRef, SearchProps>((
  {
    className = '',
    placeholder = "Search products, articles...",
    autoFocus = false,
    isMobile = false,
    onClose
  },
  ref
) => {
  const searchRef = useRef<HTMLDivElement>(null);
  const {
    query,
    results,
    isSearching,
    activeCategory,
    isOpen,
    recentSearches,
    setQuery,
    setActiveCategory,
    setIsOpen,
    handleSearch,
    handleSelectResult
  } = useSearch({
    minQueryLength: 2,
    maxResults: 8,
    debounceMs: 300
  });

  // Show results when open and has query or recent searches
  const showResults = isOpen && (query.length >= 2 || recentSearches.length > 0);

  // Expose closeSearch method to parent
  useImperativeHandle(ref, () => ({
    closeSearch: () => setIsOpen(false)
  }), [setIsOpen]);


  // Handle clicking outside to close search results
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  // Handle escape key to close search
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isOpen) {
          setIsOpen(false);
        } else if (onClose) {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, setIsOpen, onClose]);

  // Handle keyboard navigation in results
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        // Focus first result item
        const firstResult = searchRef.current?.querySelector('[role="option"]') as HTMLElement;
        if (firstResult) {
          firstResult.focus();
        }
        break;
      case 'Enter':
        if (results.length > 0) {
          e.preventDefault();
          handleSelectResult(results[0]);
        }
        break;
    }
  }, [isOpen, results, handleSelectResult]);

  // Handle input focus
  const handleInputFocus = () => {
    setIsOpen(true);
  };

  // Handle input blur (with delay to allow clicks on results)
  const handleInputBlur = () => {
    // Don't close immediately to allow result clicks
    setTimeout(() => {
      if (!searchRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
      }
    }, 200);
  };

  // Handle recent search selection
  const handleRecentSearchSelect = (search: string) => {
    setQuery(search);
    handleSearch(search);
  };

  // Handle result selection
  const handleResultSelect = (result: any) => {
    handleSelectResult(result);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div 
      ref={searchRef}
      className={`${styles.search} ${className} ${isMobile ? styles.search_mobile : ''}`}
      role="search"
      aria-label="Search products and content"
    >
      {/* Mobile header */}
      {isMobile && (
        <div className={styles.search__mobileHeader}>
          <h2 className={styles.search__mobileTitle}>Search</h2>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className={styles.search__closeButton}
              aria-label="Close search"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Search input */}
      <SearchInput
        value={query}
        onChange={handleSearch}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={styles.search__input}
      />

      {/* Search results dropdown/overlay */}
      {showResults && (
        <SearchResults
          results={results}
          query={query}
          activeCategory={activeCategory}
          isSearching={isSearching}
          recentSearches={recentSearches}
          onCategoryChange={setActiveCategory}
          onResultSelect={handleResultSelect}
          onRecentSearchSelect={handleRecentSearchSelect}
        />
      )}

      {/* Backdrop for search overlay */}
      {isOpen && showResults && (
        <div 
          className={styles.search__backdrop}
          onClick={() => isMobile && onClose ? onClose() : setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
});

Search.displayName = 'Search';

export default Search;
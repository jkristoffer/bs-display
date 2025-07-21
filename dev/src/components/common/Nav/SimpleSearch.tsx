import React, { useState, useEffect, useRef } from 'react';
import styles from './Nav.module.scss';

interface SimpleSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

// Simple search component without forwardRef
export default function SimpleSearch({ isOpen, onClose }: SimpleSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length >= 2) {
      setIsSearching(true);
      // Simulate search with timeout
      const timer = setTimeout(() => {
        // Simple mock results for now
        setResults([
          { id: 1, title: 'Smart Board 86"', type: 'product', href: '/products/smartboards/86-inch' },
          { id: 2, title: 'Interactive Display Guide', type: 'article', href: '/blog/interactive-display-guide' },
          { id: 3, title: 'Lectern Solutions', type: 'product', href: '/products/lecterns' }
        ]);
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Navigate to search results page
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.searchOverlay}>
      <div className={styles.searchContainer}>
        <div className={styles.searchHeader}>
          <h2>Search</h2>
          <button
            className={styles.searchClose}
            onClick={onClose}
            aria-label="Close search"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.searchForm}>
          <input
            ref={inputRef}
            type="search"
            className={styles.searchInput}
            placeholder="Search products, articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
          />
          <button type="submit" className={styles.searchSubmit} disabled={!query.trim()}>
            Search
          </button>
        </form>

        {isSearching && (
          <div className={styles.searchLoading}>Searching...</div>
        )}

        {results.length > 0 && (
          <div className={styles.searchResults}>
            <h3>Results</h3>
            <ul>
              {results.map((result) => (
                <li key={result.id}>
                  <a href={result.href} className={styles.searchResultItem}>
                    <span className={styles.resultType}>{result.type}</span>
                    <span className={styles.resultTitle}>{result.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {query.length >= 2 && results.length === 0 && !isSearching && (
          <div className={styles.noResults}>
            No results found for "{query}"
          </div>
        )}
      </div>
    </div>
  );
}
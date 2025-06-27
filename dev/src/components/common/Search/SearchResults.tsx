import React from 'react';
import SearchItem from './SearchItem';
import { searchCategories, type SearchCategory } from './searchIndex';
import type { SearchResult } from './useSearch';
import styles from './SearchResults.module.scss';

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  activeCategory: SearchCategory;
  isSearching: boolean;
  recentSearches: string[];
  onCategoryChange: (category: SearchCategory) => void;
  onResultSelect: (result: SearchResult) => void;
  onRecentSearchSelect: (search: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  query,
  activeCategory,
  isSearching,
  recentSearches,
  onCategoryChange,
  onResultSelect,
  onRecentSearchSelect
}) => {
  // Group results by type for better organization
  const groupedResults = results.reduce((groups, result) => {
    const type = result.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(result);
    return groups;
  }, {} as Record<string, SearchResult[]>);

  // Type labels for display
  const typeLabels = {
    product: 'Products',
    blog: 'Articles',
    usecase: 'Use Cases',
    page: 'Pages'
  };

  // Show recent searches when no query
  const showRecentSearches = !query && recentSearches.length > 0;
  
  // Show no results message
  const showNoResults = query.length >= 2 && !isSearching && results.length === 0;

  return (
    <div className={styles.searchResults} role="listbox" aria-label="Search results">
      {/* Category filters */}
      <div className={styles.searchResults__filters}>
        {searchCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onCategoryChange(category.id)}
            className={`${styles.searchResults__filter} ${
              activeCategory === category.id ? styles.searchResults__filter_active : ''
            }`}
            role="tab"
            aria-selected={activeCategory === category.id}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className={styles.searchResults__content}>
        {/* Loading state */}
        {isSearching && (
          <div className={styles.searchResults__loading}>
            <div className={styles.searchResults__loadingSpinner}></div>
            <span>Searching...</span>
          </div>
        )}

        {/* Recent searches */}
        {showRecentSearches && (
          <div className={styles.searchResults__section}>
            <h3 className={styles.searchResults__sectionTitle}>
              <span className={styles.searchResults__sectionIcon}>🕒</span>
              Recent Searches
            </h3>
            <div className={styles.searchResults__recentList}>
              {recentSearches.slice(0, 3).map((search, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => onRecentSearchSelect(search)}
                  className={styles.searchResults__recentItem}
                >
                  <span className={styles.searchResults__recentIcon}>🔍</span>
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search results grouped by type */}
        {!isSearching && results.length > 0 && (
          <>
            {Object.entries(groupedResults).map(([type, typeResults]) => (
              <div key={type} className={styles.searchResults__section}>
                <h3 className={styles.searchResults__sectionTitle}>
                  <span className={styles.searchResults__sectionIcon}>
                    {type === 'product' ? '📺' : type === 'blog' ? '📖' : type === 'usecase' ? '💼' : '📄'}
                  </span>
                  {typeLabels[type as keyof typeof typeLabels]} ({typeResults.length})
                </h3>
                <div className={styles.searchResults__list} role="group">
                  {typeResults.map((result) => (
                    <SearchItem
                      key={`${result.type}-${result.id}`}
                      result={result}
                      query={query}
                      onClick={() => onResultSelect(result)}
                      tabIndex={0}
                      role="option"
                      aria-describedby={`search-result-${result.type}-${result.id}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {/* No results state */}
        {showNoResults && (
          <div className={styles.searchResults__noResults}>
            <div className={styles.searchResults__noResultsIcon}>🔍</div>
            <h3 className={styles.searchResults__noResultsTitle}>No results found</h3>
            <p className={styles.searchResults__noResultsText}>
              Try searching for:
            </p>
            <ul className={styles.searchResults__suggestions}>
              <li>Product brands (METZ, SMART, Infinity Pro)</li>
              <li>Display sizes (65", 75", 86")</li>
              <li>Touch technology (capacitive, infrared)</li>
              <li>Use cases (classroom, office, meeting)</li>
            </ul>
            <div className={styles.searchResults__noResultsActions}>
              <a href="/quiz" className={styles.searchResults__suggestionLink}>
                Take our quiz for recommendations
              </a>
              <a href="/contact" className={styles.searchResults__suggestionLink}>
                Contact our experts
              </a>
            </div>
          </div>
        )}

        {/* Quick actions footer */}
        {(results.length > 0 || showRecentSearches) && (
          <div className={styles.searchResults__footer}>
            <div className={styles.searchResults__quickActions}>
              <a href="/products" className={styles.searchResults__quickAction}>
                <span>📋</span>
                Browse All Products
              </a>
              <a href="/quiz" className={styles.searchResults__quickAction}>
                <span>🎯</span>
                Take Quiz
              </a>
              <a href="/contact" className={styles.searchResults__quickAction}>
                <span>💬</span>
                Get Quote
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
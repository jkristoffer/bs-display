import { useState, useEffect, useMemo, useCallback } from 'react';
import Fuse, { type IFuseOptions, type FuseResultMatch } from 'fuse.js';
import { getSearchIndex, type SearchIndexItem, type SearchCategory, searchCategories } from './searchIndex';

export interface SearchResult extends SearchIndexItem {
  score?: number;
  matches?: readonly FuseResultMatch[];
}

export interface UseSearchOptions {
  minQueryLength?: number;
  maxResults?: number;
  debounceMs?: number;
}

export interface UseSearchReturn {
  query: string;
  results: SearchResult[];
  isSearching: boolean;
  activeCategory: SearchCategory;
  hasResults: boolean;
  isOpen: boolean;
  recentSearches: string[];
  setQuery: (query: string) => void;
  setActiveCategory: (category: SearchCategory) => void;
  setIsOpen: (open: boolean) => void;
  handleSearch: (query: string) => void;
  handleSelectResult: (result: SearchResult) => void;
  clearSearch: () => void;
}

const RECENT_SEARCHES_KEY = 'bigshine-recent-searches';
const MAX_RECENT_SEARCHES = 5;

// Fuse.js configuration for optimal search experience
const fuseOptions: IFuseOptions<SearchIndexItem> = {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'brand', weight: 0.3 },
    { name: 'keywords', weight: 0.2 },
    { name: 'description', weight: 0.1 }
  ],
  threshold: 0.4, // 0.0 = perfect match, 1.0 = match anything
  distance: 100,
  minMatchCharLength: 2,
  includeScore: true,
  includeMatches: true,
  ignoreLocation: true, // Don't care about position of match
  findAllMatches: true
};

/**
 * Custom hook for search functionality
 * Provides fuzzy search with debouncing, categorization, and recent searches
 */
export const useSearch = (options: UseSearchOptions = {}): UseSearchReturn => {
  const {
    minQueryLength = 2,
    maxResults = 8,
    debounceMs = 300
  } = options;

  // State management
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Initialize Fuse.js instance with memoization
  const fuse = useMemo(() => {
    const searchIndex = getSearchIndex();
    return new Fuse(searchIndex, fuseOptions);
  }, []);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.warn('Failed to load recent searches:', error);
    }
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length >= minQueryLength) {
      setIsSearching(true);
      
      // Perform fuzzy search
      const searchResults = fuse.search(debouncedQuery);
      
      // Convert Fuse results to our SearchResult format
      let processedResults: SearchResult[] = searchResults.map(result => ({
        ...result.item,
        score: result.score,
        matches: result.matches
      }));

      // Filter by active category
      if (activeCategory !== 'all') {
        const categoryConfig = searchCategories.find(cat => cat.id === activeCategory);
        if (categoryConfig) {
          processedResults = processedResults.filter(result => 
            (categoryConfig.types as readonly string[]).includes(result.type)
          );
        }
      }

      // Limit results and sort by relevance (score + searchScore)
      processedResults = processedResults
        .sort((a, b) => {
          const scoreA = (a.score || 0) * 0.3 + a.searchScore * 0.7;
          const scoreB = (b.score || 0) * 0.3 + b.searchScore * 0.7;
          return scoreB - scoreA;
        })
        .slice(0, maxResults);

      setResults(processedResults);
      setIsSearching(false);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [debouncedQuery, activeCategory, fuse, minQueryLength, maxResults]);

  // Handle search input changes
  const handleSearch = useCallback((newQuery: string) => {
    setQuery(newQuery);
    if (newQuery.length >= minQueryLength) {
      setIsOpen(true);
    } else if (newQuery.length === 0) {
      setIsOpen(false);
    }
  }, [minQueryLength]);

  // Handle result selection
  const handleSelectResult = useCallback((result: SearchResult) => {
    // Add to recent searches
    const newRecentSearches = [
      query,
      ...recentSearches.filter(search => search !== query)
    ].slice(0, MAX_RECENT_SEARCHES);

    setRecentSearches(newRecentSearches);
    
    // Save to localStorage
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newRecentSearches));
    } catch (error) {
      console.warn('Failed to save recent searches:', error);
    }

    // Navigate to result
    window.location.href = result.url;
  }, [query, recentSearches]);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  }, []);

  // Computed properties
  const hasResults = results.length > 0;

  return {
    query,
    results,
    isSearching,
    activeCategory,
    hasResults,
    isOpen,
    recentSearches,
    setQuery,
    setActiveCategory,
    setIsOpen,
    handleSearch,
    handleSelectResult,
    clearSearch
  };
};
import { allModels } from '../../../data/models/models.all.js';

export interface SearchIndexItem {
  id: string;
  type: 'product' | 'blog' | 'usecase' | 'page';
  title: string;
  description: string;
  keywords: string[];
  brand?: string;
  category: string;
  url: string;
  image?: string;
  searchScore: number;
}

// Static pages for search indexing
const staticPages = [
  {
    id: 'quiz',
    title: 'Smart Board Quiz - Find Your Perfect Display',
    description: 'Take our interactive quiz to get personalized smart board recommendations based on your needs',
    keywords: ['quiz', 'recommendation', 'finder', 'smart board', 'interactive'],
    category: 'Tools',
    url: '/quiz',
    searchScore: 7
  },
  {
    id: 'contact',
    title: 'Contact Us - Get Expert Advice',
    description: 'Contact our smart board experts for personalized recommendations and quotes',
    keywords: ['contact', 'support', 'quote', 'expert', 'consultation'],
    category: 'Support',
    url: '/contact',
    searchScore: 6
  },
  {
    id: 'buying-guide',
    title: 'Smart Whiteboard Buying Guide 2025',
    description: 'Complete guide to choosing the right interactive display for your needs',
    keywords: ['buying guide', 'how to choose', 'comparison', 'features'],
    category: 'Guides',
    url: '/smart-whiteboard-buying-guide',
    searchScore: 8
  }
];

// Blog posts metadata (will be expanded with dynamic content in future)
const blogPosts = [
  {
    id: 'smart-board-comparison-chart',
    title: 'Smart Board Comparison Chart: Choose the Right Interactive Technology',
    description: 'Compare different smart board technologies with our comprehensive comparison chart',
    keywords: ['comparison', 'technology', 'touch screen', 'interactive'],
    category: 'Articles',
    url: '/blog/smart-board-comparison-chart',
    searchScore: 7
  },
  {
    id: 'capacitive-vs-infrared-touch-screen',
    title: 'Capacitive vs Infrared Touch Screen Technology',
    description: 'Understanding the differences between capacitive and infrared touch technologies',
    keywords: ['capacitive', 'infrared', 'touch technology', 'comparison'],
    category: 'Articles',
    url: '/blog/capacitive-vs-infrared-touch-screen',
    searchScore: 6
  },
  {
    id: 'best-smart-whiteboard-brands-2025',
    title: 'Best Smart Whiteboard Brands 2025',
    description: 'Top smart whiteboard brands and their best models for education and business',
    keywords: ['brands', 'best', 'top rated', 'reviews', '2025'],
    category: 'Articles',
    url: '/blog/best-smart-whiteboard-brands-2025',
    searchScore: 8
  },
  {
    id: 'how-smartboards-work',
    title: 'How Smart Boards Work: Technology Behind Interactive Displays',
    description: 'Learn how smart boards work and the technology that makes them interactive',
    keywords: ['how it works', 'technology', 'explanation', 'interactive displays'],
    category: 'Articles',
    url: '/blog/how-smartboards-work',
    searchScore: 6
  }
];

// Use cases
const useCases = [
  {
    id: 'corporate-lobby-display',
    title: 'Corporate Lobby Interactive Display Solutions',
    description: 'Transform your corporate lobby with engaging interactive displays',
    keywords: ['corporate', 'lobby', 'business', 'reception'],
    category: 'Use Cases',
    url: '/use-cases/corporate-lobby-display',
    searchScore: 5
  },
  {
    id: 'retail-led-wall',
    title: 'Retail LED Wall Display Solutions',
    description: 'Eye-catching LED wall displays for retail environments',
    keywords: ['retail', 'LED wall', 'advertising', 'displays'],
    category: 'Use Cases',
    url: '/use-cases/retail-led-wall',
    searchScore: 5
  }
];

/**
 * Generate search index from all available content
 * Respects pricing policy - no pricing data included
 */
export const generateSearchIndex = (): SearchIndexItem[] => {
  // Process product data
  const productItems: SearchIndexItem[] = allModels.map((product: any) => {
    // Extract key features for keywords (first 5 features max)
    const featureKeywords = product.features?.slice(0, 5) || [];
    
    // Create size-specific keywords
    const sizeKeywords = product.size ? [`${product.size} inch`, `${product.size}"`, product.size.toString()] : [];
    
    // Technology keywords
    const techKeywords = [
      product.touchTechnology,
      product.resolution,
      product.os
    ].filter(Boolean);

    return {
      id: product.id,
      type: 'product',
      title: product.model,
      description: featureKeywords.slice(0, 3).join(', ') || 'Interactive smart board display',
      keywords: [
        product.brand,
        ...sizeKeywords,
        ...techKeywords,
        ...featureKeywords,
        'smart board',
        'interactive display',
        'whiteboard'
      ].filter(Boolean),
      brand: product.brand,
      category: 'Interactive Displays',
      url: `/products/smartboards/${product.brand.toLowerCase().replace(/\s+/g, '-')}/${product.id}`,
      image: `/assets/models/${product.id}.webp`,
      searchScore: 8 // High priority for products
    };
  });

  // Process static pages
  const pageItems: SearchIndexItem[] = staticPages.map(page => ({
    ...page,
    type: 'page' as const
  }));

  // Process blog posts
  const blogItems: SearchIndexItem[] = blogPosts.map(post => ({
    ...post,
    type: 'blog' as const
  }));

  // Process use cases
  const useCaseItems: SearchIndexItem[] = useCases.map(useCase => ({
    ...useCase,
    type: 'usecase' as const
  }));

  // Combine all items and sort by search score
  return [...productItems, ...pageItems, ...blogItems, ...useCaseItems]
    .sort((a, b) => b.searchScore - a.searchScore);
};

/**
 * Get search index with memoization for performance
 */
let cachedSearchIndex: SearchIndexItem[] | null = null;

export const getSearchIndex = (): SearchIndexItem[] => {
  if (!cachedSearchIndex) {
    cachedSearchIndex = generateSearchIndex();
  }
  return cachedSearchIndex;
};

/**
 * Search categories for filtering
 */
export const searchCategories = [
  { id: 'all', label: 'All Results', types: ['product', 'blog', 'usecase', 'page'] },
  { id: 'products', label: 'Products', types: ['product'] },
  { id: 'articles', label: 'Articles', types: ['blog'] },
  { id: 'resources', label: 'Resources', types: ['usecase', 'page'] }
] as const;

export type SearchCategory = typeof searchCategories[number]['id'];
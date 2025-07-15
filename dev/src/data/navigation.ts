/**
 * Mobile Navigation Configuration
 * Defines the structure and content for the mobile grid navigation
 */

import React from 'react';
import { 
  FiSettings, FiUsers, FiShoppingBag, FiDollarSign, 
  FiCalendar, FiTarget, FiBookOpen, FiStar, 
  FiShoppingCart, FiHelpCircle, FiMonitor 
} from 'react-icons/fi';
import { 
  MdOutlineSmartDisplay, MdMic 
} from 'react-icons/md';
import { TbScale } from 'react-icons/tb';
import type { NavigationConfig, NavSection, MobileNavItem } from '../types/navigation';

// Primary navigation items for mobile grid
const mobileNavItems: MobileNavItem[] = [
  // Product Categories Section
  {
    id: 'smart-boards',
    label: 'Smart Boards',
    path: '/products/smart-boards',
    category: 'products',
    priority: 'high',
    icon: React.createElement(MdOutlineSmartDisplay),
    badge: 'Popular',
    description: 'Interactive displays for education',
    touchTarget: 'large',
    bgColor: '#667eea',
    gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
    ariaLabel: 'Browse smart boards and interactive displays'
  },
  {
    id: 'smart-lecterns',
    label: 'Smart Lecterns',
    path: '/products/smart-lecterns',
    category: 'products',
    priority: 'medium',
    icon: React.createElement(MdMic),
    description: 'Podiums with integrated technology',
    touchTarget: 'standard',
    ariaLabel: 'Browse smart lecterns and podiums'
  },
  {
    id: 'accessories',
    label: 'Accessories',
    path: '/products/accessories',
    category: 'products',
    priority: 'medium',
    icon: React.createElement(FiSettings),
    description: 'Mounts, cables, and accessories',
    ariaLabel: 'Browse accessories and mounting solutions'
  },
  {
    id: 'collaboration',
    label: 'Collaboration',
    path: '/products/collaboration',
    category: 'products',
    priority: 'medium',
    icon: React.createElement(FiUsers),
    isNew: true,
    description: 'Tools for team collaboration',
    ariaLabel: 'Browse collaboration solutions'
  },

  // Featured Products Section
  {
    id: 'metz-h-series',
    label: 'METZ H Series 65"',
    path: '/products/metz-h-series-65',
    category: 'featured',
    priority: 'high',
    icon: React.createElement(FiMonitor),
    description: 'Premium UHD interactive display',
    ariaLabel: 'View METZ H Series 65 inch display details'
  },
  {
    id: 'infinity-pro-x',
    label: 'Infinity Pro X 55"',
    path: '/products/infinity-pro-x-55',
    category: 'featured',
    priority: 'medium',
    icon: React.createElement(FiMonitor),
    description: 'Professional-grade display',
    ariaLabel: 'View Infinity Pro X 55 inch display details'
  },
  {
    id: 'smart-6000s-v3',
    label: 'SMART 6000S V3',
    path: '/products/smart-6000s-v3',
    category: 'featured',
    priority: 'medium',
    icon: React.createElement(FiMonitor),
    description: 'Education-focused smart board',
    ariaLabel: 'View SMART 6000S V3 smart board details'
  },
  {
    id: 'maxhub-v5-classic',
    label: 'MAXHUB V5 Classic',
    path: '/products/maxhub-v5-classic-65',
    category: 'featured',
    priority: 'medium',
    icon: React.createElement(FiMonitor),
    description: '65" business collaboration display',
    ariaLabel: 'View MAXHUB V5 Classic 65 inch display details'
  },

  // Quick Actions Section
  {
    id: 'all-products',
    label: 'All Products',
    path: '/products',
    category: 'actions',
    priority: 'high',
    icon: React.createElement(FiShoppingBag),
    description: 'Browse complete product catalog',
    ariaLabel: 'View all products in catalog'
  },
  {
    id: 'get-quote',
    label: 'Get Quote',
    path: '/quote',
    category: 'actions',
    priority: 'high',
    icon: React.createElement(FiDollarSign),
    description: 'Request pricing information',
    gradient: 'linear-gradient(135deg, #2c5530, #11998e)',
    bgColor: '#2c5530',
    textColor: '#ffffff',
    ariaLabel: 'Request a quote for products'
  },
  {
    id: 'book-demo',
    label: 'Book Demo',
    path: '/demo',
    category: 'actions',
    priority: 'medium',
    icon: React.createElement(FiCalendar),
    description: 'Schedule product demonstration',
    ariaLabel: 'Schedule a product demonstration'
  },
  {
    id: 'compare',
    label: 'Compare',
    path: '/compare',
    category: 'actions',
    priority: 'medium',
    icon: React.createElement(TbScale),
    description: 'Compare product features',
    ariaLabel: 'Compare product features and specifications'
  },
  {
    id: 'take-quiz',
    label: 'Take Quiz',
    path: '/quiz',
    category: 'actions',
    priority: 'medium',
    icon: React.createElement(FiTarget),
    description: 'Find your perfect display',
    ariaLabel: 'Take product recommendation quiz'
  },

  // Resources Section
  {
    id: 'expert-articles',
    label: 'Expert Articles',
    path: '/blog',
    category: 'resources',
    priority: 'medium',
    icon: React.createElement(FiBookOpen),
    description: 'Industry insights and guides',
    ariaLabel: 'Read expert articles and insights'
  },
  {
    id: 'customer-stories',
    label: 'Customer Stories',
    path: '/case-studies',
    category: 'resources',
    priority: 'medium',
    icon: React.createElement(FiStar),
    description: 'Success stories and case studies',
    ariaLabel: 'Read customer success stories'
  },
  {
    id: 'buying-guide',
    label: 'Buying Guide',
    path: '/guide',
    category: 'resources',
    priority: 'high',
    icon: React.createElement(FiShoppingCart),
    description: 'How to choose the right display',
    bgColor: '#ffecd2',
    gradient: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
    ariaLabel: 'Read the buying guide for displays'
  },
  {
    id: 'support-center',
    label: 'Support Center',
    path: '/support',
    category: 'resources',
    priority: 'medium',
    icon: React.createElement(FiHelpCircle),
    description: 'Help and documentation',
    ariaLabel: 'Access support center and documentation'
  }
];

// Group items into sections
const navigationSections: NavSection[] = [
  {
    id: 'products',
    title: 'Product Categories',
    description: 'Explore our range of interactive displays and solutions',
    items: mobileNavItems.filter(item => item.category === 'products'),
    columns: 2,
    showTitle: true,
    priority: 1
  },
  {
    id: 'featured',
    title: 'Featured Products',
    description: 'Popular displays and best-sellers',
    items: mobileNavItems.filter(item => item.category === 'featured'),
    columns: 2,
    showTitle: true,
    priority: 2
  },
  {
    id: 'actions',
    title: 'Quick Actions',
    description: 'Get quotes, demos, and product recommendations',
    items: mobileNavItems.filter(item => item.category === 'actions'),
    columns: 2, // Changed from 1 to 2 to match type constraint
    showTitle: true,
    priority: 3
  },
  {
    id: 'resources',
    title: 'Resources & Support',
    description: 'Guides, articles, and customer support',
    items: mobileNavItems.filter(item => item.category === 'resources'),
    columns: 2,
    showTitle: true,
    priority: 4
  }
];

// Complete navigation configuration
export const mobileNavigationConfig: NavigationConfig = {
  sections: navigationSections,
  metadata: {
    version: '1.0.0',
    lastUpdated: '2025-07-14',
    defaultColumns: 2,
    theme: 'auto'
  },
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    screenReaderOptimized: true
  }
};

// Export individual sections for flexible usage
export const productCategoriesSection = navigationSections.find(s => s.id === 'products')!;
export const featuredProductsSection = navigationSections.find(s => s.id === 'featured')!;
export const quickActionsSection = navigationSections.find(s => s.id === 'actions')!;
export const resourcesSection = navigationSections.find(s => s.id === 'resources')!;

// Utility functions for navigation data
export const getNavItemById = (id: string): MobileNavItem | undefined => {
  return mobileNavItems.find(item => item.id === id);
};

export const getNavItemsByCategory = (category: string): MobileNavItem[] => {
  return mobileNavItems.filter(item => item.category === category);
};

export const getHighPriorityItems = (): MobileNavItem[] => {
  return mobileNavItems.filter(item => item.priority === 'high');
};

export const getNewItems = (): MobileNavItem[] => {
  return mobileNavItems.filter(item => item.isNew);
};

// Default export
export default mobileNavigationConfig;
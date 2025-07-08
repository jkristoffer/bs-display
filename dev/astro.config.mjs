import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from '@astrojs/sitemap';
import vercel from "@astrojs/vercel";
import { purgeCSSPlugin } from '@fullhuman/postcss-purgecss';
// https://astro.build/config
export default defineConfig({
  site: 'https://bigshine-display.com',
  integrations: [react(), sitemap({
    filter: (page) => !page.includes('/404'),
    customPages: [
      'https://bigshine-display.com/quote-request',
      'https://bigshine-display.com/schedule-demo'
    ],
    changefreq: 'weekly',
    priority: 0.7,
    lastmod: new Date(),
    entryLimit: 10000,
    serialize(item) {
      // Custom serialization for specific pages
      const url = new URL(item.url);
      const pathname = url.pathname;
      
      // Base configuration from item
      const sitemap = {
        url: item.url,
        changefreq: item.changefreq,
        priority: item.priority,
        lastmod: item.lastmod,
      };
      
      // Homepage (highest priority, changes weekly)
      if (pathname === '/') {
        sitemap.changefreq = 'weekly';
        sitemap.priority = 1.0;
      }
      // Product category pages (high priority, changes weekly)
      else if (pathname.match(/^\/products\/(lecterns|smartboards)\/?$/) ||
               pathname === '/lecterns' ||
               pathname === '/smartboards') {
        sitemap.changefreq = 'weekly';
        sitemap.priority = 0.9;
      }
      // Individual product pages (high priority, changes less frequently)
      else if (pathname.match(/^\/products\/(lecterns|smartboards)\/[\w-]+\/[\w-]+\/?$/)) {
        sitemap.changefreq = 'monthly';
        sitemap.priority = 0.8;
      }
      // Blog index (changes frequently)
      else if (pathname === '/blog') {
        sitemap.changefreq = 'daily';
        sitemap.priority = 0.8;
      }
      // Blog posts (medium priority)
      else if (pathname.match(/^\/blog\/[\w-]+\/?$/)) {
        sitemap.changefreq = 'monthly';
        sitemap.priority = 0.7;
      }
      // Buying guide (changes infrequently but important)
      else if (pathname === '/smart-whiteboard-buying-guide') {
        sitemap.changefreq = 'monthly';
        sitemap.priority = 0.8;
      }
      // Quiz (interactive tool, medium priority)
      else if (pathname === '/quiz') {
        sitemap.changefreq = 'monthly';
        sitemap.priority = 0.7;
      }
      // Contact page (rarely changes but important)
      else if (pathname === '/contact') {
        sitemap.changefreq = 'yearly';
        sitemap.priority = 0.6;
      }
      // API endpoints (should be excluded)
      else if (pathname.startsWith('/api/')) {
        return undefined; // Exclude from sitemap
      }
      
      return sitemap;
    },
  })],
  


  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: {
        quality: 85,
        formats: ['avif', 'webp', 'jpeg'],
        progressive: true,
        withMetadata: false,
        // Sharp-specific optimizations
        mozjpeg: true,
        pngQuantization: true
      },
    },
    experimentalLayout: "constrained",
    experimentalObjectFit: "cover",
    experimentalObjectPosition: "center",
  },

  vite: {
    plugins: [],
    css: {
      postcss: {
        plugins: [
          purgeCSSPlugin({
            content: [
              './src/**/*.{astro,html,js,jsx,ts,tsx}',
              './public/**/*.html'
            ],
            safelist: [
              // Astro framework classes
              /^astro-/,
              // Data attributes
              /^data-/,
              // Quiz component classes
              /quiz-/,
              /cta-button/,
              /result-/,
              /category-/,
              /product-/,
              /score-/,
              // Filter UI classes
              /filter-/,
              /model-/,
              /brand-/,
              // React/dynamic classes
              /^react-/,
              // Animation/transition classes
              /fade-/,
              /slide-/,
              /show/,
              /hide/,
              /active/,
              /selected/,
              // Button states
              /hover/,
              /focus/,
              /disabled/,
              // Responsive utilities
              /mobile-/,
              /tablet-/,
              /desktop-/,
              // Common utility classes
              'sr-only',
              'visually-hidden',
              'container',
              'full-width-container',
              // New gradient system classes
              /gradient-/,
              /glass-/,
              /animate-/,
              /stagger-/,
              /button-/,
              /heading-/,
              /subtitle-/,
              /text-fluid-/,
              /icon-container-/
            ],
            // Extract dynamic classes from templates
            extractors: [
              {
                extensions: ['astro', 'html', 'js', 'jsx', 'ts', 'tsx'],
                extractor: (content) => {
                  // Match class names in templates
                  const classMatches = content.match(/class[Name]*\s*=\s*["'`][^"'`]*["'`]/g) || [];
                  const classes = classMatches
                    .map(match => match.replace(/class[Name]*\s*=\s*["'`]([^"'`]*)["'`]/, '$1'))
                    .join(' ')
                    .split(/\s+/)
                    .filter(cls => cls.length > 0);
                  
                  // Also match CSS classes in style tags and imports
                  const cssMatches = content.match(/\.[a-zA-Z_-][a-zA-Z0-9_-]*/g) || [];
                  const cssClasses = cssMatches.map(match => match.substring(1));
                  
                  return [...classes, ...cssClasses];
                }
              }
            ]
          })
        ]
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Vendor libraries
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('react-icons')) {
                return 'vendor-icons';
              }
              return 'vendor';
            }
            
            // Quiz components and logic
            if (id.includes('src/components/quiz/')) {
              return 'quiz';
            }
            
            // Product filtering components
            if (id.includes('src/components/products/FilterUI/') || 
                id.includes('src/hooks/useProductFilters')) {
              return 'filters';
            }
          }
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: (source, filename) => {
            if (filename.endsWith('index.scss')) return source;
            return `@use "src/styles/index.scss" as *;\n${source}`;
          },
        },
      },
    },
  },

  adapter: vercel(),
});
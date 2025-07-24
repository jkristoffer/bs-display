import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from '@astrojs/sitemap';
import vercel from "@astrojs/vercel";
import { purgeCSSPlugin } from '@fullhuman/postcss-purgecss';
// https://astro.build/config
export default defineConfig({
  site: 'https://bigshine-display.com',
  integrations: [react({
    experimentalReactChildren: true
  }), sitemap({
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
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
      exclude: ['fsevents'],
      esbuildOptions: {
        target: 'es2020',
        define: {
          global: 'globalThis',
        },
      },
    },
    ssr: {
      external: ['react', 'react-dom'],
    },
    resolve: {
      dedupe: ['react', 'react-dom'],
      conditions: ['browser', 'import'],
    },
    css: {
      postcss: {
        plugins: [
          purgeCSSPlugin({
            content: [
              './src/**/*.{astro,html,js,jsx,ts,tsx}',
              './public/**/*.html'
            ],
            safelist: [
              // Essential framework classes only
              /^astro-/,
              // Data attributes for dynamic content
              /^data-/,
              // Essential accessibility classes
              'sr-only',
              'visually-hidden',
              // Core layout classes
              'container',
              'full-width-container',
              // Essential dynamic classes only
              /active$/,
              /selected$/,
              /disabled$/,
              /hover$/,
              /focus$/,
              // Required for quiz functionality
              /quiz-question/,
              /quiz-answer/,
              /quiz-result/,
              // Required for filter functionality
              /filter-active/,
              /filter-option/,
              // Critical navigation classes
              /nav-/,
              /mobile-menu/
            ],
            // More aggressive extraction
            extractors: [
              {
                extensions: ['astro', 'html', 'js', 'jsx', 'ts', 'tsx'],
                extractor: (content) => {
                  // More comprehensive class extraction
                  const patterns = [
                    // Standard class attributes
                    /class[Name]*\s*=\s*["'`]([^"'`]*)["'`]/g,
                    // Template literals with classes
                    /className\s*=\s*\{[^}]*["'`]([^"'`]*?)["'`][^}]*\}/g,
                    // CSS class references
                    /\.[a-zA-Z_-][a-zA-Z0-9_-]*/g,
                    // CSS modules
                    /styles\.[a-zA-Z_-][a-zA-Z0-9_-]*/g
                  ];
                  
                  const classes = new Set();
                  
                  patterns.forEach(pattern => {
                    let match;
                    while ((match = pattern.exec(content)) !== null) {
                      if (match[1]) {
                        // Split space-separated classes
                        match[1].split(/\s+/).forEach(cls => {
                          if (cls && cls.length > 0) classes.add(cls);
                        });
                      } else if (match[0] && match[0].startsWith('.')) {
                        // CSS class reference
                        classes.add(match[0].substring(1));
                      } else if (match[0] && match[0].startsWith('styles.')) {
                        // CSS module reference
                        classes.add(match[0].replace('styles.', ''));
                      }
                    }
                  });
                  
                  return Array.from(classes);
                }
              }
            ],
            // More aggressive purging options
            variables: true,
            keyframes: true,
            fontFace: true,
            rejected: false // Set to true for debugging
          })
        ]
      }
    },
    build: {
      cssCodeSplit: true,
      minify: 'esbuild',
      rollupOptions: {
        external: ['fsevents'],
        output: {
          // Optimize CSS file naming
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'assets/[name].[hash].min.css';
            }
            return 'assets/[name].[hash][extname]';
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
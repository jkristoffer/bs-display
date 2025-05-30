import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from '@astrojs/sitemap';
import vercel from "@astrojs/vercel";
// https://astro.build/config
export default defineConfig({
  site: 'https://bigshine-display.com',
  integrations: [react(), sitemap()],

  experimental: {
    responsiveImages: true,
  },

  image: {
    service: {
      entrypoint: "astro/assets/services/sharp", // Options: 'sharp' (default), 'squoosh', or a custom service
      config: {
        // Service-specific configurations (e.g., quality, formats)
      },
    },
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.example.com",
        pathname: "/**",
      },
    ],
    experimentalLayout: "constrained", // Default layout for responsive images
    experimentalObjectFit: "cover", // Default object-fit value
    experimentalObjectPosition: "center", // Default object-position value
  },

  vite: {
    plugins: [],
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
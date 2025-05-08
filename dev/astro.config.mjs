import { defineConfig } from "astro/config";
import react from "@astrojs/react";
// https://astro.build/config
export default defineConfig({
  integrations: [react()],
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
  }
});
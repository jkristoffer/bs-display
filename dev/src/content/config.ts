import { defineCollection, z } from 'astro:content';

// Define the blog collection schema
const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    author: z.string().optional(),
    category: z.string().optional(),
    image: z.string().optional(),
    canonicalUrl: z.string().optional(),
  }),
});

// Export the collections
export const collections = {
  blog: blogCollection,
};

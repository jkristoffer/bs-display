// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishDate: z.date(),
  author: z.string().optional(),
  category: z.string().optional(),
  image: z.string().optional(),
  canonicalUrl: z.string().optional()
});
// Define the blog collection schema
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: blogSchema
});

// Export the collections
export const collections = { blog };

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

export const useCaseSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishDate: z.date(),
  industry: z.string(),
  challenge: z.string(),
  solution: z.string(),
  results: z.string(),
  clientName: z.string().optional(),
  clientLogo: z.string().optional(),
  featuredImage: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  testimonial: z.object({
    quote: z.string(),
    author: z.string(),
    position: z.string().optional()
  }).optional(),
  products: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  canonicalUrl: z.string().optional()
});

// Define the blog collection schema
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: blogSchema
});

// Define the use cases collection schema
const useCases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/use-cases' }),
  schema: useCaseSchema
});

// Export the collections
export const collections = { blog, useCases };

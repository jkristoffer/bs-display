// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Blog schema
export const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishDate: z.date(),
  author: z.string().optional(),
  category: z.string().optional(),
  image: z.string().optional(),
  canonicalUrl: z.string().optional()
});

// Use Case schema
export const useCaseSchema = z.object({
  title: z.string(),
  description: z.string(),
  industry: z.string(),
  client: z.string().optional(),
  clientLogo: z.string().optional(),
  challenge: z.string(),
  solution: z.string(),
  results: z.array(z.string()),
  testimonial: z.object({
    quote: z.string().optional(),
    author: z.string().optional(),
    position: z.string().optional()
  }).optional(),
  featuredImage: z.string(),
  galleryImages: z.array(z.string()).optional(),
  relatedProducts: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  publishDate: z.date(),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.array(z.string()).optional()
  }).optional()
});

// Define the blog collection schema
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: blogSchema
});

// Define the use case collection schema
const useCase = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/use-cases' }),
  schema: useCaseSchema
});

// Export the collections
export const collections = { 
  blog,
  useCase
};

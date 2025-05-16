/**
 * Type definitions for blog posts
 */

import type { z } from 'astro:content';
import { blogSchema } from '../content/content.config';

/**
 * Interface for blog post frontmatter data
 */
export type BlogPost = z.infer<typeof blogSchema>;

/**
 * Interface for blog post API response item
 */
export interface BlogPostResponse {
  /** Slug/URL identifier of the post */
  slug: string;

  /** Title of the blog post */
  title: string;

  /** Meta description for SEO */
  description: string;

  /** Publication date of the post as ISO string */
  publishDate: string;

  /** Author of the post */
  author?: string;

  /** Category or topic of the post */
  category?: string;

  /** Featured image URL */
  image?: string;
}

/**
 * Interface for paginated blog posts API response
 */
export interface PaginatedBlogPostsResponse {
  /** Array of blog posts */
  posts: BlogPostResponse[];

  /** Current page number */
  page: number;

  /** Total number of posts */
  totalPosts: number;

  /** Total number of pages */
  totalPages: number;
}

/**
 * Type definitions for blog posts
 */

/**
 * Interface for blog post frontmatter data
 */
export interface BlogPost {
  /** Title of the blog post */
  title: string;

  /** Meta description for SEO */
  description: string;

  /** Publication date of the post */
  publishDate: Date;

  /** Author of the post */
  author?: string;

  /** Category or topic of the post */
  category?: string;

  /** Featured image with metadata */
  image?: string;

  /** Custom canonical URL if different from the default */
  canonicalUrl?: string;
}

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

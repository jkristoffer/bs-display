import { getCollection } from 'astro:content';

interface Props {
  currentSlug: string;
  category?: string;
  limit?: number;
}

const { currentSlug, limit = 3 } = Astro.props;

// Get all blog posts
const allBlogPosts = await getCollection('blog');

// Filter out the current post and optionally filter by category
const filteredPosts = allBlogPosts.filter((post) => post.id !== currentSlug);

// Apply category filter if provided
// const categoryFilteredPosts = category
//   ? filteredPosts.filter((post) => post.data.category === category)
//   : filteredPosts;

// Sort by publish date (newest first)
const sortedPosts = filteredPosts.sort(
  (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime()
);

// Limit the number of posts
const relatedPosts = sortedPosts.slice(0, limit);

// Format date function
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}
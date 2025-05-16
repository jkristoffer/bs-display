import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import type {
  BlogPostResponse,
  PaginatedBlogPostsResponse
} from '../../types/blog';

export const GET: APIRoute = async ({ request }) => {
  try {
    // Get the page number from the URL query parameters
    const url = new URL(request.url);
    const pageParam = url.searchParams.get('page');
    const page = pageParam ? parseInt(pageParam) : 1;

    // Pagination configuration
    const postsPerPage = 6;

    // Get all blog posts and sort by publish date (newest first)
    const allBlogPosts = await getCollection('blog');
    const sortedPosts = allBlogPosts.sort(
      (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime()
    );

    // Calculate pagination
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const paginatedPosts = sortedPosts.slice(startIndex, endIndex);

    // Transform the posts to a simpler format for JSON response
    const posts: BlogPostResponse[] = paginatedPosts.map((post) => ({
      slug: post.id,
      title: post.data.title,
      description: post.data.description,
      publishDate: post.data.publishDate.toISOString(),
      author: post.data.author,
      category: post.data.category,
      image: post.data.image
    }));

    // Return the posts as JSON
    const response: PaginatedBlogPostsResponse = {
      posts,
      page,
      totalPosts: sortedPosts.length,
      totalPages: Math.ceil(sortedPosts.length / postsPerPage)
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch blog posts'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};

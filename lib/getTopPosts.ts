import { allPosts } from ".contentlayer/generated";
import type { Post } from ".contentlayer/generated";

interface PostWithViews extends Post {
  views?: number;
}

export async function getTopPostsByViews(limit: number = 5): Promise<PostWithViews[]> {
  try {
    // Construct the API URL - use localhost in development, otherwise use the deployment URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://araon.space');
    
    // Fetch view data from the API
    const response = await fetch(`${baseUrl}/api/prisma/topPosts?limit=${limit}`, {
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });
    
    if (!response.ok) {
      console.error('Failed to fetch top posts');
      return [];
    }
    
    const data = await response.json();
    const topPostsWithViews = data.posts || [];
    
    // Match with contentlayer posts and add view counts
    const topPosts: PostWithViews[] = topPostsWithViews
      .map((viewData: { slug: string; views: number }) => {
        const post = allPosts.find(p => p.slug === viewData.slug);
        if (post) {
          return {
            ...post,
            views: viewData.views
          };
        }
        return null;
      })
      .filter(Boolean) // Remove null entries
      .slice(0, limit);
    
    return topPosts;
  } catch (error) {
    console.error('Error fetching top posts:', error);
    return [];
  }
}

export async function getRecommendedPosts(count: number = 2): Promise<PostWithViews[]> {
  const topPosts = await getTopPostsByViews(10); // Get top 10 to have more options
  
  // Filter out very recent posts (less than 7 days old) for recommendations
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const eligiblePosts = topPosts.filter(post => {
    const postDate = new Date(post.publishedAt);
    return postDate < sevenDaysAgo; // Only recommend posts older than 7 days
  });
  
  // If we don't have enough eligible posts, fall back to all top posts
  const finalPosts = eligiblePosts.length >= count ? eligiblePosts : topPosts;
  
  return finalPosts.slice(0, count);
}

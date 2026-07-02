import { allPosts } from ".contentlayer/generated";
import type { Post } from ".contentlayer/generated";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

interface PostWithViews extends Post {
  views?: number;
}

// Cache the direct database query using Next.js unstable_cache
const fetchTopPostsFromDb = unstable_cache(
  async (limit: number) => {
    return await prisma.post.findMany({
      orderBy: {
        views: "desc",
      },
      take: limit,
      select: {
        slug: true,
        views: true,
      },
    });
  },
  ["top-posts-views"],
  { revalidate: 300 } // Revalidate every 5 minutes
);

export async function getTopPostsByViews(limit: number = 5): Promise<PostWithViews[]> {
  try {
    const topPostsWithViews = await fetchTopPostsFromDb(limit);
    
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
      .filter(Boolean) as PostWithViews[];
    
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

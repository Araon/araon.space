import { Metadata } from "next";
import { allPosts } from ".contentlayer/generated";
import BlogPostList from "./components/ui/BlogPostList";
import FeaturedPost from "./components/ui/FeaturedPost";
import RecommendedPost from "./components/ui/RecommendedPost";
import { RiRssFill } from "react-icons/ri";
import Link from "next/link";
import { getRecommendedPosts } from "@/lib/getTopPosts";
// import NewsletterSignupForm from "./components/ui/NewsletterSignupForm";

export const metadata: Metadata = {
  title: "Stories/Notes | Araon",
  description:
    "I write about programming, stories, and occasionally life updates!",
};

export default async function Blog() {
  const posts = allPosts
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

  // Get the featured post (most recent)
  const featuredPost = posts.length > 0 ? posts[0] : null;
  
  // Get recommended posts based on view counts, excluding the featured post
  const allRecommendedPosts = await getRecommendedPosts(5); // Get more to have options after filtering
  const recommendedPosts = allRecommendedPosts.filter(post => 
    featuredPost ? post.slug !== featuredPost.slug : true
  ).slice(0, 2); // Take only 2 after filtering
  
  // Get recent posts (excluding featured post and any recommended posts)
  const recentPosts = posts.slice(1).filter(post => 
    !recommendedPosts.some(recPost => recPost.slug === post.slug)
  );

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      {/* Header */}
      <div className="flex flex-col gap-8">
        <div>
          <div className="flex items-center justify-between">
            <h1 className="animate-in text-3xl font-bold tracking-tight">
              Ranting
            </h1>
            <Link 
              href="/api/rss" 
              target="_blank"
              className="text-secondary hover:text-primary transition-colors animate-in flex items-center gap-1 text-sm"
              style={{ "--index": 1 } as React.CSSProperties}
              title="RSS Feed"
            >
              <RiRssFill className="h-4 w-4" />
              <span>RSS</span>
            </Link>
          </div>
          <p
            className="animate-in text-secondary"
            style={{ "--index": 1 } as React.CSSProperties}
          >
            {posts.length} rants about life, engineering and more ...
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left Column - Featured Post */}
        <div className="lg:col-span-2">
          {featuredPost && (
            <div
              className="animate-in"
              style={{ "--index": 2 } as React.CSSProperties}
            >
              <FeaturedPost post={featuredPost} />
            </div>
          )}
        </div>

        {/* Right Column - Recommended Post */}
        <div className="lg:col-span-1">
          {recommendedPosts.length > 0 && (
            <div
              className="animate-in"
              style={{ "--index": 3 } as React.CSSProperties}
            >
              <RecommendedPost posts={recommendedPosts} />
            </div>
          )}
        </div>
      </div>

      {/* Recent Posts Section */}
      {recentPosts.length > 0 && (
        <div
          className="animate-in"
          style={{ "--index": 4 } as React.CSSProperties}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Recent posts</h2>
              <p className="text-secondary text-sm mt-1">
                Discover more insights and stories
              </p>
            </div>
            <Link 
              href="/blog/all" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              View All Posts
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <BlogPostList posts={recentPosts.slice(0, 6)} />
          {recentPosts.length > 6 && (
            <div className="mt-8 text-center">
              <Link 
                href="/blog/all"
                className="text-secondary hover:text-primary transition-colors text-sm font-medium inline-flex items-center gap-1"
              >
                Show {recentPosts.length - 6} more posts
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Newsletter Section */}
      <div
        className="animate-in"
        style={{ "--index": 5 } as React.CSSProperties}
      >
        {/* <NewsletterSignupForm/> */}
      </div>
    </div>
  );
}

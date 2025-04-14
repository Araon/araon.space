import { Metadata } from "next";
import { allPosts } from ".contentlayer/generated";
import PostList from "./components/ui/PostList";
import { RiRssFill } from "react-icons/ri";
import Link from "next/link";
// import NewsletterSignupForm from "./components/ui/NewsletterSignupForm";

export const metadata: Metadata = {
  title: "Stories/Notes | Araon",
  description:
    "I write about programming, stories, and occasionally life updates!",
};

export default function Blog() {
  const posts = allPosts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return (
    <div className="flex flex-col gap-16 md:gap-24">
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
      <div
        className="animate-in"
        style={{ "--index": 2 } as React.CSSProperties}
      >
        <PostList posts={posts} />
      </div>
      <div
        className="animate-in"
        style={{ "--index": 3 } as React.CSSProperties}
      >
        {/* <NewsletterSignupForm/> */}
      </div>
    </div>
  );
}

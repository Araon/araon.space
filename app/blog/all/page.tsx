import { allPosts } from ".contentlayer/generated";
import Link from "next/link";
import { RiArrowLeftLine } from "react-icons/ri";
import Image from 'next/image';
import React from "react";

export default function AllPosts() {
  const posts = allPosts
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-4 animate-in">
        <Link 
          href="/blog" 
          className="text-secondary hover:text-primary transition-colors inline-flex items-center gap-2 text-sm font-medium w-fit"
        >
          <RiArrowLeftLine className="w-4 h-4" />
          Back to Blog
        </Link>
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Posts</h1>
          <p className="text-secondary mt-2">
            {posts.length} posts about life, engineering, and more
          </p>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-8" style={{ "--index": 1 } as React.CSSProperties}>
        {posts.map((post, index) => (
          <article 
            key={post.slug} 
            className="group animate-in"
            style={{ "--index": index + 2 } as React.CSSProperties}
          >
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="flex gap-6 items-start hover:bg-secondaryA/20 rounded-lg p-4 -m-4 transition-all duration-200">
                {/* Content */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h2 className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    
                    {post.summary && (
                      <p className="text-secondary mt-2 leading-relaxed line-clamp-3">
                        {post.summary}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-tertiary">
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                    <span className="opacity-40">•</span>
                    <span>{post.readingTime}</span>
                  </div>
                </div>

                {/* Image */}
                {post.image && (
                  <div className="flex-shrink-0 w-32 h-24 sm:w-40 sm:h-28 rounded-lg overflow-hidden bg-secondary/10 relative">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 128px, 160px"
                    />
                  </div>
                )}
              </div>
            </Link>
          </article>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12 animate-in" style={{ "--index": 2 } as React.CSSProperties}>
          <p className="text-secondary">No posts found.</p>
        </div>
      )}
    </div>
  );
}

"use client";

import type { Post as PostType } from ".contentlayer/generated";
import BlogPost from "./BlogPost";
import React from "react";

type BlogPostListProps = {
  posts: PostType[];
};

export default function BlogPostList({ posts }: BlogPostListProps) {
  return (
    <ul className="flex flex-col animated-list">
      {posts.length === 0 && <p>No posts found</p>}
      {posts.map((post) => (
        <BlogPost key={post.slug} post={post} />
      ))}
    </ul>
  );
}

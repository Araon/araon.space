"use client";

import { allPosts } from ".contentlayer/generated";
import BlogPostList from "../components/ui/BlogPostList";
import Link from "next/link";
import { RiArrowLeftLine } from "react-icons/ri";
import Image from 'next/image';
import { motion } from "framer-motion";

export default function AllPosts() {
  const posts = allPosts
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

  // Calculate reading time based on word count
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const postVariants = {
    initial: { opacity: 0.8 },
    hover: { 
      opacity: 1,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className="flex flex-col gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="flex flex-col gap-4" variants={itemVariants}>
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
      </motion.div>

      {/* Posts List */}
      <motion.div className="space-y-8" variants={itemVariants}>
        {posts.map((post, index) => (
          <motion.article 
            key={post.slug} 
            className="group"
            variants={postVariants}
            initial="initial"
            whileHover="hover"
            custom={index}
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
                    <span>{calculateReadingTime(post.body.raw)}</span>
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
          </motion.article>
        ))}
      </motion.div>

      {posts.length === 0 && (
        <motion.div className="text-center py-12" variants={itemVariants}>
          <p className="text-secondary">No posts found.</p>
        </motion.div>
      )}
    </motion.div>
  );
}

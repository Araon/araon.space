"use client";

import { formatDate } from "@/lib/formatdate";
import type { Post } from ".contentlayer/generated";
import Section from "@/components/Section";
import Link from "@/components/ui/Link";
import Image from "next/image";
import { motion } from "framer-motion";
import React from "react";

type BlogPostProps = {
  post: Post;
};

export default function BlogPost({ post }: BlogPostProps) {
  const { publishedAt, slug, title, image, summary, readingTime } = post;
  const publishDate = new Date(publishedAt);
  const showNewBadge =
    Math.abs(new Date(publishDate).getTime() - new Date().getTime()) /
      (24 * 60 * 60 * 1000) < 5; 
    // New badge stays up for 5 days

  const badgeVariants = {
    fromBelow: {
      y: 10,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    hover: {
      y: -5,
      transition: {
        duration: 0.1,
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
    <motion.li 
      className="py-4 group transition-all duration-200 hover:bg-secondary/5 rounded-lg px-2 -mx-2"
      variants={postVariants}
      initial="initial"
      whileHover="hover"
    >
      <Link href={`/blog/${slug}`} className="block">
        <div className="flex gap-4 items-start">
          {/* Image */}
          <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 relative rounded-lg overflow-hidden bg-secondary/10">
            {image && (
              <Image 
                src={image} 
                alt={title} 
                fill 
                sizes="(max-width: 768px) 80px, 96px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {title}
                  {showNewBadge && (
                    <motion.span
                      variants={badgeVariants}
                      initial="frombelow"
                      animate="visible"
                      whileHover={{ ...badgeVariants.hover, backgroundColor: "#54b3ff" }}
                      className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs ml-2 inline-block"
                    >
                      New
                    </motion.span>
                  )}
                </h3>
                {summary && (
                  <p className="text-secondary text-sm leading-relaxed line-clamp-2 mt-1">
                    {summary}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-xs text-tertiary">
              <time dateTime={publishedAt} className="font-medium">
                {formatDate(publishedAt)}
              </time>
              <span className="opacity-40">•</span>
              <span>{readingTime}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.li>
  );
}

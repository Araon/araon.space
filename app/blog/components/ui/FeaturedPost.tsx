"use client";

import { formatDate } from "@/lib/formatdate";
import type { Post } from ".contentlayer/generated";
import Link from "@/components/ui/Link";
import Image from "next/image";
import { motion } from "framer-motion";

type FeaturedPostProps = {
  post: Post;
};

export default function FeaturedPost({ post }: FeaturedPostProps) {
  const { publishedAt, slug, title, image, summary } = post;
  const publishDate = new Date(publishedAt);
  const showNewBadge =
    Math.abs(new Date(publishDate).getTime() - new Date().getTime()) /
      (24 * 60 * 60 * 1000) < 5;

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

  return (
    <article className="group cursor-pointer">
      <Link href={`/blog/${slug}`} className="block">
        {/* Featured Image */}
        {image && (
          <div className="relative aspect-[16/9] mb-6 overflow-hidden rounded-lg bg-secondary/10">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority
            />
            {showNewBadge && (
              <motion.div
                variants={badgeVariants}
                initial="fromBelow"
                animate="visible"
                whileHover={badgeVariants.hover}
                className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium"
              >
                New
              </motion.div>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="space-y-3">
          {/* Date */}
          <time className="text-sm text-secondary font-medium">
            {formatDate(publishedAt)}
          </time>
          
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight group-hover:text-primary transition-colors">
            {title}
          </h1>
          
          {/* Summary */}
          {summary && (
            <p className="text-lg leading-relaxed text-secondary line-clamp-3">
              {summary}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}

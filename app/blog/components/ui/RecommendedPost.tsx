"use client";

import { formatDate } from "@/lib/formatdate";
import { Post } from ".contentlayer/generated";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface PostWithViews extends Post {
  views?: number;
}

interface RecommendedPostProps {
  posts: PostWithViews[];
}

export default function RecommendedPost({ posts }: RecommendedPostProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const tooltipVariants = {
    hidden: {
      opacity: 0,
      y: 10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: 10,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    },
  };

  if (!posts || posts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="relative">
          <h2
            className="text-xl font-bold"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            Recommended
          </h2>
          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                variants={tooltipVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-primary-foreground absolute bottom-full left-0 z-10 mb-2 w-64 rounded-lg bg-primary p-3 text-sm shadow-lg"
              >
                <div className="relative">
                  Posts recommended based on view counts, excluding very recent
                  posts.
                  {/* Tooltip arrow */}
                  <div className="absolute -bottom-2 left-4 h-0 w-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="text-secondary">
          <p>Coming soon...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <h2
          className="text-xl font-bold text-primary"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          Recommended
        </h2>
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              variants={tooltipVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-primary-foreground absolute bottom-full left-0 z-10 mb-2 w-64 rounded-lg bg-primary p-3 text-sm shadow-lg"
            >
              <div className="relative">
                Posts recommended based on view counts, excluding very recent
                posts.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="space-y-5">
        {posts.map((post, index) => {
          const { publishedAt, slug, title, image, summary, views } = post;

          return (
            <article key={slug} className="group">
              <Link href={`/blog/${slug}`} className="block">
                <div className="space-y-2.5">
                  {image && (
                    <div className="bg-secondary/10 aspect-[4/3] overflow-hidden rounded-lg">
                      <Image
                        src={image}
                        alt={title}
                        width={300}
                        height={225}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <h3 className="line-clamp-2 text-base font-semibold leading-snug transition-colors group-hover:text-primary">
                      {title}
                    </h3>
                    {/* {summary && (
                      <p className="line-clamp-2 text-sm leading-relaxed text-secondary/80">
                        {summary}
                      </p>
                    )} */}
                    <div className="flex items-center gap-2 pt-0.5">
                      <time
                        dateTime={publishedAt}
                        className="text-xs font-medium uppercase tracking-wide text-tertiary"
                      >
                        {formatDate(publishedAt)}
                      </time>
                      {views && views > 0 && (
                        <>
                          <span className="text-tertiary opacity-60">-</span>
                          <span className="text-xs text-tertiary">
                            {views} views
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}

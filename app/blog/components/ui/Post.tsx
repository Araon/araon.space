import { formatDate } from "@/lib/formatdate";
import type { Post } from ".contentlayer/generated";
import Section from "@/components/Section";
import Link from "@/components/ui/Link";
import Image from "next/image";
import { motion } from "framer-motion";
import React from "react";

type PostProps = {
  post: Post;
  mousePosition?: {
    x: number;
    y: number;
  };
};

export default function Post({ post, mousePosition }: PostProps) {
  const { publishedAt, slug, title, image } = post;
  const publishDate = new Date(publishedAt);
  const showNewBadge =
    Math.abs(new Date(publishDate).getTime() - new Date().getTime()) /
      (24 * 60 * 60 * 1000) < 5; 
    // New badge stays up for 5 days
  const imageHeight = 180;
  const imageWidth = 300;
  const imageOffset = 24;

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
    <li className="py-3 group transition-opacity">
      <div className="transition-opacity">
        {image && mousePosition && (
          <motion.div
            animate={{
              top: mousePosition.y - imageHeight - imageOffset,
              left: mousePosition.x - imageWidth / 2,
            }}
            initial={false}
            transition={{ ease: "easeOut" }}
            style={{ width: imageWidth, height: imageHeight }}
            className="absolute z-10 hidden overflow-hidden rounded shadow-sm pointer-events-none sm:group-hover:block bg-primary"
          >
            <Image
              src={image}
              alt={title}
              width={imageWidth}
              height={imageHeight}
            />
          </motion.div>
        )}
        <div className="flex justify-between gap-6 items-center">
          <Section heading={formatDate(publishedAt)}>
            <Link href={`/blog/${slug}`} className="font-medium leading-tight">{title}</Link>
            {showNewBadge && (
              <motion.span
                variants={badgeVariants}
                initial="frombelow"
                animate="visible"
                whileHover={{ ...badgeVariants.hover, backgroundColor: "#54b3ff" }}
                className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs ml-2"
              >
                New
              </motion.span>
            )}
          </Section>
          <div className="md:hidden aspect-square min-w-24 w-24 h-24 relative drop-shadow-sm">
            <Image src={image} alt={title} fill className="object-cover rounded"/>
          </div>
        </div>
      </div>
    </li>
  );
}

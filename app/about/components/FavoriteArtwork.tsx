"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "@/components/ui/Link";
import { motion } from "framer-motion";

export default function FavoriteArtwork() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLSpanElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const imageWidth = 300;
  const imageHeight = 200;
  const imageOffset = 24;

  return (
    <span
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="group relative inline-block"
    >
      <Link
        href="https://artsandculture.google.com/asset/view-of-delft-vermeer-johannes/CgGsQh01dnFdDQ"
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        View of Delft
      </Link>

      <motion.div
        animate={{
          top: mousePosition.y - imageHeight - imageOffset,
          left: mousePosition.x - imageWidth / 2,
        }}
        initial={false}
        transition={{ ease: "easeOut" }}
        style={{ width: imageWidth, height: imageHeight }}
        className="pointer-events-none absolute z-50 hidden overflow-hidden rounded-lg shadow-lg group-hover:block"
      >
        <Image
          src="https://lh3.googleusercontent.com/ci/AL18g_Q7JJVvT7ox9updRd7tnn8a-X7ZJyc0ocL7jKkkijn68xAfoL1EE118ZtG2HQs8_1RAN7J3N2c"
          alt="View of Delft by Johannes Vermeer"
          width={imageWidth}
          height={imageHeight}
          className="object-cover"
        />
      </motion.div>
    </span>
  );
}

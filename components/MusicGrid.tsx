"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import useSWR from "swr";

import fetcher from "@/lib/fetcher";
import type { Track } from "@/lib/spotify";

const TRACK_GRID_CLASSES =
  "columns-1 gap-4 sm:columns-2 md:columns-3 xl:columns-5 2xl:columns-6";

function TrackItem({ track, index }: { track: Track; index: number }) {
  const sizeClass =
    index % 5 === 0
      ? "h-96" // Large items
      : index % 3 === 0
        ? "h-72" // Medium items
        : "h-48"; // Regular items

  return (
    <motion.a
      href={track.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`bg-muted/50 group relative mb-4 block w-full overflow-hidden rounded-xl transition-all ${sizeClass}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 1.02 }}
    >
      {/* Cover Image */}
      <Image
        src={track.coverImage}
        alt={track.title}
        fill
        className="object-cover transition-all group-hover:blur-sm"
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
      />

      {/* Title overlay (hidden until hover) */}
      <div
        className="absolute inset-0 flex items-center justify-center bg-black/30 
                   opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        {/* Text is smaller and centered, color set from album art */}
        <span
          className="text-center text-sm font-semibold"
          style={{ color: "#FFF" }}
        >
          {track.artist} - {track.title}
        </span>
      </div>
    </motion.a>
  );
}

// Loading skeleton remains the same
function LoadingSkeleton() {
  return (
    <div className={TRACK_GRID_CLASSES}>
      {[...Array(8)].map((_, i) => {
        const sizeClass = i % 5 === 0 ? "h-96" : i % 3 === 0 ? "h-72" : "h-48";

        return (
          <motion.div
            key={i}
            className={`bg-muted/50 mb-4 block w-full rounded-xl ${sizeClass}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          />
        );
      })}
    </div>
  );
}

function TrackError() {
  return (
    <p role="alert" className="text-sm text-secondary">
      spotify tracks are unavailable
    </p>
  );
}

function TrackGrid({ endpoint }: { endpoint: string }) {
  const { data: tracks, error } = useSWR<Track[]>(endpoint, fetcher);

  if (error || (tracks && !Array.isArray(tracks))) return <TrackError />;
  if (!tracks) return <LoadingSkeleton />;

  return (
    <div className={TRACK_GRID_CLASSES}>
      {tracks.map((track, i) => (
        <TrackItem
          key={`${track.url}-${track.playedAt ?? i}`}
          track={track}
          index={i}
        />
      ))}
    </div>
  );
}

export function TopTracks() {
  return <TrackGrid endpoint="/api/spotify/top-tracks" />;
}

export function RecentlyPlayed() {
  return <TrackGrid endpoint="/api/spotify/recently-played" />;
}

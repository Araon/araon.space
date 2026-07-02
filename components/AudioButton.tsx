"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AudioButtonProps {
  audioPath: string;
  className?: string;
  children: React.ReactNode;
  tooltipText?: string;
}

export default function AudioButton({
  audioPath,
  className = "",
  children,
  tooltipText = "Click to hear pronunciation",
}: AudioButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const playAudio = () => {
    const audio = new Audio(audioPath);
    audio.play();
  };

  const handleTap = () => {
    playAudio();
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };

  return (
    <span
      className={`relative cursor-pointer hover:opacity-80 ${className}`}
      onClick={handleTap}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleTap();
        }
      }}
      aria-label="Play pronunciation"
    >
      <AnimatePresence>
        {showTooltip && (
          <motion.span
            className="absolute -top-7 left-1/2 z-10 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-neutral-800/70 px-2.5 py-1.5 text-xs font-medium text-white shadow-md backdrop-blur-sm dark:bg-white/70 dark:text-neutral-800"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {tooltipText}
          </motion.span>
        )}
      </AnimatePresence>
      {children}
    </span>
  );
}

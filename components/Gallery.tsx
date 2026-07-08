"use client";

import { ReactNode, useEffect, useState } from "react";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import Image, { StaticImageData } from "next/image";
import { motion } from "framer-motion";
import clsx from "clsx";
import localFont from "next/font/local";

import Halo from "@/components/ui/Halo";

const ticketingFont = localFont({
  src: "../public/fonts/google/inter-400.ttf",
  display: "swap",
});

type PhotoProps = {
  src: StaticImageData | string;
  meta?: ReactNode;
  filename?: string;
  alt: string;
  width: number;
  height: number;
  rotate: number;
  left: number;
  index: number;
  flipDirection?: "left" | "right";
  children?: ReactNode;
};

export function GetPhotos() {
  const { data: photosUrl, error: photosError } = useSWR(
    `/api/prisma/fetchPhotos`,
    fetcher,
  );

  if (photosError) return <div>failed to load</div>;
  return photosUrl;
}

function Photo({
  src,
  alt,
  filename,
  width,
  height,
  rotate,
  left,
  index,
  flipDirection,
  meta,
  children,
}: PhotoProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const maxWidth = 1080;
  const maxHeight = 1920;

  let scaleFactor = 1;
  if (width > height) {
    scaleFactor = maxWidth / width;
  } else {
    scaleFactor = maxHeight / height;
  }

  const newWidth = width * scaleFactor;
  const newHeight = height * scaleFactor;

  const fileName =
    filename ||
    (typeof src !== "string" &&
      `${src.src.split("/").at(-1)?.split(".")[0]}.jpg`);
  const shared = "absolute h-full w-full rounded-2xl overflow-hidden";
  return (
    <motion.div
      className={clsx(
        "hover:before:absolute hover:before:-left-7 hover:before:-top-8 hover:before:block hover:before:h-[300px] hover:before:w-[calc(100%+55px)]",
        !isMobile && "cursor-grab",
      )}
      style={{ width: newWidth, height: newHeight }}
      initial={{
        width,
        height,
        rotate: (rotate || 0) - 20,
        y: isMobile ? 50 + index * 10 : 200 + index * 20,
        opacity: 0,
      }}
      transition={{
        default: {
          type: isMobile ? "tween" : "spring",
          bounce: 0.2,
          duration: isMobile ? 0.3 : index === 1 ? 0.8 : index === 2 ? 0.85 : index === 3 ? 0.9 : 1,
          delay: isMobile ? index * 0.05 : index * 0.15,
        },
        opacity: {
          duration: isMobile ? 0.3 : 0.7,
          ease: [0.23, 0.64, 0.13, 0.99],
          delay: isMobile ? index * 0.05 : index * 0.15,
        },
        scale: { duration: 0.12 },
      }}
      animate={{ width, height, rotate, y: 0, opacity: 1 }}
      drag={isMobile ? false : true}
      whileTap={isMobile ? undefined : "flipped"}
      whileDrag={isMobile ? undefined : { scale: 1.1, cursor: "grabbing" }}
      whileHover={isMobile ? undefined : "flipped"}
    >
      <motion.div
        className="relative h-full w-full rounded-2xl shadow-md will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
        transition={{ type: "spring", duration: 0.4 }}
        variants={{
          flipped: {
            scale: 1.1,
            rotateY: flipDirection === "right" ? -180 : 180,
            rotateX: 5,
          },
        }}
      >
        <div className={shared} style={{ backfaceVisibility: "hidden" }}>
          <Image
            src={src}
            alt={alt}
            width={newWidth}
            height={newHeight}
            className="pointer-events-none absolute inset-0 h-full w-full rounded-2xl bg-gray-400 object-cover"
            priority={index <= 2}
            aria-describedby={`photo-${index}-description`}
          />
          {meta && (
            <span id={`photo-${index}-description`} className="sr-only">
              {meta}
            </span>
          )}
          {children}
        </div>
        <div
          className={clsx(
            shared,
            "flex items-center overflow-hidden rounded-2xl bg-[#FFFAF2]",
          )}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <Halo strength={50} className="flex items-center">
            <span className="absolute h-[500px] w-[500px] rotate-[-20deg] bg-[url('/photopaper.png')] bg-[length:280px] bg-repeat" />
            <div className="z-[1] px-6">
              <div
                className={clsx(
                  ticketingFont.className,
                  "flex flex-col gap-1 uppercase",
                )}
              >
                <p className="text-sm text-secondary">{fileName}</p>
                {meta && <p className="text-xl text-secondary">{meta}</p>}
              </div>
            </div>
          </Halo>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Gallery() {
  const { data: photosUrl, error: photosError } = useSWR(
    `/api/prisma/fetchPhotos`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 3600000,
    },
  );

  if (photosError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="mb-4 text-red-500">Unable to load photos</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-gray-100 px-4 py-2 transition-colors hover:bg-gray-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!photosUrl) {
    return (
      <div className="grid animate-pulse grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-12">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 rounded-2xl bg-gray-200"></div>
        ))}
      </div>
    );
  }

  return (
    <section
      className="grid auto-rows-min grid-cols-1 place-items-center gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-12"
      aria-label="Photo gallery"
      role="region"
    >
      {/* @ts-ignore */}
      {photosUrl.photos.map((photo, index) => (
        <Photo
          key={photo.photo_url}
          src={photo.photo_url}
          meta={photo.views + " " + photo.alt_text}
          alt={photo.alt_text}
          width={photo.width / 12}
          height={photo.height / 12}
          rotate={index % 3 === 0 ? 6.3 : -6}
          left={index * 150 + (index % 2 === 0 ? -115 : 108)}
          index={index + 1}
          flipDirection={index % 2 === 0 ? "left" : undefined}
        />
      ))}
    </section>
  );
}

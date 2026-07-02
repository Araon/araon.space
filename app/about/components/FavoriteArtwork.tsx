"use client";

import Image from "next/image";
import Link from "@/components/ui/Link";

export default function FavoriteArtwork() {
  return (
    <span className="group relative inline">
      <Link
        href="https://artsandculture.google.com/asset/view-of-delft-vermeer-johannes/CgGsQh01dnFdDQ"
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        View of Delft
      </Link>

      <span
        style={{ width: 300, height: 200 }}
        className="pointer-events-none absolute z-50 hidden overflow-hidden rounded-lg shadow-lg group-hover:block"
      >
        <Image
          src="/gallery/view-of-delft.jpg"
          alt="View of Delft by Johannes Vermeer"
          width={300}
          height={200}
          className="object-cover"
        />
      </span>
    </span>
  );
}

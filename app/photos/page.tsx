import Image, { StaticImageData } from "next/image";
import { Metadata } from "next";

import Gallery from "@/components/Gallery";

import punehill from "public/gallery/doremon-hill.jpg"
import medarjeeling from "public/gallery/me-darjeeling.jpg"


export const metadata: Metadata = {
  title: "Photos | Araon",
  description: "Some photos I took",
};

export default function Photos() {
  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <div>
        <h1 className="animate-in text-3xl font-bold tracking-tight">
          Photos I took 📷
        </h1>
        <div className="hidden md:block">
          <p
            className="animate-in text-secondary"
            style={{ "--index": 1 } as React.CSSProperties}
          >
            well, at least I tried
          </p>
        </div>
        <div className="mb-8 md:hidden">
        <div>
          <p
            className="animate-in text-secondary"
            style={{ "--index": 1 } as React.CSSProperties}
          >
            Well rest you have to check my instagram
          </p>
        </div>
      </div>
      </div>

      <div className="mb-8 md:hidden">
        <div
          className="animate-in"
          style={{ "--index": 1 } as React.CSSProperties}
        >
          <Image
            src={medarjeeling}
            alt={"me in darjeeling"}
            width={220}
            height={260}
            className="pointer-events-none relative inset-0 -top-2 h-60 -rotate-6 rounded-2xl bg-gray-400 object-cover shadow-md"
            priority
          />
        </div>

        <div
          className="animate-in"
          style={{ "--index": 2 } as React.CSSProperties}
        >
          <Image
            src={punehill}
            alt={"guitar from k-on"}
            width={220}
            height={260}
            className="pointer-events-none absolute inset-0 -top-40 left-[45%] w-48 rotate-6 rounded-2xl bg-gray-400 object-cover shadow-md md:left-[60%] md:w-56"
            priority
          />
        </div>
      </div>
      <div className="hidden md:block">
        <Gallery />
      </div>
      <div
        className="flex animate-in flex-col gap-16 md:gap-24"
        style={{ "--index": 3 } as React.CSSProperties}
      >
      </div>
    </div>
  );
}
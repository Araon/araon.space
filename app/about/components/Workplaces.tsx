"use client";
import Image, { StaticImageData } from "next/image";
import { useTheme } from "next-themes";
import clsx from "clsx";

import Link from "@/components/ui/Link";

type Workplace = {
  company: string;
  imageSrc: string | StaticImageData;
  time?: string;
  link?: string;
};

function Workplace({ company, imageSrc, time, link }: Workplace) {
  const { theme } = useTheme();

  const content = (
    <>
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-primary bg-tertiary">
          <Image
            src={imageSrc}
            alt={company}
            width={48}
            height={48}
            className={clsx(
              "h-full w-full object-cover",
              company === "Nagarro" && "bg-black object-contain p-2",
              company === "University of Houston" && "bg-neutral-50"
            )}
          />
        </div>
        <p className={link ? "external-arrow min-w-0" : "min-w-0"}>
          {company}
        </p>
      </div>
      {time && (
        <time className="shrink-0 whitespace-nowrap text-right text-secondary">
          {time}
        </time>
      )}
    </>
  );
  return (
    <li className="transition-opacity" key={company}>
      {link ? (
        <Link
          href={link}
          className="-mx-3 -my-2 grid w-[calc(100%+1.5rem)] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-3 py-2 no-underline"
        >
          {content}
        </Link>
      ) : (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          {content}
        </div>
      )}
    </li>
  );
}

export default function Workplaces({ items }: { items: Workplace[] }) {
  return (
    <ul className="flex flex-col gap-8 animated-list">
      {items.map(Workplace)}
    </ul>
  );
}

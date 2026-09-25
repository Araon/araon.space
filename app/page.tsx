import Image from "next/image";
import Link from "@/components/ui/Link";
import { allPosts } from ".contentlayer/generated";

import PostList from "./blog/components/ui/PostList";
import Stats from "@/components/Stats";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";
import Avatar from "@/public/avatar.jpg";
import Coderenderer from "@/components/Code";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

export default async function Home() {
  const posts = [...allPosts]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    // 3 most recent
    .filter((_, i) => i < 3);

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <section className="sr-only" aria-labelledby="site-summary-heading">
        <h2 id="site-summary-heading">About Araon</h2>
        <p>
          Araon is Soumik Ghosh&apos;s personal site for engineering projects,
          photography, music, and notes on technology and life.
        </p>
        <ul>
          <li>
            <Link href="/about">Learn about Araon</Link>
          </li>
          <li>
            <Link href="/blog">Read stories and notes</Link>
          </li>
          <li>
            <Link href="/projects">Browse projects</Link>
          </li>
          <li>
            <Link href="/photos">View photographs</Link>
          </li>
          <li>
            <Link href="/music">Explore music</Link>
          </li>
        </ul>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@id": "https://araon.space/#person",
                "@type": "Person",
                name: "Soumik Ghosh",
                alternateName: "Araon",
                url: "https://araon.space",
                image: "https://araon.space/avatar.jpg",
                sameAs: [
                  "https://github.com/araon",
                  "https://www.instagram.com/ara0n/",
                  "https://www.twitch.tv/ara0nwastaken",
                ],
              },
              {
                "@id": "https://araon.space/#website",
                "@type": "WebSite",
                name: "Araon",
                alternateName: "araon.space",
                url: "https://araon.space/",
                description:
                  "Code, camera, and chaos: Araon's personal projects, photography, music, and notes on technology and life.",
                inLanguage: "en",
                publisher: { "@id": "https://araon.space/#person" },
              },
              {
                "@id": "https://araon.space/#blog",
                "@type": "Blog",
                name: "Araon's Stories and Notes",
                url: "https://araon.space/blog",
                publisher: { "@id": "https://araon.space/#person" },
                blogPost: posts.map((post) => ({
                  "@type": "BlogPosting",
                  headline: post.title,
                  description: post.summary,
                  url: `https://araon.space/blog/${post.slug}`,
                  datePublished: post.publishedAt,
                  dateModified: post.updatedAt ?? post.publishedAt,
                  author: { "@id": "https://araon.space/#person" },
                })),
              },
            ],
          }),
        }}
      />
      <div className="flex animate-in flex-col gap-8">
        <div>
          <h1 className="animate-in text-3xl text-primary">
            <span className="font-bold">Araon</span>
          </h1>
          <p
            className="nothing-matrix animate-in text-secondary"
            style={{ "--index": 1 } as React.CSSProperties}
          >
            Code • Camera • Chaos
          </p>
        </div>
        <div
          className="flex animate-in flex-col gap-6 text-secondary md:flex-row md:items-center"
          style={{ "--index": 1 } as React.CSSProperties}
        >
          <Link href="/about">
            <Image
              src={Avatar}
              width={85}
              height={85}
              alt="avatar"
              className="rounded-full bg-secondary"
            />
          </Link>
          <Stats />
        </div>
        <p
          className="max-w-lg animate-in text-primary"
          style={{ "--index": 2 } as React.CSSProperties}
        >
          Everything about me, engineering and life as I see it.
        </p>
        <ul
          className="animated-list flex animate-in flex-col gap-2 text-secondary md:flex-row md:gap-6"
          style={{ "--index": 2 } as React.CSSProperties}
        >
          <li className="transition-opacity">
            <Link
              href="/links"
              className="flex items-center gap-2 no-underline"
            >
              <ArrowUpRightIcon className="h-5 w-5" />
              <span>More ways to connect</span>
            </Link>
          </li>
        </ul>
      </div>
      <div
        className="flex animate-in flex-col gap-8"
        style={{ "--index": 3 } as React.CSSProperties}
      >
        <h2 className="nothing-matrix text-secondary">Latest Rambles</h2>
        <PostList posts={posts} />
        <Link
          href="/blog"
          className="text-secondary underline underline-offset-4 hover:text-primary"
        >
          See All
        </Link>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Coderenderer />
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to download PGP public key.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

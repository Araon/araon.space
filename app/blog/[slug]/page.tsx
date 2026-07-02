import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import { allPosts, Post as PostType } from ".contentlayer/generated";

import Tags from "@/components/Tags";
import Link from "@/components/ui/Link";
import Mdx from "@/app/blog/components/ui/MdxWrapper";
import ViewCounter from "@/app/blog/components/ui/ViewCounter";

import CommentList from "@/app/blog/components/ui/CommentList";
import CommentSection from "@/app/blog/components/ui/CommentSection";

import { formatDate } from "lib/formatdate";

import Avatar from "@/public/avatar.jpg";

type Props = {
  params: {
    slug: string;
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const post = allPosts.find((post) => post.slug === params.slug);

  if (!post) {
    throw new Error("Post not found");
  }

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
    slug,
  } = post;

  // Use absolute URLs
  const url = `https://araon.space/blog/${slug}`;
  const ogImage = image
    ? `https://araon.space${image}`
    : `https://ik.imagekit.io/ara0n/Blog_Images/why_are_you_still_awake.jpeg`;

  const metadata: Metadata = {
    title: `${title} | Araon`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url,
      siteName: "araon.space",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
  return metadata;
}

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Post({ params }: { params: any }) {
  const post = allPosts.find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-20">
      <article>
        <div
          className="flex animate-in flex-col gap-8"
          style={{ "--index": 1 } as React.CSSProperties}
        >
          <div className="max-w-xl space-y-2">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-primary">
              {post.title}
            </h1>
            <p className="text-lg leading-tight text-secondary md:text-xl">
              {post.summary}
            </p>
          </div>

          <div className="flex max-w-none items-center gap-4">
            <Image
              src={Avatar}
              width={40}
              height={40}
              alt="avatar"
              className="rounded-full bg-secondary"
            />
            <div className="leading-tight">
              <p className="font-medium text-primary">Araon</p>
              <p className="text-secondary">
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
                {post.updatedAt
                  ? `(Updated ${formatDate(post.updatedAt)})`
                  : ""}
                {" · "}
                <ViewCounter post={post} />
              </p>
            </div>
          </div>
        </div>

        {post.image && (
          <>
            <div className="h-8" />
            <Image
              src={post.image}
              alt={`${post.title} post image`}
              width={700}
              height={350}
              className="-ml-6 w-[calc(100%+48px)] max-w-none animate-in md:rounded-lg lg:-ml-16 lg:w-[calc(100%+128px)]"
              style={{ "--index": 2 } as React.CSSProperties}
              priority
              quality={85}
            />
          </>
        )}

        <div className="h-16" />
        <div
          className="prose prose-neutral animate-in"
          style={{ "--index": 3 } as React.CSSProperties}
        >
          <Mdx code={post.body.code} />
        </div>
      </article>

      <div className="flex items-center gap-3">
        <span className="text-sm text-secondary">Share:</span>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://araon.space/blog/${post.slug}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-secondary px-3 py-2 text-sm text-secondary transition-colors hover:border-primary hover:text-primary min-h-[44px]"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          <span>Post</span>
        </a>
      </div>

      <Tags tags={post.tags} />

      {(() => {
        const related = allPosts
          .filter((p) => p.slug !== post.slug && p.tags?.some((t: string) => post.tags?.includes(t)))
          .slice(0, 3);
        if (related.length > 0) {
          return (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-primary">Related Posts</h2>
              <div className="flex flex-col gap-3">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group rounded-lg border border-secondary p-4 transition-colors hover:border-primary"
                  >
                    <p className="font-medium text-primary group-hover:underline">{p.title}</p>
                    <p className="mt-1 text-sm text-tertiary">{p.summary}</p>
                  </Link>
                ))}
              </div>
            </div>
          );
        }
      })()}

      <CommentSection postId={post.slug} />
      <CommentList postId={post.slug} />

      <div className="mt-8 ">
        <p className="text-sm text-secondary">
          - 100% human written, including emdashes. Sigh.
        </p>
        <p className="mt-2 text-sm text-secondary">
          - This post is licensed under{" "}
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 hover:text-blue-500"
          >
            CC BY-SA 4.0
          </a>
        </p>
      </div>

    </div>
  );
}

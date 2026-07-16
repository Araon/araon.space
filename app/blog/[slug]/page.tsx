import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import { allPosts, Post as PostType } from ".contentlayer/generated";

import Tags from "@/components/Tags";
import Link from "@/components/ui/Link";
import Mdx from "@/app/blog/components/ui/MdxWrapper";
import ViewCounter from "@/app/blog/components/ui/ViewCounter";
import BlogPostAnalytics from "@/app/blog/components/ui/BlogPostAnalytics";
import ShareButtons from "@/app/blog/components/ui/ShareButtons";

import CommentList from "@/app/blog/components/ui/CommentList";
import CommentSection from "@/app/blog/components/ui/CommentSection";

import { formatDate } from "lib/formatdate";
import { getRelatedPosts } from "@/lib/relatedPosts";

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

  const { title, publishedAt: publishedTime, summary: description, slug } = post;

  // Use absolute URLs
  const url = `https://araon.space/blog/${slug}`;
  const ogImage = `https://araon.space/og/blog/${slug}.png`;

  const metadata: Metadata = {
    title: `${title} | Araon`,
    description,
    alternates: {
      canonical: url,
    },
    authors: [{ name: "Araon", url: "https://araon.space/about" }],
    keywords: post.tags,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      modifiedTime: post.updatedAt,
      authors: ["Araon"],
      tags: post.tags,
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
      creator: "@ara0n_",
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
      <BlogPostAnalytics slug={post.slug} title={post.title} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.summary,
            image: `https://araon.space/og/blog/${post.slug}.png`,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt ?? post.publishedAt,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://araon.space/blog/${post.slug}`,
            },
            author: {
              "@type": "Person",
              name: "Araon",
              url: "https://araon.space/about",
            },
            publisher: {
              "@type": "Person",
              name: "Araon",
              url: "https://araon.space",
            },
            keywords: post.tags?.join(", "),
          }),
        }}
      />
      <article>
        <div
          className="flex animate-in flex-col gap-8"
          style={{ "--index": 1 } as React.CSSProperties}
        >
          <div className="max-w-xl space-y-2">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-primary">
              {post.title}
            </h1>
            {!post.hideSummary && (
              <p className="text-lg leading-tight text-secondary md:text-xl">
                {post.summary}
              </p>
            )}
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

      <ShareButtons slug={post.slug} title={post.title} />

      <Tags tags={post.tags} />

      {(() => {
        const related = getRelatedPosts(post, allPosts);

        return (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-primary">Keep reading</h2>
            <div className="flex flex-col gap-3">
              {related.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="group rounded-lg border border-secondary p-4 transition-colors hover:border-primary"
                >
                  <p className="font-medium text-primary group-hover:underline">{relatedPost.title}</p>
                  {!relatedPost.hideSummary && (
                    <p className="mt-1 text-sm text-tertiary">{relatedPost.summary}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        );
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

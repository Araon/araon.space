import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import slugify from "slugify";
import { allPosts } from ".contentlayer/generated";

type TagPageProps = {
  params: { tag: string };
};

const tagSlug = (tag: string) => slugify(tag, { lower: true });

export function generateStaticParams() {
  return Array.from(
    new Set(allPosts.flatMap((post) => post.tags ?? []).map(tagSlug)),
  ).map((tag) => ({ tag }));
}

export function generateMetadata({ params }: TagPageProps): Metadata {
  const posts = allPosts.filter((post) => post.tags?.some((tag: string) => tagSlug(tag) === params.tag));
  const label = posts.flatMap((post) => post.tags ?? []).find((tag: string) => tagSlug(tag) === params.tag) ?? params.tag;

  return {
    title: `${label} posts | Araon`,
    description: `Stories and notes about ${label} by Araon.`,
    alternates: { canonical: `https://araon.space/blog/tag/${params.tag}` },
    robots: posts.length ? undefined : { index: false, follow: false },
  };
}

export default function TagPage({ params }: TagPageProps) {
  const posts = allPosts
    .filter((post) => post.tags?.some((tag: string) => tagSlug(tag) === params.tag))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  const label = posts.flatMap((post) => post.tags ?? []).find((tag: string) => tagSlug(tag) === params.tag) ?? params.tag;

  return (
    <div className="flex flex-col gap-8">
      <div className="animate-in space-y-3">
        <Link href="/blog" className="inline-flex text-sm font-medium text-secondary transition-colors hover:text-primary">
          ← All posts
        </Link>
        <div>
          <p className="text-sm text-secondary">Topic</p>
          <h1 className="text-3xl font-bold tracking-tight">{label}</h1>
          <p className="mt-2 text-secondary">{posts.length} {posts.length === 1 ? "post" : "posts"} about {label}.</p>
        </div>
      </div>

      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="group animate-in">
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="flex items-start gap-6 rounded-lg p-4 transition-all duration-200 hover:bg-secondaryA/20">
                <div className="flex-1 space-y-3">
                  <h2 className="text-xl font-semibold leading-tight group-hover:underline">{post.title}</h2>
                  <p className="text-secondary">{post.summary}</p>
                  <p className="text-sm text-tertiary">{post.readingTime}</p>
                </div>
                <Image src={post.image} alt="" width={160} height={112} className="hidden rounded-lg object-cover sm:block" />
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

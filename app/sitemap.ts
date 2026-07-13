import type { MetadataRoute } from "next";
import slugify from "slugify";
import { allPosts, allProjects } from ".contentlayer/generated";

const SITE_URL = "https://araon.space";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/projects`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/now`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/photos`, changeFrequency: "monthly", priority: 0.4 },
  ];

  const posts = allPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const tags = Array.from(
    new Set(
      allPosts
        .flatMap((post) => post.tags ?? [])
        .map((tag: string) => slugify(tag, { lower: true })),
    ),
  ).map((tag) => ({
    url: `${SITE_URL}/blog/tag/${tag}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const projects = allProjects.map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...posts, ...tags, ...projects];
}

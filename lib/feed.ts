import { headers } from "next/headers";
import { Feed } from "feed";

import { allPosts } from ".contentlayer/generated";

export function getSiteUrl() {
  const host = headers().get("host") ?? "araon.space";
  const protocol = host.includes("localhost") ? "http" : "https";

  return `${protocol}://${host}`;
}

export function createBlogFeed(siteUrl: string) {
  const feed = new Feed({
    title: "Araon's Blog",
    description:
      "I write about engineering, stories, and occasionally life updates!",
    id: siteUrl,
    link: siteUrl,
    language: "en",
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Araon`,
    author: {
      name: "Araon",
      email: "ayy.soumik@gmail.com",
      link: siteUrl,
    },
    feedLinks: {
      rss: `${siteUrl}/api/rss`,
      json: `${siteUrl}/api/rss/json`,
    },
  });

  const posts = allPosts
    .slice()
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

  for (const post of posts) {
    const url = `${siteUrl}/blog/${post.slug}`;

    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.summary,
      date: new Date(post.publishedAt),
      image: post.image ? `${siteUrl}${post.image}` : undefined,
    });
  }

  return feed;
}

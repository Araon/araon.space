import { Feed } from "feed";
import { allPosts } from ".contentlayer/generated";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  // Get the request headers to detect the host
  const headersList = headers();
  const host = headersList.get("host") || "araon.space";
  const protocol = host.includes("localhost") ? "http" : "https";

  // Use the current request URL for feed links to ensure self-reference is correct
  const siteURL = `${protocol}://${host}`;
  const feedURL = `${siteURL}/api/rss`;
  const jsonFeedURL = `${siteURL}/api/rss/json`;
  const blogURL = `${siteURL}/blog`;

  const feed = new Feed({
    title: "Araon's Blog",
    description:
      "I write about engineering, stories, and occasionally life updates!",
    id: siteURL,
    link: siteURL,
    language: "en",
    favicon: `${siteURL}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Araon`,
    author: {
      name: "Araon",
      email: "ayy.soumik@gmail.com",
      link: siteURL,
    },
    feedLinks: {
      rss: feedURL,
      json: jsonFeedURL,
    },
  });

  // Sort posts by date (newest first)
  const posts = allPosts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  // Add each post to the feed
  posts.forEach((post) => {
    const url = `${blogURL}/${post.slug}`;

    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.summary,
      date: new Date(post.publishedAt),
      image: post.image ? `${siteURL}${post.image}` : undefined,
    });
  });

  // Generate JSON feed
  const jsonOutput = feed.json1();

  // Set appropriate content type and return the JSON feed
  return new NextResponse(jsonOutput, {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
    },
  });
}

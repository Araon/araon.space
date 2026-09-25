import { NextResponse } from "next/server";
import { allPosts, allProjects } from ".contentlayer/generated";

const SITE_URL = "https://araon.space";

export const dynamic = "force-static";

export function GET() {
  const corePages = [
    ["Home", "/", "Araon's personal site."],
    ["About", "/about", "Background, work, resume, and ways to connect."],
    ["Stories and Notes", "/blog", "Writing about technology, life, and more."],
    ["All Stories and Notes", "/blog/all", "Complete blog archive."],
    ["Projects", "/projects", "Personal engineering projects."],
    ["Photographs", "/photos", "Photography by Araon."],
    ["Music", "/music", "Recently played music and favorites."],
    ["Links", "/links", "Araon's public profiles and contact links."],
  ];

  const posts = [...allPosts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  const projects = [...allProjects].sort((a, b) => b.time.localeCompare(a.time));

  const content = [
    "# Araon",
    "",
    "> Personal site by Soumik Ghosh, known online as Araon. It covers engineering projects, photography, music, and notes on technology and life.",
    "",
    "## Attribution and reuse",
    "",
    "When citing or using material from this site, credit Araon and link to the original canonical URL. Blog posts are published under CC BY-SA 4.0 as stated on their individual pages.",
    "",
    "## Core pages",
    "",
    ...corePages.map(
      ([title, path, description]) => `- [${title}](${SITE_URL}${path}): ${description}`,
    ),
    "",
    "## Stories and notes",
    "",
    ...posts.map(
      (post) =>
        `- [${post.title}](${SITE_URL}/blog/${post.slug}): ${post.summary}`,
    ),
    "",
    "## Projects",
    "",
    ...projects.map(
      (project) =>
        `- [${project.title}](${SITE_URL}/projects/${project.slug}): ${project.description}`,
    ),
    "",
    "## Feeds and discovery",
    "",
    `- [RSS feed](${SITE_URL}/api/rss)`,
    `- [JSON Feed](${SITE_URL}/api/rss/json)`,
    `- [Sitemap](${SITE_URL}/sitemap.xml)`,
    `- [Robots policy](${SITE_URL}/robots.txt)`,
    "",
  ].join("\n");

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

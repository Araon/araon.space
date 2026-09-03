import { NextResponse } from "next/server";

import { createBlogFeed, getSiteUrl } from "@/lib/feed";

export async function GET() {
  const feed = createBlogFeed(getSiteUrl());

  return new NextResponse(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}

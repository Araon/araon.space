import { NextResponse } from "next/server";

import { createBlogFeed, getSiteUrl } from "@/lib/feed";

export async function GET() {
  const feed = createBlogFeed(getSiteUrl());

  return new NextResponse(feed.json1(), {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
    },
  });
}

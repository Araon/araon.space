import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "5");

    // Get posts ordered by view count (descending)
    const topPosts = await prisma.post.findMany({
      orderBy: {
        views: "desc",
      },
      take: limit,
      select: {
        slug: true,
        views: true,
      },
    });

    return new Response(JSON.stringify({ posts: topPosts }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

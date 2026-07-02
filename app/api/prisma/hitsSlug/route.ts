import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function getIP() {
  const FALLBACK_IP_ADDRESS = "0.0.0.0";
  const forwardedFor = headers().get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0] ?? FALLBACK_IP_ADDRESS;
  }

  return headers().get("x-real-ip") ?? FALLBACK_IP_ADDRESS;
}

export async function GET(req: NextRequest) {
  try {
    const ip = getIP();
    // Check if IP is blocked
    const blocked = await prisma.blockedIp.findUnique({ where: { ip } });
    if (blocked) {
      return new Response("Access denied", { status: 403 });
    }

    const searchParams = req.nextUrl.searchParams;
    const slug = searchParams.get("slug");

    if (!slug) {
      return new Response("Please provide a slug", { status: 200 });
    }

    let viewCount = 0;

    if (process.env.NODE_ENV !== "development") {
      // Increment the view count in production using upsert for efficiency
      const post = await prisma.post.upsert({
        where: { slug: slug as string },
        update: { views: { increment: 1 } },
        create: { slug: slug as string, views: 1 },
      });
      viewCount = post.views;
    } else {
      // Get view count without incrementing in local environment
      const post = await prisma.post.findUnique({
        where: { slug: slug as string },
      });
      viewCount = post?.views || 0;
    }

    return new Response(JSON.stringify({ Views: viewCount }), {
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

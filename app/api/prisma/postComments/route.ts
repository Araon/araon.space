import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";

import { RateLimiterMemory } from "rate-limiter-flexible";

const prisma = new PrismaClient();

const limiter = new RateLimiterMemory({
  points: 5, // Allow 5 comments
  duration: 60 * 60, // Per hour (60 * 60 seconds)
  blockDuration: 60 * 60 * 24, // Block for 24 hours if limit is exceeded
});

function getIP() {
  const FALLBACK_IP_ADDRESS = "0.0.0.0";
  const forwardedFor = headers().get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0] ?? FALLBACK_IP_ADDRESS;
  }

  return headers().get("x-real-ip") ?? FALLBACK_IP_ADDRESS;
}

export async function POST(req: NextRequest) {
  const ip = getIP();
  // Check if IP is blocked
  const blocked = await prisma.blockedIp.findUnique({ where: { ip } });
  if (blocked) {
    return NextResponse.json(
      { error: "You have been blocked from commenting." },
      { status: 403 },
    );
  }
  try {
    // Rate limit check
    try {
      await limiter.consume(ip);
    } catch (rateLimiterRes) {
      // Block the IP in the database
      await prisma.blockedIp.upsert({
        where: { ip },
        update: { blockedAt: new Date() },
        create: { ip },
      });
      return NextResponse.json(
        { error: "You have been blocked due to excessive requests." },
        { status: 429 },
      );
    }

    const body = await req.json();
    const { postId, content, author } = body;

    if (!content || !author) {
      return NextResponse.json(
        { error: "Content and author fields are required" },
        { status: 400 },
      );
    }

    const ip_identity = ip;

    const post = await prisma.post.findUnique({
      where: {
        slug: postId,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const newComment = await prisma.comments.create({
      data: {
        postId,
        content,
        author,
        ip_identity,
      },
    });

    return NextResponse.json({ comment: "Comment added" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}

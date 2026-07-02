import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

import { RateLimiterMemory } from "rate-limiter-flexible";

export const dynamic = "force-dynamic";

const MAX_AUTHOR_LENGTH = 80;
const MAX_COMMENT_LENGTH = 2000;

let limiter: RateLimiterMemory;

function getLimiter() {
  if (!limiter) {
    limiter = new RateLimiterMemory({
      points: 5,
      duration: 60 * 60,
      blockDuration: 60 * 60 * 24,
    });
  }
  return limiter;
}

function getIP() {
  const FALLBACK_IP_ADDRESS = "0.0.0.0";
  const forwardedFor = headers().get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0] ?? FALLBACK_IP_ADDRESS;
  }

  return headers().get("x-real-ip") ?? FALLBACK_IP_ADDRESS;
}

function normalizeCommentField(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\s+/g, " ").trim();
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
      await getLimiter().consume(ip);
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

    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Please provide a valid JSON body" },
        { status: 400 },
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Please provide a valid JSON body" },
        { status: 400 },
      );
    }

    const { postId, content, author } = body as Record<string, unknown>;
    const normalizedPostId = normalizeCommentField(postId);
    const normalizedContent = normalizeCommentField(content);
    const normalizedAuthor = normalizeCommentField(author);

    if (!normalizedPostId || !normalizedContent || !normalizedAuthor) {
      return NextResponse.json(
        { error: "Post, content, and author fields are required" },
        { status: 400 },
      );
    }

    if (normalizedAuthor.length > MAX_AUTHOR_LENGTH) {
      return NextResponse.json(
        { error: "Author must be 80 characters or less" },
        { status: 400 },
      );
    }

    if (normalizedContent.length > MAX_COMMENT_LENGTH) {
      return NextResponse.json(
        { error: "Content must be 2000 characters or less" },
        { status: 400 },
      );
    }

    const ip_identity = ip;

    const post = await prisma.post.findUnique({
      where: {
        slug: normalizedPostId,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    await prisma.comments.create({
      data: {
        postId: normalizedPostId,
        content: normalizedContent,
        author: normalizedAuthor,
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
  }
}

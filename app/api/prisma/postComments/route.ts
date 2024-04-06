import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";

import RateLimiter from 'rate-limiter-flexible';

const prisma = new PrismaClient();

// const limiter = new RateLimiter({
//   points: 100, // Allow 100 requests
//   duration: 15 * 60, // Per 15 minutes
//   blockDuration: 60 * 60 , // Block for 1 hour if limit is exceeded
// });


function getIP() {
  const FALLBACK_IP_ADDRESS = "0.0.0.0";
  const forwardedFor = headers().get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0] ?? FALLBACK_IP_ADDRESS;
  }

  return headers().get("x-real-ip") ?? FALLBACK_IP_ADDRESS;
}

export async function POST(req: NextRequest) {
  try {

    // await limiter.consume(req.ip);

    const body = await req.json();
    const { postId, content, author } = body;
    
    console.log('Got data from front end: ', content, author)

    if (!content || !author) {
      return NextResponse.json(
        { error: "Content and author fields are required" },
        { status: 400 },
      );
    }

    const ip_identity = getIP();

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

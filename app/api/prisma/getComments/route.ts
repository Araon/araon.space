// Fetch comments for a post
export const dynamic = "force-dynamic";
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const postIdSlug = searchParams.get("postId");

    const comments = await prisma.comments.findMany({
      where: {
        postId: postIdSlug as string,
      },
    });

    return Response.json({ comments: comments });
  } catch (error) {
    console.error(error);
    return new Response(`Something went wrong: ${error}`, { status: 200 });
  } finally {
    await prisma.$disconnect();
  }
}

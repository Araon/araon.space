// Fetch comments for a post
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const postIdSlug = searchParams.get("postId");

    const comments = await prisma.comments.findMany({
      where: {
        postId: postIdSlug as string,
      },
    });

    return Response.json({ comments: comments });
  } catch (error) {
    console.error(error);
    return new Response("Something went wrong", { status: 200 });
  } finally {
    await prisma.$disconnect();
  }
}

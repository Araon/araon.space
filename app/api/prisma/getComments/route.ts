export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const postIdSlug = searchParams.get("postId");

    const comments = await prisma.comments.findMany({
      where: {
        postId: postIdSlug as string,
        // only fetch comments that has show_comments set to true
        show_comments: true,
      },
    });

    return Response.json({ comments: comments });
  } catch (error) {
    console.error(error);
    return new Response(`Something went wrong: ${error}`, { status: 200 });
  }
}

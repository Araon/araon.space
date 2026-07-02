export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const postIdSlug = searchParams.get("postId");

    if (!postIdSlug) {
      return NextResponse.json(
        { error: "Please provide a postId" },
        { status: 400 },
      );
    }

    const comments = await prisma.comments.findMany({
      where: {
        postId: postIdSlug,
        // only fetch comments that has show_comments set to true
        show_comments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

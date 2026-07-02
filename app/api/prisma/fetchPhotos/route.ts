import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const photos = await prisma.photos.findMany({
      select: {
        photo_id: false,
        photo_url: true,
        alt_text: true,
        is_published: true,
        color: true,
        views: true,
        height: true,
        width: true,
      },
    });

    return Response.json({ photos: photos });
  } catch (error) {
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }
}

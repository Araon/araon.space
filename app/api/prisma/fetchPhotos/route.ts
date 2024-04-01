import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
    return new Response("Something went wrong", { status: 200 });
  } finally {
    await prisma.$disconnect();
  }
}

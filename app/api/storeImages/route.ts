import { NextRequest } from "next/server";
import { createApi } from "unsplash-js";

import { prisma } from "@/lib/prisma";

const SYNC_SECRET = process.env.STORE_IMAGES_SECRET;

export const dynamic = "force-dynamic";

function isAuthorized(req: NextRequest) {
  if (!SYNC_SECRET) {
    console.error("STORE_IMAGES_SECRET is missing");
    return false;
  }

  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : req.nextUrl.searchParams.get("secret");

  return token === SYNC_SECRET;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!process.env.UNSPLASH_ACCESS_KEY) {
    console.error("UNSPLASH_ACCESS_KEY is missing");
    return new Response("Unsplash access key is missing", { status: 500 });
  }

  try {
    const unsplash = createApi({
      accessKey: process.env.UNSPLASH_ACCESS_KEY,
    });
    const username = "ara0n";
    const responseData = await unsplash.users.getPhotos({
      username,
      perPage: 100,
      stats: true,
    });

    const data = responseData.response;

    if (!data?.results) {
      return new Response("No results found", { status: 404 });
    }

    const photos = data?.results.map((photo: any) => ({
      photo_id: photo.id,
      photo_url: photo.urls.regular,
      alt_text: photo.alt_description || "",
      is_published: true,
      color: photo.color,
      views: photo.statistics?.views?.total || 0,
      height: photo.height,
      width: photo.width,
    }));

    // Update existing photos or create new ones
    for (const photo of photos) {
      await prisma.photos.upsert({
        where: { photo_id: photo.photo_id },
        update: { views: photo.views },
        create: photo,
      });
    }

    return new Response(
      JSON.stringify({ message: "Views updated successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// pages/api/unsplash-images.ts

import { createApi } from "unsplash-js";
import { PrismaClient } from "@prisma/client";

import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

// @ts-ignore
const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

export async function GET() {
  try {
    const username = "ara0n"; // Replace with your Unsplash username
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
  } finally {
    await prisma.$disconnect();
  }
}

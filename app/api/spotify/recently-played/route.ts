import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

import { getRecentlyPlayed } from "@/lib/spotify";

export const dynamic = "force-dynamic";

const getCachedRecentlyPlayed = unstable_cache(
  getRecentlyPlayed,
  ["spotify-recently-played"],
  { revalidate: 60 },
);

export async function GET() {
  try {
    const tracks = await getCachedRecentlyPlayed();
    return NextResponse.json(tracks);
  } catch (error) {
    console.error("Error fetching recently played:", error);
    return NextResponse.json(
      { error: "Failed to fetch recently played tracks" },
      { status: 500 },
    );
  }
}

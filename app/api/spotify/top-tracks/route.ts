import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

import { getTopTracks } from "@/lib/spotify";

export const dynamic = "force-dynamic";

const getCachedTopTracks = unstable_cache(
  getTopTracks,
  ["spotify-top-tracks"],
  { revalidate: 3600 },
);

export async function GET() {
  try {
    const tracks = await getCachedTopTracks();
    return NextResponse.json(tracks);
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    return NextResponse.json(
      { error: "Failed to fetch top tracks" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";

import { getTopTracks } from "@/lib/spotify";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tracks = await getTopTracks();
    return NextResponse.json(tracks, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    return NextResponse.json(
      { error: "Failed to fetch top tracks" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

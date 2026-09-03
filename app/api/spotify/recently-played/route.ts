import { NextResponse } from "next/server";

import { getRecentlyPlayed } from "@/lib/spotify";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tracks = await getRecentlyPlayed();
    return NextResponse.json(tracks, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error fetching recently played:", error);
    return NextResponse.json(
      { error: "Failed to fetch recently played tracks" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

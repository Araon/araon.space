const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const TOP_TRACKS_ENDPOINT = "https://api.spotify.com/v1/me/top/tracks";
const RECENTLY_PLAYED_ENDPOINT =
  "https://api.spotify.com/v1/me/player/recently-played";

type SpotifyArtist = {
  name: string;
};

type SpotifyTrack = {
  name: string;
  artists: SpotifyArtist[];
  external_urls: { spotify: string };
  album: { images: { url: string }[] };
};

type RecentlyPlayedItem = {
  track: SpotifyTrack;
  played_at: string;
};

export type Track = {
  title: string;
  artist: string;
  url: string;
  coverImage: string;
  playedAt?: string;
};

function getCredentials() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Spotify credentials are missing");
  }

  return { clientId, clientSecret, refreshToken };
}

async function getAccessToken(): Promise<string> {
  const { clientId, clientSecret, refreshToken } = getCredentials();
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });
  const data = await response.json();

  if (!response.ok || typeof data.access_token !== "string") {
    throw new Error("Failed to get Spotify access token");
  }

  return data.access_token;
}

async function getSpotifyItems<T>(endpoint: string): Promise<T[]> {
  const accessToken = await getAccessToken();
  const response = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  const data = await response.json();

  if (!response.ok || !Array.isArray(data.items)) {
    throw new Error(`Spotify returned status ${response.status}`);
  }

  return data.items;
}

function toTrack(track: SpotifyTrack): Track {
  return {
    title: track.name,
    artist: track.artists.map((artist) => artist.name).join(", "),
    url: track.external_urls.spotify,
    coverImage: track.album.images[0]?.url ?? "",
  };
}

export async function getTopTracks(): Promise<Track[]> {
  const items = await getSpotifyItems<SpotifyTrack>(TOP_TRACKS_ENDPOINT);

  return items.slice(0, 10).map(toTrack);
}

export async function getRecentlyPlayed(): Promise<Track[]> {
  const items = await getSpotifyItems<RecentlyPlayedItem>(
    RECENTLY_PLAYED_ENDPOINT,
  );

  return items.slice(0, 10).map((item) => ({
    ...toTrack(item.track),
    playedAt: item.played_at,
  }));
}

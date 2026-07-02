export async function GET() {
  if (!process.env.YOUTUBE_API_KEY) {
    return new Response("No YouTube API key found.", { status: 500 });
  }

  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UCCIFp-Se_xjfYc94H04oK7Q&key=${process.env.YOUTUBE_API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return new Response("Failed to fetch YouTube statistics", {
        status: response.status,
      });
    }

    const data = await response.json();
    const subscribers = data.items?.[0]?.statistics?.subscriberCount;

    if (!subscribers) {
      return new Response("YouTube statistics were not found", { status: 502 });
    }

    return Response.json({ subscribers });
  } catch (error) {
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }
}

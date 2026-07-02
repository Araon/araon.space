import { NextRequest } from "next/server";

const API_KEY = process.env.CONVERTKIT_API_KEY;
const FORM_ID = process.env.CONVERTKIT_FORM_ID;

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Endpoint
  // POST /v3/forms/#{form_id}/subscribe

  if (!API_KEY || !FORM_ID) {
    console.error("Error: API_KEY or FORM_ID is missing");
    return new Response("Error: API_KEY or FORM_ID is missing", {
      status: 500,
    });
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return new Response("Please provide a valid JSON body", {
      status: 400,
    });
  }

  const { email } = body as { email?: unknown };

  if (typeof email !== "string" || !email.includes("@")) {
    return new Response("Please provide a valid email address", {
      status: 400,
    });
  }

  const url = `https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        api_key: API_KEY,
        email: email,
      }),
    });

    if (!response.ok) {
      return new Response("Failed to subscribe email address", {
        status: response.status,
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }
}

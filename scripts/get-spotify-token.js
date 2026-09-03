const { mkdtemp, writeFile } = require("node:fs/promises");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");

require("dotenv").config({ path: ".env.local" });

const HOST = "127.0.0.1";
const PORT = 3001;
const REDIRECT_URI = `http://${HOST}:${PORT}/callback`;
const SCOPE = "user-read-recently-played user-top-read";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error("SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET are required.");
  process.exit(1);
}

function send(res, status, body, contentType = "text/plain; charset=utf-8") {
  res.writeHead(status, { "Content-Type": contentType });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url ?? "/", REDIRECT_URI);

  if (requestUrl.pathname === "/login") {
    const authorizeUrl = new URL("https://accounts.spotify.com/authorize");
    authorizeUrl.search = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      scope: SCOPE,
      redirect_uri: REDIRECT_URI,
    }).toString();

    res.writeHead(302, { Location: authorizeUrl.toString() });
    res.end();
    return;
  }

  if (requestUrl.pathname !== "/callback") {
    send(res, 404, "Not found");
    return;
  }

  const authorizationError = requestUrl.searchParams.get("error");
  const code = requestUrl.searchParams.get("code");

  if (authorizationError || !code) {
    send(res, 400, authorizationError || "Authorization code is missing");
    return;
  }

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });
    const data = await response.json();

    if (!response.ok || typeof data.refresh_token !== "string") {
      throw new Error(
        data.error_description || "Spotify token exchange failed",
      );
    }

    const tokenDirectory = await mkdtemp(
      path.join(os.tmpdir(), "araon-spotify-"),
    );
    const tokenPath = path.join(tokenDirectory, "refresh-token");
    await writeFile(tokenPath, data.refresh_token, { mode: 0o600 });

    send(
      res,
      200,
      `<h1>Spotify authorization succeeded</h1><p>The refresh token was written to:</p><pre>${tokenPath}</pre><p>The file is readable only by your user.</p>`,
      "text/html; charset=utf-8",
    );
  } catch (error) {
    console.error("Spotify authorization failed:", error.message);
    send(res, 502, "Spotify authorization failed");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Spotify authorization helper: http://${HOST}:${PORT}/login`);
  console.log(`Registered redirect URI: ${REDIRECT_URI}`);
});

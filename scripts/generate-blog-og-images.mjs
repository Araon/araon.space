import { ImageResponse } from "@vercel/og";
import fs from "node:fs/promises";
import path from "node:path";
import React from "react";

const rootDir = process.cwd();
const blogDir = path.join(rootDir, "content/blog");
const publicDir = path.join(rootDir, "public");
const outputDir = path.join(publicDir, "og/blog");
const fallbackImagePath = path.join(publicDir, "blog/awake/image.png");
const fontPath = path.join(publicDir, "fonts/google/space-grotesk-400.ttf");

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const force = process.argv.includes("--force");

function stripQuotes(value) {
  return value.replace(/^["']|["']$/g, "").trim();
}

function sanitizeOgText(value) {
  return value
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return {};
  }

  const fields = {};
  for (const line of match[1].split("\n")) {
    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!field) {
      continue;
    }

    fields[field[1]] = stripQuotes(field[2]);
  }

  return fields;
}

function getMimeType(data, filePath) {
  if (data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) {
    return "image/jpeg";
  }

  if (
    data[0] === 0x89 &&
    data[1] === 0x50 &&
    data[2] === 0x4e &&
    data[3] === 0x47
  ) {
    return "image/png";
  }

  if (
    data.subarray(0, 4).toString("ascii") === "RIFF" &&
    data.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }

  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") {
    return "image/jpeg";
  }

  if (ext === ".png") {
    return "image/png";
  }

  if (ext === ".webp") {
    return "image/webp";
  }

  throw new Error(`Unsupported image type for ${filePath}`);
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function findCoverImage(slug, image) {
  if (image?.startsWith("/")) {
    const imagePath = path.join(publicDir, image);
    if (await pathExists(imagePath)) {
      return imagePath;
    }
  }

  for (const ext of IMAGE_EXTENSIONS) {
    const imagePath = path.join(publicDir, "blog", slug, `image${ext}`);
    if (await pathExists(imagePath)) {
      return imagePath;
    }
  }

  return fallbackImagePath;
}

async function toDataUrl(filePath) {
  const data = await fs.readFile(filePath);
  return `data:${getMimeType(data, filePath)};base64,${data.toString("base64")}`;
}

function el(type, props, ...children) {
  return React.createElement(type, props, ...children);
}

function getAccent(slug) {
  const colors = ["#f4d35e", "#7bdff2", "#f07167", "#b8f2e6", "#f5b0cb"];
  const total = [...slug].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[total % colors.length];
}

async function renderOgImage({ title, summary, slug, coverDataUrl, fontData }) {
  const accent = getAccent(slug);

  const response = new ImageResponse(
    el(
      "div",
      {
        style: {
          display: "flex",
          width: "100%",
          height: "100%",
          position: "relative",
          background: "#0a0a0a",
          fontFamily: "Space Grotesk",
          overflow: "hidden",
        },
      },
      el("img", {
        src: coverDataUrl,
        style: {
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.42,
        },
      }),
      el("div", {
        style: {
          position: "absolute",
          inset: 0,
          display: "flex",
          background: "rgba(0,0,0,0.34)",
        },
      }),
      el("div", {
        style: {
          position: "absolute",
          top: 0,
          right: 0,
          display: "flex",
          width: 360,
          height: 630,
          background: accent,
          opacity: 0.72,
        },
      }),
      el("div", {
        style: {
          position: "absolute",
          top: 0,
          right: 0,
          display: "flex",
          width: 360,
          height: 630,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.16), rgba(0,0,0,0.46))",
        },
      }),
      el(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "68px 76px",
            color: "#fff",
          },
        },
        el(
          "div",
          {
            style: {
              display: "flex",
              fontSize: 24,
              color: "rgba(255,255,255,0.78)",
              marginBottom: 22,
            },
          },
          "araon.space",
        ),
        el(
          "div",
          {
            style: {
              display: "flex",
              maxWidth: 790,
              fontSize: title.length > 58 ? 54 : 66,
              lineHeight: 1.02,
              fontWeight: 700,
              letterSpacing: 0,
              marginBottom: 22,
            },
          },
          title,
        ),
        el(
          "div",
          {
            style: {
              display: "flex",
              maxWidth: 740,
              fontSize: 30,
              lineHeight: 1.22,
              color: "rgba(255,255,255,0.82)",
            },
          },
          summary,
        ),
      ),
      el(
        "div",
        {
          style: {
            position: "absolute",
            right: 58,
            bottom: 54,
            display: "flex",
            width: 190,
            height: 190,
            border: "2px solid rgba(0,0,0,0.42)",
            borderRadius: 999,
          },
        },
      ),
      el(
        "div",
        {
          style: {
            position: "absolute",
            right: 126,
            bottom: 122,
            display: "flex",
            width: 54,
            height: 54,
            background: "#0a0a0a",
            borderRadius: 999,
          },
        },
      ),
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Space Grotesk",
          data: fontData,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );

  return Buffer.from(await response.arrayBuffer());
}

await fs.mkdir(outputDir, { recursive: true });

const fontData = await fs.readFile(fontPath);
const files = (await fs.readdir(blogDir)).filter((file) => file.endsWith(".mdx"));

let generated = 0;
let skipped = 0;

for (const file of files) {
  const slug = path.basename(file, ".mdx");
  const outputPath = path.join(outputDir, `${slug}.png`);

  if (!force && (await pathExists(outputPath))) {
    skipped += 1;
    continue;
  }

  const content = await fs.readFile(path.join(blogDir, file), "utf8");
  const frontmatter = parseFrontmatter(content);

  if (!frontmatter.title || !frontmatter.summary) {
    throw new Error(`Missing title or summary in ${file}`);
  }

  const coverPath = await findCoverImage(slug, frontmatter.image);
  const coverDataUrl = await toDataUrl(coverPath);
  const image = await renderOgImage({
    title: sanitizeOgText(frontmatter.title),
    summary: sanitizeOgText(frontmatter.summary),
    slug,
    coverDataUrl,
    fontData,
  });

  await fs.writeFile(outputPath, image);
  generated += 1;
}

console.log(`Generated ${generated} blog OG images. Skipped ${skipped} existing images.`);

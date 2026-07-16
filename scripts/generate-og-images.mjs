import { ImageResponse } from "@vercel/og";
import fs from "node:fs/promises";
import path from "node:path";
import React from "react";

const rootDir = process.cwd();
const contentDir = path.join(rootDir, "content");
const publicDir = path.join(rootDir, "public");
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

function parseInlineList(value) {
  const match = value?.match(/^\[(.*)\]$/);
  if (!match) {
    return [];
  }

  return match[1]
    .split(",")
    .map((item) => stripQuotes(item.trim()))
    .filter(Boolean);
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

async function findCoverImage(section, slug, image) {
  if (image?.startsWith("/")) {
    const imagePath = path.join(publicDir, image);
    if (await pathExists(imagePath)) {
      return imagePath;
    }
  }

  for (const ext of IMAGE_EXTENSIONS) {
    const imagePath = path.join(publicDir, section.publicPath, slug, `image${ext}`);
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

function splitProjectTitle(title) {
  const words = title.toUpperCase().split(/\s+/);
  const lines = [];

  for (const word of words) {
    const current = lines[lines.length - 1];
    if (!current || `${current} ${word}`.length > 20) {
      lines.push(word);
    } else {
      lines[lines.length - 1] = `${current} ${word}`;
    }
  }

  if (lines.length > 2) {
    lines[1] = `${lines.slice(1).join(" ")}`;
  }

  return lines.slice(0, 2);
}

const tagColors = {
  "AI/ML": "#ffd84d",
  API: "#38bdf8",
  "Chrome Extension": "#4285f4",
  CUDA: "#76b900",
  Discord: "#5865f2",
  Docker: "#2496ed",
  FastAPI: "#009688",
  FFMPEG: "#007808",
  Flask: "#ffffff",
  JavaScript: "#f7df1e",
  "Machine Learning": "#ff6f00",
  MongoDB: "#47a248",
  Prisma: "#2d3748",
  PyTorch: "#ee4c2c",
  Python: "#3776ab",
  React: "#61dafb",
  Selenium: "#43b02a",
  Telegram: "#26a5e4",
  Trading: "#16a34a",
  "Transformers.js": "#ffcc4d",
  TypeScript: "#3178c6",
  WebScraping: "#f97316",
};

function getTagColor(tag) {
  return tagColors[tag] ?? "rgba(255,255,255,0.72)";
}

function getProjectAccent(slug, tags) {
  const tagAccent = tags.map((tag) => tagColors[tag]).find(Boolean);
  return tagAccent ?? getAccent(slug);
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

async function renderProjectOgImage({
  title,
  summary,
  slug,
  time,
  tags,
  coverDataUrl,
  fontData,
}) {
  const visibleTags = tags.slice(0, 5);
  const titleLines = splitProjectTitle(title);
  const longTitle = titleLines.length > 1;
  const accent = getProjectAccent(slug, tags);

  const response = new ImageResponse(
    el(
      "div",
      {
        style: {
          display: "flex",
          width: "100%",
          height: "100%",
          position: "relative",
          background: "#050505",
          fontFamily: "Space Grotesk",
          overflow: "hidden",
          color: "#f5f5f5",
          textTransform: "uppercase",
        },
      },
      el("div", {
        style: {
          position: "absolute",
          inset: 24,
          display: "flex",
          border: "1px solid rgba(255,255,255,0.78)",
        },
      }),
      el("div", {
        style: {
          position: "absolute",
          inset: 40,
          display: "flex",
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.04), inset 6px 0 0 ${accent}`,
        },
      }),
      el("div", {
        style: {
          position: "absolute",
          left: 72,
          top: 94,
          display: "flex",
          width: 138,
          height: 4,
          background: accent,
        },
      }),
      el("div", {
        style: {
          position: "absolute",
          left: 72,
          right: 72,
          top: 96,
          display: "flex",
          height: 1,
          background: "rgba(255,255,255,0.28)",
        },
      }),
      el(
        "div",
        {
          style: {
            position: "absolute",
            left: 72,
            top: 62,
            display: "flex",
            gap: 24,
            alignItems: "center",
            fontSize: 21,
            letterSpacing: "0.16em",
            color: "rgba(255,255,255,0.84)",
          },
        },
        el("span", null, "araon.space"),
        el("span", { style: { color: accent } }, "/"),
        el("span", null, "project"),
        time ? el("span", { style: { color: "rgba(255,255,255,0.42)" } }, time) : null,
      ),
      el(
        "div",
        {
          style: {
            position: "absolute",
            right: 72,
            top: 60,
            display: "flex",
            fontSize: 21,
            letterSpacing: "0.16em",
            color: "rgba(255,255,255,0.46)",
          },
        },
        "build artifact",
      ),
      el("img", {
        src: coverDataUrl,
        style: {
          position: "absolute",
          right: 72,
          top: 128,
          width: 270,
          height: 250,
          objectFit: "cover",
          opacity: 0.46,
          filter: "grayscale(1) contrast(1.08) brightness(1.28)",
        },
      }),
      el("div", {
        style: {
          position: "absolute",
          right: 72,
          top: 128,
          display: "flex",
          width: 270,
          height: 250,
          border: "1px solid rgba(255,255,255,0.32)",
          background:
            "linear-gradient(135deg, rgba(5,5,5,0.02), rgba(5,5,5,0.42))",
        },
      }),
      el("div", {
        style: {
          position: "absolute",
          right: 72,
          top: 404,
          display: "flex",
          width: 270,
          height: 8,
          background: accent,
        },
      }),
      el("div", {
        style: {
          position: "absolute",
          right: 72,
          top: 422,
          display: "flex",
          width: 270,
          height: 1,
          background: "rgba(255,255,255,0.32)",
        },
      }),
      el(
        "div",
        {
          style: {
            position: "absolute",
            left: 72,
            top: longTitle ? 132 : 142,
            display: "flex",
            flexDirection: "column",
            maxWidth: 650,
            fontSize: longTitle ? 64 : title.length > 14 ? 72 : 82,
            lineHeight: 0.96,
            fontWeight: 400,
            letterSpacing: "0.03em",
          },
        },
        ...titleLines.map((line) => el("span", { key: line }, line)),
      ),
      el(
        "div",
        {
          style: {
            position: "absolute",
            left: 76,
            top: longTitle ? 318 : 304,
            display: "flex",
            maxWidth: 620,
            fontSize: 25,
            lineHeight: 1.28,
            color: "rgba(255,255,255,0.78)",
            textTransform: "none",
          },
        },
        summary,
      ),
      el(
        "div",
        {
          style: {
            position: "absolute",
            left: 72,
            bottom: 74,
            display: "flex",
            gap: 0,
            flexWrap: "wrap",
            maxWidth: 880,
          },
        },
        ...visibleTags.map((tag) =>
          el(
            "div",
            {
              key: tag,
              style: {
                display: "flex",
                padding: "10px 15px",
                border: `1px solid ${getTagColor(tag)}`,
                borderLeft: "0",
                color: getTagColor(tag),
                background: "rgba(255,255,255,0.02)",
                fontSize: 18,
                letterSpacing: "0.1em",
              },
            },
            tag.toUpperCase(),
          ),
        ),
      ),
      el("div", {
        style: {
          position: "absolute",
          right: 90,
          bottom: 72,
          display: "flex",
          width: 118,
          height: 118,
          border: `1px solid ${accent}`,
          transform: "rotate(45deg)",
        },
      }),
      el("div", {
        style: {
          position: "absolute",
          right: 135,
          bottom: 117,
          display: "flex",
          width: 28,
          height: 28,
          background: accent,
        },
      }),
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

const sections = [
  {
    name: "blog",
    contentPath: "blog",
    publicPath: "blog",
    outputPath: "og/blog",
    summaryField: "summary",
    render: renderOgImage,
  },
  {
    name: "project",
    contentPath: "project",
    publicPath: "projects",
    outputPath: "og/projects",
    summaryField: "description",
    render: renderProjectOgImage,
  },
];

const fontData = await fs.readFile(fontPath);

let totalGenerated = 0;
let totalSkipped = 0;

for (const section of sections) {
  const sourceDir = path.join(contentDir, section.contentPath);
  const outputDir = path.join(publicDir, section.outputPath);
  const files = (await fs.readdir(sourceDir)).filter((file) => file.endsWith(".mdx"));
  let generated = 0;
  let skipped = 0;

  await fs.mkdir(outputDir, { recursive: true });

  for (const file of files) {
    const slug = path.basename(file, ".mdx");
    const outputPath = path.join(outputDir, `${slug}.png`);

    if (!force && (await pathExists(outputPath))) {
      skipped += 1;
      continue;
    }

    const content = await fs.readFile(path.join(sourceDir, file), "utf8");
    const frontmatter = parseFrontmatter(content);
    const summary = frontmatter[section.summaryField];
    const ogSummary =
      section.name === "blog" && frontmatter.hideSummary === "true" ? "" : summary;

    if (!frontmatter.title || !summary) {
      throw new Error(`Missing title or ${section.summaryField} in ${file}`);
    }

    const coverPath = await findCoverImage(section, slug, frontmatter.image);
    const coverDataUrl = await toDataUrl(coverPath);
    const image = await section.render({
      ...(section.name === "project"
        ? {
            time: frontmatter.time,
            tags: parseInlineList(frontmatter.tags),
          }
        : {}),
      title: sanitizeOgText(frontmatter.title),
      summary: sanitizeOgText(ogSummary),
      slug,
      coverDataUrl,
      fontData,
    });

    await fs.writeFile(outputPath, image);
    generated += 1;
  }

  totalGenerated += generated;
  totalSkipped += skipped;
  console.log(
    `Generated ${generated} ${section.name} OG images. Skipped ${skipped} existing images.`,
  );
}

console.log(`Generated ${totalGenerated} OG images. Skipped ${totalSkipped} existing images.`);

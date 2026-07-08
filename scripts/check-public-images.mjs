import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const MAX_BYTES = 1024 * 1024;
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }

    if (IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

function formatBytes(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
}

const files = await walk(PUBLIC_DIR);
const oversized = [];

for (const file of files) {
  const { size } = await stat(file);

  if (size > MAX_BYTES) {
    oversized.push({
      path: path.relative(process.cwd(), file),
      size,
    });
  }
}

if (oversized.length > 0) {
  console.error("Found public images larger than 1 MiB:");

  for (const image of oversized) {
    console.error(`- ${image.path} (${formatBytes(image.size)})`);
  }

  console.error("\nRun `npm run compress:images` before building.");
  process.exit(1);
}

console.log(`Image size check passed (${files.length} images checked).`);

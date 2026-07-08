import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const MAX_BYTES = 1024 * 1024;
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = "82";
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);

function hasSips() {
  return spawnSync("sips", ["--version"], { stdio: "ignore" }).status === 0;
}

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

function getDimensions(file) {
  const result = spawnSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", file], {
    encoding: "utf8",
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || `Unable to read dimensions for ${file}`);
  }

  const width = Number(result.stdout.match(/pixelWidth: (\d+)/)?.[1] ?? 0);
  const height = Number(result.stdout.match(/pixelHeight: (\d+)/)?.[1] ?? 0);

  return { width, height };
}

function formatBytes(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
}

if (!hasSips()) {
  console.error("`npm run compress:images` requires macOS `sips`.");
  console.error("Use any image editor to keep public images under 1 MiB.");
  process.exit(1);
}

const files = await walk(PUBLIC_DIR);
let changed = 0;

for (const file of files) {
  const before = await stat(file);
  const { width, height } = getDimensions(file);

  if (before.size <= MAX_BYTES && Math.max(width, height) <= MAX_DIMENSION) {
    continue;
  }

  const extension = path.extname(file).toLowerCase();
  const args = ["-Z", String(MAX_DIMENSION)];

  if (extension === ".jpg" || extension === ".jpeg") {
    args.push("-s", "format", "jpeg", "-s", "formatOptions", JPEG_QUALITY);
  }

  args.push(file, "--out", file);

  const result = spawnSync("sips", args, { encoding: "utf8" });

  if (result.status !== 0) {
    throw new Error(result.stderr || `Unable to compress ${file}`);
  }

  const after = await stat(file);
  changed += 1;

  console.log(
    `${path.relative(process.cwd(), file)}: ${width}x${height}, ${formatBytes(
      before.size,
    )} -> ${formatBytes(after.size)}`,
  );
}

if (changed === 0) {
  console.log("No public images needed compression.");
} else {
  console.log(`Compressed ${changed} public image${changed === 1 ? "" : "s"}.`);
}

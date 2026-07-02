# Image Optimization Workflows

This repository uses GitHub Actions to automatically compress and optimize images.

## Workflows

### 1. Compress Images (on PR)

**File**: `.github/workflows/compress-images.yml`

Automatically compresses images when they are added or modified in a pull request.

**Trigger**: Pull requests that modify image files (`.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`)

**What it does**:

- Compresses images using calibreapp/image-actions
- Creates a new PR with compressed images
- Posts compression results as a comment

**Quality Settings**:

- JPEG: 80% quality
- PNG: 80% quality
- WebP: 80% quality
- GIF: 80% quality

### 2. Batch Compress Images (manual/monthly)

**File**: `.github/workflows/batch-compress.yml`

One-time or scheduled batch compression of all images in the repository.

**Trigger**:

- Manual dispatch (run anytime from Actions tab)
- Monthly schedule (1st of every month)

**What it does**:

- Compresses all images in the `public/` directory
- Uses pngquant for PNGs (70-80% quality)
- Uses jpegoptim for JPEGs (85% of original size)
- Creates a PR with all compressed images

**To run manually**:

1. Go to Actions tab in GitHub
2. Select "Batch Compress Images"
3. Click "Run workflow"
4. Select branch (usually `main`)
5. Click "Run workflow"

### 3. Check Image Sizes (on PR)

**File**: `.github/workflows/image-size-check.yml`

Prevents large images (>1MB) from being merged without warning.

**Trigger**: Pull requests that modify image files

**What it does**:

- Checks all changed image files
- Fails the check if any image is >1MB
- Posts a comment with recommendations
- Suggests compression tools

## Manual Compression

If you need to compress images locally before committing:

### Using ImageMagick

```bash
# Compress PNG
convert input.png -quality 85 output.png

# Compress JPEG
convert input.jpg -quality 85 -strip output.jpg
```

### Using Squoosh (CLI)

```bash
npx @squoosh/cli --webp "input.png" -d output/
```

### Using imagemin

```bash
npx imagemin-cli "public/**/*.png" --out-dir="public" --plugin=pngquant
```

## Best Practices

1. **Always use WebP when possible** - Better compression than PNG/JPEG
2. **Convert GIFs to WebM/MP4** - 90% smaller file sizes for animations
3. **Use Next.js Image component** - Automatic optimization at build time
4. **Check file sizes before committing** - Aim for <500KB per image
5. **Use SVG for icons/logos** - Infinitely scalable, tiny file size

## Current Image Stats

- Total images: ~70+
- Total size: ~85MB
- Expected after compression: ~25-35MB (60-70% reduction)
- Largest image: 9.7MB → ~1-2MB after compression

## Troubleshooting

### Workflow fails to create PR

Make sure the GitHub token has proper permissions:

- Go to Settings → Actions → General
- Scroll to "Workflow permissions"
- Select "Read and write permissions"
- Check "Allow GitHub Actions to create and approve pull requests"

### Images not compressing

- calibreapp/image-actions only compresses if savings > 5%
- Very small images may not be compressed
- Already optimized images are skipped

### Batch compression takes too long

- The workflow compresses all images, which can take 5-10 minutes
- Consider running it during off-peak hours
- Cancel if not needed

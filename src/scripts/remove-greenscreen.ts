#!/usr/bin/env npx tsx
// ============================================
// Green Screen Removal for Chef Characters
// High-quality chroma key with:
// - HSL-based green detection
// - Soft edge feathering (no harsh cutoffs)
// - Green despill on edge pixels
// - Gaussian blur on alpha channel for smooth edges
// ============================================

import sharp from "sharp";
import { resolve } from "path";
import { existsSync, mkdirSync } from "fs";

const INPUT_DIR = "/Users/carlosdomingo/Downloads";
const OUTPUT_DIR = resolve(__dirname, "../../public/images/chefs");

const CHEF_MAP: Record<string, string> = {
  "Uses_this_character_2k_202602221418.jpeg": "max-flavour",
  "Uses_this_character_2k_202602221422.jpeg": "maximum-junk",
  "Uses_this_character_2k_202602221427 (1).jpeg": "speed-demon",
  "Uses_this_character_2k_202602221427.jpeg": "budget-king",
  "Uses_this_character_2k_202602221429.jpeg": "coach-bulk",
  "Uses_this_character_2k_202602221437.jpeg": "the-optimizer",
};

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [h * 360, s, l];
}

function greenness(r: number, g: number, b: number): number {
  // Returns 0-1 how "green screen" a pixel is
  const [h, s, l] = rgbToHsl(r, g, b);

  // Green screen hue range: ~80-160 degrees
  if (h < 70 || h > 170) return 0;
  if (s < 0.2) return 0;  // too desaturated
  if (l < 0.1 || l > 0.9) return 0;  // too dark or too bright

  // Core green: hue 90-150, high saturation
  const hueScore = h >= 90 && h <= 150
    ? 1.0
    : h < 90
      ? (h - 70) / 20   // ramp up from 70-90
      : (170 - h) / 20; // ramp down from 150-170

  const satScore = Math.min(1, (s - 0.2) / 0.3); // ramp from 0.2-0.5

  // Green dominance in RGB space
  const gDom = g > 0 ? Math.min(1, Math.max(0, (g - Math.max(r, b)) / g)) : 0;

  return Math.min(1, hueScore * satScore * (0.5 + gDom * 0.5));
}

async function removeGreenScreen(inputPath: string, outputPath: string) {
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const { width, height } = metadata;
  if (!width || !height) throw new Error("Could not read image dimensions");

  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = new Uint8Array(data);
  const ch = info.channels;
  const w = info.width;
  const h2 = info.height;

  // Pass 1: Compute greenness map and set alpha
  const alphaMap = new Float32Array(w * h2);

  for (let y = 0; y < h2; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * ch;
      const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
      const gn = greenness(r, g, b);

      // Strong threshold: if greenness > 0.5, fully transparent
      // Between 0.2-0.5: partial transparency (soft edge)
      let alpha: number;
      if (gn > 0.5) {
        alpha = 0;
      } else if (gn > 0.15) {
        alpha = 1 - ((gn - 0.15) / 0.35);  // smooth falloff
      } else {
        alpha = 1;
      }
      alphaMap[y * w + x] = alpha;
    }
  }

  // Pass 2: Erode the alpha slightly to eat into green fringe
  // Use a 3x3 minimum filter
  const erodedAlpha = new Float32Array(w * h2);
  for (let y = 0; y < h2; y++) {
    for (let x = 0; x < w; x++) {
      let minVal = alphaMap[y * w + x];
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const ny = y + dy, nx = x + dx;
          if (ny >= 0 && ny < h2 && nx >= 0 && nx < w) {
            minVal = Math.min(minVal, alphaMap[ny * w + nx]);
          }
        }
      }
      erodedAlpha[y * w + x] = minVal;
    }
  }

  // Pass 3: Blur the alpha for smooth edges (5x5 box blur)
  const blurredAlpha = new Float32Array(w * h2);
  const blurRadius = 2;
  for (let y = 0; y < h2; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0, count = 0;
      for (let dy = -blurRadius; dy <= blurRadius; dy++) {
        for (let dx = -blurRadius; dx <= blurRadius; dx++) {
          const ny = y + dy, nx = x + dx;
          if (ny >= 0 && ny < h2 && nx >= 0 && nx < w) {
            sum += erodedAlpha[ny * w + nx];
            count++;
          }
        }
      }
      blurredAlpha[y * w + x] = sum / count;
    }
  }

  // Pass 4: Apply alpha and despill green from edge pixels
  let removedCount = 0;
  for (let y = 0; y < h2; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * ch;
      const alpha = blurredAlpha[y * w + x];

      if (alpha < 0.01) {
        // Fully transparent
        pixels[idx + 3] = 0;
        removedCount++;
      } else {
        pixels[idx + 3] = Math.round(alpha * 255);

        // Despill: reduce green cast on semi-transparent edge pixels
        if (alpha < 0.95) {
          const r = pixels[idx], g = pixels[idx + 1], b = pixels[idx + 2];
          const avgRB = (r + b) / 2;
          if (g > avgRB) {
            // Suppress excess green, blend toward avg of r and b
            const spillAmount = Math.min(1, (1 - alpha) * 2); // stronger despill at lower alpha
            const newG = g - (g - avgRB) * spillAmount * 0.7;
            pixels[idx + 1] = Math.round(Math.max(0, Math.min(255, newG)));
          }
        }
      }
    }
  }

  const totalPixels = w * h2;
  console.log(`  Removed ${removedCount}/${totalPixels} pixels (${((removedCount / totalPixels) * 100).toFixed(1)}%)`);

  // Write high-quality PNG
  await sharp(Buffer.from(pixels), {
    raw: { width: w, height: h2, channels: ch as 4 },
  })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);
}

async function optimizeChef(inputPath: string, outputPath: string) {
  // Trim transparent edges, resize to 512px tall, palette optimize
  const trimmed = await sharp(inputPath).trim().toBuffer();
  const meta = await sharp(trimmed).metadata();
  console.log(`  Trimmed: ${meta.width}x${meta.height}`);

  await sharp(trimmed)
    .resize({ height: 512, fit: "inside" })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);

  const { default: fs } = await import("fs");
  const stats = fs.statSync(outputPath);
  const finalMeta = await sharp(outputPath).metadata();
  console.log(`  Final: ${finalMeta.width}x${finalMeta.height} (${(stats.size / 1024).toFixed(0)}KB)`);
}

async function main() {
  console.log("🎨 ForkIt Chef Green Screen Remover v2");
  console.log("=======================================");
  console.log("HSL detection + erode + blur + despill\n");

  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  for (const [filename, chefId] of Object.entries(CHEF_MAP)) {
    const inputPath = resolve(INPUT_DIR, filename);
    if (!existsSync(inputPath)) {
      console.log(`⏭️  Skipping ${chefId}: not found`);
      continue;
    }

    const tempPath = resolve(OUTPUT_DIR, `${chefId}-raw.png`);
    const finalPath = resolve(OUTPUT_DIR, `${chefId}.png`);

    console.log(`🔧 ${chefId}`);
    await removeGreenScreen(inputPath, tempPath);
    await optimizeChef(tempPath, finalPath);

    // Clean up temp
    const { unlinkSync } = await import("fs");
    unlinkSync(tempPath);
    console.log(`  ✅ Done\n`);
  }

  console.log("✅ All chef images processed!");
}

main().catch(console.error);

#!/usr/bin/env npx tsx
import sharp from "sharp";
import { resolve } from "path";
import { existsSync, unlinkSync } from "fs";

const CHEFS_DIR = resolve(__dirname, "../../public/images/chefs");
const TARGET_HEIGHT = 512;

const CHEFS = [
  "max-flavour",
  "maximum-junk",
  "speed-demon",
  "budget-king",
  "coach-bulk",
  "the-optimizer",
];

async function main() {
  console.log("🎨 Optimizing chef images...\n");

  // Remove old/unused files
  for (const toRemove of ["gut-fix.png", "extra.png"]) {
    const path = resolve(CHEFS_DIR, toRemove);
    if (existsSync(path)) {
      unlinkSync(path);
      console.log(`🗑️  Removed ${toRemove}`);
    }
  }

  for (const chef of CHEFS) {
    const inputPath = resolve(CHEFS_DIR, `${chef}.png`);
    if (!existsSync(inputPath)) {
      console.log(`⏭️  Skipping ${chef}: not found`);
      continue;
    }

    const meta = await sharp(inputPath).metadata();
    console.log(`\n🔧 ${chef}: ${meta.width}x${meta.height}`);

    // Resize to target height, maintain aspect ratio
    // Then trim transparent edges, then re-add small padding
    const trimmed = await sharp(inputPath)
      .trim()  // Remove transparent edges
      .toBuffer();

    const trimMeta = await sharp(trimmed).metadata();
    console.log(`   Trimmed: ${trimMeta.width}x${trimMeta.height}`);

    await sharp(trimmed)
      .resize({ height: TARGET_HEIGHT, fit: "inside" })
      .png({ compressionLevel: 9, palette: true })
      .toFile(resolve(CHEFS_DIR, `${chef}-optimized.png`));

    const optimizedMeta = await sharp(resolve(CHEFS_DIR, `${chef}-optimized.png`)).metadata();

    // Replace original with optimized
    unlinkSync(inputPath);
    const fs = await import("fs");
    fs.renameSync(
      resolve(CHEFS_DIR, `${chef}-optimized.png`),
      inputPath
    );

    const stats = fs.statSync(inputPath);
    console.log(`   Final: ${optimizedMeta.width}x${optimizedMeta.height} (${(stats.size / 1024).toFixed(0)}KB)`);
  }

  console.log("\n✅ All chef images optimized!");
}

main().catch(console.error);

#!/usr/bin/env node
/**
 * ForkIt Dish Image Generator — Google Flow Edition
 *
 * Automates Google Flow (labs.google) to generate dish images for each recipe.
 * Reuses Google session from the skimm project.
 *
 * Usage:
 *   node scripts/generate-dish-images.js                    # Generate all
 *   node scripts/generate-dish-images.js --force            # Regenerate existing
 *   node scripts/generate-dish-images.js --id r001          # Single recipe
 *   node scripts/generate-dish-images.js --start-from 10    # Skip first N
 *   node scripts/generate-dish-images.js --cooldown 30      # Seconds between gens (default 45)
 */

const { chromium } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

// ═══════════════════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════════════════

const FLOW_URL = "https://labs.google/fx/es-419/tools/flow/project/0fd7a4c6-0324-4beb-a458-b15ec9147dea";
const SESSION_DIR = path.join(__dirname, "..", ".playwright-flow-session");
const OUTPUT_DIR = path.join(__dirname, "..", "public", "images", "dishes");
const SEED_PATH = path.join(__dirname, "..", "src", "data", "seed-recipes.ts");

// ═══════════════════════════════════════════════════════════════════════════
// ART STYLE — Comic/cartoon food illustration matching ForkIt's aesthetic
// ═══════════════════════════════════════════════════════════════════════════

const STYLE_SUFFIX = `Illustrated as a vibrant cartoon food art poster. Bold black outlines, flat vivid colors, slightly exaggerated proportions. The dish is the hero — centered, larger than life, steam rising. Clean white or solid color background. Comic book pop art style with halftone dots. Overhead or 3/4 angle view. No text, no words, no letters, no UI, no plates or table setting — just the food floating dramatically.`;

// ═══════════════════════════════════════════════════════════════════════════
// LOAD RECIPES FROM SEED FILE
// ═══════════════════════════════════════════════════════════════════════════

function loadRecipes() {
  const content = fs.readFileSync(SEED_PATH, "utf-8");
  const match = content.match(/export const SEED_RECIPES: Recipe\[\] = (\[[\s\S]*\]);/);
  if (!match) {
    console.error("Could not parse seed-recipes.ts");
    process.exit(1);
  }
  const fn = new Function(`return ${match[1]}`);
  return fn();
}

// ═══════════════════════════════════════════════════════════════════════════
// PROMPT BUILDER — turns recipe data into an image generation prompt
// ═══════════════════════════════════════════════════════════════════════════

function buildPrompt(recipe) {
  // Extract top 4-5 key ingredients (skip boring ones)
  const boring = new Set(["salt", "pepper", "water", "oil", "olive oil", "cooking spray", "butter"]);
  const keyIngredients = recipe.ingredients
    .map(i => i.name)
    .filter(n => !boring.has(n.toLowerCase()))
    .slice(0, 5);

  const ingredientList = keyIngredients.join(", ");

  // Build a descriptive food scene
  const prompt = `A delicious ${recipe.name}: ${ingredientList}. ${recipe.snap || recipe.tagline}\n\n${STYLE_SUFFIX}`;
  return prompt;
}

// ═══════════════════════════════════════════════════════════════════════════
// BROWSER AUTOMATION (adapted from skimm project)
// ═══════════════════════════════════════════════════════════════════════════

const IMG_SELECTOR = 'img[src*="blob:"], img[src*="storage.googleapis"], img[src*="generativelanguage"], img[src*="lh3.googleusercontent.com/d/"]';

async function getAllImageSrcs(page) {
  return page.evaluate((sel) => {
    return Array.from(document.querySelectorAll(sel))
      .map(img => img.src)
      .filter(Boolean);
  }, IMG_SELECTOR);
}

async function downloadImage(page, src, outputPath) {
  const buffer = await page.evaluate(async (url) => {
    const resp = await fetch(url);
    const blob = await resp.blob();
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }, src);
  const base64 = buffer.split(",")[1];
  fs.writeFileSync(outputPath, Buffer.from(base64, "base64"));
}

async function generateImage(page, prompt, outputPath) {
  // Snapshot current images BEFORE generating
  const beforeSrcs = new Set(await getAllImageSrcs(page));

  // Wait for textarea to be ready, clear and type prompt
  await page.waitForSelector("#PINHOLE_TEXT_AREA_ELEMENT_ID", { timeout: 15000 });
  const textarea = page.locator("#PINHOLE_TEXT_AREA_ELEMENT_ID");
  await textarea.click();
  await textarea.fill("");
  await page.waitForTimeout(500);
  await textarea.fill(prompt);
  await page.waitForTimeout(800);

  // Click the "Crear" (Create) submit button — the arrow_forward one
  const crearBtn = page.locator('button:has-text("Crear")').last();
  await crearBtn.click();

  console.log("      Waiting for image...");

  try {
    let newSrc = null;
    const startTime = Date.now();
    const TIMEOUT = 120000;

    while (Date.now() - startTime < TIMEOUT) {
      await page.waitForTimeout(2000);
      const currentSrcs = await getAllImageSrcs(page);
      const fresh = currentSrcs.filter(s => !beforeSrcs.has(s));
      if (fresh.length > 0) {
        newSrc = fresh[fresh.length - 1];
        break;
      }
    }

    if (!newSrc) {
      console.log("      No new image after timeout");
      return false;
    }

    await page.waitForTimeout(2000);
    await downloadImage(page, newSrc, outputPath);
    return true;

  } catch (err) {
    console.log(`      Error: ${err.message}`);
    try {
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `.debug-error-${Date.now()}.png`),
        fullPage: false,
        timeout: 10000,
      });
    } catch (_) {}
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const idIdx = args.indexOf("--id");
  const onlyId = idIdx !== -1 ? args[idIdx + 1] : null;
  const startIdx = args.indexOf("--start-from");
  const startFrom = startIdx !== -1 ? parseInt(args[startIdx + 1], 10) : 0;
  const cdIdx = args.indexOf("--cooldown");
  const cooldown = cdIdx !== -1 ? parseInt(args[cdIdx + 1], 10) * 1000 : 15000;

  // Load recipes
  let recipes = loadRecipes();

  if (onlyId) {
    recipes = recipes.filter(r => r.id === onlyId);
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log("\nForkIt Dish Image Generator (Google Flow)");
  console.log("=".repeat(55));
  console.log(`Recipes:    ${recipes.length}`);
  console.log(`Start from: ${startFrom}`);
  console.log(`Force:      ${force}`);
  console.log(`Cooldown:   ${cooldown / 1000}s`);
  console.log(`Output:     ${OUTPUT_DIR}`);
  console.log("=".repeat(55));

  // Check if session exists, if not copy from skimm project
  const skimmSession = path.join(__dirname, "..", "..", "skimm", ".playwright-flow-session");
  if (!fs.existsSync(SESSION_DIR) && fs.existsSync(skimmSession)) {
    console.log("\nCopying Google session from skimm project...");
    fs.cpSync(skimmSession, SESSION_DIR, { recursive: true });
  }

  // Launch browser
  console.log("\nLaunching browser...");
  const context = await chromium.launchPersistentContext(SESSION_DIR, {
    headless: false,
    viewport: { width: 1280, height: 900 },
    args: ["--disable-blink-features=AutomationControlled"],
    locale: "es-419",
  });

  const page = context.pages()[0] || await context.newPage();
  await page.goto(FLOW_URL, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(8000);

  // Check login
  if (page.url().includes("accounts.google.com")) {
    console.log("\nLogin required. Sign in, then the script will continue...");
    await page.waitForURL("**/labs.google/**", { timeout: 180000 });
    await page.waitForTimeout(8000);
  }

  // Wait for the textarea to be ready
  await page.waitForSelector("#PINHOLE_TEXT_AREA_ELEMENT_ID", { timeout: 30000 });
  console.log("Flow loaded. Starting generation...\n");

  const results = { generated: 0, skipped: 0, errors: 0 };

  for (let i = 0; i < recipes.length; i++) {
    if (i < startFrom) continue;

    const recipe = recipes[i];
    const filename = `${recipe.id}.jpg`;
    const filepath = path.join(OUTPUT_DIR, filename);
    const progress = `[${i + 1}/${recipes.length}]`;

    if (fs.existsSync(filepath) && !force) {
      console.log(`${progress} ${recipe.id} "${recipe.name}" — exists, skipping`);
      results.skipped++;
      continue;
    }

    const prompt = buildPrompt(recipe);

    console.log(`\n${progress} ${recipe.id} "${recipe.name}"`);
    console.log(`      Prompt: ${prompt.substring(0, 120)}...`);

    try {
      const success = await generateImage(page, prompt, filepath);

      if (success) {
        const size = fs.statSync(filepath).size;
        console.log(`      Saved: ${filename} (${Math.round(size / 1024)} KB)`);
        results.generated++;
      } else {
        console.log(`      FAILED`);
        results.errors++;
      }
    } catch (loopErr) {
      console.log(`      CRASH: ${loopErr.message}`);
      results.errors++;
      try {
        await page.goto(FLOW_URL, { waitUntil: "commit", timeout: 30000 });
        await page.waitForTimeout(5000);
      } catch (_) {}
    }

    // Cooldown between generations
    if (i < recipes.length - 1) {
      console.log(`      Cooling down ${cooldown / 1000}s...`);
      try { await page.waitForTimeout(cooldown); } catch (_) { break; }
    }
  }

  // Summary
  console.log("\n" + "=".repeat(55));
  console.log("DONE");
  console.log("=".repeat(55));
  console.log(`Generated: ${results.generated}`);
  console.log(`Skipped:   ${results.skipped}`);
  console.log(`Errors:    ${results.errors}`);
  console.log(`Images at: ${OUTPUT_DIR}`);

  await context.close();
}

main().catch(err => {
  console.error("Fatal:", err.message);
  process.exit(1);
});

#!/usr/bin/env npx tsx
// ============================================
// Finalize Recipes
// Merges generated recipes with seed recipes,
// assigns sequential IDs, and outputs final data
// ============================================

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";
import type { Recipe } from "../lib/types";

const GENERATED_PATH = resolve(__dirname, "../data/generated-recipes.json");
const SEED_PATH = resolve(__dirname, "../data/seed-recipes.ts");
const OUTPUT_PATH = resolve(__dirname, "../data/seed-recipes.ts");

// ---- Load Seed Recipes ----

function loadSeedRecipes(): Recipe[] {
  // Dynamic import won't work for .ts files in a script context,
  // so we'll parse the TS file to extract the recipes
  const content = readFileSync(SEED_PATH, "utf-8");

  // Find the array content between SEED_RECIPES: Recipe[] = [ ... ];
  const match = content.match(/export const SEED_RECIPES: Recipe\[\] = (\[[\s\S]*\]);/);
  if (!match) {
    console.error("❌ Could not parse seed-recipes.ts");
    process.exit(1);
  }

  try {
    // Use Function constructor to evaluate the array (it's valid JS once extracted)
    const fn = new Function(`return ${match[1]}`);
    return fn() as Recipe[];
  } catch (e) {
    console.error("❌ Failed to evaluate seed recipes:", e);
    process.exit(1);
  }
}

// ---- Generate TypeScript Output ----

function recipeToTS(recipe: Recipe, indent: string = "  "): string {
  const i = indent;
  const ii = indent + "  ";
  const iii = indent + "    ";

  const ingredients = recipe.ingredients
    .map((ing) => `${iii}{ name: ${JSON.stringify(ing.name)}, amount: ${JSON.stringify(ing.amount)}, unit: ${JSON.stringify(ing.unit)} }`)
    .join(",\n");

  const steps = recipe.steps
    .map((step) => {
      const time = step.timeMinutes !== undefined ? `, timeMinutes: ${step.timeMinutes}` : "";
      return `${iii}{ number: ${step.number}, instruction: ${JSON.stringify(step.instruction)}${time} }`;
    })
    .join(",\n");

  const swaps = recipe.smartSwaps
    .map((swap) => {
      const note = swap.note ? `, note: ${JSON.stringify(swap.note)}` : "";
      return `${iii}{ original: ${JSON.stringify(swap.original)}, replacement: ${JSON.stringify(swap.replacement)}${note} }`;
    })
    .join(",\n");

  const debate = recipe.debate
    .map(
      (msg) =>
        `${iii}{ chefId: ${JSON.stringify(msg.chefId)}, text: ${JSON.stringify(msg.text)}, timestamp: ${msg.timestamp}, intensity: ${JSON.stringify(msg.intensity)} }`
    )
    .join(",\n");

  return `${i}{
${ii}id: ${JSON.stringify(recipe.id)},
${ii}name: ${JSON.stringify(recipe.name)},
${ii}tagline: ${JSON.stringify(recipe.tagline)},
${ii}debateSummary: ${JSON.stringify(recipe.debateSummary)},
${ii}winningChef: ${JSON.stringify(recipe.winningChef)},
${ii}ingredients: [
${ingredients},
${ii}],
${ii}steps: [
${steps},
${ii}],
${ii}stats: { prepMinutes: ${recipe.stats.prepMinutes}, cookMinutes: ${recipe.stats.cookMinutes}, totalMinutes: ${recipe.stats.totalMinutes}, servings: ${recipe.stats.servings}, difficulty: ${JSON.stringify(recipe.stats.difficulty)}, costTier: ${JSON.stringify(recipe.stats.costTier)} },
${ii}smartSwaps: [
${swaps},
${ii}],
${ii}snap: ${JSON.stringify(recipe.snap)},
${ii}debate: [
${debate},
${ii}],
${ii}createdAt: ${JSON.stringify(recipe.createdAt)},
${i}}`;
}

// ---- Main ----

async function main() {
  console.log("🍳 ForkIt Recipe Finalizer");
  console.log("=========================\n");

  // Load seed recipes
  const seedRecipes = loadSeedRecipes();
  console.log(`📂 Loaded ${seedRecipes.length} seed recipes (r001-r0${seedRecipes.length.toString().padStart(2, "0")})`);

  // Load generated recipes
  if (!existsSync(GENERATED_PATH)) {
    console.error(`❌ Generated recipes not found at ${GENERATED_PATH}`);
    console.error("   Run generate-recipes.ts first!");
    process.exit(1);
  }

  const generatedRecipes: Recipe[] = JSON.parse(readFileSync(GENERATED_PATH, "utf-8"));
  console.log(`📂 Loaded ${generatedRecipes.length} generated recipes`);

  // Assign sequential IDs to generated recipes starting after seed
  const startId = seedRecipes.length + 1;
  const now = new Date();

  const finalGenerated = generatedRecipes.map((recipe, index) => ({
    ...recipe,
    id: `r${String(startId + index).padStart(3, "0")}`,
    createdAt: new Date(now.getTime() + index * 60000).toISOString(),
  }));

  console.log(`\n🔢 Assigned IDs: r${String(startId).padStart(3, "0")} - r${String(startId + finalGenerated.length - 1).padStart(3, "0")}`);

  // Merge all recipes
  const allRecipes = [...seedRecipes, ...finalGenerated];
  console.log(`📦 Total recipes: ${allRecipes.length}`);

  // Generate output TypeScript file
  const tsContent = `import type { Recipe } from "@/lib/types";

export const SEED_RECIPES: Recipe[] = [
${allRecipes.map((r) => recipeToTS(r)).join(",\n")},
];
`;

  writeFileSync(OUTPUT_PATH, tsContent);
  console.log(`\n💾 Written to: ${OUTPUT_PATH}`);

  // Summary stats
  const winCounts: Record<string, number> = {};
  const diffCounts: Record<string, number> = {};
  const costCounts: Record<string, number> = {};

  allRecipes.forEach((r) => {
    winCounts[r.winningChef] = (winCounts[r.winningChef] || 0) + 1;
    diffCounts[r.stats.difficulty] = (diffCounts[r.stats.difficulty] || 0) + 1;
    costCounts[r.stats.costTier] = (costCounts[r.stats.costTier] || 0) + 1;
  });

  console.log("\n📊 Final Stats:");
  console.log(`   Total recipes: ${allRecipes.length}`);

  console.log("\n   Chef wins:");
  Object.entries(winCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([chef, count]) => {
      const pct = ((count / allRecipes.length) * 100).toFixed(1);
      console.log(`     ${chef}: ${count} (${pct}%)`);
    });

  console.log("\n   Difficulty:");
  Object.entries(diffCounts).forEach(([diff, count]) => {
    const pct = ((count / allRecipes.length) * 100).toFixed(1);
    console.log(`     ${diff}: ${count} (${pct}%)`);
  });

  console.log("\n   Cost:");
  Object.entries(costCounts).forEach(([cost, count]) => {
    const pct = ((count / allRecipes.length) * 100).toFixed(1);
    console.log(`     ${cost}: ${count} (${pct}%)`);
  });

  console.log("\n✅ Finalization complete!");
  console.log("📝 Next: run 'pnpm build' to verify, then spot-check recipes");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

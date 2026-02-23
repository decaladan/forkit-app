#!/usr/bin/env npx tsx
// ============================================
// Wacky Recipe Concept Generator
// Uses Claude to brainstorm 30 creative, unexpected recipe concepts
// Output: src/data/wacky-concepts.json
// ============================================

import Anthropic from "@anthropic-ai/sdk";
import { writeFileSync } from "fs";
import { resolve } from "path";
import type { ResearchCard } from "./types";
import { CHEF_PROFILES, CHEF_IDS } from "./types";

const OUTPUT_PATH = resolve(__dirname, "../data/wacky-concepts.json");
const TOTAL_CONCEPTS = 30;
const BATCH_SIZE = 10;

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("Missing ANTHROPIC_API_KEY environment variable");
    process.exit(1);
  }
  return new Anthropic({ apiKey });
}

const SYSTEM_PROMPT = `You are a wildly creative recipe inventor for ForkIt, a food app where 6 chef characters debate recipes.

The chefs:
${Object.entries(CHEF_PROFILES)
  .map(([id, p]) => `- ${p.name} (${id}): ${p.personality}`)
  .join("\n")}

Your job: invent UNEXPECTED recipe concepts that:
1. Are actually cookable with real ingredients and real techniques
2. Feature surprising ingredient combos that shouldn't work but DO
3. Are driven by a specific chef's personality
4. Would make someone say "wait, that actually sounds amazing"

Think: peanut butter ramen, miso caramel brownies, pickle-brined fried chicken, breakfast burrito with french fry filling, Korean BBQ nachos.

Rules:
- Must be REAL food (no joke recipes)
- Must be cookable by a home cook
- Focus on unexpected mashups, cultural fusions, or "why didn't I think of that" combos
- Each concept should feel like it belongs to one specific chef`;

async function generateBatch(
  client: Anthropic,
  batchNum: number,
  existingNames: string[]
): Promise<ResearchCard[]> {
  console.log(`\n🧪 Generating batch ${batchNum + 1}...`);

  const avoidList =
    existingNames.length > 0
      ? `\nDo NOT repeat or closely resemble these existing concepts:\n${existingNames.map((n) => `- ${n}`).join("\n")}`
      : "";

  const response = await client.messages.create({
    model: "claude-opus-4-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Generate ${BATCH_SIZE} wacky but ACTUALLY COOKABLE recipe concepts.${avoidList}

For each concept, think about:
- What unexpected combo makes this special?
- Which chef would champion this and why?
- Is this genuinely delicious despite sounding weird?
- Could a home cook actually make this?

Return a JSON array with these exact fields for each concept:
{
  "originalName": string (the creative ForkIt-style recipe name),
  "sourceDescription": string (why this concept is interesting/wild),
  "category": "wacky-invention",
  "keyIngredients": string[] (4-8 real ingredients),
  "coreTechnique": string (1-2 sentences on how to actually make it),
  "whatMakesItSpecial": string (the surprise factor),
  "suggestedTwists": string[] (2-3 ways different chefs would modify it),
  "suggestedWinner": string (one of: ${CHEF_IDS.join(", ")}),
  "difficulty": "easy" | "medium" | "adventurous",
  "estimatedCost": "$" | "$$" | "$$$",
  "estimatedMinutes": number
}

Return ONLY the JSON array. Make sure it's valid JSON.

Be WILD but REAL. Think food truck mashups, late-night kitchen experiments, "I tried this as a joke and it slapped" energy.`,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    console.error("   ❌ No text response");
    return [];
  }

  let jsonStr = textBlock.text.trim();
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  try {
    const concepts = JSON.parse(jsonStr) as Omit<ResearchCard, "id">[];
    console.log(`   ✅ Generated ${concepts.length} concepts`);
    return concepts.map((c, i) => ({
      ...c,
      id: `wc${String(batchNum * BATCH_SIZE + i + 1).padStart(3, "0")}`,
      category: "wacky-invention",
    }));
  } catch (e) {
    console.error("   ❌ Failed to parse JSON:", e);
    console.error(`   Raw (first 500): ${jsonStr.slice(0, 500)}`);
    return [];
  }
}

async function main() {
  console.log("🧪 ForkIt Wacky Concept Generator");
  console.log("==================================\n");

  const client = getClient();
  const allConcepts: ResearchCard[] = [];
  const batchCount = Math.ceil(TOTAL_CONCEPTS / BATCH_SIZE);

  for (let i = 0; i < batchCount; i++) {
    const existingNames = allConcepts.map((c) => c.originalName);
    const batch = await generateBatch(client, i, existingNames);
    allConcepts.push(...batch);

    // Save progress
    writeFileSync(OUTPUT_PATH, JSON.stringify(allConcepts, null, 2));
    console.log(`   💾 Saved: ${allConcepts.length} concepts total`);

    if (i < batchCount - 1) {
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  // Summary
  console.log("\n==================================");
  console.log("📊 Concept Generation Complete!");
  console.log(`   Total concepts: ${allConcepts.length}`);

  const byChef = allConcepts.reduce(
    (acc, c) => {
      acc[c.suggestedWinner] = (acc[c.suggestedWinner] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  console.log("\n   By suggested winner:");
  Object.entries(byChef).forEach(([chef, count]) => {
    console.log(`     ${chef}: ${count}`);
  });

  const byDiff = allConcepts.reduce(
    (acc, c) => {
      acc[c.difficulty] = (acc[c.difficulty] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  console.log("\n   By difficulty:");
  Object.entries(byDiff).forEach(([diff, count]) => {
    console.log(`     ${diff}: ${count}`);
  });

  console.log(`\n💾 Output: ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

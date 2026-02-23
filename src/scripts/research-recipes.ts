#!/usr/bin/env npx tsx
// ============================================
// Recipe Research System
// Uses Claude API with web search to find trending recipes
// Output: src/data/research-cards.json
// ============================================

import Anthropic from "@anthropic-ai/sdk";
import { writeFileSync, existsSync, readFileSync } from "fs";
import { resolve } from "path";
import type { ResearchCard, RecipeCategory } from "./types";
import { RECIPE_CATEGORIES, CHEF_IDS } from "./types";

const OUTPUT_PATH = resolve(__dirname, "../data/research-cards.json");
const RECIPES_PER_CATEGORY = 8;

// ---- Claude Client ----

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("Missing ANTHROPIC_API_KEY environment variable");
    process.exit(1);
  }
  return new Anthropic({ apiKey });
}

// ---- Category Search Prompts ----

const CATEGORY_PROMPTS: Record<RecipeCategory, string> = {
  "comfort-food": "most popular comfort food recipes 2024 2025, viral mac and cheese, best casseroles, hearty stews trending",
  "quick-meals": "fastest popular dinner recipes under 20 minutes 2024 2025, weeknight meals trending",
  "budget-meals": "best cheap dinner recipes under $5 2024 2025, budget cooking trending recipes",
  "high-protein": "high protein meal prep recipes trending 2024 2025, protein-packed dinners popular",
  "pasta": "most popular pasta recipes 2024 2025, viral pasta TikTok, best rated pasta dishes",
  "tacos-burritos": "best taco recipes trending 2024 2025, viral burrito bowl recipes, Mexican food popular",
  "breakfast": "most popular breakfast recipes 2024 2025, viral breakfast TikTok, best brunch recipes",
  "stir-fry": "best stir-fry recipes 2024 2025, popular Asian-inspired quick meals, wok recipes trending",
  "bowls": "best grain bowl buddha bowl recipes 2024 2025, poke bowl trending, healthy bowl recipes popular",
  "snacks-appetizers": "most popular snack recipes 2024 2025, viral appetizers TikTok, party food trending",
  "trending-viral": "most viral food recipes TikTok 2024 2025, trending recipes social media, food trends",
  "meal-prep": "best meal prep recipes 2024 2025, weekly meal prep trending, batch cooking popular recipes",
};

// ---- Research a Single Category ----

async function researchCategory(
  client: Anthropic,
  category: RecipeCategory,
  startId: number
): Promise<ResearchCard[]> {
  const searchQuery = CATEGORY_PROMPTS[category];

  console.log(`\n🔍 Researching: ${category}`);
  console.log(`   Search: "${searchQuery}"`);

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    tools: [
      {
        type: "web_search_20250305",
        name: "web_search",
        max_uses: 5,
      },
    ],
    messages: [
      {
        role: "user",
        content: `Search for: ${searchQuery}

Find ${RECIPES_PER_CATEGORY} real, popular recipes in the "${category}" category. For each recipe, provide:

1. The recipe name as it's known (e.g., "Marry Me Chicken", "Birria Tacos")
2. Why it's popular (viral status, ratings, view counts if available)
3. Key ingredients (4-8 main ingredients)
4. Core technique in 1-2 sentences
5. What makes it special (the hook that makes people love it)
6. 2-3 suggested ForkIt twists (how our chef characters could remix it)
7. Which ForkIt chef would most likely champion this: ${CHEF_IDS.join(", ")}
8. Difficulty: easy, medium, or adventurous
9. Estimated cost tier: $ (under $5), $$ ($5-15), $$$ ($15+)
10. Estimated total cook time in minutes

Return your findings as a JSON array. Each object should have these exact fields:
{
  "originalName": string,
  "sourceDescription": string,
  "category": "${category}",
  "keyIngredients": string[],
  "coreTechnique": string,
  "whatMakesItSpecial": string,
  "suggestedTwists": string[],
  "suggestedWinner": string (one of the chef IDs),
  "difficulty": "easy" | "medium" | "adventurous",
  "estimatedCost": "$" | "$$" | "$$$",
  "estimatedMinutes": number
}

Return ONLY the JSON array, no other text. Make sure it's valid JSON.`,
      },
    ],
  });

  // Extract text from response
  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    console.error(`   ❌ No text response for ${category}`);
    return [];
  }

  // Parse JSON from response (handle markdown code blocks)
  let jsonStr = textBlock.text.trim();
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  try {
    const recipes = JSON.parse(jsonStr) as Omit<ResearchCard, "id">[];
    const cards: ResearchCard[] = recipes.map((r, i) => ({
      ...r,
      id: `rc${String(startId + i).padStart(3, "0")}`,
      category,
    }));

    console.log(`   ✅ Found ${cards.length} recipes`);
    return cards;
  } catch (e) {
    console.error(`   ❌ Failed to parse JSON for ${category}:`, e);
    // Try to salvage partial results
    console.error(`   Raw response (first 500 chars): ${jsonStr.slice(0, 500)}`);
    return [];
  }
}

// ---- Main ----

async function main() {
  console.log("🍳 ForkIt Recipe Research System");
  console.log("================================\n");

  // Check for existing progress
  let existingCards: ResearchCard[] = [];
  let completedCategories: Set<string> = new Set();

  if (existsSync(OUTPUT_PATH)) {
    try {
      existingCards = JSON.parse(readFileSync(OUTPUT_PATH, "utf-8"));
      completedCategories = new Set(existingCards.map((c) => c.category));
      console.log(`📂 Found existing progress: ${existingCards.length} cards from ${completedCategories.size} categories`);
    } catch {
      console.log("📂 Existing file found but couldn't parse, starting fresh");
    }
  }

  const client = getClient();
  const allCards: ResearchCard[] = [...existingCards];
  let nextId = allCards.length + 1;

  // Process categories sequentially to respect rate limits
  const remainingCategories = RECIPE_CATEGORIES.filter(
    (c) => !completedCategories.has(c)
  );

  if (remainingCategories.length === 0) {
    console.log("\n✅ All categories already researched!");
    console.log(`   Total: ${allCards.length} research cards`);
    return;
  }

  console.log(`\n📋 Categories to research: ${remainingCategories.length}`);
  console.log(`   ${remainingCategories.join(", ")}\n`);

  for (const category of remainingCategories) {
    try {
      const cards = await researchCategory(client, category, nextId);
      allCards.push(...cards);
      nextId += cards.length;

      // Save progress after each category
      writeFileSync(OUTPUT_PATH, JSON.stringify(allCards, null, 2));
      console.log(`   💾 Saved progress: ${allCards.length} total cards`);

      // Small delay between categories to be nice to the API
      await new Promise((r) => setTimeout(r, 2000));
    } catch (error) {
      console.error(`   ❌ Error researching ${category}:`, error);
      console.log("   Saving progress and continuing...");
      writeFileSync(OUTPUT_PATH, JSON.stringify(allCards, null, 2));
    }
  }

  // Final summary
  console.log("\n================================");
  console.log("📊 Research Complete!");
  console.log(`   Total research cards: ${allCards.length}`);

  const byCat = allCards.reduce(
    (acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  console.log("\n   By category:");
  Object.entries(byCat).forEach(([cat, count]) => {
    console.log(`     ${cat}: ${count}`);
  });

  const byChef = allCards.reduce(
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

  console.log(`\n💾 Output: ${OUTPUT_PATH}`);
  console.log("📝 Next step: Review and curate the best 70 cards for recipe generation");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

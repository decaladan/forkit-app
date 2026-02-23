#!/usr/bin/env npx tsx
// ============================================
// Recipe Generation Pipeline
// Takes research cards + wacky concepts and generates full ForkIt recipes
// Output: src/data/generated-recipes.json
// ============================================

import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";
import type { ResearchCard, DebateArc } from "./types";
import { CHEF_PROFILES, CHEF_IDS, DEBATE_ARCS } from "./types";
import type { Recipe, ChefId } from "../lib/types";

// ---- Claude Client ----

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("Missing ANTHROPIC_API_KEY environment variable");
    process.exit(1);
  }
  return new Anthropic({ apiKey });
}

// ---- Paths ----

const RESEARCH_CARDS_PATH = resolve(__dirname, "../data/research-cards.json");
const WACKY_CONCEPTS_PATH = resolve(__dirname, "../data/wacky-concepts.json");
const OUTPUT_PATH = resolve(__dirname, "../data/generated-recipes.json");
const PROGRESS_PATH = resolve(__dirname, "../data/generation-progress.json");

// ---- Exemplar Recipes (2 hand-picked from seed) ----

const EXEMPLAR_RECIPES: Recipe[] = [
  {
    id: "example-1",
    name: "The Spice Tornado Stir-Fry",
    tagline: "Max Flavour turned a simple stir-fry into a flavour bomb.",
    debateSummary: "Max Flavour wanted heat. Speed Demon wanted speed. Together they created a 15-minute stir-fry with enough chili to wake the dead. Coach Bulk approved the 30g of protein per serving.",
    winningChef: "max-flavour",
    ingredients: [
      { name: "chicken thigh", amount: "300", unit: "g" },
      { name: "bell pepper", amount: "1", unit: "whole" },
      { name: "broccoli florets", amount: "1", unit: "cup" },
      { name: "soy sauce", amount: "3", unit: "tbsp" },
      { name: "sriracha", amount: "2", unit: "tbsp" },
      { name: "honey", amount: "1", unit: "tbsp" },
      { name: "garlic", amount: "3", unit: "cloves" },
      { name: "ginger", amount: "1", unit: "thumb" },
      { name: "rice", amount: "1", unit: "cup" },
    ],
    steps: [
      { number: 1, instruction: "Start rice. Slice chicken into thin strips.", timeMinutes: 2 },
      { number: 2, instruction: "Sear chicken in a screaming hot pan until charred edges form.", timeMinutes: 4 },
      { number: 3, instruction: "Add garlic, ginger, and veggies. Toss for 2 minutes.", timeMinutes: 2 },
      { number: 4, instruction: "Mix soy sauce, sriracha, and honey. Pour over everything.", timeMinutes: 1 },
      { number: 5, instruction: "Toss until sauce is sticky and glossy. Serve over rice.", timeMinutes: 2 },
    ],
    stats: { prepMinutes: 5, cookMinutes: 10, totalMinutes: 15, servings: 2, difficulty: "easy", costTier: "$" },
    nutrition: { calories: 485, protein: 32, carbs: 52, fat: 14, fiber: 4 },
    smartSwaps: [
      { original: "chicken thigh", replacement: "tofu, pressed and cubed", note: "Crisp it up in the hot pan first" },
      { original: "sriracha", replacement: "gochujang", note: "Deeper, more complex heat" },
      { original: "honey", replacement: "brown sugar", note: "Slightly different caramel notes" },
    ],
    snap: "Max Flavour doesn't do mild. This stir-fry has opinions and it's not afraid to share them.",
    debate: [
      { chefId: "max-flavour", text: "Stir-fry. But we're going FULL HEAT. Sriracha AND ginger.", timestamp: 2, intensity: "explosive" },
      { chefId: "coach-bulk", text: "300g chicken thigh is 30g protein per serving. That's a perfect meal. I'm in.", timestamp: 5, intensity: "calm" },
      { chefId: "speed-demon", text: "Stir-fry is literally designed for speed. 15 minutes max.", timestamp: 8, intensity: "heated" },
      { chefId: "budget-king", text: "Chicken thighs, not breast. Half the price, double the flavour.", timestamp: 11, intensity: "calm" },
      { chefId: "max-flavour", text: "Soy sauce, sriracha, honey. That's the holy trinity of stir-fry sauce.", timestamp: 14, intensity: "heated" },
      { chefId: "maximum-junk", text: "Can we at least put this over fried rice instead?", timestamp: 17, intensity: "calm" },
      { chefId: "speed-demon", text: "Plain rice. Faster. I'm not adding steps.", timestamp: 19, intensity: "heated" },
      { chefId: "max-flavour", text: "THREE cloves of garlic. Fresh ginger. Don't you DARE use powder.", timestamp: 22, intensity: "explosive" },
      { chefId: "the-optimizer", text: "Broccoli and bell pepper add vitamin C and fiber. Acceptable nutrient profile.", timestamp: 25, intensity: "calm" },
      { chefId: "max-flavour", text: "Charred edges on the chicken. That's where flavour LIVES.", timestamp: 28, intensity: "explosive" },
    ],
    createdAt: "2026-02-20T12:04:00Z",
  },
  {
    id: "example-2",
    name: "Chaos Quesadilla Supreme",
    tagline: "Every chef threw something in. Nobody expected it to work this well.",
    debateSummary: "Maximum Junk started with cheese. Max Flavour added chipotle. The Optimizer demanded black beans for fiber. Speed Demon demanded one pan only. Budget King clapped when it cost $3.",
    winningChef: "maximum-junk",
    ingredients: [
      { name: "flour tortillas", amount: "2", unit: "large" },
      { name: "shredded cheese blend", amount: "150", unit: "g" },
      { name: "black beans", amount: "0.5", unit: "can" },
      { name: "chipotle in adobo", amount: "1", unit: "tbsp" },
      { name: "corn kernels", amount: "0.5", unit: "cup" },
      { name: "sour cream", amount: "2", unit: "tbsp" },
      { name: "lime", amount: "1", unit: "whole" },
    ],
    steps: [
      { number: 1, instruction: "Mash black beans with chipotle. Spread on one tortilla.", timeMinutes: 2 },
      { number: 2, instruction: "Layer cheese and corn on top. Cover with second tortilla.", timeMinutes: 1 },
      { number: 3, instruction: "Cook in a dry pan over medium heat until golden and crispy.", timeMinutes: 3 },
      { number: 4, instruction: "Flip carefully. Cook until other side is golden and cheese melts.", timeMinutes: 3 },
      { number: 5, instruction: "Cut into wedges. Serve with sour cream and lime.", timeMinutes: 0 },
    ],
    stats: { prepMinutes: 3, cookMinutes: 6, totalMinutes: 9, servings: 1, difficulty: "easy", costTier: "$" },
    nutrition: { calories: 892, protein: 40, carbs: 78, fat: 46, fiber: 14 },
    smartSwaps: [
      { original: "chipotle in adobo", replacement: "hot sauce + smoked paprika", note: "Less smoky but still delivers" },
      { original: "corn", replacement: "diced bell pepper", note: "Adds crunch and color" },
    ],
    snap: "When six chefs agree on a quesadilla, you know it's good. This one has no weaknesses.",
    debate: [
      { chefId: "maximum-junk", text: "Quesadilla. Maximum cheese. Both sides. Let's GO.", timestamp: 2, intensity: "explosive" },
      { chefId: "max-flavour", text: "Chipotle in adobo. Smoky heat inside the cheese. Trust me.", timestamp: 5, intensity: "heated" },
      { chefId: "the-optimizer", text: "Black beans: 7g fiber, 8g protein per half can. This needs a nutrient anchor.", timestamp: 8, intensity: "calm" },
      { chefId: "speed-demon", text: "One pan. No oven. 9 minutes total. That's the deal.", timestamp: 11, intensity: "heated" },
      { chefId: "budget-king", text: "Tortillas, beans, cheese. We're at $3. Everyone can afford this.", timestamp: 14, intensity: "calm" },
      { chefId: "maximum-junk", text: "Add corn for little pops of sweetness in the cheese. ELEVATED.", timestamp: 17, intensity: "heated" },
      { chefId: "max-flavour", text: "Did you just say 'elevated'? We don't use that word here.", timestamp: 19, intensity: "calm" },
      { chefId: "maximum-junk", text: "Fine. EXTRA. This quesadilla is EXTRA. Happy?", timestamp: 22, intensity: "explosive" },
      { chefId: "speed-demon", text: "Dry pan. No oil needed. The tortilla crisps in its own glory.", timestamp: 25, intensity: "calm" },
      { chefId: "coach-bulk", text: "Add some shredded chicken and you've got 35g protein. Just saying.", timestamp: 28, intensity: "calm" },
    ],
    createdAt: "2026-02-20T12:07:00Z",
  },
];

// ---- Diversity Tracker ----

interface DiversityState {
  chefWins: Record<string, number>;
  categoryCounts: Record<string, number>;
  difficultyCounts: Record<string, number>;
  costCounts: Record<string, number>;
  primaryIngredients: Record<string, number>;
  debateArcIndex: number;
}

function createDiversityState(): DiversityState {
  return {
    chefWins: Object.fromEntries(CHEF_IDS.map((id) => [id, 0])),
    categoryCounts: {},
    difficultyCounts: { easy: 0, medium: 0, adventurous: 0 },
    costCounts: { $: 0, $$: 0, $$$: 0 },
    primaryIngredients: {},
    debateArcIndex: 0,
  };
}

function getTargetChef(state: DiversityState, suggested: string): string {
  // Find chefs with fewest wins
  const entries = Object.entries(state.chefWins);
  entries.sort((a, b) => a[1] - b[1]);
  const minWins = entries[0][1];
  const underrepresented = entries.filter(([, count]) => count <= minWins + 2);

  // Prefer the suggested chef if they're underrepresented
  if (underrepresented.some(([id]) => id === suggested)) {
    return suggested;
  }
  // Otherwise pick the most underrepresented
  return underrepresented[0][0];
}

function getTargetDifficulty(state: DiversityState, total: number): string {
  // Target: 60% easy, 30% medium, 10% adventurous
  const easyTarget = Math.round(total * 0.6);
  const medTarget = Math.round(total * 0.3);

  if (state.difficultyCounts.easy < easyTarget) return "easy";
  if (state.difficultyCounts.medium < medTarget) return "medium";
  return "adventurous";
}

function getTargetCost(state: DiversityState, total: number): string {
  // Target: 50% $, 35% $$, 15% $$$
  const cheapTarget = Math.round(total * 0.5);
  const midTarget = Math.round(total * 0.35);

  if (state.costCounts["$"] < cheapTarget) return "$";
  if (state.costCounts["$$"] < midTarget) return "$$";
  return "$$$";
}

function getNextDebateArc(state: DiversityState): DebateArc {
  const arc = DEBATE_ARCS[state.debateArcIndex % DEBATE_ARCS.length];
  state.debateArcIndex++;
  return arc;
}

// ---- Validation ----

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function validateRecipe(recipe: Recipe): ValidationResult {
  const errors: string[] = [];

  // Schema checks
  if (!recipe.name || recipe.name.length > 60) errors.push(`Name too long or missing: "${recipe.name}"`);
  if (!recipe.tagline || recipe.tagline.length > 100) errors.push(`Tagline too long or missing`);
  if (!recipe.snap || recipe.snap.length > 150) errors.push(`Snap too long or missing`);
  if (!recipe.debateSummary) errors.push("Missing debateSummary");
  if (!CHEF_IDS.includes(recipe.winningChef as typeof CHEF_IDS[number])) errors.push(`Invalid winningChef: ${recipe.winningChef}`);

  // Ingredients check
  if (!recipe.ingredients || recipe.ingredients.length < 4 || recipe.ingredients.length > 12) {
    errors.push(`Ingredient count out of range: ${recipe.ingredients?.length ?? 0} (need 4-12)`);
  }
  recipe.ingredients?.forEach((ing, i) => {
    if (!ing.name || !ing.amount || !ing.unit) errors.push(`Ingredient ${i} missing fields`);
  });

  // Steps check
  if (!recipe.steps || recipe.steps.length < 3 || recipe.steps.length > 8) {
    errors.push(`Step count out of range: ${recipe.steps?.length ?? 0} (need 3-8)`);
  }
  recipe.steps?.forEach((step, i) => {
    if (step.number !== i + 1) errors.push(`Step ${i} has wrong number: ${step.number}`);
    if (!step.instruction) errors.push(`Step ${i} missing instruction`);
  });

  // Stats check
  if (recipe.stats) {
    const { prepMinutes, cookMinutes, totalMinutes } = recipe.stats;
    if (prepMinutes + cookMinutes !== totalMinutes) {
      errors.push(`Time math: ${prepMinutes} + ${cookMinutes} != ${totalMinutes}`);
    }
    if (!["easy", "medium", "adventurous"].includes(recipe.stats.difficulty)) {
      errors.push(`Invalid difficulty: ${recipe.stats.difficulty}`);
    }
    if (!["$", "$$", "$$$"].includes(recipe.stats.costTier)) {
      errors.push(`Invalid costTier: ${recipe.stats.costTier}`);
    }
  } else {
    errors.push("Missing stats");
  }

  // Debate check
  if (!recipe.debate || recipe.debate.length !== 10) {
    errors.push(`Debate must have exactly 10 messages, got ${recipe.debate?.length ?? 0}`);
  } else {
    // Check ascending timestamps
    for (let i = 1; i < recipe.debate.length; i++) {
      if (recipe.debate[i].timestamp <= recipe.debate[i - 1].timestamp) {
        errors.push(`Debate timestamps not ascending at index ${i}`);
        break;
      }
    }

    // Check at least 4 unique chefs
    const uniqueChefs = new Set(recipe.debate.map((m) => m.chefId));
    if (uniqueChefs.size < 4) {
      errors.push(`Only ${uniqueChefs.size} unique chefs in debate (need 4+)`);
    }

    // Check winning chef speaks 2-4 times
    const winnerCount = recipe.debate.filter((m) => m.chefId === recipe.winningChef).length;
    if (winnerCount < 2 || winnerCount > 4) {
      errors.push(`Winning chef speaks ${winnerCount} times (need 2-4)`);
    }

    // Check valid chef IDs
    recipe.debate.forEach((m, i) => {
      if (!CHEF_IDS.includes(m.chefId as typeof CHEF_IDS[number])) {
        errors.push(`Debate message ${i} has invalid chefId: ${m.chefId}`);
      }
      if (!["calm", "heated", "explosive"].includes(m.intensity)) {
        errors.push(`Debate message ${i} has invalid intensity: ${m.intensity}`);
      }
    });
  }

  // Smart swaps check
  if (!recipe.smartSwaps || recipe.smartSwaps.length < 2 || recipe.smartSwaps.length > 4) {
    errors.push(`Smart swaps count: ${recipe.smartSwaps?.length ?? 0} (need 2-4)`);
  }

  return { valid: errors.length === 0, errors };
}

// ---- System Prompt ----

function buildSystemPrompt(): string {
  const chefGuides = Object.entries(CHEF_PROFILES)
    .map(
      ([id, p]) => `### ${p.name} (${id}) ${p.emoji}
Personality: ${p.personality}
Voice: ${p.voice}
DOES say: ${p.doesSay.map((s) => `"${s}"`).join(", ")}
NEVER says: ${p.neverSays.map((s) => `"${s}"`).join(", ")}`
    )
    .join("\n\n");

  return `You are the ForkIt Recipe Engine. You generate complete recipe JSON objects for the ForkIt cooking app.

## The 6 ForkIt Chefs

${chefGuides}

## Recipe Quality Rules

1. **Name**: Creative, fun, under 60 characters. Think "The Spice Tornado Stir-Fry" not "Chicken Stir-Fry"
2. **Tagline**: One punchy sentence under 100 characters
3. **Debate**: Exactly 10 messages, 4+ unique chefs, winning chef speaks 2-4 times, timestamps ascending (2-29)
4. **Ingredients**: 6-9 items, real ingredients with amounts and units
5. **Steps**: 4-6 clear steps with timeMinutes. Step times should roughly add up to total cook time
6. **Stats**: prepMinutes + cookMinutes = totalMinutes. Realistic times.
7. **Smart Swaps**: 2-3 ingredient swaps that reference actual ingredients in the recipe
8. **Snap**: Fun summary under 150 chars, sounds like a social media caption
9. **Debate Summary**: 2-3 sentences capturing the debate arc

## Debate Writing Guide

- Each chef MUST sound distinct (use their vocabulary, sentence patterns)
- The winning chef's argument should be convincing
- Include tension/disagreement — this is a DEBATE, not a conversation
- At least 2 messages should be "explosive" intensity
- Timestamps range from 2 to 29, roughly 2-3 seconds apart
- The debate should tell a STORY: disagreement → compromise → resolution

## JSON Schema

\`\`\`typescript
{
  id: string,           // will be assigned later, use ""
  name: string,         // under 60 chars
  tagline: string,      // under 100 chars
  debateSummary: string, // 2-3 sentences
  winningChef: ChefId,
  ingredients: Array<{ name: string, amount: string, unit: string }>,
  steps: Array<{ number: number, instruction: string, timeMinutes: number }>,
  stats: {
    prepMinutes: number,
    cookMinutes: number,
    totalMinutes: number,  // must equal prep + cook
    servings: number,
    difficulty: "easy" | "medium" | "adventurous",
    costTier: "$" | "$$" | "$$$"
  },
  smartSwaps: Array<{ original: string, replacement: string, note: string }>,
  snap: string,          // under 150 chars
  debate: Array<{
    chefId: ChefId,
    text: string,
    timestamp: number,   // 2-29, ascending
    intensity: "calm" | "heated" | "explosive"
  }>,
  createdAt: string      // ISO date, use ""
}
\`\`\`

## Exemplar Recipes

Here are 2 examples of well-crafted ForkIt recipes:

${JSON.stringify(EXEMPLAR_RECIPES, null, 2)}`;
}

// ---- Generate Single Recipe ----

async function generateRecipe(
  client: Anthropic,
  card: ResearchCard,
  constraints: {
    targetChef: string;
    targetDifficulty: string;
    targetCost: string;
    debateArc: DebateArc;
    isWacky: boolean;
  }
): Promise<Recipe | null> {
  const typeLabel = constraints.isWacky ? "WACKY INVENTION" : "TRENDING RECIPE";
  const inspiration = constraints.isWacky
    ? `This is a WACKY INVENTION concept. Invent something unexpected that actually works. Lean into the weird factor.`
    : `This is based on a REAL trending recipe. Give it the ForkIt treatment — a creative twist, a heated debate, a killer name.`;

  const userPrompt = `## Research Card (${typeLabel})

**Original Name**: ${card.originalName}
**Source**: ${card.sourceDescription}
**Category**: ${card.category}
**Key Ingredients**: ${card.keyIngredients.join(", ")}
**Core Technique**: ${card.coreTechnique}
**What Makes It Special**: ${card.whatMakesItSpecial}
**Suggested Twists**: ${card.suggestedTwists.join("; ")}

## Instructions

${inspiration}

## Constraints for This Recipe

- **Winning Chef**: \`${constraints.targetChef}\` (this chef's argument should be most compelling)
- **Target Difficulty**: ${constraints.targetDifficulty}
- **Target Cost Tier**: ${constraints.targetCost}
- **Debate Arc Style**: "${constraints.debateArc}" — ${getArcDescription(constraints.debateArc)}

Generate a complete ForkIt recipe JSON object. Return ONLY the JSON object (no markdown, no explanation).
Make sure:
- prepMinutes + cookMinutes = totalMinutes
- Exactly 10 debate messages with ascending timestamps (2-29)
- 4+ unique chefs in the debate
- Winning chef speaks 2-4 times
- 6-9 ingredients, 4-6 steps, 2-3 smart swaps
- Each chef sounds like THEMSELVES (use their specific vocabulary)`;

  const response = await client.messages.create({
    model: "claude-opus-4-20250514",
    max_tokens: 4096,
    system: buildSystemPrompt(),
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") return null;

  let jsonStr = textBlock.text.trim();
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) jsonStr = jsonMatch[1].trim();

  try {
    return JSON.parse(jsonStr) as Recipe;
  } catch {
    console.error("   ❌ JSON parse failed");
    return null;
  }
}

function getArcDescription(arc: DebateArc): string {
  const descriptions: Record<DebateArc, string> = {
    hijack: "One chef takes over another's recipe idea and makes it their own",
    alliance: "Two chefs team up against the others, their combined vision wins",
    underdog: "An unlikely chef wins — everyone expected someone else to dominate",
    chaos: "Everyone throws in ideas, the result is a beautiful collision",
    unanimous: "Rare moment where all chefs actually agree (mostly)",
    "grudging-respect": "Critics end up reluctantly admitting the recipe is good",
    "speed-run": "Speed Demon forces a strict time constraint that shapes everything",
  };
  return descriptions[arc];
}

// ---- Retry with Fix Instructions ----

async function retryRecipe(
  client: Anthropic,
  original: Recipe,
  errors: string[]
): Promise<Recipe | null> {
  console.log("   🔄 Retrying with fix instructions...");

  const response = await client.messages.create({
    model: "claude-opus-4-20250514",
    max_tokens: 4096,
    system: buildSystemPrompt(),
    messages: [
      {
        role: "user",
        content: `This recipe had validation errors. Fix them and return the corrected JSON.

## Original Recipe
${JSON.stringify(original, null, 2)}

## Errors to Fix
${errors.map((e) => `- ${e}`).join("\n")}

Return ONLY the corrected JSON object. No explanation.`,
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") return null;

  let jsonStr = textBlock.text.trim();
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) jsonStr = jsonMatch[1].trim();

  try {
    return JSON.parse(jsonStr) as Recipe;
  } catch {
    return null;
  }
}

// ---- Main ----

async function main() {
  console.log("🍳 ForkIt Recipe Generation Pipeline");
  console.log("=====================================\n");

  // Load research cards
  if (!existsSync(RESEARCH_CARDS_PATH)) {
    console.error(`❌ Research cards not found at ${RESEARCH_CARDS_PATH}`);
    console.error("   Run research-recipes.ts first!");
    process.exit(1);
  }

  const researchCards: ResearchCard[] = JSON.parse(readFileSync(RESEARCH_CARDS_PATH, "utf-8"));
  console.log(`📂 Loaded ${researchCards.length} research cards`);

  // Load wacky concepts
  let wackyConcepts: ResearchCard[] = [];
  if (existsSync(WACKY_CONCEPTS_PATH)) {
    wackyConcepts = JSON.parse(readFileSync(WACKY_CONCEPTS_PATH, "utf-8"));
    console.log(`📂 Loaded ${wackyConcepts.length} wacky concepts`);
  } else {
    console.log("⚠️ No wacky concepts found, proceeding with research cards only");
  }

  // Combine all cards (research first, then wacky)
  const allCards = [...researchCards, ...wackyConcepts];
  console.log(`📋 Total cards to process: ${allCards.length}\n`);

  // Load progress if exists
  let generatedRecipes: Recipe[] = [];
  let processedIds: Set<string> = new Set();

  if (existsSync(PROGRESS_PATH)) {
    try {
      const progress = JSON.parse(readFileSync(PROGRESS_PATH, "utf-8"));
      generatedRecipes = progress.recipes || [];
      processedIds = new Set(progress.processedCardIds || []);
      console.log(`📂 Resuming: ${generatedRecipes.length} recipes already generated`);
    } catch {
      console.log("📂 Progress file exists but couldn't parse, starting fresh");
    }
  }

  const client = getClient();
  const diversity = createDiversityState();

  // Rebuild diversity state from existing recipes
  generatedRecipes.forEach((r) => {
    diversity.chefWins[r.winningChef] = (diversity.chefWins[r.winningChef] || 0) + 1;
    diversity.difficultyCounts[r.stats.difficulty] = (diversity.difficultyCounts[r.stats.difficulty] || 0) + 1;
    diversity.costCounts[r.stats.costTier] = (diversity.costCounts[r.stats.costTier] || 0) + 1;
  });

  // Process remaining cards
  const remainingCards = allCards.filter((c) => !processedIds.has(c.id));
  console.log(`📋 Remaining cards to process: ${remainingCards.length}\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < remainingCards.length; i++) {
    const card = remainingCards[i];
    const isWacky = card.category === "wacky-invention";
    const total = allCards.length;

    console.log(`\n[${i + 1}/${remainingCards.length}] ${isWacky ? "🧪" : "📖"} ${card.originalName}`);

    // Determine diversity constraints
    const targetChef = getTargetChef(diversity, card.suggestedWinner);
    const targetDifficulty = getTargetDifficulty(diversity, total);
    const targetCost = getTargetCost(diversity, total);
    const debateArc = getNextDebateArc(diversity);

    console.log(`   Chef: ${targetChef} | Difficulty: ${targetDifficulty} | Cost: ${targetCost} | Arc: ${debateArc}`);

    // Generate
    let recipe = await generateRecipe(client, card, {
      targetChef,
      targetDifficulty,
      targetCost,
      debateArc,
      isWacky,
    });

    if (!recipe) {
      console.error("   ❌ Generation failed (no response)");
      failCount++;
      processedIds.add(card.id);
      continue;
    }

    // Validate
    let validation = validateRecipe(recipe);

    if (!validation.valid) {
      console.log(`   ⚠️ Validation failed: ${validation.errors.length} errors`);
      validation.errors.forEach((e) => console.log(`     - ${e}`));

      // Retry once
      const fixed = await retryRecipe(client, recipe, validation.errors);
      if (fixed) {
        recipe = fixed;
        validation = validateRecipe(recipe);
      }
    }

    if (validation.valid) {
      console.log(`   ✅ Valid! "${recipe.name}"`);
      generatedRecipes.push(recipe);
      successCount++;

      // Update diversity state
      diversity.chefWins[recipe.winningChef] = (diversity.chefWins[recipe.winningChef] || 0) + 1;
      diversity.difficultyCounts[recipe.stats.difficulty] = (diversity.difficultyCounts[recipe.stats.difficulty] || 0) + 1;
      diversity.costCounts[recipe.stats.costTier] = (diversity.costCounts[recipe.stats.costTier] || 0) + 1;

      // Track primary ingredient
      if (recipe.ingredients[0]) {
        const primary = recipe.ingredients[0].name.toLowerCase();
        diversity.primaryIngredients[primary] = (diversity.primaryIngredients[primary] || 0) + 1;
      }
    } else {
      console.error(`   ❌ Still invalid after retry:`);
      validation.errors.forEach((e) => console.error(`     - ${e}`));
      failCount++;
    }

    processedIds.add(card.id);

    // Save progress every 5 recipes
    if ((i + 1) % 5 === 0) {
      const progress = {
        recipes: generatedRecipes,
        processedCardIds: Array.from(processedIds),
      };
      writeFileSync(PROGRESS_PATH, JSON.stringify(progress, null, 2));
      console.log(`\n   💾 Progress saved: ${generatedRecipes.length} recipes`);
    }

    // Delay between API calls
    await new Promise((r) => setTimeout(r, 1500));
  }

  // Final save
  writeFileSync(OUTPUT_PATH, JSON.stringify(generatedRecipes, null, 2));
  const progress = {
    recipes: generatedRecipes,
    processedCardIds: Array.from(processedIds),
  };
  writeFileSync(PROGRESS_PATH, JSON.stringify(progress, null, 2));

  // Summary
  console.log("\n=====================================");
  console.log("📊 Generation Complete!");
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   Total recipes: ${generatedRecipes.length}`);

  console.log("\n   Chef wins:");
  Object.entries(diversity.chefWins)
    .sort((a, b) => b[1] - a[1])
    .forEach(([chef, count]) => console.log(`     ${chef}: ${count}`));

  console.log("\n   Difficulty distribution:");
  Object.entries(diversity.difficultyCounts).forEach(([diff, count]) =>
    console.log(`     ${diff}: ${count}`)
  );

  console.log("\n   Cost distribution:");
  Object.entries(diversity.costCounts).forEach(([cost, count]) =>
    console.log(`     ${cost}: ${count}`)
  );

  console.log(`\n💾 Output: ${OUTPUT_PATH}`);
  console.log("📝 Next step: Run finalize-recipes.ts to merge with seed data");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

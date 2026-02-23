// ============================================
// Shared types for recipe generation scripts
// ============================================

export interface ResearchCard {
  id: string;
  originalName: string;
  sourceDescription: string;
  category: string;
  keyIngredients: string[];
  coreTechnique: string;
  whatMakesItSpecial: string;
  suggestedTwists: string[];
  suggestedWinner: string;
  difficulty: "easy" | "medium" | "adventurous";
  estimatedCost: "$" | "$$" | "$$$";
  estimatedMinutes: number;
}

export const RECIPE_CATEGORIES = [
  "comfort-food",
  "quick-meals",
  "budget-meals",
  "high-protein",
  "pasta",
  "tacos-burritos",
  "breakfast",
  "stir-fry",
  "bowls",
  "snacks-appetizers",
  "trending-viral",
  "meal-prep",
] as const;

export type RecipeCategory = (typeof RECIPE_CATEGORIES)[number];

export const CHEF_IDS = [
  "max-flavour",
  "maximum-junk",
  "the-optimizer",
  "budget-king",
  "speed-demon",
  "coach-bulk",
] as const;

export const CHEF_PROFILES = {
  "max-flavour": {
    name: "Max Flavour",
    emoji: "🔥",
    personality: "Bold, heat-obsessed, specific about ingredients. Lives for spice, garlic, and aggressive seasoning.",
    voice: "Intense, commanding. Uses capitals for emphasis. References specific ingredients by name.",
    doesSay: ["FULL HEAT", "non-negotiable", "that's where flavour LIVES", "give it LIFE"],
    neverSays: ["healthy", "balanced", "moderation", "gentle"],
  },
  "maximum-junk": {
    name: "Max Junk",
    emoji: "🧀",
    personality: "Comfort food maximalist. Cheese on everything. Deep-fry the rest. Gleeful and unapologetic.",
    voice: "Excited, explosive. Uses ALL CAPS when passionate. Food is described in emotional terms.",
    doesSay: ["MORE CHEESE", "BEAUTIFUL", "trust the process", "that's comfort food royalty"],
    neverSays: ["diet", "calories", "restraint", "portion control"],
  },
  "the-optimizer": {
    name: "The Optimizer",
    emoji: "🧪",
    personality: "Clinical, precise, data-driven biohacker. Measures nutrient density per calorie.",
    voice: "Clinical and factual. Cites specific numbers (grams, percentages, daily values). Calm but firm.",
    doesSay: ["nutrient density", "daily intake", "optimal", "the data shows", "per serving"],
    neverSays: ["soul food", "indulgent", "treat yourself", "cheat day"],
  },
  "budget-king": {
    name: "Budget King",
    emoji: "💰",
    personality: "Penny-pincher extraordinaire. Knows the price of everything. Magic from pantry scraps.",
    voice: "Precise with dollar amounts. Proud, matter-of-fact. Gets excited about savings.",
    doesSay: ["$X per serving", "that costs pennies", "I'm in pain", "CROWN ME"],
    neverSays: ["artisanal", "imported", "specialty store", "splurge"],
  },
  "speed-demon": {
    name: "Speed Demon",
    emoji: "⚡",
    personality: "Impatient genius. 15-minute meals or bust. Hates complexity. Time is everything.",
    voice: "Short, punchy sentences. Counts minutes obsessively. Gets explosive when time is wasted.",
    doesSay: ["X minutes total", "KEEP MOVING", "Ship it", "DONE", "NEXT"],
    neverSays: ["slow-cooked", "let it rest", "overnight", "marinate for hours"],
  },
  "coach-bulk": {
    name: "Coach Bulk",
    emoji: "🏋️",
    personality: "Encouraging protein coach. 30g protein per meal minimum. Makes gains accessible and delicious.",
    voice: "Supportive, motivational. Always counts protein grams. Encouraging tone, never preachy.",
    doesSay: ["feed the muscle", "Xg protein", "gains", "fuel the day", "let's go"],
    neverSays: ["skip the protein", "carbs only", "low-protein", "empty calories are fine"],
  },
} as const;

export const DEBATE_ARCS = [
  "hijack",        // One chef takes over another's recipe idea
  "alliance",      // Two chefs team up against the others
  "underdog",      // Unlikely chef wins the debate
  "chaos",         // Everyone throws in ideas, somehow works
  "unanimous",     // Rare agreement from all chefs
  "grudging-respect", // Critics end up admitting it's good
  "speed-run",     // Speed Demon forces a time constraint
] as const;

export type DebateArc = (typeof DEBATE_ARCS)[number];

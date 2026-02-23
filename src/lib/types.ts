// ============================================
// ForkIt — Domain Types
// ============================================

export type ChefId = "max-flavour" | "maximum-junk" | "the-optimizer" | "budget-king" | "speed-demon" | "coach-bulk";

export type Difficulty = "easy" | "medium" | "adventurous";
export type CostTier = "$" | "$$" | "$$$";

export interface Chef {
  id: ChefId;
  name: string;
  emoji: string;
  color: string;
  image: string;
  personality: string;
  catchphrase: string;
}

export interface DebateMessage {
  chefId: ChefId;
  text: string;
  /** Seconds from debate start (0-30) */
  timestamp: number;
  intensity: "calm" | "heated" | "explosive";
}

export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export interface RecipeStep {
  number: number;
  instruction: string;
  timeMinutes?: number;
}

export interface SmartSwap {
  original: string;
  replacement: string;
  note?: string;
}

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface RecipeStats {
  prepMinutes: number;
  cookMinutes: number;
  totalMinutes: number;
  servings: number;
  difficulty: Difficulty;
  costTier: CostTier;
}

export interface Recipe {
  id: string;
  name: string;
  tagline: string;
  debateSummary: string;
  winningChef: ChefId;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  stats: RecipeStats;
  nutrition: Nutrition;
  smartSwaps: SmartSwap[];
  snap: string;
  photoUrl?: string;
  debate: DebateMessage[];
  createdAt: string;
}

export interface RecipeHistoryItem {
  recipeId: string;
  viewedAt: string;
  madeIt: boolean;
  saved: boolean;
}

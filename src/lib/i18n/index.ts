import { useForkItStore } from "@/lib/store";
import type { Recipe, Chef, CostTier } from "@/lib/types";
import type { Lang, UIStrings, RecipeTranslation, ChefTranslation } from "./types";
import { en } from "./ui-en";
import { es } from "./ui-es";

// Re-export types for convenience
export type { Lang, UIStrings, RecipeTranslation, ChefTranslation } from "./types";

// ------------------------------------
// Currency conversion for Spanish locale
// ------------------------------------

/** Convert "$X.YY" patterns to "X,YY €" (European format) */
function dollarsToEuros(text: string): string;
function dollarsToEuros(text: string | undefined): string | undefined;
function dollarsToEuros(text: string | undefined): string | undefined {
  if (!text) return text;
  return text.replace(/\$(\d+(?:\.\d{1,2})?)/g, (_match, amount: string) => {
    return amount.replace('.', ',') + ' €';
  });
}

/** Display CostTier with locale-appropriate currency symbol */
export function formatCostTier(tier: CostTier, lang: Lang): string {
  if (lang === "en") return tier;
  return tier.replace(/\$/g, '€');
}

// ------------------------------------
// UI string dictionaries
// ------------------------------------
const UI_STRINGS: Record<Lang, UIStrings> = { en, es };

// ------------------------------------
// Lazy-loaded content translations
// ------------------------------------
let recipesEs: Record<string, RecipeTranslation> | null = null;
let chefsEs: Record<string, ChefTranslation> | null = null;

async function loadRecipesEs() {
  if (!recipesEs) {
    const mod = await import("@/data/i18n/recipes-es");
    recipesEs = mod.recipesEs;
  }
  return recipesEs;
}

async function loadChefsEs() {
  if (!chefsEs) {
    const mod = await import("@/data/i18n/chefs-es");
    chefsEs = mod.chefsEs;
  }
  return chefsEs;
}

// Eagerly load Spanish translations when module first imports
// so they're ready by the time user switches language
if (typeof window !== "undefined") {
  loadRecipesEs();
  loadChefsEs();
  detectGeoLanguage();
}

/** Auto-detect language from IP on first visit (no saved preference yet) */
function detectGeoLanguage() {
  try {
    // Check if user has an existing persisted store (= returning user)
    const stored = localStorage.getItem("forkit-store");
    if (stored) {
      const parsed = JSON.parse(stored);
      // If language was already persisted, user made a choice — don't override
      if (parsed?.state?.language) return;
    }
  } catch {
    // No stored preference — this is a first visit
  }

  fetch("/api/geo")
    .then((r) => r.json())
    .then((data) => {
      if (data.lang === "es") {
        // Dynamic import to avoid circular dependency
        import("@/lib/store").then(({ useForkItStore }) => {
          useForkItStore.getState().setLanguage("es");
        });
      }
    })
    .catch(() => {});
}


// ------------------------------------
// Hooks
// ------------------------------------

/** Returns the current language from the store */
export function useLang(): Lang {
  return useForkItStore((s) => s.language);
}

/** Returns the typed UI string dictionary for the current language */
export function useT(): UIStrings {
  const lang = useForkItStore((s) => s.language);
  return UI_STRINGS[lang];
}

// ------------------------------------
// Content localization (synchronous)
// Falls back to English if translation not found
// ------------------------------------

/** Merge Spanish translation overlay onto an English recipe */
export function getLocalizedRecipe(recipe: Recipe, lang: Lang): Recipe {
  if (lang === "en" || !recipesEs) return recipe;

  const tr = recipesEs[recipe.id];
  if (!tr) return recipe;

  return {
    ...recipe,
    name: dollarsToEuros(tr.name),
    tagline: dollarsToEuros(tr.tagline),
    debateSummary: dollarsToEuros(tr.debateSummary),
    snap: dollarsToEuros(tr.snap),
    ingredients: recipe.ingredients.map((ing, i) => ({
      ...ing,
      name: tr.ingredients[i]?.name ?? ing.name,
    })),
    steps: recipe.steps.map((step, i) => ({
      ...step,
      instruction: tr.steps[i]?.instruction ?? step.instruction,
    })),
    smartSwaps: recipe.smartSwaps.map((swap, i) => ({
      ...swap,
      original: tr.smartSwaps[i]?.original ?? swap.original,
      replacement: tr.smartSwaps[i]?.replacement ?? swap.replacement,
      note: dollarsToEuros(tr.smartSwaps[i]?.note ?? swap.note),
    })),
    debate: recipe.debate.map((msg, i) => ({
      ...msg,
      text: dollarsToEuros(tr.debate[i]?.text ?? msg.text),
    })),
  };
}

/** Merge Spanish translation overlay onto an English chef */
export function getLocalizedChef(chef: Chef, lang: Lang): Chef {
  if (lang === "en" || !chefsEs) return chef;

  const tr = chefsEs[chef.id];
  if (!tr) return chef;

  return {
    ...chef,
    personality: dollarsToEuros(tr.personality),
    catchphrase: dollarsToEuros(tr.catchphrase),
  };
}

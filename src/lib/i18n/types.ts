// ============================================
// ForkIt — i18n Types
// ============================================

export type Lang = "en" | "es";

export interface UIStrings {
  // Navigation
  nav: {
    home: string;
    history: string;
    settings: string;
  };

  // Home page
  home: {
    subtitle: string;
    buttonLabel: string;
    tagline: string;
  };

  // History page
  history: {
    title: string;
    subtitle: string;
    recipeCount: (n: number) => string;
    emptyTitle: string;
    emptySubtitle: string;
    emptyCta: string;
    cal: string;
  };

  // Recipe detail / RecipeCard
  recipe: {
    back: string;
    won: string;
    whatHappened: string;
    debatedThis: string;
    theSnap: string;
    makeThis: string;
    toastCooking: string;
    toastSaved: string;
    toastRemoved: string;
    toastLinkCopied: string;
    notFoundTitle: string;
    notFoundDesc: string;
    goHome: string;
  };

  // Recipe Reveal
  reveal: {
    wins: string;
    seeFullRecipe: string;
    tryAnother: string;
  };

  // Debate
  debate: {
    councilDebating: string;
    winner: string;
    inventing: string;
    explosive: string;
    heated: string;
  };

  // Ingredients
  ingredients: {
    title: string;
    ready: (checked: number, total: number) => string;
  };

  // Steps
  steps: {
    title: string;
    stepCount: (n: number) => string;
    min: string;
  };

  // Smart Swaps
  swaps: {
    title: string;
  };

  // Recipe Stats
  stats: {
    prep: string;
    cook: string;
    total: string;
    serving: string;
    servings: string;
    level: string;
    cost: string;
    easy: string;
    medium: string;
    adventurous: string;
    perServing: string;
    cal: string;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
  };

  // Settings
  settings: {
    title: string;
    guest: string;
    noAccount: string;
    freeTier: string;
    preferences: string;
    dailyInventions: string;
    freeTierLimit: string;
    perDay: string;
    darkMode: string;
    alwaysOn: string;
    language: string;
    switchLanguage: string;
    goPro: string;
    comingSoon: string;
    unlimitedInventions: string;
    proDescription: string;
    oneTime: string;
    proPrice: string;
    chefPreferences: string;
    active: string;
    about: string;
    version: string;
    build: string;
    madeWith: string;
  };
}

/** Fields of a Recipe that get translated */
export interface RecipeTranslation {
  name: string;
  tagline: string;
  debateSummary: string;
  snap: string;
  ingredients: { name: string }[];
  steps: { instruction: string }[];
  smartSwaps: { original: string; replacement: string; note?: string }[];
  debate: { text: string }[];
}

/** Fields of a Chef that get translated */
export interface ChefTranslation {
  personality: string;
  catchphrase: string;
}

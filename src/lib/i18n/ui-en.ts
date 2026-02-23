import type { UIStrings } from "./types";

export const en: UIStrings = {
  nav: {
    home: "Home",
    history: "History",
    settings: "Settings",
  },

  home: {
    subtitle: "AI CHEFS, WACKY DISHES.",
    buttonLabel: "FORK IT!",
    tagline: "Smash the button. Watch 6 AI chefs fight. Get dinner.",
  },

  history: {
    title: "Your Inventions",
    subtitle: "Every recipe the council ever created for you",
    recipeCount: (n) => `${n} recipe${n !== 1 ? "s" : ""}`,
    emptyTitle: "No inventions yet",
    emptySubtitle: "Tap the button to summon the council",
    emptyCta: "Let\u2019s Fork It",
    cal: "cal",
  },

  recipe: {
    back: "Back",
    won: "won",
    whatHappened: "What happened",
    debatedThis: "debated this",
    theSnap: "The Snap",
    makeThis: "Make This",
    toastCooking: "Let\u2019s cook! \uD83D\uDD25",
    toastSaved: "Saved!",
    toastRemoved: "Removed from saved",
    toastLinkCopied: "Link copied!",
    notFoundTitle: "Recipe not found",
    notFoundDesc: "This recipe doesn\u2019t exist or has been removed.",
    goHome: "Go Home",
  },

  reveal: {
    wins: "wins",
    seeFullRecipe: "See Full Recipe",
    tryAnother: "Try Another",
  },

  debate: {
    councilDebating: "The council is debating...",
    winner: "WINNER",
    inventing: "Inventing:",
    explosive: "EXPLOSIVE",
    heated: "HEATED",
  },

  ingredients: {
    title: "Ingredients",
    ready: (checked, total) => `${checked}/${total} ready`,
  },

  steps: {
    title: "Steps",
    stepCount: (n) => `${n} step${n !== 1 ? "s" : ""}`,
    min: "min",
  },

  swaps: {
    title: "Missing something?",
  },

  stats: {
    prep: "Prep",
    cook: "Cook",
    total: "Total",
    serving: "Serving",
    servings: "Servings",
    level: "Level",
    cost: "Cost",
    easy: "Easy",
    medium: "Medium",
    adventurous: "Adventurous",
    perServing: "Per serving",
    cal: "Cal",
    protein: "Protein",
    carbs: "Carbs",
    fat: "Fat",
    fiber: "Fiber",
  },

  settings: {
    title: "Settings",
    guest: "Guest",
    noAccount: "No account yet",
    freeTier: "Free tier",
    preferences: "Preferences",
    dailyInventions: "Daily inventions",
    freeTierLimit: "Free tier limit",
    perDay: "/ day",
    darkMode: "Dark mode",
    alwaysOn: "Always on",
    language: "Language",
    switchLanguage: "App language",
    goPro: "Go Pro",
    comingSoon: "Coming soon",
    unlimitedInventions: "Unlimited inventions",
    proDescription:
      "No daily limits. Priority AI generation. Exclusive chef personalities.",
    oneTime: "one-time",
    proPrice: "$4.99",
    chefPreferences: "Chef Preferences",
    active: "Active",
    about: "About",
    version: "Version",
    build: "Build",
    madeWith: "Made with chaos by the council",
  },
};

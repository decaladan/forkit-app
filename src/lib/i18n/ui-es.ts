import type { UIStrings } from "./types";

export const es: UIStrings = {
  nav: {
    home: "Inicio",
    history: "Historial",
    settings: "Ajustes",
  },

  home: {
    subtitle: "CHEFS IA, PLATOS LOCOS.",
    buttonLabel: "\u00A1FORK IT!",
    tagline: "Pulsa el bot\u00F3n. Mira a 5 chefs IA pelear. Consigue tu cena.",
  },

  history: {
    title: "Tus Invenciones",
    subtitle: "Cada receta que el consejo ha creado para ti",
    recipeCount: (n) => `${n} receta${n !== 1 ? "s" : ""}`,
    emptyTitle: "A\u00FAn no hay invenciones",
    emptySubtitle: "Pulsa el bot\u00F3n para convocar al consejo",
    emptyCta: "\u00A1A cocinar!",
    cal: "cal",
  },

  recipe: {
    back: "Volver",
    won: "gan\u00F3",
    whatHappened: "Qu\u00E9 pas\u00F3",
    debatedThis: "debatieron esto",
    theSnap: "El Remate",
    makeThis: "Preparar",
    toastCooking: "\u00A1A cocinar! \uD83D\uDD25",
    toastSaved: "\u00A1Guardada!",
    toastRemoved: "Eliminada de guardados",
    toastLinkCopied: "\u00A1Enlace copiado!",
    notFoundTitle: "Receta no encontrada",
    notFoundDesc: "Esta receta no existe o ha sido eliminada.",
    goHome: "Ir al inicio",
  },

  reveal: {
    wins: "gana",
    seeFullRecipe: "Ver receta completa",
    tryAnother: "Probar otra",
  },

  debate: {
    councilDebating: "El consejo est\u00E1 debatiendo...",
    winner: "GANADOR",
    inventing: "Inventando:",
    explosive: "EXPLOSIVO",
    heated: "ACALORADO",
  },

  ingredients: {
    title: "Ingredientes",
    ready: (checked, total) => `${checked}/${total} listos`,
  },

  steps: {
    title: "Pasos",
    stepCount: (n) => `${n} paso${n !== 1 ? "s" : ""}`,
    min: "min",
  },

  swaps: {
    title: "\u00BFTe falta algo?",
  },

  stats: {
    prep: "Prep",
    cook: "Cocci\u00F3n",
    total: "Total",
    serving: "Porci\u00F3n",
    servings: "Porciones",
    level: "Nivel",
    cost: "Costo",
    easy: "F\u00E1cil",
    medium: "Medio",
    adventurous: "Aventurero",
    perServing: "Por porci\u00F3n",
    cal: "Cal",
    protein: "Prote\u00EDna",
    carbs: "Carbos",
    fat: "Grasa",
    fiber: "Fibra",
  },

  settings: {
    title: "Ajustes",
    guest: "Invitado",
    noAccount: "Sin cuenta a\u00FAn",
    freeTier: "Plan gratuito",
    preferences: "Preferencias",
    dailyInventions: "Invenciones diarias",
    freeTierLimit: "L\u00EDmite del plan gratuito",
    perDay: "/ d\u00EDa",
    darkMode: "Modo oscuro",
    alwaysOn: "Siempre activo",
    language: "Idioma",
    switchLanguage: "Idioma de la app",
    goPro: "Hazte Pro",
    comingSoon: "Pr\u00F3ximamente",
    unlimitedInventions: "Invenciones ilimitadas",
    proDescription:
      "Sin l\u00EDmites diarios. Generaci\u00F3n IA prioritaria. Personalidades de chefs exclusivas.",
    oneTime: "pago \u00FAnico",
    proPrice: "4,99 €",
    chefPreferences: "Preferencias de Chefs",
    active: "Activo",
    about: "Acerca de",
    version: "Versi\u00F3n",
    build: "Build",
    madeWith: "Hecho con caos por el consejo",
  },
};

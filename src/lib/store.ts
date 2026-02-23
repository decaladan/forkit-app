"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Recipe, RecipeHistoryItem } from "./types";
import type { Lang } from "./i18n/types";

type AppScreen = "home" | "debate" | "reveal" | "recipe";

interface ForkItState {
  // Navigation
  screen: AppScreen;
  setScreen: (screen: AppScreen) => void;

  // Current session
  currentRecipe: Recipe | null;
  setCurrentRecipe: (recipe: Recipe | null) => void;
  debateProgress: number; // 0-30 seconds
  setDebateProgress: (progress: number) => void;
  isDebating: boolean;
  setIsDebating: (debating: boolean) => void;

  // History (persisted to localStorage)
  history: RecipeHistoryItem[];
  addToHistory: (item: RecipeHistoryItem) => void;

  // Daily limit
  dailyCount: number;
  dailyDate: string; // ISO date string for reset
  incrementDailyCount: () => void;
  getDailyCount: () => number;

  // Saved recipes
  savedRecipeIds: string[];
  toggleSave: (recipeId: string) => void;

  // Language
  language: Lang;
  setLanguage: (lang: Lang) => void;
}

function todayDateStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export const useForkItStore = create<ForkItState>()(
  persist(
    (set, get) => ({
      // Navigation (not persisted — see partialize below)
      screen: "home" as AppScreen,
      setScreen: (screen) => set({ screen }),

      // Current session (not persisted)
      currentRecipe: null,
      setCurrentRecipe: (recipe) => set({ currentRecipe: recipe }),
      debateProgress: 0,
      setDebateProgress: (progress) => set({ debateProgress: progress }),
      isDebating: false,
      setIsDebating: (debating) => set({ isDebating: debating }),

      // History — deduplicated by recipeId, most recent first
      history: [],
      addToHistory: (item) =>
        set((state) => {
          // Remove existing entry for this recipe, add new one at front
          const filtered = state.history.filter(
            (h) => h.recipeId !== item.recipeId
          );
          return { history: [item, ...filtered].slice(0, 100) };
        }),

      // Daily limit — auto-resets on new day
      dailyCount: 0,
      dailyDate: todayDateStr(),
      incrementDailyCount: () =>
        set((state) => {
          const today = todayDateStr();
          if (state.dailyDate !== today) {
            // New day — reset and start at 1
            return { dailyCount: 1, dailyDate: today };
          }
          return { dailyCount: state.dailyCount + 1 };
        }),
      getDailyCount: () => {
        const state = get();
        if (state.dailyDate !== todayDateStr()) return 0;
        return state.dailyCount;
      },

      // Saved recipes
      savedRecipeIds: [],
      toggleSave: (recipeId) =>
        set((state) => ({
          savedRecipeIds: state.savedRecipeIds.includes(recipeId)
            ? state.savedRecipeIds.filter((id) => id !== recipeId)
            : [...state.savedRecipeIds, recipeId],
        })),

      // Language
      language: "en" as Lang,
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: "forkit-store",
      // Only persist these fields — skip transient UI state
      partialize: (state) => ({
        history: state.history,
        dailyCount: state.dailyCount,
        dailyDate: state.dailyDate,
        savedRecipeIds: state.savedRecipeIds,
        language: state.language,
      }),
    }
  )
);

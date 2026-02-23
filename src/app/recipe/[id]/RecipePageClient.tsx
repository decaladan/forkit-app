"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { SEED_RECIPES } from "@/data/seed-recipes";
import { useForkItStore } from "@/lib/store";
import { RecipeReveal } from "@/components/RecipeReveal";
import { RecipeCard } from "@/components/RecipeCard";
import { useT, useLang, getLocalizedRecipe } from "@/lib/i18n";

interface RecipePageClientProps {
  id: string;
}

export default function RecipePageClient({ id }: RecipePageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setScreen, setCurrentRecipe, incrementDailyCount, addToHistory, history } = useForkItStore();

  // Show reveal animation only when coming from debate (has ?reveal=1 param)
  const fromDebate = searchParams.get("reveal") === "1";
  const [showReveal, setShowReveal] = useState(fromDebate);
  const [mounted, setMounted] = useState(false);

  const recipe = SEED_RECIPES.find((r) => r.id === id);
  const t = useT();
  const lang = useLang();

  useEffect(() => {
    setMounted(true);
    // Reset screen state when landing on recipe page
    setScreen("recipe");
  }, [setScreen]);

  // Add to history when viewing a recipe
  useEffect(() => {
    if (recipe && mounted) {
      addToHistory({
        recipeId: recipe.id,
        viewedAt: new Date().toISOString(),
        madeIt: false,
        saved: false,
      });
    }
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const handleTryAnother = useCallback(() => {
    const recentIds = history
      .slice(0, SEED_RECIPES.length - 1)
      .map((h) => h.recipeId);
    // Also exclude current recipe
    const exclude = new Set([...recentIds, id]);
    const available = SEED_RECIPES.filter((r) => !exclude.has(r.id));
    const pool = available.length > 0 ? available : SEED_RECIPES;
    const next = pool[Math.floor(Math.random() * pool.length)];

    setCurrentRecipe(next);
    setScreen("debate");
    incrementDailyCount();
    router.replace("/debate");
  }, [history, id, setCurrentRecipe, setScreen, incrementDailyCount, router]);

  if (!mounted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--color-bg)" }}
      >
        <div className="w-8 h-8 rounded-full border-2 border-forkit-red border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4 px-6"
        style={{ background: "var(--color-bg)" }}
      >
        <span className="text-5xl">🍽</span>
        <h1 className="text-xl font-bold text-text-primary">
          {t.recipe.notFoundTitle}
        </h1>
        <p className="text-sm text-text-secondary text-center">
          {t.recipe.notFoundDesc}
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-2 px-6 py-2.5 rounded-full text-sm font-bold text-white cursor-pointer"
          style={{
            background:
              "linear-gradient(135deg, var(--color-forkit-red-light), var(--color-forkit-red))",
          }}
        >
          {t.recipe.goHome}
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--color-bg)" }}>
      <AnimatePresence mode="wait">
        {showReveal ? (
          <RecipeReveal
            key="reveal"
            recipe={getLocalizedRecipe(recipe, lang)}
            onRevealComplete={() => setShowReveal(false)}
            onTryAnother={handleTryAnother}
          />
        ) : (
          <RecipeCard
            key="card"
            recipe={getLocalizedRecipe(recipe, lang)}
            onBack={() => {
              setScreen("home");
              router.push("/");
            }}
            onTryAnother={handleTryAnother}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { SEED_RECIPES } from "@/data/seed-recipes";
import { getChef } from "@/lib/chefs";
import { useForkItStore } from "@/lib/store";
import type { Recipe } from "@/lib/types";
import { useT, useLang, getLocalizedRecipe } from "@/lib/i18n";

function HistoryRecipeCard({
  recipe,
  index,
  onClose,
}: {
  recipe: Recipe;
  index: number;
  onClose: () => void;
}) {
  const chef = getChef(recipe.winningChef);
  const savedRecipeIds = useForkItStore((s) => s.savedRecipeIds);
  const isSaved = savedRecipeIds.includes(recipe.id);
  const lang = useLang();
  const t = useT();
  const localizedRecipe = getLocalizedRecipe(recipe, lang);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.04,
        duration: 0.35,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <Link href={`/recipe/${recipe.id}`} onClick={onClose} className="block group">
        <div className="comic-card relative overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[3px_5px_0_#000]">
          {isSaved && (
            <div className="absolute top-3 right-3 z-10">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(229,57,53,0.15)', border: '2px solid #000' }}
              >
                <span className="text-[11px] leading-none">❤️</span>
              </div>
            </div>
          )}

          <div className="w-full h-[100px] overflow-hidden" style={{ borderBottom: '3px solid #000' }}>
            <img
              src={`/images/dishes/${recipe.id}.jpg`}
              alt={localizedRecipe.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-4 pt-3.5">
            <h3 className="text-[15px] font-bold leading-snug mb-1 pr-6 line-clamp-2" style={{ color: '#000' }}>
              {localizedRecipe.name}
            </h3>
            <p className="text-[12px] leading-relaxed line-clamp-2 mb-3" style={{ color: '#555' }}>
              {localizedRecipe.tagline}
            </p>

            <div className="flex items-center justify-between gap-2">
              <div
                className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium"
                style={{ backgroundColor: '#fff', color: '#000', border: '2px solid #000' }}
              >
                <img src={chef.image} alt={chef.name} className="w-5 h-5 rounded-full object-cover object-top" style={{ border: '2px solid #000', background: '#ffc737' }} />
                <span className="truncate max-w-[80px]">{chef.name}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="flex items-center px-2 py-1 rounded-full text-[11px] font-medium" style={{ background: '#fff', border: '2px solid #000', color: '#000' }}>
                  {recipe.nutrition.calories} {t.history.cal}
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium" style={{ background: '#fff', border: '2px solid #000', color: '#000' }}>
                  <span className="text-[10px] leading-none">⏱</span>
                  {recipe.stats.totalMinutes}m
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

interface HistoryOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function HistoryOverlay({ open, onClose }: HistoryOverlayProps) {
  const history = useForkItStore((s) => s.history);
  const t = useT();

  // Resolve history entries to actual recipe objects, preserving order
  const recipes = useMemo(() => {
    const recipeMap = new Map(SEED_RECIPES.map((r) => [r.id, r]));
    return history
      .map((h) => recipeMap.get(h.recipeId))
      .filter((r): r is Recipe => r !== undefined);
  }, [history]);

  const hasRecipes = recipes.length > 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60]"
            style={{ background: 'rgba(0,0,0,0.4)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel — slides up from bottom */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[65] flex flex-col"
            style={{ top: 48, background: '#ffc737' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 flex-shrink-0">
              <div>
                <h2 className="text-[22px] font-bold tracking-tight" style={{ color: '#000' }}>
                  {t.history.title}
                </h2>
                <p className="text-[13px] mt-0.5" style={{ color: 'rgba(0,0,0,0.6)' }}>
                  {t.history.subtitle}
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="flex items-center justify-center w-9 h-9 rounded-full cursor-pointer"
                style={{
                  background: '#fff',
                  border: '3px solid #000',
                  boxShadow: '2px 2px 0 #000',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M3 3L11 11" />
                  <path d="M11 3L3 11" />
                </svg>
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-4 pb-8">
              {hasRecipes ? (
                <>
                  <div className="flex items-center gap-2 mb-4 px-1">
                    <span className="text-[12px] font-medium" style={{ color: 'rgba(0,0,0,0.5)' }}>
                      {t.history.recipeCount(recipes.length)}
                    </span>
                    <div className="flex-1 h-px" style={{ background: 'rgba(0,0,0,0.15)' }} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {recipes.map((recipe, i) => (
                      <HistoryRecipeCard key={recipe.id} recipe={recipe} index={i} onClose={onClose} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[40vh] px-6">
                  <span className="text-[48px] mb-5">🍴</span>
                  <h2 className="text-[20px] font-bold mb-2" style={{ color: '#000' }}>
                    {t.history.emptyTitle}
                  </h2>
                  <p className="text-[14px] text-center mb-6 max-w-[240px]" style={{ color: 'rgba(0,0,0,0.6)' }}>
                    {t.history.emptySubtitle}
                  </p>
                  <button
                    onClick={onClose}
                    className="comic-btn-red text-[14px] tracking-wide"
                  >
                    {t.history.emptyCta}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

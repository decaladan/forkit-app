"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SEED_RECIPES } from "@/data/seed-recipes";
import { getChef } from "@/lib/chefs";
import { useForkItStore } from "@/lib/store";
import type { Recipe } from "@/lib/types";
import { useT, useLang, getLocalizedRecipe } from "@/lib/i18n";

function RecipeCard({ recipe, index }: { recipe: Recipe; index: number }) {
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
        delay: index * 0.06,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <Link href={`/recipe/${recipe.id}`} className="block group">
        <div className="comic-card relative overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[3px_5px_0_#000]">
          {/* Saved heart indicator */}
          {isSaved && (
            <div className="absolute top-3 right-3 z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(229,57,53,0.15)', border: '2px solid #000' }}
              >
                <span className="text-[11px] leading-none">❤️</span>
              </motion.div>
            </div>
          )}

          {/* Dish thumbnail */}
          <div className="w-full h-[100px] overflow-hidden" style={{ borderBottom: '3px solid #000' }}>
            <img
              src={`/images/dishes/${recipe.id}.jpg`}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-4 pt-3.5">
            {/* Dish name */}
            <h3 className="text-[15px] font-bold leading-snug mb-1 pr-6 line-clamp-2" style={{ color: '#000' }}>
              {localizedRecipe.name}
            </h3>

            {/* Tagline */}
            <p className="text-[12px] leading-relaxed line-clamp-2 mb-3" style={{ color: '#555' }}>
              {localizedRecipe.tagline}
            </p>

            {/* Bottom row: chef, time, cost */}
            <div className="flex items-center justify-between gap-2">
              {/* Chef pill */}
              <div
                className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium"
                style={{
                  backgroundColor: '#fff',
                  color: '#000',
                  border: '2px solid #000',
                }}
              >
                <img src={chef.image} alt={chef.name} className="w-5 h-5 rounded-full object-cover object-top" style={{ border: '2px solid #000', background: '#ffc737' }} />
                <span className="truncate max-w-[80px]">{chef.name}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Calories badge */}
                <div className="flex items-center px-2 py-1 rounded-full text-[11px] font-medium" style={{ background: '#fff', border: '2px solid #000', color: '#000' }}>
                  {recipe.nutrition.calories} {t.history.cal}
                </div>

                {/* Time badge */}
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

function EmptyState() {
  const t = useT();

  return (
    <motion.div
      className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] px-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="text-[48px] mb-5"
        animate={{
          rotate: [0, -10, 10, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeInOut",
        }}
      >
        🍴
      </motion.div>
      <h2 className="text-[20px] font-bold mb-2" style={{ color: '#000' }}>
        {t.history.emptyTitle}
      </h2>
      <p className="text-[14px] text-center mb-6 max-w-[240px]" style={{ color: 'rgba(0,0,0,0.6)' }}>
        {t.history.emptySubtitle}
      </p>
      <Link href="/">
        <motion.div
          className="comic-btn-red text-[14px] tracking-wide"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {t.history.emptyCta}
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function HistoryPage() {
  // Phase 1: show seed recipes as history.
  // In the future, filter based on actual user history from store/Supabase.
  const recipes = SEED_RECIPES;
  const hasRecipes = recipes.length > 0;
  const t = useT();

  return (
    <div className="comic-page pb-24">
      {/* Sunburst background */}
      <div className="sunburst" />

      {/* Header */}
      <div className="pt-safe relative z-10">
        <motion.div
          className="px-5 pt-16 pb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-[24px] font-bold tracking-tight" style={{ color: '#000' }}>
            {t.history.title}
          </h1>
          <p className="text-[14px] mt-1" style={{ color: 'rgba(0,0,0,0.6)' }}>
            {t.history.subtitle}
          </p>
        </motion.div>
      </div>

      {hasRecipes ? (
        <div className="px-4 relative z-10">
          {/* Recipe count pill */}
          <motion.div
            className="flex items-center gap-2 mb-4 px-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-[12px] font-medium" style={{ color: 'rgba(0,0,0,0.5)' }}>
              {t.history.recipeCount(recipes.length)}
            </span>
            <div className="flex-1 h-px" style={{ background: 'rgba(0,0,0,0.15)' }} />
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {recipes.map((recipe, i) => (
              <RecipeCard key={recipe.id} recipe={recipe} index={i} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

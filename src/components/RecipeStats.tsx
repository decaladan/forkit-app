"use client";

import { motion } from "framer-motion";
import type { RecipeStats as RecipeStatsType, Nutrition } from "@/lib/types";
import { useT, useLang, formatCostTier } from "@/lib/i18n";

interface RecipeStatsProps {
  stats: RecipeStatsType;
  nutrition: Nutrition;
  chefColor: string;
}

const difficultyEmoji: Record<string, string> = {
  easy: "😌",
  medium: "🤔",
  adventurous: "🔥",
};

export function RecipeStats({ stats, nutrition, chefColor }: RecipeStatsProps) {
  const t = useT();
  const lang = useLang();

  const difficultyLabel: Record<string, string> = {
    easy: t.stats.easy,
    medium: t.stats.medium,
    adventurous: t.stats.adventurous,
  };

  const cookingItems = [
    {
      emoji: "🔪",
      value: `${stats.prepMinutes}m`,
      label: t.stats.prep,
      highlight: false,
    },
    {
      emoji: "♨️",
      value: `${stats.cookMinutes}m`,
      label: t.stats.cook,
      highlight: false,
    },
    {
      emoji: "⏱",
      value: `${stats.totalMinutes}m`,
      label: t.stats.total,
      highlight: true,
    },
    {
      emoji: "🍽",
      value: `${stats.servings}`,
      label: stats.servings === 1 ? t.stats.serving : t.stats.servings,
      highlight: false,
    },
    {
      emoji: difficultyEmoji[stats.difficulty],
      value: difficultyLabel[stats.difficulty],
      label: t.stats.level,
      highlight: false,
    },
    {
      emoji: "💸",
      value: formatCostTier(stats.costTier, lang),
      label: t.stats.cost,
      highlight: false,
    },
  ];

  const nutritionItems = [
    { value: `${nutrition.calories}`, label: t.stats.cal, color: chefColor },
    { value: `${nutrition.protein}g`, label: t.stats.protein, color: "#00C853" },
    { value: `${nutrition.carbs}g`, label: t.stats.carbs, color: "#FFD600" },
    { value: `${nutrition.fat}g`, label: t.stats.fat, color: "#FF6B35" },
    { value: `${nutrition.fiber}g`, label: t.stats.fiber, color: "#26A69A" },
  ];

  return (
    <div className="space-y-3">
      {/* Cooking stats */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {cookingItems.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35, ease: "easeOut" }}
            className="relative flex flex-col items-center gap-1 rounded-xl px-2 py-3 overflow-hidden"
            style={{
              background: '#fff',
              border: item.highlight
                ? '3px solid var(--color-forkit-red)'
                : '3px solid #000',
              boxShadow: item.highlight
                ? '2px 2px 0 var(--color-forkit-red)'
                : '2px 2px 0 #000',
              borderRadius: 14,
            }}
          >
            <span className="text-base leading-none">{item.emoji}</span>
            <span
              className="text-sm font-bold leading-none"
              style={{
                color: item.highlight ? 'var(--color-forkit-red)' : '#000',
              }}
            >
              {item.value}
            </span>
            <span className="text-[10px] uppercase tracking-wider leading-none" style={{ color: 'rgba(0,0,0,0.5)' }}>
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Nutrition per serving */}
      <div
        className="flex items-center gap-2 px-4 py-3 overflow-hidden"
        style={{
          background: '#fff',
          border: '3px solid #000',
          borderRadius: 14,
          boxShadow: '2px 2px 0 #000',
        }}
      >
        <span className="text-[10px] font-bold uppercase tracking-widest shrink-0" style={{ color: 'rgba(0,0,0,0.4)' }}>
          {t.stats.perServing}
        </span>
        <div className="flex items-center gap-3 flex-1 justify-end">
          {nutritionItems.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-0.5">
              <span className="text-[13px] font-bold leading-none" style={{ color: item.color }}>
                {item.value}
              </span>
              <span className="text-[9px] uppercase tracking-wider leading-none" style={{ color: 'rgba(0,0,0,0.45)' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

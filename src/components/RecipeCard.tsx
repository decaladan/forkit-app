"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Recipe } from "@/lib/types";
import { getChef } from "@/lib/chefs";
import { useForkItStore } from "@/lib/store";
import { useT, useLang, getLocalizedChef } from "@/lib/i18n";
import { RecipeStats } from "./RecipeStats";
import { IngredientList } from "./IngredientList";
import { StepList } from "./StepList";
import { SmartSwaps } from "./SmartSwaps";

interface RecipeCardProps {
  recipe: Recipe;
  onBack?: () => void;
  onTryAnother?: () => void;
}

/* -----------------------------------------------
   Toast — brief notification overlay
----------------------------------------------- */
function Toast({
  message,
  onDone,
}: {
  message: string;
  onDone: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onAnimationComplete={() => {
        setTimeout(onDone, 1200);
      }}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full"
      style={{
        background: '#fff',
        border: '3px solid #000',
        borderRadius: 50,
        boxShadow: '3px 3px 0 #000',
      }}
    >
      <span className="text-sm font-bold" style={{ color: '#000' }}>{message}</span>
    </motion.div>
  );
}

export function RecipeCard({ recipe, onBack, onTryAnother }: RecipeCardProps) {
  const chef = getChef(recipe.winningChef);
  const {
    savedRecipeIds,
    toggleSave,
    addToHistory,
  } = useForkItStore();
  const t = useT();
  const lang = useLang();
  const localizedChef = getLocalizedChef(chef, lang);

  const isSaved = savedRecipeIds.includes(recipe.id);
  const [showDebate, setShowDebate] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleMakeThis = useCallback(() => {
    addToHistory({
      recipeId: recipe.id,
      viewedAt: new Date().toISOString(),
      madeIt: true,
      saved: savedRecipeIds.includes(recipe.id),
    });
    setToast(t.recipe.toastCooking);
  }, [recipe.id, addToHistory, savedRecipeIds]);

  const handleSave = useCallback(() => {
    toggleSave(recipe.id);
    setToast(
      savedRecipeIds.includes(recipe.id) ? t.recipe.toastRemoved : t.recipe.toastSaved
    );
  }, [recipe.id, toggleSave, savedRecipeIds]);

  const handleShare = useCallback(async () => {
    const url = window.location.href;

    // Always copy link first so user gets immediate feedback
    try {
      await navigator.clipboard.writeText(url);
      setToast(t.recipe.toastLinkCopied);
    } catch {
      // Clipboard API may fail without HTTPS — still try native share
    }

    // Then also open native share sheet if available (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.name,
          text: `${recipe.name} — ${recipe.tagline}`,
          url,
        });
      } catch {
        // User cancelled — link already copied above
      }
    }
  }, [recipe, t.recipe.toastLinkCopied]);

  return (
    <div
      className="relative min-h-screen w-full pb-28"
      style={{ background: '#ffc737' }}
    >
      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      </AnimatePresence>

      {/* Comic sunburst background */}
      <div className="sunburst" />

      {/* Scrollable content */}
      <div className="relative z-10 max-w-lg mx-auto px-5 pt-safe">
        {/* Top bar — extra padding to clear fixed header */}
        <div className="flex items-center justify-between pt-16 pb-2">
          {onBack && (
            <motion.button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm font-medium cursor-pointer py-2 pr-3"
              style={{ color: '#000' }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M11 4L6 9L11 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t.recipe.back}
            </motion.button>
          )}
          <div className="flex-1" />
        </div>

        {/* =========== HEADER =========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 pb-6"
        >
          {/* Chef badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.1,
            }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              background: '#fff',
              border: '3px solid #000',
              borderRadius: 50,
              boxShadow: '2px 2px 0 #000',
            }}
          >
            <img src={chef.image} alt={chef.name} style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid #000', background: '#ffc737', objectFit: 'cover', objectPosition: 'center top' }} />
            <span
              className="text-xs font-bold tracking-wide"
              style={{ color: '#000' }}
            >
              {chef.name}
            </span>
            <span className="text-[10px]" style={{ color: '#555' }}>{t.recipe.won}</span>
          </motion.div>

          {/* Dish name */}
          <h1 className="text-[28px] font-black leading-tight tracking-tight" style={{ color: '#000' }}>
            {recipe.name}
          </h1>

          {/* Tagline */}
          <p className="text-[15px] italic leading-relaxed" style={{ color: '#555' }}>
            {recipe.tagline}
          </p>

          {/* Hero dish image */}
          <div
            className="w-full h-[200px] overflow-hidden"
            style={{
              border: '3px solid #000',
              borderRadius: 14,
              boxShadow: '3px 3px 0 #000',
            }}
          >
            <img
              src={`/images/dishes/${recipe.id}.jpg`}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* =========== STATS =========== */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="pb-8"
        >
          <RecipeStats stats={recipe.stats} nutrition={recipe.nutrition} chefColor={chef.color} />
        </motion.div>

        {/* =========== DEBATE SUMMARY =========== */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="pb-8"
        >
          <button
            onClick={() => setShowDebate(!showDebate)}
            className="w-full flex items-center justify-between px-4 py-3.5 cursor-pointer transition-colors duration-200"
            style={{
              background: '#fff',
              border: '3px solid #000',
              borderRadius: 14,
              boxShadow: '3px 3px 0 #000',
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">💬</span>
              <span className="text-sm font-bold" style={{ color: '#000' }}>
                {t.recipe.whatHappened}
              </span>
            </div>
            <motion.svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              animate={{ rotate: showDebate ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="#000"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </button>

          <AnimatePresence>
            {showDebate && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div
                  className="px-4 py-3 mt-1"
                  style={{
                    background: '#fff',
                    border: '3px solid #000',
                    borderRadius: 14,
                    boxShadow: '2px 2px 0 #000',
                  }}
                >
                  <p className="text-sm leading-relaxed" style={{ color: '#555' }}>
                    {recipe.debateSummary}
                  </p>

                  {/* Inline chef avatars mentioned in the debate */}
                  <div className="flex items-center gap-1.5 mt-3 pt-3 border-t" style={{ borderColor: 'rgba(0,0,0,0.12)' }}>
                    {Array.from(
                      new Set(recipe.debate.map((m) => m.chefId))
                    ).map((chefId) => {
                      const c = getChef(chefId);
                      return (
                        <div
                          key={chefId}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-sm overflow-hidden"
                          style={{
                            background: '#ffc737',
                            border: '2px solid #000',
                          }}
                          title={c.name}
                        >
                          <img src={c.image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                        </div>
                      );
                    })}
                    <span className="text-[11px] ml-1" style={{ color: 'rgba(0,0,0,0.5)' }}>
                      {t.recipe.debatedThis}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* =========== INGREDIENTS =========== */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="pb-8"
        >
          <IngredientList
            ingredients={recipe.ingredients}
            chefColor={chef.color}
          />
        </motion.div>

        {/* =========== STEPS =========== */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="pb-8"
        >
          <StepList steps={recipe.steps} chefColor={chef.color} />
        </motion.div>

        {/* =========== SMART SWAPS =========== */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="pb-8"
        >
          <SmartSwaps swaps={recipe.smartSwaps} chefColor={chef.color} />
        </motion.div>

        {/* =========== THE SNAP =========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="pb-10"
        >
          <div
            className="relative px-5 py-5 overflow-hidden"
            style={{
              background: '#fff',
              border: '3px solid #000',
              borderRadius: 14,
              boxShadow: '3px 3px 0 #000',
            }}
          >
            {/* Snap label */}
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(0,0,0,0.5)' }}>
                {t.recipe.theSnap}
              </span>
              <div
                className="h-px flex-1"
                style={{
                  background: 'rgba(0,0,0,0.12)',
                }}
              />
            </div>

            <p className="text-[17px] font-medium italic leading-relaxed" style={{ color: '#000' }}>
              {recipe.snap}
            </p>
          </div>
        </motion.div>
      </div>

      {/* =========== STICKY BOTTOM ACTIONS =========== */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
        style={{
          background: '#fff',
          borderTop: '3px solid #000',
        }}
      >
        <div className="max-w-lg mx-auto px-5 pb-4 pt-3 flex items-center gap-3">
          {/* Save button */}
          <motion.button
            onClick={handleSave}
            whileTap={{ scale: 0.9 }}
            className="flex items-center justify-center w-12 h-12 rounded-full cursor-pointer"
            style={{
              background: '#fff',
              border: '3px solid #000',
              boxShadow: '2px 2px 0 #000',
            }}
          >
            {isSaved ? (
              <motion.svg
                key="saved"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="var(--color-forkit-red)"
              >
                <path d="M10 17.5L2.5 10C1.1 8.6 1.1 6.4 2.5 5C3.9 3.6 6.1 3.6 7.5 5L10 7.5L12.5 5C13.9 3.6 16.1 3.6 17.5 5C18.9 6.4 18.9 8.6 17.5 10L10 17.5Z" />
              </motion.svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="#000"
                strokeWidth="1.5"
              >
                <path
                  d="M10 17.5L2.5 10C1.1 8.6 1.1 6.4 2.5 5C3.9 3.6 6.1 3.6 7.5 5L10 7.5L12.5 5C13.9 3.6 16.1 3.6 17.5 5C18.9 6.4 18.9 8.6 17.5 10L10 17.5Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </motion.button>

          {/* Make This button */}
          <motion.button
            onClick={handleMakeThis}
            className="comic-btn-red"
            style={{ flex: 1, height: 48, borderRadius: 50, fontSize: 16 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            {t.recipe.makeThis}
          </motion.button>

          {/* Share button */}
          <motion.button
            onClick={handleShare}
            whileTap={{ scale: 0.9 }}
            className="flex items-center justify-center w-12 h-12 rounded-full cursor-pointer"
            style={{
              background: '#fff',
              border: '3px solid #000',
              boxShadow: '2px 2px 0 #000',
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="#000"
              strokeWidth="1.5"
            >
              <path
                d="M3 9V15C3 15.6 3.4 16 4 16H14C14.6 16 15 15.6 15 15V9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 2V11M9 2L6 5M9 2L12 5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>

          {/* Try Another button */}
          {onTryAnother && (
            <motion.button
              onClick={onTryAnother}
              whileTap={{ scale: 0.9 }}
              className="flex items-center justify-center w-12 h-12 rounded-full cursor-pointer"
              style={{
                background: '#fff',
                border: '3px solid #000',
                boxShadow: '2px 2px 0 #000',
              }}
              title={t.reveal.tryAnother}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                stroke="#000"
                strokeWidth="1.5"
              >
                <path
                  d="M1 4V8H5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.51 11A7 7 0 1014.13 4.26L1 8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

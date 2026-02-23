"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Recipe } from "@/lib/types";
import { getChef } from "@/lib/chefs";
import { useT, useLang, getLocalizedChef } from "@/lib/i18n";

type RevealPhase = "build-up" | "name-drop" | "photo" | "done";

interface RecipeRevealProps {
  recipe: Recipe;
  onRevealComplete: () => void;
  onTryAnother?: () => void;
}

/* -----------------------------------------------
   Tiny confetti particle — rendered as colored dots
   that float and fade away
----------------------------------------------- */
function ConfettiDot({
  color,
  delay,
  x,
  y,
}: {
  color: string;
  delay: number;
  x: number;
  y: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: 6,
        height: 6,
        background: color,
        left: `${50 + x}%`,
        top: `${50 + y}%`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [0, 1.5, 0.8],
        opacity: [0, 1, 0],
        x: x * 2.5,
        y: y * 2.5 - 30,
      }}
      transition={{
        duration: 1.6,
        delay,
        ease: "easeOut",
      }}
    />
  );
}

export function RecipeReveal({ recipe, onRevealComplete, onTryAnother }: RecipeRevealProps) {
  const [phase, setPhase] = useState<RevealPhase>("build-up");
  const chef = getChef(recipe.winningChef);
  const t = useT();
  const lang = useLang();
  const localizedChef = getLocalizedChef(chef, lang);

  // Confetti positions — static so they don't re-randomize
  const confettiParticles = useMemo(
    () => [
      { x: -18, y: -12, delay: 0.9 },
      { x: 22, y: -8, delay: 1.0 },
      { x: -10, y: 16, delay: 1.1 },
      { x: 15, y: 10, delay: 1.05 },
      { x: -25, y: 2, delay: 0.95 },
      { x: 28, y: -16, delay: 1.15 },
    ],
    []
  );

  // Phase progression
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    timers.push(setTimeout(() => setPhase("name-drop"), 800));
    timers.push(setTimeout(() => setPhase("photo"), 2000));
    timers.push(setTimeout(() => setPhase("done"), 3200));

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleContinue = useCallback(() => {
    onRevealComplete();
  }, [onRevealComplete]);

  const showNameDrop = phase === "name-drop" || phase === "photo" || phase === "done";
  const showPhoto = phase === "photo" || phase === "done";

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-4"
      style={{ background: '#ffc737' }}
    >
      {/* Comic sunburst background */}
      <div className="sunburst" />

      {/* Confetti dots (absolute, just visual flair) */}
      {showNameDrop &&
        confettiParticles.map((p, i) => (
          <ConfettiDot
            key={i}
            color={i % 3 === 0 ? "#000" : i % 3 === 1 ? "#fff" : chef.color}
            delay={p.delay}
            x={p.x}
            y={p.y}
          />
        ))}

      {/* ========== PHASE 1: BUILD-UP (centered chef emoji) ========== */}
      <AnimatePresence>
        {(phase === "build-up" || phase === "name-drop") && (
          <motion.div
            className="absolute flex flex-col items-center gap-4"
            animate={
              phase === "name-drop"
                ? { scale: 0.6, y: -180, x: -80, opacity: 0.9 }
                : { scale: 1, y: 0, x: 0, opacity: 1 }
            }
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 22,
            }}
          >
            {/* Chef image entrance */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 15,
                mass: 0.8,
              }}
            >
              <div style={{ width: 100, height: 100, borderRadius: '50%', border: '3px solid #000', background: '#ffc737', overflow: 'hidden', boxShadow: '3px 3px 0 #000' }}>
                <img src={chef.image} alt={chef.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
              </div>
            </motion.div>

            {/* Catchphrase */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              style={{ background: '#fff', border: '3px solid #000', borderRadius: 14, padding: '8px 16px', boxShadow: '2px 2px 0 #000' }}
            >
              <p style={{ color: '#000', fontStyle: 'italic', fontWeight: 600, fontSize: 14, textAlign: 'center' }}>
                &ldquo;{localizedChef.catchphrase}&rdquo;
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== MAIN CONTENT: Badge + Name + Tagline + Photo + Button ========== */}
      {/* Flowing layout — badge is part of the column to prevent overlap */}
      <AnimatePresence>
        {showNameDrop && (
          <motion.div
            className="relative flex flex-col items-center gap-4 px-6 w-full max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Winner badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.15,
              }}
              className="flex items-center gap-2"
              style={{
                background: '#fff',
                border: '3px solid #000',
                borderRadius: 50,
                padding: '6px 16px',
                boxShadow: '2px 2px 0 #000',
              }}
            >
              <img src={chef.image} alt={chef.name} style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid #000', background: '#ffc737', objectFit: 'cover', objectPosition: 'center top' }} />
              <span
                className="text-xs font-bold"
                style={{ color: '#000' }}
              >
                {chef.name} {t.reveal.wins}
              </span>
            </motion.div>

            {/* Dish name — SLAMS in */}
            <motion.h1
              initial={{ y: 80, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                mass: 1.2,
              }}
              className="text-3xl sm:text-4xl font-black text-center leading-tight tracking-tight"
              style={{ color: '#000' }}
            >
              {recipe.name}
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-base text-center max-w-sm italic"
              style={{ color: '#555' }}
            >
              {recipe.tagline}
            </motion.p>

            {/* ========== PHASE 3: PHOTO PLACEHOLDER ========== */}
            <AnimatePresence>
              {showPhoto && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                    delay: 0.1,
                  }}
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
                </motion.div>
              )}
            </AnimatePresence>

            {/* ========== PHASE 4: ACTION BUTTONS ========== */}
            <AnimatePresence>
              {phase === "done" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 22,
                    delay: 0.3,
                  }}
                  className="flex flex-col items-center gap-3 w-full"
                >
                  <button
                    onClick={handleContinue}
                    className="comic-btn-red"
                    style={{ fontSize: 16, padding: '14px 40px' }}
                  >
                    {t.reveal.seeFullRecipe}
                  </button>
                  {onTryAnother && (
                    <button
                      onClick={onTryAnother}
                      className="text-sm font-bold cursor-pointer px-5 py-2.5 rounded-full transition-transform active:scale-95"
                      style={{
                        background: '#fff',
                        color: '#000',
                        border: '3px solid #000',
                        boxShadow: '2px 2px 0 #000',
                      }}
                    >
                      {t.reveal.tryAnother}
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

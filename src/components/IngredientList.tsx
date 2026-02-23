"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Ingredient } from "@/lib/types";
import { useT } from "@/lib/i18n";

interface IngredientListProps {
  ingredients: Ingredient[];
  chefColor: string;
}

export function IngredientList({ ingredients, chefColor }: IngredientListProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const t = useT();

  const toggle = useCallback((index: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const checkedCount = checked.size;
  const total = ingredients.length;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h3 className="text-lg font-bold" style={{ color: '#000' }}>{t.ingredients.title}</h3>
          <span
            className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-[11px] font-bold"
            style={{
              background: '#fff',
              color: '#000',
              border: '2px solid #000',
            }}
          >
            {total}
          </span>
        </div>
        {checkedCount > 0 && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xs"
            style={{ color: 'rgba(0,0,0,0.5)' }}
          >
            {t.ingredients.ready(checkedCount, total)}
          </motion.span>
        )}
      </div>

      {/* Progress bar */}
      {checkedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 4 }}
          className="w-full rounded-full overflow-hidden"
          style={{ background: 'rgba(0,0,0,0.1)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--color-forkit-red)' }}
            initial={{ width: 0 }}
            animate={{ width: `${(checkedCount / total) * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </motion.div>
      )}

      {/* Ingredient list */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: '#fff',
          border: '3px solid #000',
          borderRadius: 14,
          boxShadow: '3px 3px 0 #000',
        }}
      >
        {ingredients.map((ing, i) => {
          const isChecked = checked.has(i);
          return (
            <motion.button
              key={`${ing.name}-${i}`}
              onClick={() => toggle(i)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer transition-colors"
              style={{
                borderBottom:
                  i < ingredients.length - 1
                    ? '1px solid rgba(0,0,0,0.1)'
                    : 'none',
                background: isChecked ? 'rgba(229, 57, 53, 0.06)' : 'transparent',
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Custom checkbox */}
              <div
                className="relative flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200"
                style={{
                  background: isChecked ? 'var(--color-forkit-red)' : 'transparent',
                  border: isChecked
                    ? '2px solid #000'
                    : '2px solid #000',
                }}
              >
                <AnimatePresence>
                  {isChecked && (
                    <motion.svg
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 25,
                      }}
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2.5 6L5 8.5L9.5 3.5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </div>

              {/* Amount + unit */}
              <span
                className="flex-shrink-0 text-sm font-mono font-medium min-w-[52px] transition-opacity duration-200"
                style={{
                  color: isChecked
                    ? 'rgba(0,0,0,0.3)'
                    : '#555',
                  opacity: isChecked ? 0.5 : 1,
                }}
              >
                {ing.amount} {ing.unit}
              </span>

              {/* Name */}
              <span
                className="text-sm transition-all duration-200"
                style={{
                  color: isChecked
                    ? 'rgba(0,0,0,0.3)'
                    : '#000',
                  textDecoration: isChecked ? 'line-through' : 'none',
                  opacity: isChecked ? 0.5 : 1,
                }}
              >
                {ing.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

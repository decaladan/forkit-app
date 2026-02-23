"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SmartSwap } from "@/lib/types";
import { useT } from "@/lib/i18n";

interface SmartSwapsProps {
  swaps: SmartSwap[];
  chefColor: string;
}

export function SmartSwaps({ swaps, chefColor }: SmartSwapsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const t = useT();

  if (swaps.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-base">🔄</span>
        <h3 className="text-lg font-bold" style={{ color: '#000' }}>
          {t.swaps.title}
        </h3>
      </div>

      {/* Swaps */}
      <div className="space-y-2">
        {swaps.map((swap, i) => (
          <motion.div
            key={`${swap.original}-${i}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className="rounded-xl overflow-hidden"
            style={{
              background: '#fff',
              border: '3px solid #000',
              borderRadius: 14,
              boxShadow: '2px 2px 0 #000',
            }}
          >
            <button
              onClick={() =>
                setExpandedIndex(expandedIndex === i ? null : i)
              }
              className="w-full flex items-center gap-3 px-4 py-3 cursor-pointer"
            >
              {/* Swap pill */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: '#ffc737',
                    color: '#000',
                    border: '2px solid #000',
                    fontWeight: 700,
                  }}
                >
                  {swap.original}
                </span>

                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <path
                    d="M3 8H13M13 8L10 5M13 8L10 11"
                    stroke="#000"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: '#4caf50',
                    color: '#fff',
                    border: '2px solid #000',
                    fontWeight: 700,
                  }}
                >
                  {swap.replacement}
                </span>
              </div>

              {/* Expand indicator */}
              {swap.note && (
                <motion.svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="ml-auto flex-shrink-0"
                  animate={{ rotate: expandedIndex === i ? 180 : 0 }}
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
              )}
            </button>

            {/* Note expand */}
            <AnimatePresence>
              {swap.note && expandedIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p
                    className="px-4 pb-3 text-xs leading-relaxed"
                    style={{ color: '#555' }}
                  >
                    {swap.note}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

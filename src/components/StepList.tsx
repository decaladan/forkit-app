"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { RecipeStep } from "@/lib/types";
import { useT } from "@/lib/i18n";

interface StepListProps {
  steps: RecipeStep[];
  chefColor: string;
}

export function StepList({ steps, chefColor }: StepListProps) {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const t = useT();

  const handleStepTap = useCallback((stepNumber: number) => {
    setActiveStep((prev) => (prev === stepNumber ? null : stepNumber));
  }, []);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <h3 className="text-lg font-bold" style={{ color: '#000' }}>{t.steps.title}</h3>
        <span className="text-xs" style={{ color: 'rgba(0,0,0,0.5)' }}>
          {t.steps.stepCount(steps.length)}
        </span>
      </div>

      {/* Steps */}
      <div className="space-y-2.5">
        {steps.map((step, i) => {
          const isActive = activeStep === step.number;

          return (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: i * 0.07,
                duration: 0.4,
                ease: "easeOut",
              }}
              onClick={() => handleStepTap(step.number)}
              className="relative flex gap-3.5 rounded-2xl px-4 py-3.5 cursor-pointer transition-colors duration-200"
              style={{
                background: '#fff',
                border: isActive
                  ? '3px solid var(--color-forkit-red)'
                  : '3px solid #000',
                borderRadius: 14,
                boxShadow: isActive
                  ? '2px 2px 0 var(--color-forkit-red)'
                  : '2px 2px 0 #000',
              }}
            >
              {/* Step number circle */}
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mt-0.5"
                style={{
                  background: isActive ? 'var(--color-forkit-red)' : '#fff',
                  color: isActive ? '#fff' : '#000',
                  border: '3px solid #000',
                }}
              >
                {step.number}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: isActive ? '#000' : '#555',
                  }}
                >
                  {step.instruction}
                </p>

                {/* Time badge */}
                {step.timeMinutes !== undefined && step.timeMinutes > 0 && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: '#fff',
                      color: '#000',
                      border: '2px solid #000',
                    }}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                    >
                      <circle
                        cx="5"
                        cy="5"
                        r="4"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                      <path
                        d="M5 2.5V5L6.5 6.5"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                    </svg>
                    {step.timeMinutes} {t.steps.min}
                  </motion.span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

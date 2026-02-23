"use client";

import { motion, useAnimation } from "framer-motion";
import { useCallback } from "react";

interface ForkItButtonProps {
  onTap: () => void;
  disabled?: boolean;
}

export function ForkItButton({ onTap, disabled }: ForkItButtonProps) {
  const controls = useAnimation();

  const handlePress = useCallback(async () => {
    if (disabled) return;

    // Slam down
    await controls.start({
      y: 10,
      transition: { duration: 0.08, ease: "easeIn" },
    });

    // Bounce back
    controls.start({
      y: 0,
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 15,
        mass: 0.6,
      },
    });

    onTap();
  }, [disabled, onTap, controls]);

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ perspective: "600px" }}
    >
      {/* Ambient table glow — soft light pooling under the button */}
      <div
        className="absolute w-[260px] h-[260px] rounded-full pointer-events-none animate-pulse-glow"
        style={{
          background:
            "radial-gradient(circle, rgba(229,57,53,0.18) 0%, rgba(229,57,53,0.06) 50%, transparent 70%)",
        }}
      />

      {/* ====== THE BASE (dark housing / pedestal) ====== */}
      <div
        className="absolute w-[190px] h-[190px] md:w-[210px] md:h-[210px] rounded-full"
        style={{
          background:
            "linear-gradient(180deg, #7a1a18 0%, #4a0e0d 100%)",
          boxShadow: `
            0 8px 0 #3a0a09,
            0 12px 0 #2a0706,
            0 16px 30px rgba(0,0,0,0.6),
            0 20px 60px rgba(0,0,0,0.3),
            inset 0 2px 4px rgba(255,255,255,0.08)
          `,
          transform: "translateY(6px)",
        }}
      >
        {/* Base inner ring detail */}
        <div
          className="absolute inset-[6px] rounded-full pointer-events-none"
          style={{
            border: "1px solid rgba(255,255,255,0.04)",
            background:
              "radial-gradient(circle at 50% 30%, rgba(229,57,53,0.1) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* ====== THE DOME (pressable top) ====== */}
      <motion.button
        onClick={handlePress}
        disabled={disabled}
        animate={controls}
        className="
          relative z-10
          w-[170px] h-[170px] md:w-[190px] md:h-[190px]
          rounded-full
          flex flex-col items-center justify-center gap-1.5
          cursor-pointer
          border-0 outline-none
          select-none
          disabled:opacity-40 disabled:cursor-not-allowed
        "
        style={{
          background:
            "radial-gradient(circle at 40% 30%, #ff6b5a 0%, var(--color-forkit-red) 40%, var(--color-forkit-red-dark) 85%, #7a1a18 100%)",
          boxShadow: `
            0 6px 0 var(--color-forkit-red-dark),
            0 8px 0 #7a1a18,
            0 10px 20px rgba(229,57,53,0.3),
            inset 0 -4px 8px rgba(0,0,0,0.3),
            inset 0 2px 2px rgba(255,255,255,0.1)
          `,
          transformStyle: "preserve-3d",
        }}
        whileHover={{
          scale: 1.03,
          boxShadow: `
            0 6px 0 var(--color-forkit-red-dark),
            0 8px 0 #7a1a18,
            0 14px 40px rgba(229,57,53,0.5),
            inset 0 -4px 8px rgba(0,0,0,0.3),
            inset 0 2px 2px rgba(255,255,255,0.1)
          `,
        }}
        whileTap={{
          y: 10,
          scale: 0.98,
          boxShadow: `
            0 1px 0 var(--color-forkit-red-dark),
            0 2px 0 #7a1a18,
            0 4px 12px rgba(229,57,53,0.2),
            inset 0 -2px 4px rgba(0,0,0,0.4),
            inset 0 4px 6px rgba(0,0,0,0.2)
          `,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 20,
        }}
      >
        {/* Glossy dome highlight — the curved light reflection */}
        <div
          className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[65%] h-[35%] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.08) 50%, transparent 70%)",
          }}
        />

        {/* Secondary rim highlight */}
        <div
          className="absolute inset-[3px] rounded-full pointer-events-none"
          style={{
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.12) 0%, transparent 40%, transparent 80%, rgba(0,0,0,0.15) 100%)",
          }}
        />

        {/* Label */}
        <span
          className="relative text-[20px] md:text-[22px] font-black tracking-[0.2em] text-white"
          style={{
            textShadow: "0 2px 4px rgba(0,0,0,0.4), 0 0 20px rgba(255,255,255,0.1)",
          }}
        >
          FORK IT
        </span>
        <span
          className="relative text-[28px] md:text-[32px] leading-none"
          style={{
            filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.4))",
          }}
        >
          🍴
        </span>
      </motion.button>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import type { Chef } from "@/lib/types";

interface ChefAvatarProps {
  chef: Chef;
  isSpeaking?: boolean;
  isWinner?: boolean;
  isDimmed?: boolean;
  delay?: number;
  /** "small" = 32px circle (speech bubbles), "default" = 64px circle, "full" = full-body figure */
  size?: "default" | "small" | "full";
}

export function ChefAvatar({
  chef,
  isSpeaking = false,
  isWinner = false,
  isDimmed = false,
  delay = 0,
  size = "default",
}: ChefAvatarProps) {
  const isSmall = size === "small";
  const isFull = size === "full";

  // ---------- Full-body mode (debate stage) ----------
  if (isFull) {
    return (
      <motion.div
        className="flex flex-col items-center"
        initial={{ y: 60, opacity: 0 }}
        animate={{
          y: isSpeaking ? -8 : isWinner ? -12 : 0,
          opacity: isDimmed ? 0.3 : 1,
          scale: isWinner ? 1.1 : isSpeaking ? 1.05 : isDimmed ? 0.9 : 1,
          filter: isDimmed ? "grayscale(100%)" : "grayscale(0%)",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          delay,
        }}
        style={{ width: 56 }}
      >
        {/* Full-body image */}
        <motion.div
          className="relative"
          animate={
            isSpeaking
              ? { y: [0, -4, 0] }
              : isWinner
                ? { y: [0, -6, 0] }
                : {}
          }
          transition={
            isSpeaking || isWinner
              ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
              : {}
          }
        >
          {/* Glow effect for speaking/winner */}
          {(isSpeaking || isWinner) && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: isWinner
                  ? `radial-gradient(circle, #ffd70044 0%, transparent 70%)`
                  : `radial-gradient(circle, ${chef.color}33 0%, transparent 70%)`,
                transform: "scale(1.8)",
                filter: "blur(8px)",
              }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          {/* Winner crown */}
          {isWinner && (
            <motion.span
              className="absolute -top-4 left-1/2 -translate-x-1/2 text-lg z-10"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              👑
            </motion.span>
          )}

          <img
            src={chef.image}
            alt={chef.name}
            className="relative z-[1]"
            style={{
              width: 56,
              height: 80,
              objectFit: "contain",
              objectPosition: "bottom",
            }}
            draggable={false}
          />
        </motion.div>

        {/* Name label */}
        <span
          className="text-[9px] font-bold leading-none text-center mt-1 truncate w-full"
          style={{ color: isWinner ? '#000' : isDimmed ? 'rgba(0,0,0,0.3)' : '#000' }}
        >
          {chef.name}
        </span>
      </motion.div>
    );
  }

  // ---------- Circle mode (default / small) ----------
  const circleSize = isSmall ? "w-8 h-8" : "w-16 h-16";
  const nameClass = isSmall
    ? "text-[10px] font-bold leading-tight text-center max-w-[56px] truncate"
    : "text-[11px] font-bold leading-tight text-center max-w-[80px]";

  return (
    <motion.div
      className="flex flex-col items-center gap-1"
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isWinner ? 1.2 : isDimmed ? 0.9 : 1,
        opacity: isDimmed ? 0.35 : 1,
        filter: isDimmed ? "grayscale(100%)" : "grayscale(0%)",
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 25,
        delay,
      }}
    >
      {/* Avatar circle */}
      <motion.div
        className={`debate-chef-circle ${circleSize}`}
        animate={
          isSpeaking
            ? {
                scale: [1, 1.1, 1],
                boxShadow: [
                  `0 0 0px ${chef.color}00`,
                  `0 0 24px ${chef.color}88`,
                  `0 0 0px ${chef.color}00`,
                ],
              }
            : isWinner
              ? {
                  boxShadow: [
                    `0 0 12px #ffd70066, 0 0 30px #ffd70033`,
                    `0 0 24px #ffd70099, 0 0 50px #ffd70055`,
                    `0 0 12px #ffd70066, 0 0 30px #ffd70033`,
                  ],
                }
              : {}
        }
        transition={
          isSpeaking || isWinner
            ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
            : {}
        }
      >
        {/* Winner golden ring */}
        {isWinner && (
          <motion.div
            className="absolute inset-[-4px] rounded-full"
            style={{ border: "3px solid #ffd700" }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        )}

        <img
          src={chef.image}
          alt={chef.name}
          className="w-full h-full object-cover object-center rounded-full"
        />
      </motion.div>

      {/* Name */}
      {!isSmall && (
        <span className={nameClass} style={{ color: "#000" }}>
          {chef.name}
        </span>
      )}
    </motion.div>
  );
}

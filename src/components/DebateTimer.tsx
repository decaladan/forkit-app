"use client";

import { motion } from "framer-motion";

interface DebateTimerProps {
  secondsLeft: number;
  totalSeconds: number;
}

export function DebateTimer({ secondsLeft, totalSeconds }: DebateTimerProps) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = secondsLeft / totalSeconds;
  const dashOffset = circumference * (1 - progress);
  const isUrgent = secondsLeft <= 5;

  return (
    <motion.div
      className="debate-timer"
      animate={
        isUrgent
          ? { scale: [1, 1.08, 1] }
          : {}
      }
      transition={
        isUrgent
          ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
          : {}
      }
    >
      <svg
        width="72"
        height="72"
        viewBox="0 0 64 64"
        className="transform -rotate-90"
      >
        {/* Background track */}
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="4"
        />
        {/* Progress ring */}
        <motion.circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke={isUrgent ? "#e53935" : "#000"}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 0.5, ease: "linear" }}
        />
      </svg>

      {/* Seconds number */}
      <motion.span
        className={`absolute text-[22px] font-black tabular-nums ${
          isUrgent ? "text-[#e53935]" : "text-black"
        }`}
        key={secondsLeft}
        initial={{ scale: 1.3, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {secondsLeft}
      </motion.span>
    </motion.div>
  );
}

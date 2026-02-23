"use client";

import { motion } from "framer-motion";
import type { Chef, DebateMessage } from "@/lib/types";
import { useT } from "@/lib/i18n";

interface SpeechBubbleProps {
  message: DebateMessage;
  chef: Chef;
}

function IntensityBadge({ intensity, t }: { intensity: DebateMessage["intensity"]; t: ReturnType<typeof useT> }) {
  if (intensity === "calm") return null;

  const label = intensity === "explosive" ? t.debate.explosive : t.debate.heated;
  const bg = intensity === "explosive" ? "#e53935" : "#FF6B35";

  return (
    <span
      className="debate-intensity-badge"
      style={{ background: bg }}
    >
      {label}
    </span>
  );
}

export function SpeechBubble({ message, chef }: SpeechBubbleProps) {
  const t = useT();
  const isExplosive = message.intensity === "explosive";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        opacity: { duration: 0.2 },
      }}
      className={`debate-speech-bubble ${isExplosive ? "animate-shake" : ""}`}
    >
      {/* Mini chef avatar + name row */}
      <div className="flex items-center gap-2 mb-1.5">
        <div className="debate-bubble-avatar">
          <img
            src={chef.image}
            alt={chef.name}
            className="w-full h-full object-cover object-center rounded-full"
          />
        </div>
        <span className="text-[13px] font-bold text-black">
          {chef.name}
        </span>
        <IntensityBadge intensity={message.intensity} t={t} />
      </div>

      {/* Message text */}
      <p
        className={`leading-relaxed ${
          isExplosive
            ? "text-[15px] font-bold text-black"
            : message.intensity === "heated"
              ? "text-[14px] font-semibold text-gray-800"
              : "text-[14px] text-gray-700"
        }`}
      >
        {message.text}
      </p>
    </motion.div>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForkItStore } from "@/lib/store";
import { CHEF_LIST, getChef } from "@/lib/chefs";
import { ChefAvatar } from "./ChefAvatar";
import { SpeechBubble } from "./SpeechBubble";
import { DebateTimer } from "./DebateTimer";
import type { DebateMessage } from "@/lib/types";
import { useT, useLang, getLocalizedRecipe } from "@/lib/i18n";

const DEBATE_DURATION = 30;
const WINNER_PAUSE_MS = 1500;
const MAX_VISIBLE_MESSAGES = 3;

type DebatePhase = "entering" | "debating" | "winner" | "done";

export function DebateViewer() {
  const { currentRecipe, setScreen } = useForkItStore();
  const t = useT();
  const lang = useLang();
  const [phase, setPhase] = useState<DebatePhase>("entering");
  const [secondsLeft, setSecondsLeft] = useState(DEBATE_DURATION);
  const [visibleMessages, setVisibleMessages] = useState<DebateMessage[]>([]);
  const [speakingChefId, setSpeakingChefId] = useState<string | null>(null);
  const [showWinner, setShowWinner] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const messageTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const elapsedRef = useRef(0);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      messageTimeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // Phase: entering -> debating (chefs bounce in over ~1s)
  useEffect(() => {
    if (phase === "entering") {
      const timeout = setTimeout(() => {
        setPhase("debating");
      }, CHEF_LIST.length * 200 + 300);
      return () => clearTimeout(timeout);
    }
  }, [phase]);

  // Phase: debating -- run the countdown and schedule messages
  useEffect(() => {
    if (phase !== "debating" || !currentRecipe) return;

    const debate = currentRecipe.debate;

    const initTimeout = setTimeout(() => {
      elapsedRef.current = 0;
      setSecondsLeft(DEBATE_DURATION);
    }, 0);
    messageTimeoutsRef.current.push(initTimeout);

    timerRef.current = setInterval(() => {
      elapsedRef.current += 1;
      const remaining = DEBATE_DURATION - elapsedRef.current;
      setSecondsLeft(Math.max(0, remaining));

      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        setPhase("winner");
      }
    }, 1000);

    debate.forEach((msg) => {
      const timeout = setTimeout(() => {
        setVisibleMessages((prev) => {
          const next = [...prev, msg];
          return next.slice(-MAX_VISIBLE_MESSAGES);
        });
        setSpeakingChefId(msg.chefId);

        const clearSpeaking = setTimeout(() => {
          setSpeakingChefId((current) =>
            current === msg.chefId ? null : current
          );
        }, 1500);
        messageTimeoutsRef.current.push(clearSpeaking);
      }, msg.timestamp * 1000);

      messageTimeoutsRef.current.push(timeout);
    });

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      messageTimeoutsRef.current.forEach(clearTimeout);
      messageTimeoutsRef.current = [];
    };
  }, [phase, currentRecipe]);

  // Phase: winner -- spotlight and then transition
  useEffect(() => {
    if (phase !== "winner") return;

    const winnerInit = setTimeout(() => {
      setShowWinner(true);
      setSpeakingChefId(null);
    }, 0);

    const transition = setTimeout(() => {
      setPhase("done");
      setScreen("reveal");
    }, WINNER_PAUSE_MS);

    return () => {
      clearTimeout(winnerInit);
      clearTimeout(transition);
    };
  }, [phase, setScreen]);

  if (!currentRecipe) return null;

  const winnerChef = getChef(currentRecipe.winningChef);

  return (
    <div className="debate-screen">
      {/* Spinning sunburst background */}
      <div className="sunburst" />

      {/* Header area: timer + status text */}
      <div className="debate-header">
        <DebateTimer secondsLeft={secondsLeft} totalSeconds={DEBATE_DURATION} />
        <motion.h2
          className="debate-status-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {t.debate.councilDebating}
        </motion.h2>
      </div>

      {/* Full-body chef figures */}
      <div className="debate-chefs-stage">
        {CHEF_LIST.map((chef, i) => (
          <ChefAvatar
            key={chef.id}
            chef={chef}
            size="full"
            isSpeaking={speakingChefId === chef.id && !showWinner}
            isWinner={showWinner && chef.id === currentRecipe.winningChef}
            isDimmed={showWinner && chef.id !== currentRecipe.winningChef}
            delay={phase === "entering" ? i * 0.15 : 0}
          />
        ))}
      </div>

      {/* Winner announcement */}
      <AnimatePresence>
        {showWinner && (
          <motion.div
            className="debate-winner-banner"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <span className="debate-winner-label">{t.debate.winner}</span>
            <div className="flex items-center gap-2">
              <div
                className="debate-bubble-avatar"
                style={{ borderColor: winnerChef.color }}
              >
                <img
                  src={winnerChef.image}
                  alt={winnerChef.name}
                  className="w-full h-full object-cover object-center rounded-full"
                />
              </div>
              <span className="text-[18px] font-black text-black">
                {winnerChef.name}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Speech bubbles area */}
      <div className="debate-messages">
        <AnimatePresence mode="popLayout">
          {visibleMessages.map((msg) => (
            <SpeechBubble
              key={`${msg.chefId}-${msg.timestamp}`}
              message={msg}
              chef={getChef(msg.chefId)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Recipe name at bottom */}
      <motion.div
        className="debate-recipe-bar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p className="text-[14px] font-bold text-black">
          {t.debate.inventing}{" "}
          <span className="font-black">
            {getLocalizedRecipe(currentRecipe, lang).name}
          </span>
        </p>
      </motion.div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "@/lib/i18n";
import { useForkItStore } from "@/lib/store";
import type { Lang } from "@/lib/i18n";
import { HistoryOverlay } from "./HistoryOverlay";
import { SettingsOverlay } from "./SettingsOverlay";

export function Navigation() {
  const t = useT();
  const { language, setLanguage } = useForkItStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="pt-safe" />
        <div className="flex h-[48px] items-center justify-between px-4">
          {/* Left: FORK IT — home button */}
          <Link
            href="/"
            onClick={() => { setMenuOpen(false); setHistoryOpen(false); }}
            className="px-2.5 py-1 rounded-lg"
            style={{
              background: 'rgba(255,255,255,0.85)',
              border: '2px solid #000',
              boxShadow: '1px 1px 0 #000',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span
              className="text-[15px] font-black tracking-tight leading-none"
              style={{ color: '#000', fontFamily: 'var(--font-display)' }}
            >
              FORK IT
            </span>
          </Link>

          {/* Right: Settings / burger icon */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer"
            style={{
              background: 'rgba(255,255,255,0.85)',
              border: '2px solid #000',
              boxShadow: '1px 1px 0 #000',
              backdropFilter: 'blur(8px)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? (
                <>
                  <path d="M4 4L12 12" />
                  <path d="M12 4L4 12" />
                </>
              ) : (
                <>
                  <path d="M2 4H14" />
                  <path d="M2 8H14" />
                  <path d="M2 12H14" />
                </>
              )}
            </svg>
          </button>
        </div>
      </motion.header>

      {/* ====== DROPDOWN MENU ====== */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.3)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed right-4 left-4 z-45"
              style={{ top: 'calc(48px + env(safe-area-inset-top, 0px))' }}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: '#fff',
                  border: '3px solid #000',
                  boxShadow: '4px 4px 0 #000',
                }}
              >
                {/* History */}
                <button
                  onClick={() => { setMenuOpen(false); setHistoryOpen(true); }}
                  className="w-full flex items-center gap-3 px-5 py-4 cursor-pointer text-left"
                  style={{ borderBottom: '2px solid rgba(0,0,0,0.1)' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className="text-[15px] font-bold" style={{ color: '#000' }}>
                    {t.nav.history}
                  </span>
                </button>

                {/* Settings */}
                <button
                  onClick={() => { setMenuOpen(false); setSettingsOpen(true); }}
                  className="w-full flex items-center gap-3 px-5 py-4 cursor-pointer text-left"
                  style={{ borderBottom: '2px solid rgba(0,0,0,0.1)' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                  <span className="text-[15px] font-bold" style={{ color: '#000' }}>
                    {t.nav.settings}
                  </span>
                </button>

                {/* Language selector */}
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                    </svg>
                    <span className="text-[15px] font-bold" style={{ color: '#000' }}>
                      {t.settings.language}
                    </span>
                  </div>
                  <div className="flex rounded-full overflow-hidden" style={{ border: '2px solid #000' }}>
                    {(["en", "es"] as Lang[]).map((l) => (
                      <button
                        key={l}
                        onClick={() => setLanguage(l)}
                        className="px-3 py-1 text-[12px] font-bold cursor-pointer transition-colors"
                        style={{
                          background: language === l ? 'var(--color-forkit-red)' : '#fff',
                          color: language === l ? '#fff' : '#000',
                          borderLeft: l === 'es' ? '2px solid #000' : 'none',
                        }}
                      >
                        {l.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ====== OVERLAYS ====== */}
      <HistoryOverlay open={historyOpen} onClose={() => setHistoryOpen(false)} />
      <SettingsOverlay open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}

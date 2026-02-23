"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CHEF_LIST } from "@/lib/chefs";
import { useT } from "@/lib/i18n";
import { useForkItStore } from "@/lib/store";
import type { Lang } from "@/lib/i18n";

interface SettingsOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsOverlay({ open, onClose }: SettingsOverlayProps) {
  const t = useT();
  const { language, setLanguage } = useForkItStore();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60]"
            style={{ background: 'rgba(0,0,0,0.4)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel — slides up from bottom */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[65] flex flex-col"
            style={{ top: 48, background: '#ffc737' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 flex-shrink-0">
              <h2 className="text-[22px] font-bold tracking-tight" style={{ color: '#000' }}>
                {t.settings.title}
              </h2>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-9 h-9 rounded-full cursor-pointer"
                style={{
                  background: '#fff',
                  border: '3px solid #000',
                  boxShadow: '2px 2px 0 #000',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M3 3L11 11" />
                  <path d="M11 3L3 11" />
                </svg>
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 pb-8">
              <div className="flex flex-col gap-4">
                {/* ---- Profile Section ---- */}
                <div className="comic-card p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#ffc737', border: '3px solid #000' }}>
                      <span className="text-[24px] leading-none">👤</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-[16px] font-bold" style={{ color: '#000' }}>{t.settings.guest}</h2>
                      <p className="text-[13px] mt-0.5" style={{ color: 'rgba(0,0,0,0.5)' }}>
                        {t.settings.noAccount}
                      </p>
                    </div>
                    <div className="comic-pill" style={{ background: '#fff', color: '#000' }}>
                      {t.settings.freeTier}
                    </div>
                  </div>
                </div>

                {/* ---- Preferences Section ---- */}
                <div className="comic-card p-5">
                  <h3 className="text-[13px] font-semibold uppercase tracking-wider mb-4" style={{ color: 'rgba(0,0,0,0.5)' }}>
                    {t.settings.preferences}
                  </h3>

                  <div className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="text-[14px] font-medium" style={{ color: '#000' }}>
                        {t.settings.dailyInventions}
                      </p>
                      <p className="text-[12px] mt-0.5" style={{ color: 'rgba(0,0,0,0.5)' }}>
                        {t.settings.freeTierLimit}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: '#fff', border: '2px solid #000' }}>
                      <span className="text-[12px] font-bold" style={{ color: '#000' }}>3</span>
                      <span className="text-[11px]" style={{ color: 'rgba(0,0,0,0.5)' }}>{t.settings.perDay}</span>
                    </div>
                  </div>

                  <div className="h-px my-1" style={{ background: 'rgba(0,0,0,0.12)' }} />

                  <div className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="text-[14px] font-medium" style={{ color: '#000' }}>
                        {t.settings.language}
                      </p>
                      <p className="text-[12px] mt-0.5" style={{ color: 'rgba(0,0,0,0.5)' }}>
                        {t.settings.switchLanguage}
                      </p>
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

                {/* ---- Go Pro Card ---- */}
                <div className="relative rounded-2xl overflow-hidden">
                  <div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      padding: "1.5px",
                      background: "linear-gradient(135deg, #ffd700, #b8860b, #ffd700, #daa520, #ffd700)",
                      backgroundSize: "300% 300%",
                      animation: "shimmer 3s ease infinite",
                      WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                    }}
                  />
                  <div className="relative rounded-2xl p-5 m-[1.5px]" style={{ background: '#fff' }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[20px] leading-none">👑</span>
                        <h3 className="text-[16px] font-bold text-gold">
                          {t.settings.goPro}
                        </h3>
                      </div>
                      <div className="comic-pill" style={{ background: '#fff', borderColor: '#b8860b', color: '#b8860b' }}>
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {t.settings.comingSoon}
                        </span>
                      </div>
                    </div>
                    <p className="text-[15px] font-semibold mb-1" style={{ color: '#000' }}>
                      {t.settings.unlimitedInventions}
                    </p>
                    <p className="text-[13px] mb-4 leading-relaxed" style={{ color: '#555' }}>
                      {t.settings.proDescription}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[24px] font-bold text-gold">{t.settings.proPrice}</span>
                      <span className="text-[13px]" style={{ color: 'rgba(0,0,0,0.5)' }}>{t.settings.oneTime}</span>
                    </div>
                  </div>
                </div>

                {/* ---- Chef Preferences ---- */}
                <div className="comic-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[13px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(0,0,0,0.5)' }}>
                      {t.settings.chefPreferences}
                    </h3>
                    <span className="comic-pill" style={{ background: '#fff' }}>
                      {t.settings.comingSoon}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {CHEF_LIST.map((chef) => (
                      <div
                        key={chef.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all"
                        style={{ backgroundColor: '#fff', color: '#000', border: '2px solid #000' }}
                      >
                        <img src={chef.image} alt={chef.name} className="w-5 h-5 rounded-full object-cover object-top" style={{ border: '2px solid #000', background: '#ffc737' }} />
                        <span>{chef.name}</span>
                        <span className="text-[10px] ml-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>{t.settings.active}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ---- About Section ---- */}
                <div className="comic-card p-5">
                  <h3 className="text-[13px] font-semibold uppercase tracking-wider mb-4" style={{ color: 'rgba(0,0,0,0.5)' }}>
                    {t.settings.about}
                  </h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[14px]" style={{ color: '#000' }}>{t.settings.version}</span>
                      <span className="text-[13px] font-mono" style={{ color: 'rgba(0,0,0,0.5)' }}>0.1.0</span>
                    </div>
                    <div className="h-px" style={{ background: 'rgba(0,0,0,0.12)' }} />
                    <div className="flex items-center justify-between">
                      <span className="text-[14px]" style={{ color: '#000' }}>{t.settings.build}</span>
                      <span className="text-[13px] font-mono" style={{ color: 'rgba(0,0,0,0.5)' }}>Phase 1</span>
                    </div>
                    <div className="h-px" style={{ background: 'rgba(0,0,0,0.12)' }} />
                    <p className="text-[12px] text-center pt-2 italic" style={{ color: 'rgba(0,0,0,0.4)' }}>
                      {t.settings.madeWith}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

"use client";

import { motion } from "framer-motion";
import { CHEF_LIST } from "@/lib/chefs";
import { useT } from "@/lib/i18n";
import { useForkItStore } from "@/lib/store";

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function SettingsPage() {
  const t = useT();
  const { language, setLanguage } = useForkItStore();

  return (
    <div className="comic-page pb-24">
      {/* Sunburst background */}
      <div className="sunburst" />

      <div className="pt-safe relative z-10">
        <motion.div
          className="px-5 pt-16 pb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-[24px] font-bold tracking-tight" style={{ color: '#000' }}>
            {t.settings.title}
          </h1>
        </motion.div>
      </div>

      <motion.div
        className="px-5 flex flex-col gap-4 relative z-10"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* ---- Profile Section ---- */}
        <motion.div variants={fadeUp} className="comic-card p-5">
          <div className="flex items-center gap-4">
            {/* Placeholder avatar */}
            <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#ffc737', border: '3px solid #000' }}>
              <span className="text-[24px] leading-none">👤</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[16px] font-bold" style={{ color: '#000' }}>{t.settings.guest}</h2>
              <p className="text-[13px] mt-0.5" style={{ color: 'rgba(0,0,0,0.5)' }}>
                {t.settings.noAccount}
              </p>
            </div>
            <div className="comic-pill" style={{ background: '#fff' }}>
              {t.settings.freeTier}
            </div>
          </div>
        </motion.div>

        {/* ---- Preferences Section ---- */}
        <motion.div variants={fadeUp} className="comic-card p-5">
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
              <span className="text-[12px] font-bold" style={{ color: '#000' }}>10</span>
              <span className="text-[11px]" style={{ color: 'rgba(0,0,0,0.5)' }}>{t.settings.perDay}</span>
            </div>
          </div>

          <div className="h-px my-1" style={{ background: 'rgba(0,0,0,0.12)' }} />

          <div className="flex items-center justify-between py-2.5">
            <div>
              <p className="text-[14px] font-medium" style={{ color: '#000' }}>
                {t.settings.darkMode}
              </p>
              <p className="text-[12px] mt-0.5" style={{ color: 'rgba(0,0,0,0.5)' }}>
                {t.settings.alwaysOn}
              </p>
            </div>
            <div className="w-10 h-6 rounded-full flex items-center justify-end px-0.5" style={{ background: 'var(--color-forkit-red)', border: '2px solid #000' }}>
              <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
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
              <button
                onClick={() => setLanguage('en')}
                className="px-3 py-1 text-[12px] font-bold cursor-pointer transition-colors"
                style={{
                  background: language === 'en' ? 'var(--color-forkit-red)' : '#fff',
                  color: language === 'en' ? '#fff' : '#000',
                }}
              >
                EN
              </button>
              <div className="w-px" style={{ background: '#000' }} />
              <button
                onClick={() => setLanguage('es')}
                className="px-3 py-1 text-[12px] font-bold cursor-pointer transition-colors"
                style={{
                  background: language === 'es' ? 'var(--color-forkit-red)' : '#fff',
                  color: language === 'es' ? '#fff' : '#000',
                }}
              >
                ES
              </button>
            </div>
          </div>
        </motion.div>

        {/* ---- Go Pro Card ---- */}
        <motion.div variants={fadeUp} className="relative rounded-2xl overflow-hidden">
          {/* Gold gradient border effect */}
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
        </motion.div>

        {/* ---- Chef Preferences ---- */}
        <motion.div variants={fadeUp} className="comic-card p-5">
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
                style={{
                  backgroundColor: '#fff',
                  color: '#000',
                  border: '2px solid #000',
                }}
              >
                <img src={chef.image} alt={chef.name} className="w-5 h-5 rounded-full object-cover object-top" style={{ border: '2px solid #000', background: '#ffc737' }} />
                <span>{chef.name}</span>
                <span className="text-[10px] ml-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>{t.settings.active}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ---- About Section ---- */}
        <motion.div variants={fadeUp} className="comic-card p-5">
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
        </motion.div>

        {/* Bottom breathing room */}
        <div className="h-4" />
      </motion.div>
    </div>
  );
}

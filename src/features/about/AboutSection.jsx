import React from 'react'
import { useTranslation } from 'react-i18next'
import portfolioData from '../../data/portfolioData.json'
import { useGSAPFadeUp } from '../../hooks/useGSAPAnimations'

/**
 * AboutSection Component
 * 
 * Fits 100% strictly inside fullscreen viewport (`h-screen` / `100dvh`) with `pt-20 pb-6`
 * to guarantee that the fixed navbar NEVER overlaps or crops any content.
 */
export default function AboutSection() {
  const { t, i18n } = useTranslation('portfolio')
  const currentLang = i18n.language === 'en' ? 'en' : 'vi'
  const sectionRef = useGSAPFadeUp({ delay: 0.2, stagger: 0.15 })

  const bio = portfolioData.about.bio?.[currentLang] || portfolioData.about.bio?.vi || ''
  const role = portfolioData.about.role?.[currentLang] || portfolioData.about.role?.vi || ''

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen min-h-[100dvh] md:h-[100dvh] w-full overflow-hidden flex flex-col justify-center items-center pt-20 pb-8 px-4 sm:px-8 md:px-12 max-w-6xl mx-auto select-none"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[200px] sm:h-[300px] bg-blue-600/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center my-auto py-2">
        {/* Left Column: Heading & Role Accent */}
        <div className="md:col-span-4 space-y-3 sm:space-y-4 text-center md:text-left" data-animate>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-blue-950/80 text-blue-300 border border-blue-800/80">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>01 / ABOUT ME</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            {t('about.title', 'Giới thiệu về tôi')}
          </h2>

          <p className="text-xs sm:text-sm md:text-base font-mono text-blue-400 font-semibold tracking-wide uppercase">
            {role}
          </p>
        </div>

        {/* Right Column: Bio Narrative & Stats Card */}
        <div className="md:col-span-8 space-y-4 sm:space-y-6" data-animate>
          <div className="p-5 sm:p-7 md:p-8 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-slate-800 shadow-xl">
            <p className="text-xs sm:text-sm md:text-base leading-relaxed text-slate-200 font-sans italic">
              "{bio}"
            </p>

            {/* Responsive 3-Column Stats Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 pt-5 mt-5 sm:pt-6 sm:mt-6 border-t border-slate-800/80 text-center">
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <span className="block text-xl sm:text-2xl md:text-3xl font-black text-blue-400 font-mono">
                  .NET
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 uppercase tracking-wider block mt-0.5">
                  Primary Stack
                </span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <span className="block text-xl sm:text-2xl md:text-3xl font-black text-blue-400 font-mono">
                  API & Micro
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 uppercase tracking-wider block mt-0.5">
                  Architecture
                </span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <span className="block text-xl sm:text-2xl md:text-3xl font-black text-blue-400 font-mono">
                  ReactJS
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 uppercase tracking-wider block mt-0.5">
                  Frontend
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

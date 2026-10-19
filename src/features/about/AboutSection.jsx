import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import portfolioData from '../../data/portfolioData.json'
import { useGSAPFadeUp } from '../../hooks/useGSAPAnimations'
import { resolveDocumentUrl } from '../../utils/helpers'
import DocumentsModal from '../../components/common/DocumentsModal'

/**
 * AboutSection Component
 * 
 * Fits 100% strictly inside fullscreen viewport (`h-screen` / `100dvh`) with `pt-20 pb-6`
 * to guarantee that the fixed navbar NEVER overlaps or crops any content.
 * Features verified credentials for Master CV and Academic Transcript downloads.
 */
export default function AboutSection() {
  const { t, i18n } = useTranslation('portfolio')
  const currentLang = i18n.language === 'en' ? 'en' : 'vi'
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false)
  const sectionRef = useGSAPFadeUp({ delay: 0.2, stagger: 0.15 })

  const bio = portfolioData.about.bio?.[currentLang] || portfolioData.about.bio?.vi || ''
  const role = portfolioData.about.role?.[currentLang] || portfolioData.about.role?.vi || ''

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen min-h-[100dvh] md:h-[100dvh] w-full overflow-hidden flex flex-col justify-between items-center pt-20 pb-6 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-[1800px] mx-auto select-none"
    >
      {/* ─── Section Header (SpaceX Minimal - Top-Centered) ─────────────────── */}
      <div className="text-center space-y-1 mb-2 relative z-10 w-full" data-animate>
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-mono tracking-widest uppercase bg-zinc-900 text-white border border-white/20">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>01 / ABOUT ME</span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-[0.08em] sm:tracking-[0.14em] text-white">
          {t('about.title', 'Giới thiệu về tôi')}
        </h2>

        <p className="text-[10px] sm:text-xs font-mono tracking-widest uppercase text-zinc-400 max-w-lg lg:max-w-2xl mx-auto leading-relaxed px-2">
          {role}
        </p>
      </div>

      {/* ─── Main Content: Optical Lens Card Centered ─────────────────────────── */}
      <div className="w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto my-auto relative z-10 py-1" data-animate>
        <div data-lens-card="true" className="optical-lens-card p-5 sm:p-7 md:p-8 lg:p-9 xl:p-10 rounded-2xl">
          <p className="text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed text-zinc-200 font-sans italic text-center md:text-left">
            "{bio}"
          </p>

            {/* Responsive 3-Column Stats Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5 lg:gap-5 pt-5 mt-5 sm:pt-6 sm:mt-6 border-t border-white/10 text-center">
              <div className="p-2.5 sm:p-3 lg:p-4 rounded-xl bg-zinc-950/40 border border-white/10 hover:border-white/40 transition-colors flex flex-col justify-center items-center overflow-hidden backdrop-blur-sm">
                <span className="block text-base sm:text-lg md:text-sm lg:text-base xl:text-xl 2xl:text-2xl font-black text-white font-mono tracking-tight whitespace-nowrap">
                  .NET / NestJS
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mt-1 whitespace-nowrap">
                  Backend Core
                </span>
              </div>
              <div className="p-2 sm:p-2.5 lg:p-3 rounded-xl bg-zinc-950/40 border border-white/10 hover:border-white/40 transition-colors flex flex-col justify-center items-center overflow-hidden backdrop-blur-sm">
                <span className="block text-base sm:text-lg md:text-sm lg:text-base xl:text-xl font-black text-white font-mono tracking-tight whitespace-nowrap">
                  Micro & EDA
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mt-1 whitespace-nowrap">
                  Architecture
                </span>
              </div>
              <div className="p-2 sm:p-2.5 lg:p-3 rounded-xl bg-zinc-950/40 border border-white/10 hover:border-white/40 transition-colors flex flex-col justify-center items-center overflow-hidden backdrop-blur-sm">
                <span className="block text-base sm:text-lg md:text-sm lg:text-base xl:text-xl font-black text-white font-mono tracking-tight whitespace-nowrap">
                  React & Next
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mt-1 whitespace-nowrap">
                  Modern Frontend
                </span>
              </div>
            </div>

            {/* Direct Downloads & Verified Credentials Row */}
            <div className="pt-4 sm:pt-5 mt-4 sm:mt-5 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                  {currentLang === 'vi' ? 'HỒ SƠ & BẢNG ĐIỂM' : 'CREDENTIALS'}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Master CV Action */}
                <button
                  type="button"
                  onClick={() => setIsDocsModalOpen(true)}
                  className="flex-1 sm:flex-initial px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-transparent hover:bg-white text-white hover:text-black border border-white/40 hover:border-white text-[11px] sm:text-xs font-mono font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  title={currentLang === 'vi' ? 'Xem & Tải Master CV' : 'View & Download Master CV'}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>MASTER CV</span>
                </button>

                {/* Academic Transcript Action */}
                <button
                  type="button"
                  onClick={() => setIsDocsModalOpen(true)}
                  className="flex-1 sm:flex-initial px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-transparent hover:bg-white text-white hover:text-black border border-white/40 hover:border-white text-[11px] sm:text-xs font-mono font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  title={currentLang === 'vi' ? 'Xem & Tải Bảng điểm đại học' : 'View & Download Transcript'}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{currentLang === 'vi' ? 'BẢNG ĐIỂM' : 'TRANSCRIPT'}</span>
                </button>

                {/* View Details / Modal Trigger */}
                <button
                  type="button"
                  onClick={() => setIsDocsModalOpen(true)}
                  className="p-1.5 sm:p-2 rounded-xl bg-black hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 hover:border-white transition-colors cursor-pointer"
                  title="Expand credentials"
                >
                  <span className="text-xs">↗</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      {/* ─── Documents Modal ──────────────────────────────────────────────── */}
      <DocumentsModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
      />
    </section>
  )
}

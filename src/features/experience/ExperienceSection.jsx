import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import portfolioData from '../../data/portfolioData.json'
import { resolveProjectImage } from '../../utils/helpers'

/**
 * ExperienceSection Component (Career & Work Experience Showcase)
 * 
 * Modeled strictly after the 3D Project Book concept:
 * - 2/3 description & role information + 1/3 visual preview card
 * - Expandable Deep-Dive Drawer (taking 2/3 of viewport width)
 * - Isolated scrolling, full dark theme aesthetics, zero overflow (fits 100vh)
 */
export default function ExperienceSection() {
  const { t, i18n } = useTranslation('portfolio')
  const currentLang = i18n.language === 'en' ? 'en' : 'vi'

  const experiences = portfolioData.experiences || []
  const totalExperiences = experiences.length

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedExperience, setSelectedExperience] = useState(null)
  const [isFlipping, setIsFlipping] = useState(false)

  const drawerRef = useRef(null)
  const containerRef = useRef(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const currentExp = experiences[currentIndex] || experiences[0]

  // Handlers for next / prev experience pagination
  const handleNext = () => {
    if (isFlipping) return
    setIsFlipping(true)
    setCurrentIndex((prev) => (prev + 1 >= totalExperiences ? 0 : prev + 1))
    setTimeout(() => setIsFlipping(false), 250)
  }

  const handlePrev = () => {
    if (isFlipping) return
    setIsFlipping(true)
    setCurrentIndex((prev) => (prev - 1 < 0 ? totalExperiences - 1 : prev - 1))
    setTimeout(() => setIsFlipping(false), 250)
  }

  // Touch swipe support for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX
  }

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX
    const deltaX = touchStartX.current - touchEndX.current
    if (Math.abs(deltaX) > 45) {
      if (deltaX > 0) {
        handleNext()
      } else {
        handlePrev()
      }
    }
  }

  // Keyboard navigation (ArrowLeft / ArrowRight) when experience section is in view
  useEffect(() => {
    const handleArrowKeys = (e) => {
      if (selectedExperience) return
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return

      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const isVisibleOnScreen = rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.4

      if (isVisibleOnScreen) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          handlePrev()
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          handleNext()
        }
      }
    }

    window.addEventListener('keydown', handleArrowKeys)
    return () => window.removeEventListener('keydown', handleArrowKeys)
  }, [selectedExperience, totalExperiences])

  // Open & Close Details Drawer
  const handleOpenDetail = (exp) => {
    setSelectedExperience(exp)
  }

  const handleCloseDetail = () => {
    setSelectedExperience(null)
  }

  // Lock external scroll when drawer is open
  useEffect(() => {
    const mainEl = document.querySelector('main')
    if (selectedExperience) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      if (mainEl) mainEl.style.overflowY = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      if (mainEl) mainEl.style.overflowY = ''
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedExperience) {
        handleCloseDetail()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      if (mainEl) mainEl.style.overflowY = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedExperience])

  if (!currentExp) return null

  const role = currentExp.role?.[currentLang] || currentExp.role?.vi || ''
  const company = currentExp.company?.[currentLang] || currentExp.company?.vi || ''
  const period = currentExp.period?.[currentLang] || currentExp.period?.vi || ''
  const location = currentExp.location?.[currentLang] || currentExp.location?.vi || ''
  const summary = currentExp.summary?.[currentLang] || currentExp.summary?.vi || ''
  const responsibilities = currentExp.responsibilities?.[currentLang] || currentExp.responsibilities?.vi || []
  const achievements = currentExp.achievements?.[currentLang] || currentExp.achievements?.vi || []
  const coverUrl = resolveProjectImage(currentExp.coverImage)

  return (
    <section
      id="experience"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative min-h-screen min-h-[100dvh] md:h-[100dvh] w-full overflow-hidden flex flex-col justify-between items-center pt-20 pb-2 sm:pb-3 px-4 sm:px-8 lg:px-12 max-w-6xl mx-auto select-none"
    >
      {/* ─── Section Header ─────────────────────────────────────────────────── */}
      <div className="text-center space-y-1.5 mb-2 relative z-10 w-full">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-mono tracking-widest uppercase bg-zinc-900/90 text-zinc-300 border border-white/20">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>03 / CAREER & WORK EXPERIENCE</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-[0.12em] text-white">
          {currentLang === 'vi' ? 'KINH NGHIỆM LÀM VIỆC' : 'WORK EXPERIENCE'}
        </h2>

        <p className="text-[10px] sm:text-xs font-mono tracking-widest uppercase text-zinc-400 max-w-lg mx-auto leading-relaxed px-2">
          {currentLang === 'vi'
            ? 'HÀNH TRÌNH PHÁT TRIỂN NĂNG LỰC KỸ THUẬT VÀ ĐÓNG GÓP THỰC TẾ TRONG DOANH NGHIỆP'
            : 'PROFESSIONAL ENGINEERING JOURNEY & MEASURABLE BUSINESS IMPACT'}
        </p>
      </div>

      {/* ─── Interactive Career Showcase Book Card (Optical Lens) ───────────────────────────── */}
      <div className="w-full relative z-10 my-auto py-1">
        <div data-lens-card="true" className="optical-lens-card relative w-full rounded-sm sm:rounded-md p-4 sm:p-7 md:p-8 flex flex-col justify-between">
          {/* Header Metadata */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3.5 sm:mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <span className="px-2.5 py-0.5 rounded-none text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase bg-white text-black">
                {currentExp.type?.toUpperCase()}
              </span>
              <span className="text-[11px] sm:text-xs font-mono text-zinc-400">
                {period}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-xs font-mono text-zinc-400">
                {location}
              </span>
              <span className="text-[11px] sm:text-xs font-mono text-white font-bold">
                ({currentIndex + 1}/{totalExperiences})
              </span>
            </div>
          </div>

          {/* Main 2-Column Grid (2/3 Info + 1/3 Visual Preview) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center">
            {/* Left Column (2/3): Role, Company, Summary, Tech Stack & CTA */}
            <div className="md:col-span-8 space-y-3 sm:space-y-3.5 text-left">
              <div>
                <span className="text-[11px] sm:text-xs font-mono text-zinc-400 font-bold tracking-widest uppercase block">
                  {company}
                </span>
                <h3 className="text-lg sm:text-2xl font-black uppercase text-white tracking-tight leading-snug">
                  {role}
                </h3>
              </div>

              {/* Summary */}
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans line-clamp-2 sm:line-clamp-3">
                {summary}
              </p>

              {/* Technologies */}
              <div className="space-y-1.5 pt-0.5 sm:pt-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block font-semibold">
                  CORE TECHNOLOGIES:
                </span>
                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                  {currentExp.technologies?.slice(0, 6).map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] sm:text-[11px] font-mono px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-none bg-black text-zinc-300 border border-zinc-800 hover:border-white transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                  {currentExp.technologies?.length > 6 && (
                    <span className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 sm:py-1 rounded-none bg-zinc-900 text-white border border-zinc-700">
                      +{currentExp.technologies.length - 6} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 sm:pt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenDetail(currentExp)}
                  className="w-full sm:w-auto justify-center px-6 py-2.5 rounded-none bg-white hover:bg-zinc-200 text-black text-xs font-mono font-bold tracking-widest uppercase active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2"
                >
                  <span>{currentLang === 'vi' ? 'XEM CHI TIẾT' : 'VIEW FULL'}</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            <div
              onClick={() => handleOpenDetail(currentExp)}
              className="md:col-span-4 relative group cursor-pointer w-full mt-2 md:mt-0"
            >
              <div className="relative aspect-[16/9] sm:aspect-[4/3] max-h-[180px] sm:max-h-[240px] w-full rounded-none sm:rounded-sm bg-zinc-950/40 border border-white/10 group-hover:border-white/40 overflow-hidden shadow-2xl transition-all duration-300 transform group-hover:scale-[1.01] flex flex-col justify-between p-3.5 sm:p-4 backdrop-blur-sm">
                {coverUrl && (
                  <div className="absolute inset-0 z-0">
                    <img
                      src={coverUrl}
                      alt={role}
                      className="w-full h-full object-cover opacity-35 group-hover:opacity-60 transition-opacity duration-500 filter grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  </div>
                )}

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-zinc-300">
                  <span className="px-2 py-0.5 rounded-none bg-black/90 border border-white/20 text-white font-mono tracking-widest text-[9px] uppercase font-bold">
                    CAREER
                  </span>
                  <span className="text-white font-mono font-bold flex items-center gap-1 text-[11px] tracking-wider uppercase">
                    <span>EXPAND</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">↗</span>
                  </span>
                </div>

                {/* Bottom Tag */}
                <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-zinc-400 border-t border-zinc-800 pt-2 bg-black/80 backdrop-blur-md -mx-3.5 -mb-3.5 sm:-mx-4 sm:-mb-4 px-3.5 sm:px-4 pb-2.5">
                  <span className="uppercase text-zinc-400 truncate max-w-[120px] tracking-wider">{period}</span>
                  <span className="text-white font-bold tracking-widest flex-shrink-0 uppercase">CHI TIẾT →</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Inner Bottom Footer */}
          <div className="mt-3 pt-2.5 border-t border-zinc-800 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-zinc-400">
            <span className="truncate max-w-[200px] sm:max-w-none uppercase tracking-wider">
              {company} / {location}
            </span>
            <span className="uppercase tracking-wider">
              Role {currentIndex + 1} of {totalExperiences}
            </span>
          </div>
        </div>
      </div>

      {/* ─── Experience Details Deep-Dive Drawer (2/3 screen width on desktop, 100% on mobile) ─── */}
      {selectedExperience && (
        <div
          onClick={handleCloseDetail}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex justify-end animate-fade-in"
        >
          <div
            ref={drawerRef}
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="relative w-full md:w-2/3 lg:w-2/3 h-full bg-black border-l border-zinc-800 shadow-2xl overflow-y-auto overscroll-contain flex flex-col justify-between p-4 sm:p-8 md:p-10 custom-scrollbar animate-fade-in-up"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-zinc-800 sticky top-0 bg-black/95 backdrop-blur-md z-20">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white" />
                <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-zinc-300 font-bold">
                  Career Deep Dive
                </span>
              </div>

              <button
                type="button"
                onClick={handleCloseDetail}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-none border border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-white hover:text-black hover:border-white text-xs font-mono font-bold tracking-widest uppercase transition-all cursor-pointer"
              >
                <span>✕</span>
                <span>{currentLang === 'vi' ? 'ĐÓNG' : 'CLOSE'}</span>
              </button>
            </div>

            {/* Drawer Body Content */}
            <div className="py-4 sm:py-6 space-y-5 sm:space-y-6 flex-1 text-zinc-100">
              {/* Type, Period & Role */}
              <div className="space-y-2 border-b border-zinc-800 pb-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 rounded-none text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase bg-white text-black">
                    <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                    TYPE: {selectedExperience.type?.toUpperCase()}
                  </span>
                  <span className="text-[11px] sm:text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    {selectedExperience.period?.[currentLang] || selectedExperience.period?.vi} | {selectedExperience.location?.[currentLang] || selectedExperience.location?.vi}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-snug pt-1">
                  {selectedExperience.role?.[currentLang] || selectedExperience.role?.vi}
                </h2>
                <p className="text-xs sm:text-sm font-mono text-zinc-400 font-bold tracking-widest uppercase">
                  {selectedExperience.company?.[currentLang] || selectedExperience.company?.vi}
                </p>
              </div>

              {/* Summary Callout */}
              <div className="p-3.5 sm:p-4 rounded-none bg-zinc-950 border border-zinc-800">
                <p className="text-xs sm:text-sm md:text-base text-zinc-200 leading-relaxed italic">
                  "{selectedExperience.summary?.[currentLang] || selectedExperience.summary?.vi}"
                </p>
              </div>

              {/* Technologies */}
              {selectedExperience.technologies && (
                <div className="space-y-2 pt-1">
                  <h3 className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase">
                    {currentLang === 'vi' ? 'Công nghệ áp dụng' : 'Technologies Used'}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {selectedExperience.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-mono px-2.5 sm:px-3 py-1 rounded-none bg-zinc-950 text-zinc-200 border border-zinc-800 hover:border-white transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Responsibilities */}
              {responsibilities.length > 0 && (
                <div className="space-y-2 sm:space-y-2.5 pt-2">
                  <h3 className="text-xs font-mono font-bold tracking-widest text-white uppercase flex items-center gap-2">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{currentLang === 'vi' ? 'Trách nhiệm & Nhiệm vụ cốt lõi' : 'Key Responsibilities'}</span>
                  </h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    {responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 bg-zinc-950 p-3 rounded-none border border-zinc-800">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                        <span className="leading-relaxed font-sans">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Achievements */}
              {achievements.length > 0 && (
                <div className="space-y-2 sm:space-y-2.5 pt-2">
                  <h3 className="text-xs font-mono font-bold tracking-widest text-white uppercase flex items-center gap-2">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{currentLang === 'vi' ? 'Thành tựu & Đóng góp nổi bật' : 'Key Achievements & Impact'}</span>
                  </h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    {achievements.map((ach, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 bg-zinc-950 p-3 rounded-none border border-zinc-800">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                        <span className="leading-relaxed font-sans">{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 sm:pt-6 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="hidden sm:inline uppercase tracking-wider">Press ESC to exit</span>
              <button
                type="button"
                onClick={handleCloseDetail}
                className="text-white hover:underline cursor-pointer font-bold tracking-wider uppercase"
              >
                ← Return to timeline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Bottom Navigation Controls (Compact Footer) ────────────────────── */}
      <div className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between pt-2 pb-1 border-t border-zinc-800">
        <div className="text-[10px] sm:text-[11px] font-mono text-zinc-400 tracking-wider">
          <span className="hidden sm:inline">
            USE <kbd className="px-1 py-0.5 rounded-none bg-zinc-900 border border-zinc-800 text-white font-mono">←</kbd> / <kbd className="px-1 py-0.5 rounded-none bg-zinc-900 border border-zinc-800 text-white font-mono">→</kbd> OR SWIPE
          </span>
          <span className="sm:hidden text-zinc-500">
            👈 SWIPE TO NAVIGATE 👉
          </span>
        </div>

        {/* Page / Experience Navigation Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={handlePrev}
            disabled={isFlipping}
            aria-label="Previous Experience"
            className="flex items-center gap-1.5 px-4 sm:px-5 py-1.5 rounded-none
              border border-zinc-700 bg-black hover:bg-white hover:text-black
              text-white text-[11px] font-mono font-bold tracking-widest uppercase transition-all active:scale-95 disabled:opacity-30 cursor-pointer min-h-[34px] sm:min-h-[36px]"
          >
            <span>← PREV</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={isFlipping}
            aria-label={currentIndex >= totalExperiences - 1 ? 'Reset to first experience' : 'Next Experience'}
            className="flex items-center gap-1.5 px-4 sm:px-5 py-1.5 rounded-none
              border border-zinc-700 bg-black hover:bg-white hover:text-black
              text-white text-[11px] font-mono font-bold tracking-widest uppercase transition-all active:scale-95 disabled:opacity-30 cursor-pointer min-h-[34px] sm:min-h-[36px]"
          >
            <span>
              {currentIndex >= totalExperiences - 1 ? 'RESET ↺' : 'NEXT →'}
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}

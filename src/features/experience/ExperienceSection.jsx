import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import portfolioData from '../../data/portfolioData.json'
import { resolveProjectImage } from '../../utils/helpers'
import useModalHistory from '../../hooks/useModalHistory'

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
    setTimeout(() => setIsFlipping(false), 450)
  }

  const handlePrev = () => {
    if (isFlipping) return
    setIsFlipping(true)
    setCurrentIndex((prev) => (prev - 1 < 0 ? totalExperiences - 1 : prev - 1))
    setTimeout(() => setIsFlipping(false), 450)
  }

  const handleJumpToExperience = (index) => {
    if (isFlipping || index === currentIndex) return
    setIsFlipping(true)
    setCurrentIndex(index)
    setTimeout(() => setIsFlipping(false), 450)
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

  // Intercept mobile back button to close modal instead of exiting page, and hide navbar
  useModalHistory(Boolean(selectedExperience), handleCloseDetail, 'experience')


  if (!experiences || experiences.length === 0) return null

  const selectedResponsibilities =
    selectedExperience?.responsibilities?.[currentLang] ||
    selectedExperience?.responsibilities?.vi ||
    []
  const selectedAchievements =
    selectedExperience?.achievements?.[currentLang] ||
    selectedExperience?.achievements?.vi ||
    []

  return (
    <section
      id="experience"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative min-h-screen min-h-[100dvh] md:h-[100dvh] w-full overflow-hidden flex flex-col justify-center md:justify-between items-center pt-14 pb-2 sm:pt-16 sm:pb-3 md:pt-18 md:pb-3.5 px-3.5 sm:px-6 md:px-8 lg:px-10 max-w-[1920px] mx-auto select-none gap-2 xs:gap-2.5 sm:gap-3 md:gap-2.5"
    >
      {/* ─── Section Header (Always Clear & Uncompressed) ───────────────────── */}
      <div className="text-center space-y-0.5 sm:space-y-1 relative z-10 w-full flex-shrink-0">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-mono tracking-widest uppercase bg-zinc-900/90 text-zinc-300 border border-white/20">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>03 / CAREER & WORK EXPERIENCE</span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-[0.08em] sm:tracking-[0.14em] text-white">
          {currentLang === 'vi' ? 'KINH NGHIỆM LÀM VIỆC' : 'WORK EXPERIENCE'}
        </h2>

        <p className="text-xs sm:text-sm font-mono tracking-wider uppercase text-zinc-400 max-w-xl lg:max-w-3xl mx-auto leading-relaxed px-2">
          {currentLang === 'vi'
            ? 'HÀNH TRÌNH PHÁT TRIỂN NĂNG LỰC KỸ THUẬT VÀ ĐÓNG GÓP THỰC TẾ TRONG DOANH NGHIỆP'
            : 'PROFESSIONAL ENGINEERING JOURNEY & MEASURABLE BUSINESS IMPACT'}
        </p>
      </div>

      {/* ─── Interactive Career Showcase Slider (Horizontal Slide & Compact Spacing) ────── */}
      <div className="w-full relative z-10 flex-shrink-0 md:flex-1 my-0 md:my-auto py-0.5 sm:py-1.5 flex items-center justify-center min-h-[460px] xs:min-h-[500px] sm:min-h-[540px] md:min-h-0 overflow-hidden">
        <div
          className="w-full h-full flex transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {experiences.map((exp, idx) => {
            const role = exp.role?.[currentLang] || exp.role?.vi || ''
            const company = exp.company?.[currentLang] || exp.company?.vi || ''
            const period = exp.period?.[currentLang] || exp.period?.vi || ''
            const location = exp.location?.[currentLang] || exp.location?.vi || ''
            const summary = exp.summary?.[currentLang] || exp.summary?.vi || ''
            const coverUrl = resolveProjectImage(exp.coverImage)
            const isCurrent = idx === currentIndex

            return (
              <div
                key={exp.id || idx}
                className="w-full h-full flex-shrink-0 px-0.5 sm:px-1 flex items-center justify-center"
                aria-hidden={!isCurrent}
              >
                <div
                  data-lens-card="true"
                  className="optical-lens-card borderless-desktop relative w-full h-full min-h-[460px] xs:min-h-[500px] sm:min-h-[540px] md:min-h-[440px] max-h-[580px] xs:max-h-[620px] lg:max-h-[640px] xl:max-h-[700px] 2xl:max-h-[760px] rounded-xl sm:rounded-2xl p-3.5 xs:p-4 sm:p-6 md:p-7 lg:p-8 flex flex-col justify-between overflow-hidden shadow-2xl md:shadow-none border border-white/[0.08] md:border-none hover:border-white/20 md:hover:border-none transition-all duration-500 bg-black/40 md:bg-transparent backdrop-blur-md md:backdrop-blur-none"
                >
                  {/* Desktop Full-bleed Translucent Cover Image with Diagonal 135deg Mask & Hover Color Trigger */}
                  {coverUrl && (
                    <div
                      onClick={() => handleOpenDetail(exp)}
                      className="hidden md:block group/image absolute inset-0 z-[5] overflow-hidden cursor-pointer"
                      style={{
                        clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)',
                        maskImage:
                          'linear-gradient(135deg, transparent 0%, transparent 18%, rgba(0,0,0,0.3) 38%, black 62%, black 85%, transparent 100%)',
                        WebkitMaskImage:
                          'linear-gradient(135deg, transparent 0%, transparent 18%, rgba(0,0,0,0.3) 38%, black 62%, black 85%, transparent 100%)',
                      }}
                    >
                      <img
                        src={coverUrl}
                        alt={role}
                        className="w-full h-full object-cover object-right sm:object-[center_right] filter grayscale contrast-110 brightness-[0.78] group-hover/image:brightness-90 opacity-35 group-hover/image:opacity-85 group-hover/image:grayscale-0 group-hover/image:scale-105 transition-all duration-700 ease-out"
                      />

                      {/* Dark overlay to tone down brightness & blend with deep black background */}
                      <div className="absolute inset-0 bg-black/50 group-hover/image:bg-black/30 transition-colors duration-700 pointer-events-none z-10" />

                      {/* Strong edge fade gradients to dissolve edges smoothly into black background */}
                      <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-transparent to-transparent pointer-events-none z-10" />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none z-10" />
                    </div>
                  )}

                  {/* Desktop Translucent Dark Glass behind Text */}
                  <div
                    className="hidden md:block absolute inset-0 z-0 pointer-events-none transition-all duration-700"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.65) 35%, rgba(0,0,0,0.2) 60%, transparent 80%)',
                    }}
                  />

                  {/* Header Metadata (Single source of truth for Location, Company & Period) */}
                  <div className="relative z-10 flex items-center justify-between border-b border-zinc-800/80 pb-2 sm:pb-3 mb-1 sm:mb-2 flex-wrap gap-1.5 sm:gap-2">
                    <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap">
                      <span className="px-2 sm:px-2.5 py-0.5 rounded-none text-[9px] sm:text-[11px] font-mono font-bold tracking-widest uppercase bg-white text-black">
                        {exp.type?.toUpperCase()}
                      </span>
                      <span className="text-[10px] sm:text-xs font-mono text-zinc-300 font-bold uppercase tracking-wider">
                        {company}
                      </span>
                      <span className="text-[10px] sm:text-xs font-mono text-zinc-400">
                        • {period}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono text-zinc-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="uppercase tracking-wider">{location}</span>
                    </div>
                  </div>

                  {/* Body: Mobile splits into Top-Info + Bottom-Image; Desktop keeps expansive Left-Info */}
                  <div className="relative z-10 my-auto py-1 sm:py-2 flex flex-col md:flex-row items-center w-full md:pointer-events-none">
                    {/* Top Half on Mobile / Left Column on Desktop */}
                    <div className="w-full md:w-[56%] lg:w-[54%] xl:w-[50%] space-y-1.5 xs:space-y-2 sm:space-y-3 lg:space-y-3.5 text-left pr-0 md:pr-6 md:pointer-events-auto">
                      <div>
                        <h3 className="text-base xs:text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-black uppercase text-white tracking-tight leading-tight">
                          {role}
                        </h3>
                      </div>

                      {/* Summary Description */}
                      <p className="text-xs sm:text-base lg:text-[16px] text-zinc-300 leading-relaxed font-sans line-clamp-2 xs:line-clamp-3 md:line-clamp-4 max-w-2xl">
                        {summary}
                      </p>

                      {/* Technologies */}
                      <div className="space-y-1 sm:space-y-1.5 pt-0.5 sm:pt-1">
                        <span className="text-[9px] sm:text-[11px] font-mono text-zinc-400 uppercase tracking-widest block font-semibold">
                          CORE TECHNOLOGIES:
                        </span>
                        <div className="flex flex-wrap gap-1 sm:gap-1.5">
                          {exp.technologies?.slice(0, 7).map((tech) => (
                            <span
                              key={tech}
                              className="text-[9px] sm:text-[11px] font-mono px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-none bg-black/60 text-zinc-200 border border-zinc-800 hover:border-white transition-colors"
                            >
                              {tech}
                            </span>
                          ))}
                          {exp.technologies?.length > 7 && (
                            <span className="text-[9px] sm:text-[11px] font-mono px-2 py-0.5 sm:py-1 rounded-none bg-zinc-900/80 text-white border border-zinc-700">
                              +{exp.technologies.length - 7} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-1 sm:pt-2.5 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(exp)}
                          className="w-full sm:w-auto justify-center px-4 sm:px-7 py-1.5 xs:py-2 sm:py-2.5 rounded-none bg-white hover:bg-zinc-200 text-black text-[10px] xs:text-[11px] sm:text-sm font-mono font-bold tracking-widest uppercase active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2"
                        >
                          <span>{currentLang === 'vi' ? 'XEM CHI TIẾT' : 'VIEW DETAILS'}</span>
                          <span>→</span>
                        </button>
                      </div>
                    </div>

                    {/* Bottom Half on Mobile: Dedicated clear, framed image */}
                    {coverUrl && (
                      <div
                        onClick={() => handleOpenDetail(exp)}
                        className="md:hidden relative w-full h-[150px] xs:h-[180px] sm:h-[210px] rounded-lg overflow-hidden border border-white/10 mt-2.5 cursor-pointer group/mobile-img flex-shrink-0 pointer-events-auto"
                      >
                        <img
                          src={coverUrl}
                          alt={role}
                          className="w-full h-full object-cover object-center group-hover/mobile-img:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-1.5 right-2 px-2 py-0.5 rounded bg-black/70 text-[9px] font-mono text-zinc-300 border border-white/10 flex items-center gap-1">
                          <span>TAP TO EXPAND</span>
                          <span>↗</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── Bottom Navigation Controls (Synchronized Full-Width Footer, buttons placed at the very edge) ─────── */}
      <div className="relative z-10 w-full flex items-center justify-between pt-1.5 xs:pt-2 pb-1 border-t border-zinc-800/80 gap-2 flex-shrink-0 px-0.5 sm:px-0">
        {/* Left: Keyboard & Gesture Hint */}
        <div className="hidden lg:flex items-center text-[10px] sm:text-[11px] font-mono text-zinc-400 tracking-wider">
          <span>
            USE <kbd className="px-1 py-0.5 rounded-none bg-zinc-900 border border-zinc-800 text-white font-mono">←</kbd> / <kbd className="px-1 py-0.5 rounded-none bg-zinc-900 border border-zinc-800 text-white font-mono">→</kbd> OR SWIPE
          </span>
        </div>

        {/* Center: Current / Total Experience + Quick Jump Dots */}
        <div className="flex items-center gap-1.5 sm:gap-3 text-xs font-mono">
          <span className="text-zinc-400 text-[10px] sm:text-xs tracking-wider uppercase font-semibold">
            EXP <span className="text-white font-bold text-xs sm:text-sm">0{currentIndex + 1}</span> / 0{totalExperiences}
          </span>
          <div className="flex gap-1 sm:gap-1.5 items-center">
            {experiences.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleJumpToExperience(idx)}
                className={`h-1.5 sm:h-2 transition-all duration-300 rounded-none cursor-pointer ${
                  idx === currentIndex
                    ? 'w-3.5 sm:w-6 bg-white'
                    : 'w-1.5 sm:w-2 bg-zinc-800 hover:bg-zinc-600'
                }`}
                aria-label={`Jump to experience ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right: Prev & Next Buttons (Placed at the very edge) */}
        <div className="flex items-center gap-1 sm:gap-2.5">
          <button
            type="button"
            onClick={handlePrev}
            disabled={isFlipping}
            aria-label="Previous Experience"
            className="flex items-center gap-1 px-2.5 sm:px-5 py-1 sm:py-1.5 rounded-none
              border border-zinc-700 bg-black hover:bg-white hover:text-black
              text-white text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase transition-all active:scale-95 disabled:opacity-30 cursor-pointer min-h-[30px] sm:min-h-[36px]"
          >
            <span>← PREV</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={isFlipping}
            aria-label={currentIndex >= totalExperiences - 1 ? 'Reset to first experience' : 'Next Experience'}
            className="flex items-center gap-1 px-2.5 sm:px-5 py-1 sm:py-1.5 rounded-none
              border border-zinc-700 bg-black hover:bg-white hover:text-black
              text-white text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase transition-all active:scale-95 disabled:opacity-30 cursor-pointer min-h-[30px] sm:min-h-[36px]"
          >
            <span>
              {currentIndex >= totalExperiences - 1 ? 'RESET ↺' : 'NEXT →'}
            </span>
          </button>
        </div>
      </div>

      {/* ─── Experience Details Deep-Dive Drawer (2/3 screen width on desktop, 100% on mobile) ─── */}
      {selectedExperience && (
        <div
          onClick={handleCloseDetail}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-md flex justify-end animate-fade-in"
        >
          <div
            ref={drawerRef}
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="relative w-full md:w-2/3 lg:w-2/3 h-full bg-black border-l border-zinc-800 shadow-2xl overflow-y-auto overscroll-contain flex flex-col justify-between p-4 sm:p-8 md:p-10 pt-[max(1.25rem,env(safe-area-inset-top))] custom-scrollbar animate-fade-in-up"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-zinc-800 sticky top-0 bg-black/95 backdrop-blur-md z-30 pt-1">
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
              {selectedResponsibilities.length > 0 && (
                <div className="space-y-2 sm:space-y-2.5 pt-2">
                  <h3 className="text-xs font-mono font-bold tracking-widest text-white uppercase flex items-center gap-2">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{currentLang === 'vi' ? 'Trách nhiệm & Nhiệm vụ cốt lõi' : 'Key Responsibilities'}</span>
                  </h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    {selectedResponsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 bg-zinc-950 p-3 rounded-none border border-zinc-800">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                        <span className="leading-relaxed font-sans">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Achievements */}
              {selectedAchievements.length > 0 && (
                <div className="space-y-2 sm:space-y-2.5 pt-2">
                  <h3 className="text-xs font-mono font-bold tracking-widest text-white uppercase flex items-center gap-2">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{currentLang === 'vi' ? 'Thành tựu & Đóng góp nổi bật' : 'Key Achievements & Impact'}</span>
                  </h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    {selectedAchievements.map((ach, idx) => (
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
    </section>
  )
}

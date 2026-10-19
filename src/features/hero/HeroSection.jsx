import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useTranslation } from 'react-i18next'
import { scrollToElement } from '../../utils/helpers'
import DocumentsModal from '../../components/common/DocumentsModal'

/**
 * HeroSection Component (SpaceX Aesthetic)
 * 
 * Fullscreen cinematic hero section inspired by the SpaceX homepage.
 * Built with layered gradients, starfield particles, and fail-safe GSAP entrance.
 */
export default function HeroSection({ onExploreClick }) {
  const { i18n } = useTranslation('portfolio')
  const currentLang = i18n.language === 'en' ? 'en' : 'vi'
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false)

  const heroRef = useRef(null)
  const contentRef = useRef(null)
  const scrollIndicatorRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = contentRef.current?.children ? Array.from(contentRef.current.children) : []

      if (elements.length > 0) {
        gsap.fromTo(
          elements,
          {
            opacity: 0,
            y: 35,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            stagger: 0.15,
            ease: 'power3.out',
            delay: 0.1,
          }
        )
      }

      if (scrollIndicatorRef.current) {
        gsap.fromTo(
          scrollIndicatorRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.6, ease: 'power2.out' }
        )

        gsap.to(scrollIndicatorRef.current, {
          y: 8,
          repeat: -1,
          yoyo: true,
          duration: 1.0,
          ease: 'power1.inOut',
          delay: 1.4,
        })
      }
    }, heroRef)

    return () => ctx.revert()
  }, [])

  const handleScrollDown = () => {
    if (onExploreClick) {
      onExploreClick()
      return
    }
    scrollToElement('about', 80)
  }

  const roleText =
    currentLang === 'vi'
      ? 'LẬP TRÌNH VIÊN'
      : 'SOFTWARE ENGINEER'

  const heroHeading =
    currentLang === 'vi'
      ? 'DƯƠNG ĐOÀN THUẬN'
      : 'DUONG DOAN THUAN'

  const missionText =
    currentLang === 'vi'
      ? 'PHÁT TRIỂN HỆ THỐNG TOÀN DIỆN: BACKEND HIỆU NĂNG CAO, KIẾN TRÚC PHÂN TÁN VÀ GIAO DIỆN HIỆN ĐẠI, MƯỢT MÀ'
      : 'END-TO-END SYSTEM ENGINEERING: HIGH-PERFORMANCE BACKEND, DISTRIBUTED ARCHITECTURE & SEAMLESS MODERN FRONTENDS.'

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen min-h-[100dvh] w-full overflow-hidden bg-transparent text-white select-none flex flex-col justify-center"
    >
      {/* ─── Layered Cosmic & Tech Backgrounds (SpaceX Minimal with 135° Diagonal Reveal) ── */}
      {/* 1. Diagonal Translucent Dark Gradient behind Left / Top-Left Typography */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          background:
            'linear-gradient(135deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.72) 32%, rgba(0,0,0,0.2) 55%, transparent 72%)',
        }}
      />

      {/* 2. SpaceX Rocket Wallpaper (Fades out diagonally to reveal cosmic background in bottom-right) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-35 mix-blend-screen transform scale-105 transition-transform duration-1000 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1517976487507-5b62b1b38f87?q=80&w=2000&auto=format&fit=crop')`,
          maskImage:
            'linear-gradient(135deg, black 0%, black 25%, rgba(0,0,0,0.4) 48%, transparent 68%)',
          WebkitMaskImage:
            'linear-gradient(135deg, black 0%, black 25%, rgba(0,0,0,0.4) 48%, transparent 68%)',
        }}
      />

      {/* 3. Subtle Top-Edge Vignette for Clean Navbar Integration */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/75 to-transparent pointer-events-none" />

      {/* ─── Content: Vertically Centered with SpaceX Left-Aligned Typography ─── */}
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-[1800px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-16 sm:py-20 flex flex-col items-start text-left space-y-3 sm:space-y-4 my-auto"
      >
        {/* Mission Subtitle */}
        <p className="text-[11px] sm:text-xs md:text-sm font-mono tracking-[0.25em] sm:tracking-[0.35em] uppercase text-zinc-400 font-semibold">
          {roleText}
        </p>

        {/* Main Headline (Scaled down for refined SpaceX editorial typography) */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black uppercase tracking-[0.06em] sm:tracking-[0.1em] text-white leading-tight break-words max-w-full">
          {heroHeading}
        </h1>

        {/* Mission / Bio statement */}
        <p className="text-xs sm:text-sm md:text-base font-light tracking-[0.12em] sm:tracking-[0.2em] text-zinc-300 max-w-2xl lg:max-w-3xl xl:max-w-4xl uppercase leading-relaxed pb-1 sm:pb-2">
          {missionText}
        </p>

        {/* Action Buttons: SpaceX Signature High-Contrast Style */}
        <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3 sm:gap-4 z-20">
          <button
            type="button"
            onClick={handleScrollDown}
            className="px-6 sm:px-8 py-3 rounded-none sm:rounded-sm bg-white hover:bg-zinc-200 text-black font-mono text-xs sm:text-sm font-bold tracking-widest uppercase transition-all cursor-pointer flex items-center gap-2 active:scale-95 shadow-none"
          >
            <span>{currentLang === 'vi' ? 'KHÁM PHÁ DỰ ÁN' : 'EXPLORE PROJECTS'}</span>
            <span>↓</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDocsModalOpen(true)}
            className="px-6 sm:px-8 py-3 rounded-none sm:rounded-sm bg-transparent hover:bg-white hover:text-black text-white font-mono text-xs sm:text-sm font-bold tracking-widest uppercase border border-white/60 hover:border-white transition-all cursor-pointer flex items-center gap-2 backdrop-blur-sm active:scale-95 shadow-none"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{currentLang === 'vi' ? 'TẢI CV & BẢNG ĐIỂM' : 'RESUME & TRANSCRIPT'}</span>
          </button>
        </div>
      </div>

      {/* ─── Scroll Down Bouncing Arrow (Bottom Center) ─────────────────────── */}
      <div
        ref={scrollIndicatorRef}
        onClick={handleScrollDown}
        className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 cursor-pointer p-2 text-white/80 hover:text-white transition-colors"
        role="button"
        tabIndex={0}
        aria-label="Scroll to content"
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase opacity-70">
            SCROLL
          </span>
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
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

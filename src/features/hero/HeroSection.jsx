import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useTranslation } from 'react-i18next'
import portfolioData from '../../data/portfolioData.json'
import { scrollToElement } from '../../utils/helpers'

/**
 * HeroSection Component (SpaceX Aesthetic)
 * 
 * Fullscreen cinematic hero section inspired by the SpaceX homepage.
 * Built with layered gradients, starfield particles, and fail-safe GSAP entrance.
 */
export default function HeroSection({ onExploreClick }) {
  const { t, i18n } = useTranslation('portfolio')
  const currentLang = i18n.language === 'en' ? 'en' : 'vi'

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
      ? 'XÂY DỰNG PHẦN MỀM, TỐI ƯU HIỆU NĂNG, MANG GIẢI PHÁP THỰC TẾ'
      : 'BUILDING SOFTWARE, OPTIMIZING PERFORMANCE, BRINGING PRACTICAL SOLUTIONS TO REALITY.'

  return (
    <section
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden bg-slate-950 text-white select-none flex flex-col justify-between"
    >
      {/* ─── Layered Cosmic & Tech Backgrounds ─────────────────────────────── */}
      {/* 1. Deep Space Nebula Radial Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950 to-black" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* 2. SpaceX Rocket Wallpaper (Optional external layer with graceful fallback) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-screen transform scale-105 transition-transform duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1517976487507-5b62b1b38f87?q=80&w=2000&auto=format&fit=crop')`,
        }}
      />

      {/* 3. Dark Contrast Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />

      {/* 4. Subtle Starfield Grid */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#60a5fa_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

      {/* Top spacer for navbar clearance */}
      <div className="relative z-10 w-full h-20" />

      {/* ─── Content: SpaceX Bottom-Left Positioning ──────────────────────── */}
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-20 pb-28 md:pb-32 flex flex-col items-start text-left space-y-4"
      >
        {/* Mission Subtitle */}
        <p className="text-xs sm:text-sm font-mono tracking-[0.3em] uppercase text-blue-400 font-semibold">
          {roleText}
        </p>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold uppercase tracking-[0.12em] text-white leading-none drop-shadow-lg">
          {heroHeading}
        </h1>

        {/* Mission / Bio statement */}
        <p className="text-xs sm:text-sm md:text-base font-light tracking-[0.2em] text-slate-300 max-w-2xl uppercase leading-relaxed pb-2">
          {missionText}
        </p>
      </div>

      {/* ─── Scroll Down Bouncing Arrow (Bottom Center) ─────────────────────── */}
      <div
        ref={scrollIndicatorRef}
        onClick={handleScrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 cursor-pointer p-2 text-white/80 hover:text-white transition-colors"
        role="button"
        tabIndex={0}
        aria-label="Scroll to content"
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase opacity-70">
            SCROLL
          </span>
          <svg
            className="w-6 h-6 animate-pulse"
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
    </section>
  )
}

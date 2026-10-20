import React, { useState, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useTranslation } from 'react-i18next'
import portfolioData from '../../data/portfolioData.json'
import { typography } from '../../config/typography'

gsap.registerPlugin(ScrollTrigger)

/**
 * SkillsSection Component (Interactive Vertical Stack / Hover Accordion)
 * 
 * Features:
 * - Dynamic loading of all categories from `portfolioData.json`
 * - Vertical stack layout: Compact list by default, smooth slide-out expansion on hover
 * - Strictly fits 100% fullscreen height (`h-screen` / `100dvh`) with zero overflow
 * - Glowing neon pill tags and active indicator dots
 */
export default function SkillsSection() {
  const { i18n } = useTranslation('portfolio')
  const currentLang = i18n.language === 'en' ? 'en' : 'vi'
  const containerRef = useRef(null)

  const skillsData = portfolioData.about?.skills || {}
  
  // Transform dynamic skills object to ordered category array
  const categories = Object.entries(skillsData).map(([key, data], idx) => ({
    key,
    indexNumber: idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`,
    title: data.title?.[currentLang] || data.title?.vi || key,
    items: data.items || [],
  }))

  // Default active category is the first one
  const [activeKey, setActiveKey] = useState(categories[0]?.key || '')

  useGSAP(
    () => {
      const items = gsap.utils.toArray('.skill-stack-row')
      if (!items.length) return

      gsap.from(items, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })
    },
    { scope: containerRef }
  )

  return (
    <section
      id="skills"
      ref={containerRef}
      className="relative min-h-screen min-h-[100dvh] md:h-[100dvh] w-full overflow-hidden flex flex-col justify-between items-center pt-20 pb-6 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-[1800px] mx-auto select-none"
    >
      {/* ─── Section Header (SpaceX Minimal) ─────────────────────────────────── */}
      <div className="text-center space-y-1 mb-2 relative z-10 w-full">
        <div className={`inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-zinc-900 border border-white/20 ${typography.skills.sectionBadge}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>02 / CAPABILITIES & STACK</span>
        </div>

        <h2 className={typography.skills.sectionTitle}>
          {currentLang === 'vi' ? 'KỸ NĂNG CHUYÊN MÔN' : 'SKILLS & TECHNOLOGIES'}
        </h2>

        <p className={typography.skills.sectionSubtitle}>
          {currentLang === 'vi'
            ? 'CHẠM HOẶC RÊ CHUỘT VÀO TỪNG DANH MỤC ĐỂ XEM CHI TIẾT CÔNG NGHỆ'
            : 'TAP OR HOVER OVER EACH CATEGORY TO EXPAND DETAILED TECH STACK'}
        </p>
      </div>

      {/* ─── Vertical Stack Container (Accordion Flow) ─────────────────────── */}
      <div className="w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto space-y-2 sm:space-y-2.5 my-auto relative z-10 py-1">
        {categories.map((cat) => {
          const isActive = activeKey === cat.key

          return (
            <div
              key={cat.key}
              data-lens-card="true"
              onMouseEnter={() => {
                if (window.innerWidth >= 768) {
                  setActiveKey(cat.key)
                }
              }}
              onClick={() => setActiveKey(cat.key)}
              className={`skill-stack-row optical-lens-card group relative rounded-xl transition-all duration-300 cursor-pointer overflow-hidden ${
                isActive
                  ? 'border-white/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45)] p-3.5 sm:p-4 md:p-5'
                  : 'p-2.5 sm:p-3 md:p-3.5 opacity-85 hover:opacity-100'
              }`}
            >
              {/* Row Header Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
                  {/* Category Number Badge */}
                  <span
                    className={`px-2 sm:px-2.5 py-0.5 rounded-md transition-colors flex-shrink-0 ${
                      isActive
                        ? `${typography.skills.categoryIndex} bg-white text-black border border-white`
                        : 'font-mono text-[11px] sm:text-xs font-bold bg-black text-zinc-500 border border-zinc-800'
                    }`}
                  >
                    //{cat.indexNumber}
                  </span>

                  {/* Category Title */}
                  <h3
                    className={`transition-colors truncate ${typography.skills.categoryTitle} ${
                      isActive
                        ? 'text-white'
                        : 'text-zinc-300 group-hover:text-white'
                    }`}
                  >
                    {cat.title}
                  </h3>
                </div>

                {/* Right Status / Count Indicator */}
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
                  <span className={typography.skills.categoryCount}>
                    {cat.items.length} {currentLang === 'vi' ? 'MỤC' : 'ITEMS'}
                  </span>

                  {/* Expand/Collapse Chevron Indicator */}
                  <div
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-transform duration-300 ${
                      isActive
                        ? 'bg-white text-black rotate-90'
                        : 'bg-black text-zinc-600 group-hover:text-zinc-300 border border-zinc-800'
                    }`}
                  >
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* ─── Expandable Details Content Area ───────────────────────── */}
              <div
                className={`transition-all duration-300 ease-out overflow-hidden ${
                  isActive
                    ? 'max-h-60 sm:max-h-48 md:max-h-36 opacity-100 mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-zinc-800'
                    : 'max-h-0 opacity-0 mt-0 pt-0'
                }`}
              >
                <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-0.5">
                  {cat.items.map((skill) => (
                    <span
                      key={skill}
                      className={`inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg
                        bg-black border border-zinc-700
                        hover:border-white transition-all duration-200 select-none cursor-default ${typography.skills.skillPill}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white mr-1.5 sm:mr-2" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ─── Bottom Footer Hint ─────────────────────────────────────────────── */}
      <div className={`relative z-10 w-full pt-2 pb-1 border-t border-slate-800/60 flex flex-col xs:flex-row items-center justify-between gap-1 text-center ${typography.skills.footerHint}`}>
        <span>6 DOMAINS / TOTAL STACK</span>
        <span>STATUS: ACTIVE & CONTINUOUSLY EVOLVING</span>
      </div>
    </section>
  )
}

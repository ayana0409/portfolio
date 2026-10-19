import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import InfoTemplate from './ProjectDetails/InfoTemplate'
import GalleryTemplate from './ProjectDetails/GalleryTemplate'
import portfolioData from '../../data/portfolioData.json'
import { resolveProjectImage } from '../../utils/helpers'
import useModalHistory from '../../hooks/useModalHistory'

/**
 * ProjectBook Component
 * 
 * Fits 100% strictly inside fullscreen viewport (`h-screen` / `100dvh`) with `pt-20 pb-4`
 * to guarantee that the fixed navbar NEVER overlaps or crops any content.
 */
export default function ProjectBook() {
  const { t, i18n } = useTranslation('portfolio')
  const currentLang = i18n.language === 'en' ? 'en' : 'vi'

  const projects = portfolioData.projects || []
  const totalProjects = projects.length

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedProject, setSelectedProject] = useState(null)
  const [isFlipping, setIsFlipping] = useState(false)

  // Array of page DOM refs
  const pageRefs = useRef([])
  const shadowRefs = useRef([])
  const drawerRef = useRef(null)

  // Keep refs trimmed
  pageRefs.current = pageRefs.current.slice(0, totalProjects)
  shadowRefs.current = shadowRefs.current.slice(0, totalProjects)

  /**
   * Reset all pages to initial state for a target index
   */
  const setPageVisibility = (activeIndex) => {
    pageRefs.current.forEach((el, idx) => {
      if (!el) return
      if (idx === activeIndex) {
        gsap.set(el, {
          visibility: 'visible',
          opacity: 1,
          rotateY: 0,
          x: 0,
          scale: 1,
          y: 0,
          zIndex: 25,
        })
      } else if (idx < activeIndex) {
        gsap.set(el, {
          visibility: 'hidden',
          opacity: 0,
          rotateY: -110,
          x: -40,
          zIndex: 10,
        })
      } else {
        gsap.set(el, {
          visibility: 'hidden',
          opacity: 0,
          rotateY: 0,
          x: 0,
          scale: 0.98,
          y: 10,
          zIndex: 10,
        })
      }
    })
  }

  // Ensure clean initial render state
  useEffect(() => {
    setPageVisibility(currentIndex)
  }, [currentIndex])

  /**
   * Handle Next Page / Book Close Loop
   */
  const handleNextPage = useCallback(() => {
    if (isFlipping || totalProjects <= 1) return

    // ── CASE A: LAST PAGE ➔ CLOSE ALL PAGES SEQUENTIALLY TO PAGE 1 ──────────
    if (currentIndex >= totalProjects - 1) {
      setIsFlipping(true)

      const pagesToFold = []
      for (let i = totalProjects - 2; i >= 0; i--) {
        if (pageRefs.current[i]) {
          pagesToFold.push(pageRefs.current[i])
        }
      }

      if (pagesToFold.length > 0) {
        pagesToFold.forEach((el, idx) => {
          gsap.set(el, {
            visibility: 'visible',
            opacity: 0,
            rotateY: -110,
            x: -40,
            zIndex: 30 + idx,
          })
        })

        gsap.to(pagesToFold, {
          rotateY: 0,
          x: 0,
          opacity: 1,
          duration: 0.45,
          stagger: 0.12,
          ease: 'power2.out',
          onComplete: () => {
            setCurrentIndex(0)
            setPageVisibility(0)
            setIsFlipping(false)
          },
        })
      } else {
        setCurrentIndex(0)
        setPageVisibility(0)
        setIsFlipping(false)
      }
      return
    }

    // ── CASE B: NORMAL NEXT PAGE FLIP ───────────────────────────────────────
    setIsFlipping(true)
    const nextIdx = currentIndex + 1
    const currentPageEl = pageRefs.current[currentIndex]
    const nextPageEl = pageRefs.current[nextIdx]
    const currentShadowEl = shadowRefs.current[currentIndex]

    // Prepare next page beneath
    if (nextPageEl) {
      gsap.set(nextPageEl, {
        visibility: 'visible',
        opacity: 0,
        scale: 0.98,
        y: 10,
        rotateY: 0,
        x: 0,
        zIndex: 15,
      })
    }

    if (currentPageEl) {
      gsap.set(currentPageEl, { zIndex: 25 })
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(nextIdx)
        setPageVisibility(nextIdx)
        setIsFlipping(false)
      },
    })

    // 1. Current page flips left
    if (currentPageEl) {
      tl.to(currentPageEl, {
        rotateY: -110,
        x: -40,
        opacity: 0,
        transformOrigin: 'left center',
        duration: 0.6,
        ease: 'power2.inOut',
      })
    }

    // 2. Spine shadow effect
    if (currentShadowEl) {
      tl.to(
        currentShadowEl,
        { opacity: 0.8, duration: 0.25, ease: 'power1.in' },
        0
      )
    }

    // 3. Next page fades up cleanly from below
    if (nextPageEl) {
      tl.to(
        nextPageEl,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.55,
          ease: 'power2.out',
        },
        0.1
      )
    }
  }, [currentIndex, isFlipping, totalProjects])

  /**
   * Jump directly to a page
   */
  const handleJumpToPage = useCallback((targetIdx) => {
    if (isFlipping || targetIdx === currentIndex) return
    setIsFlipping(true)

    setPageVisibility(targetIdx)
    setCurrentIndex(targetIdx)
    setIsFlipping(false)
  }, [currentIndex, isFlipping])

  /**
   * Handle Previous Page Flip
   */
  const handlePrevPage = useCallback(() => {
    if (isFlipping || totalProjects <= 1) return

    if (currentIndex <= 0) {
      handleJumpToPage(totalProjects - 1)
      return
    }

    setIsFlipping(true)
    const prevIdx = currentIndex - 1
    const prevPageEl = pageRefs.current[prevIdx]
    const currentPageEl = pageRefs.current[currentIndex]

    if (prevPageEl) {
      gsap.set(prevPageEl, {
        visibility: 'visible',
        opacity: 0,
        rotateY: -110,
        x: -40,
        zIndex: 30,
        transformOrigin: 'left center',
      })
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(prevIdx)
        setPageVisibility(prevIdx)
        setIsFlipping(false)
      },
    })

    if (prevPageEl) {
      tl.to(prevPageEl, {
        rotateY: 0,
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      })
    }

    if (currentPageEl) {
      tl.to(
        currentPageEl,
        {
          scale: 0.98,
          y: 10,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.inOut',
        },
        0
      )
    }
  }, [currentIndex, handleJumpToPage, isFlipping, totalProjects])

  // Open & Close Details Drawer
  const handleOpenDetail = (project) => {
    setSelectedProject(project)
  }

  const handleCloseDetail = () => {
    if (drawerRef.current) {
      gsap.to(drawerRef.current, {
        x: '100%',
        duration: 0.3,
        ease: 'power3.in',
        onComplete: () => setSelectedProject(null),
      })
    } else {
      setSelectedProject(null)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return

      if (e.key === 'Escape' && selectedProject) {
        handleCloseDetail()
      } else if (!selectedProject) {
        if (e.key === 'ArrowRight' || e.key === 'PageDown') {
          handleNextPage()
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          handlePrevPage()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNextPage, handlePrevPage, selectedProject])

  // Intercept mobile back button to close modal instead of exiting page, and hide navbar
  useModalHistory(Boolean(selectedProject), handleCloseDetail, 'project')

  // Touch gesture swipe detection for mobile
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const diffX = touchStartX.current - e.changedTouches[0].clientX
    const diffY = touchStartY.current - e.changedTouches[0].clientY

    // Horizontal swipe threshold > 40px and dominant over vertical scroll
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        handleNextPage()
      } else {
        handlePrevPage()
      }
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  return (
    <section
      id="projects"
      className="relative min-h-screen min-h-[100dvh] md:h-[100dvh] w-full pt-14 pb-2 sm:pt-16 sm:pb-3 md:pt-18 md:pb-3.5 px-3.5 sm:px-6 md:px-8 lg:px-10 flex flex-col justify-center md:justify-between items-center overflow-hidden bg-transparent text-white select-none max-w-[1920px] mx-auto gap-2 xs:gap-2.5 sm:gap-3 md:gap-2.5"
    >
      {/* ─── Section Header (SpaceX Minimal - Always Clear & Uncompressed) ─── */}
      <div className="text-center space-y-0.5 sm:space-y-1 relative z-10 w-full flex-shrink-0">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-mono tracking-widest uppercase bg-zinc-900/90 text-zinc-300 border border-white/20">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>{currentLang === 'vi' ? '04 / DỰ ÁN CÁ NHÂN' : '04 / PERSONAL PROJECTS'}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-[0.08em] sm:tracking-[0.14em] text-white">
          {currentLang === 'vi' ? 'DỰ ÁN CÁ NHÂN' : 'PERSONAL PROJECTS'}
        </h2>

        <p className="text-xs sm:text-sm font-mono tracking-widest uppercase text-zinc-400 max-w-xl lg:max-w-3xl mx-auto leading-relaxed px-2">
          {currentLang === 'vi'
            ? 'CÁC DỰ ÁN CÁ NHÂN TÂM HUYẾT CỦA TÔI'
            : 'MY PASSIONATE PERSONAL PROJECTS'}
        </p>
      </div>

      {/* ─── 3D Book Stage (Compact Spacing on Mobile) ────────── */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative z-10 flex-shrink-0 md:flex-1 w-full flex items-center justify-center my-0 md:my-auto py-0.5 sm:py-1.5 [perspective:2200px] min-h-[460px] xs:min-h-[500px] sm:min-h-[540px] md:min-h-0"
      >
        {/* Book Outer Frame (Optical Lens Stage) */}
        <div data-lens-card="true" className="optical-lens-card borderless-desktop relative w-full h-full min-h-[460px] xs:min-h-[500px] sm:min-h-[540px] md:min-h-[440px] max-h-[580px] xs:max-h-[620px] lg:max-h-[640px] xl:max-h-[700px] 2xl:max-h-[760px] rounded-xl sm:rounded-2xl p-1 sm:p-1.5 [transform-style:preserve-3d] border border-white/[0.08] md:border-none shadow-2xl md:shadow-none bg-black/40 md:bg-transparent backdrop-blur-md md:backdrop-blur-none">
          {/* Left Spine Binding (Realistic Book Hinge) */}
          <div className="absolute inset-y-0 left-0 w-4 sm:w-8 md:w-10 bg-gradient-to-r from-black/80 via-zinc-950/60 to-transparent border-r border-white/10 md:border-r-white/5 rounded-l-xl sm:rounded-l-2xl z-40 pointer-events-none flex flex-col justify-between items-center py-3 sm:py-6">
            <div className="w-1 h-3 sm:h-6 bg-white/40 rounded-none" />
            <span className="[writing-mode:vertical-rl] rotate-180 text-[6px] sm:text-[8px] font-mono tracking-widest text-zinc-500 uppercase font-bold">
              PROJECT SHOWCASE
            </span>
            <div className="w-1 h-3 sm:h-6 bg-white/40 rounded-none" />
          </div>

          {/* ─── Solid Opaque Pages (Zero Overlapping / No Bleed) ─────────────── */}
          {projects.map((project, idx) => {
            const isCurrent = idx === currentIndex
            const pageNumber = idx + 1
            const title = project.title?.[currentLang] || project.title?.vi || ''
            const summary = project.summary?.[currentLang] || project.summary?.vi || ''

            return (
              <div
                key={project.id}
                ref={(el) => (pageRefs.current[idx] = el)}
                className={`group absolute inset-1 sm:inset-1.5 pl-6 sm:pl-10 md:pl-14 pr-3.5 sm:pr-6 md:pr-8 py-3 sm:py-5
                  rounded-xl sm:rounded-2xl bg-black/45 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border border-white/[0.06] md:border-none shadow-2xl md:shadow-none flex flex-col justify-between
                  [transform-style:preserve-3d] select-none overflow-hidden ${isCurrent ? 'pointer-events-auto' : 'pointer-events-none'}`}
                style={{
                  visibility: isCurrent ? 'visible' : 'hidden',
                  opacity: isCurrent ? 1 : 0,
                  zIndex: isCurrent ? 25 : 10,
                  transformOrigin: 'left center',
                }}
              >
                {/* Full-bleed Translucent Cover Image with Diagonal 135deg Fade Mask & Bottom-Right/Center Hover Trigger */}
                {project.coverImage && (
                  <div
                    onClick={() => handleOpenDetail(project)}
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
                      src={resolveProjectImage(project.coverImage)}
                      alt={title}
                      className="w-full h-full object-cover object-right sm:object-[center_right] filter grayscale contrast-110 brightness-[0.78] group-hover/image:brightness-90 opacity-35 group-hover/image:opacity-85 group-hover/image:grayscale-0 group-hover/image:scale-105 transition-all duration-700 ease-out"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />

                    {/* Dark overlay to tone down brightness & blend with deep black background */}
                    <div className="absolute inset-0 bg-black/50 group-hover/image:bg-black/30 transition-colors duration-700 pointer-events-none z-10" />

                    {/* Strong edge fade gradients to dissolve edges smoothly into black background */}
                    <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-transparent to-transparent pointer-events-none z-10" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none z-10" />
                  </div>
                )}

                {/* Translucent Dark Glass behind Text - See-through but Dark Tinted along diagonal / */}
                <div
                  className="hidden md:block absolute inset-0 z-0 pointer-events-none transition-all duration-700"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.65) 35%, rgba(0,0,0,0.2) 60%, transparent 80%)',
                  }}
                />

                {/* Dynamic Spine Shadow for this page */}
                <div
                  ref={(el) => (shadowRefs.current[idx] = el)}
                  className="absolute inset-y-0 left-0 w-24 sm:w-32 bg-gradient-to-r from-black/95 via-black/40 to-transparent pointer-events-none z-30 opacity-0"
                />

                {/* Page Top Header (Single metadata, no duplicate page count) */}
                <div className="relative z-10 flex items-center justify-between pb-1.5 sm:pb-2.5 border-b border-zinc-800/80">
                  <div className="flex items-center gap-1.5 sm:gap-2.5">
                    <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-none text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest bg-white text-black">
                      <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                      TYPE: {project.type}
                    </span>
                    <span className="text-[9px] sm:text-[11px] font-mono text-zinc-400">
                      #{project.id}
                    </span>
                  </div>

                  <span className="text-[9px] sm:text-[11px] font-mono text-zinc-300 uppercase tracking-widest font-semibold">
                    {project.category} • {project.year}
                  </span>
                </div>

                {/* Page Body: Mobile splits into Top-Info + Bottom-Image; Desktop keeps expansive Left-Info */}
                <div className="relative z-10 my-auto py-1 sm:py-2 flex flex-col md:flex-row items-center w-full md:pointer-events-none">
                  {/* Top Half on Mobile / Left Column on Desktop */}
                  <div className="w-full md:w-[56%] lg:w-[54%] xl:w-[50%] space-y-1.5 xs:space-y-2 sm:space-y-3 lg:space-y-3.5 text-left pr-0 md:pr-6 md:pointer-events-auto">
                    <div>
                      <h3 className="text-base xs:text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                        {title}
                      </h3>
                    </div>

                    {/* Summary Description */}
                    <p className="text-xs sm:text-base lg:text-[16px] text-zinc-300 leading-relaxed font-sans line-clamp-2 xs:line-clamp-3 md:line-clamp-4 max-w-2xl whitespace-pre-line">
                      {summary}
                    </p>

                    {/* Tech Stack Pills */}
                    <div className="space-y-1 sm:space-y-1.5 pt-0.5 sm:pt-1">
                      <span className="text-[9px] sm:text-[11px] font-mono tracking-widest uppercase text-zinc-400 block font-semibold">
                        TECH STACK:
                      </span>
                      <div className="flex flex-wrap gap-1 sm:gap-1.5">
                        {project.technologies?.slice(0, 7).map((tech) => (
                          <span
                            key={tech}
                            className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[11px] font-mono rounded-none bg-black/60 border border-zinc-800 text-zinc-200 hover:border-white hover:text-white transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies?.length > 7 && (
                          <span className="px-1.5 py-0.5 text-[9px] sm:text-[11px] font-mono rounded-none bg-zinc-900/80 text-white border border-zinc-700">
                            +{project.technologies.length - 7} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action CTA Buttons */}
                    <div className="pt-1 sm:pt-2.5 flex items-center gap-2 sm:gap-3 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(project)}
                        className="group/btn relative inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-7 py-1.5 xs:py-2 sm:py-2.5 rounded-none
                          bg-white hover:bg-zinc-200 text-black font-mono font-bold text-[10px] xs:text-[11px] sm:text-sm
                          uppercase tracking-widest
                          transition-all duration-200 active:scale-95 cursor-pointer"
                      >
                        <span>{currentLang === 'vi' ? 'KHÁM PHÁ DỰ ÁN' : 'EXPLORE PROJECT'}</span>
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform transition-transform duration-300 group-hover/btn:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </button>

                      {project.links?.source && (
                        <a
                          href={project.links.source}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 xs:py-2 sm:py-2.5 rounded-none text-[10px] xs:text-[11px] sm:text-xs font-mono font-bold tracking-widest uppercase
                            border border-zinc-700 bg-black/60 hover:bg-white hover:text-black text-white transition-all"
                        >
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                          </svg>
                          <span>CODE</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Bottom Half on Mobile: Dedicated clear, framed image */}
                  {project.coverImage && (
                    <div
                      onClick={() => handleOpenDetail(project)}
                      className="md:hidden relative w-full h-[150px] xs:h-[180px] sm:h-[210px] rounded-lg overflow-hidden border border-white/10 mt-2.5 cursor-pointer group/mobile-img flex-shrink-0"
                    >
                      <img
                        src={resolveProjectImage(project.coverImage)}
                        alt={title}
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

        {/* Center: Current / Total Page + Quick Jump Dots */}
        <div className="flex items-center gap-1.5 sm:gap-3 text-xs font-mono">
          <span className="text-zinc-400 text-[10px] sm:text-xs tracking-wider uppercase font-semibold">
            PAGE <span className="text-white font-bold text-xs sm:text-sm">0{currentIndex + 1}</span> / 0{totalProjects}
          </span>
          <div className="flex gap-1 sm:gap-1.5 items-center">
            {projects.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleJumpToPage(idx)}
                className={`h-1.5 sm:h-2 transition-all duration-300 rounded-none cursor-pointer ${
                  idx === currentIndex
                    ? 'w-3.5 sm:w-6 bg-white'
                    : 'w-1.5 sm:w-2 bg-zinc-800 hover:bg-zinc-600'
                }`}
                aria-label={`Jump to project ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right: Prev & Next Buttons (Placed at the very edge) */}
        <div className="flex items-center gap-1 sm:gap-2.5">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={isFlipping}
            aria-label="Previous Project"
            className="flex items-center gap-1 px-2.5 sm:px-5 py-1 sm:py-1.5 rounded-none
              border border-zinc-700 bg-black hover:bg-white hover:text-black
              text-white text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase transition-all active:scale-95 disabled:opacity-30 cursor-pointer min-h-[30px] sm:min-h-[36px]"
          >
            <span>← PREV</span>
          </button>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={isFlipping}
            aria-label={currentIndex >= totalProjects - 1 ? 'Reset to first project' : 'Next Project'}
            className="flex items-center gap-1 px-2.5 sm:px-5 py-1 sm:py-1.5 rounded-none
              border border-zinc-700 bg-black hover:bg-white hover:text-black
              text-white text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase transition-all active:scale-95 disabled:opacity-30 cursor-pointer min-h-[30px] sm:min-h-[36px]"
          >
            <span>
              {currentIndex >= totalProjects - 1 ? 'RESET ↺' : 'NEXT →'}
            </span>
          </button>
        </div>
      </div>

      {/* ─── Project Details Deep-Dive Drawer (Slide-Over View) ───────────────── */}
      {selectedProject && (
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
            {/* Drawer Top Navigation */}
            <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-zinc-800 sticky top-0 bg-black/95 backdrop-blur-md z-30 pt-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white" />
                <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-zinc-300 font-bold">
                  Project Deep Dive
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

            {/* Drawer Body: Comprehensive Project Details Rendering */}
            <div className="py-4 sm:py-6 space-y-5 sm:space-y-6 flex-1">
              <InfoTemplate project={selectedProject} />
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 sm:pt-6 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="hidden sm:inline uppercase tracking-wider">Press ESC to exit</span>
              <button
                type="button"
                onClick={handleCloseDetail}
                className="text-white hover:underline cursor-pointer font-bold tracking-wider uppercase"
              >
                ← Return to showcase
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

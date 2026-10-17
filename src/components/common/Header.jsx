import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageToggle from './LanguageToggle'
import DocumentsModal from './DocumentsModal'
import portfolioData from '../../data/portfolioData.json'

/**
 * Header Component (Active Scroll-Synced Navbar - Pure Dark Mode)
 * 
 * Features:
 * - Dedicated Dark-Only Aesthetic
 * - Real-time scroll spy: Automatically highlights active section in sync with scroll & snap
 * - Auto-hide on scroll down, auto-reveal on scroll up
 * - Desktop: Transparent downward gradient fade with progressive backdrop blur
 * - Desktop nav: Frosted glass pill with subtle top-to-bottom transparency
 * - Smooth scroll navigation when clicking links
 * - Full Responsive Mobile Navigation with animated Hamburger & Slide-down Drawer
 * - Active pill indicator with subtle cyan/blue neon glow
 * - Direct access to Master CV and Academic Transcript download modal
 */
export default function Header() {
  const { t, i18n } = useTranslation('portfolio')
  const currentLang = i18n.language === 'en' ? 'en' : 'vi'
  const [activeSection, setActiveSection] = useState('hero')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)
  const lastScrollUpTime = useRef(0)

  const navLinks = [
    { id: 'about', href: '#about', label: t('nav.about', currentLang === 'vi' ? 'Giới thiệu' : 'About') },
    { id: 'skills', href: '#skills', label: t('ui.navItems.skills', currentLang === 'vi' ? 'Kỹ năng' : 'Skills') },
    { id: 'experience', href: '#experience', label: t('ui.navItems.experience', currentLang === 'vi' ? 'Kinh nghiệm' : 'Experience') },
    { id: 'projects', href: '#projects', label: t('nav.projects', currentLang === 'vi' ? 'Dự án' : 'Projects') },
    { id: 'contact', href: '#contact', label: t('nav.contact', currentLang === 'vi' ? 'Liên hệ' : 'Contact') },
  ]

  // Auto-sync active section on scroll using IntersectionObserver
  useEffect(() => {
    const sectionIds = ['about', 'skills', 'experience', 'projects', 'contact']
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        threshold: 0.25,
        rootMargin: '-60px 0px -20% 0px',
      }
    )

    sections.forEach((sec) => observer.observe(sec))

    return () => {
      observer.disconnect()
    }
  }, [])

  // Auto-hide on scroll down, reveal on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Highlight hero when near top
      if (currentScrollY < 180) {
        setActiveSection('hero')
      }

      // Always show when near page top
      if (currentScrollY < 50) {
        setIsVisible(true)
        lastScrollY.current = currentScrollY
        return
      }

      // Do not auto-hide while mobile drawer is open
      if (isMobileMenuOpen) {
        setIsVisible(true)
        lastScrollY.current = currentScrollY
        return
      }

      const diff = currentScrollY - lastScrollY.current

      // Filter out micro-scroll / momentum jitter
      if (Math.abs(diff) < 10) {
        return
      }

      if (diff > 0 && currentScrollY > 80) {
        // Only hide if not immediately following a scroll-up (prevents scroll-snap bounce from re-hiding)
        const timeSinceScrollUp = Date.now() - lastScrollUpTime.current
        if (timeSinceScrollUp > 800) {
          setIsVisible(false)
        }
      } else if (diff < 0) {
        // Scrolling UP -> reveal header
        lastScrollUpTime.current = Date.now()
        setIsVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    // Reveal header when mouse cursor approaches the top edge of the viewport
    const handleMouseMove = (e) => {
      if (e.clientY < 45) {
        setIsVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isMobileMenuOpen])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close mobile menu on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobileMenuOpen])

  // Smooth scroll handler
  const handleNavClick = (e, targetId) => {
    e.preventDefault()
    setActiveSection(targetId)
    setIsMobileMenuOpen(false)

    const targetEl = document.getElementById(targetId)
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-transform duration-300 ease-in-out will-change-transform ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isMobileMenuOpen
          ? 'bg-black/95 border-b border-zinc-800 backdrop-blur-xl'
          : 'bg-gradient-to-b from-black/90 via-black/40 to-transparent'
      }`}
    >
      {/* Progressive Backdrop Blur & Gradient Mask for Desktop / Closed Drawer */}
      {!isMobileMenuOpen && (
        <div
          className="absolute inset-0 -z-10 pointer-events-none backdrop-blur-md [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]"
          aria-hidden="true"
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setActiveSection('hero')
            setIsMobileMenuOpen(false)
          }}
          className="flex items-center gap-2.5 sm:gap-3 text-white group focus:outline-none cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center font-mono font-bold text-white text-sm group-hover:scale-105 group-hover:border-white transition-all">
            &lt;/&gt;
          </div>
          <span className="font-mono font-black text-xs sm:text-sm tracking-[0.18em] sm:tracking-[0.24em] uppercase text-white group-hover:text-zinc-300 transition-colors truncate max-w-[170px] sm:max-w-none">
            {portfolioData.about.name}
          </span>
        </a>

        {/* Right Side: Desktop Nav + Toggles + Mobile Hamburger */}
        <div className="flex items-center gap-2.5 sm:gap-4 md:gap-6">
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 shadow-none">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-white text-black font-bold border border-white shadow-none'
                      : 'text-zinc-400 hover:text-white hover:bg-white/10 border border-transparent'
                  }`}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-black" />
                  )}
                  <span>{link.label}</span>
                </a>
              )
            })}
          </nav>

          {/* Quick Access: Master CV & Academic Transcript Button (SpaceX Minimal Pill) */}
          <button
            type="button"
            onClick={() => setIsDocsModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase font-semibold text-white bg-transparent hover:bg-white hover:text-black border border-white/40 hover:border-white transition-all duration-300 cursor-pointer focus:outline-none"
            title={currentLang === 'vi' ? 'Tải Master CV & Bảng điểm' : 'Download Master CV & Transcript'}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{currentLang === 'vi' ? 'Hồ sơ & CV' : 'CV & Docs'}</span>
          </button>

            {/* Language Toggle (Always accessible) */}
            <div className="flex items-center">
              <LanguageToggle />
            </div>

            {/* Mobile Hamburger Toggle Button (md:hidden) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              className="md:hidden w-9 h-9 rounded-lg bg-black border border-zinc-800 flex flex-col items-center justify-center gap-1.5 text-zinc-300 hover:text-white hover:border-white transition-all cursor-pointer focus:outline-none"
            >
              <span
                className={`w-5 h-0.5 bg-current rounded-full transition-transform duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`w-5 h-0.5 bg-current rounded-full transition-opacity duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`w-5 h-0.5 bg-current rounded-full transition-transform duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* ─── Mobile Slide-Down Drawer Navigation ───────────────────────────────── */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-zinc-800 bg-black/95 backdrop-blur-xl ${
            isMobileMenuOpen ? 'max-h-96 opacity-100 py-4 px-4' : 'max-h-0 opacity-0 py-0 px-4'
          }`}
        >
          <nav className="flex flex-col space-y-1.5 max-w-sm mx-auto">
            {navLinks.map((link, idx) => {
              const isActive = activeSection === link.id
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`px-4 py-3 rounded-xl text-xs font-mono tracking-widest uppercase transition-all flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-white text-black font-bold border border-white'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-mono opacity-60">0{idx + 1}</span>
                    <span>{link.label}</span>
                  </div>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-black" />
                  )}
                </a>
              )
            })}

            {/* Mobile Master CV & Transcript Button */}
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false)
                setIsDocsModalOpen(true)
              }}
              className="w-full mt-2 px-4 py-3 rounded-xl text-xs font-mono tracking-widest uppercase bg-transparent hover:bg-white hover:text-black text-white border border-white/40 flex items-center justify-between cursor-pointer transition-colors shadow-sm"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{currentLang === 'vi' ? 'TẢI MASTER CV & BẢNG ĐIỂM' : 'DOWNLOAD CV & TRANSCRIPT'}</span>
              </div>
              <span>→</span>
            </button>
          </nav>
        </div>

        {/* ─── Master CV & Transcript Modal Dialog ─────────────────────────────── */}
        <DocumentsModal
          isOpen={isDocsModalOpen}
          onClose={() => setIsDocsModalOpen(false)}
        />
      </header>
    )
  }


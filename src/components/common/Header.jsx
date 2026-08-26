import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageToggle from './LanguageToggle'
import portfolioData from '../../data/portfolioData.json'

/**
 * Header Component (Active Scroll-Synced Navbar - Pure Dark Mode)
 * 
 * Features:
 * - Dedicated Dark-Only Aesthetic
 * - Real-time scroll spy: Automatically highlights active section in sync with scroll & snap
 * - Smooth scroll navigation when clicking links
 * - Active pill indicator with subtle cyan/blue neon glow
 * - Backdrop blur effect (`backdrop-blur-md`) with glass styling
 */
export default function Header() {
  const { t, i18n } = useTranslation('portfolio')
  const currentLang = i18n.language === 'en' ? 'en' : 'vi'
  const [activeSection, setActiveSection] = useState('hero')

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
        threshold: 0.4,
        rootMargin: '-60px 0px -20% 0px',
      }
    )

    sections.forEach((sec) => observer.observe(sec))

    const handleScroll = () => {
      if (window.scrollY < 200) {
        setActiveSection('hero')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Smooth scroll handler
  const handleNavClick = (e, targetId) => {
    e.preventDefault()
    setActiveSection(targetId)

    const targetEl = document.getElementById(targetId)
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setActiveSection('hero')
          }}
          className="flex items-center gap-3 text-white group focus:outline-none cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-mono font-bold text-blue-400 text-sm shadow-brand-glow group-hover:scale-105 transition-transform">
            &lt;/&gt;
          </div>
          <span className="font-mono font-black text-sm tracking-[0.2em] uppercase text-white group-hover:text-blue-400 transition-colors">
            {portfolioData.about.name}
          </span>
        </a>

        {/* Navigation Links with Active Indicator */}
        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-slate-900/60 border border-slate-800/60">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/50 shadow-[0_0_12px_rgba(59,130,246,0.25)]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  )}
                  <span>{link.label}</span>
                </a>
              )
            })}
          </nav>

          {/* Language Toggle (English / Tiếng Việt) */}
          <div className="flex items-center">
            <LanguageToggle />
          </div>
        </div>
      </div>
    </header>
  )
}

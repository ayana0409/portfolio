import React from 'react'
import MainLayout from './components/layouts/MainLayout'
import HeroSection from './features/hero/HeroSection'
import AboutSection from './features/about/AboutSection'
import SkillsSection from './features/skills/SkillsSection'
import ExperienceSection from './features/experience/ExperienceSection'
import ProjectBook from './features/projects/ProjectBook'
import ContactSection from './features/contact/ContactSection'
import { scrollToElement } from './utils/helpers'

/**
 * Root Application Component
 * 
 * Assembles the full portfolio application using MainLayout and modular feature sections:
 * - HeroSection (SpaceX cinematic entrance)
 * - AboutSection (Backend developer narrative & stats)
 * - SkillsSection (Categorized skill matrix with interactive vertical stack)
 * - ExperienceSection (Career & Work experience showcase with deep-dive drawer)
 * - ProjectBook (3D interactive flipbook for projects)
 * - ContactSection (Direct contact & social links)
 */
export default function App() {
  const handleExploreClick = () => {
    scrollToElement('projects', 80)
  }

  return (
    <MainLayout>
      {/* ── 00. Hero Banner (Fullscreen SpaceX Style) ── */}
      <HeroSection onExploreClick={handleExploreClick} />

      {/* ── 01. About Me Section ── */}
      <AboutSection />

      {/* ── 02. Skills & Capabilities ── */}
      <SkillsSection />

      {/* ── 03. Career & Work Experience ── */}
      <ExperienceSection />

      {/* ── 04. 3D Interactive Project Flipbook ── */}
      <ProjectBook />

      {/* ── 05. Contact & Inquiries ── */}
      <ContactSection />
    </MainLayout>
  )
}

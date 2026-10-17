import React from 'react'
import Header from '../common/Header'
import CosmicBackground from '../common/CosmicBackground'
import { useScrollSnap } from '../../hooks/useScrollSnap'

/**
 * MainLayout Component
 * 
 * Provides global layout structure:
 * - 3-Layer Parallax Cosmic Starfield & Texture (CosmicBackground)
 * - Fixed Sticky Header at top
 * - Full-page Scroll Snap container: each child section occupies strictly 100vh
 * - Integrates useScrollSnap hook for smart snapping & locking to each section
 */
export default function MainLayout({ children }) {
  // Activate smart section snapping
  useScrollSnap()

  return (
    <div className="w-full bg-black text-white selection:bg-white selection:text-black min-h-screen relative">
      {/* ─── 0. Three-Layer Parallax Cosmic Starfield & Texture ─────────────── */}
      <CosmicBackground />

      {/* ─── 1. Fixed Sticky Navbar ────────────────────────────────────────── */}
      <Header />

      {/* ─── 2. Main Content Flow ──────────────────────────────────────────── */}
      <main className="w-full relative z-10">
        {children}
      </main>
    </div>
  )
}


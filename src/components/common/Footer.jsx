import React from 'react'
import portfolioData from '../../data/portfolioData.json'
import { getCurrentYear } from '../../utils/helpers'

/**
 * Footer Component
 * 
 * Reusable footer displaying copyright, tech stack attribution, and quick links.
 */
export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800 py-6 text-center text-xs font-mono text-zinc-400 bg-black tracking-wider uppercase">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white inline-block" />
          <span>
            © {getCurrentYear()} {portfolioData.about.name}. All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-zinc-500 font-bold">
          <span>React 19 + Tailwind CSS</span>
          <span>•</span>
          <span>GSAP + 3D Book</span>
        </div>
      </div>
    </footer>
  )
}

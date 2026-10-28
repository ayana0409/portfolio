import React from 'react'
import portfolioData from '../../data/portfolioData.json'
import { getCurrentYear } from '../../utils/helpers'
import { typography } from '../../config/typography'

/**
 * Footer Component
 * 
 * Reusable bottom footer bar displaying copyright and technical role attribution.
 * Designed to seamlessly fit into standalone layouts or fullscreen sections like ContactSection.
 * 
 * @param {Object} props
 * @param {string} [props.className] - Optional additional CSS classes
 */
export default function Footer({ className = '' }) {
  return (
    <footer className={`w-full border-t border-zinc-800 pt-3 sm:pt-4 pb-1 sm:pb-0 flex flex-col sm:flex-row items-center justify-between z-10 gap-2 text-center sm:text-left ${typography.contact.footerCopyright} ${className}`}>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-white" />
        <span>© {getCurrentYear()} {portfolioData.about.name}. All rights reserved.</span>
      </div>

      <div className={`flex items-center gap-2 sm:gap-3 ${typography.contact.footerTech}`}>
        <span>SOFTWARE ENGINEER</span>
        <span>•</span>
        <span>CAN THO</span>
      </div>
    </footer>
  )
}

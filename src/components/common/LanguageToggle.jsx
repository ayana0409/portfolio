import React from 'react'
import { useTranslation } from 'react-i18next'

/**
 * LanguageToggle Component
 * 
 * Toggles application language between Vietnamese ('vi') and English ('en')
 * using react-i18next.
 */
export default function LanguageToggle({ className = '' }) {
  const { i18n } = useTranslation()

  const handleToggle = () => {
    const nextLang = i18n.language === 'vi' ? 'en' : 'vi'
    i18n.changeLanguage(nextLang)
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label="Toggle Language"
      className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold
        border border-white/20 hover:border-white
        bg-black text-white hover:bg-white/10
        transition-all duration-200 active:scale-95 shadow-none ${className}`}
    >
      🌐 {i18n.language === 'vi' ? 'VI' : 'EN'}
    </button>
  )
}

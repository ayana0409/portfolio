import { useEffect } from 'react'

/**
 * useScrollSnap Hook (Pure Native CSS Snapping Integration)
 * 
 * Philosophy:
 * - Relies 100% on Native CSS Scroll Snapping (`scroll-snap-type: y mandatory` & `scroll-snap-stop: always`)
 *   for hardware-accelerated 120fps trackpad physics without JS wheel hijacking.
 * - Guarantees exactly 1 section transition per flick, with ZERO double-skips and ZERO jitter.
 * - Provides keyboard navigation (Arrow Up/Down, Page Up/Down, Spacebar).
 */
export function useScrollSnap() {
  useEffect(() => {
    const getSections = () => Array.from(document.querySelectorAll('section'))

    // Get current section based on scroll position
    const getCurrentSectionIndex = () => {
      const sections = getSections()
      if (!sections.length) return 0

      const scrollY = window.scrollY || document.documentElement.scrollTop
      let activeIdx = 0
      let minDiff = Infinity

      sections.forEach((sec, idx) => {
        const top = sec.offsetTop
        const diff = Math.abs(top - scrollY)
        if (diff < minDiff) {
          minDiff = diff
          activeIdx = idx
        }
      })

      return activeIdx
    }

    // Smoothly scroll to target section index
    const scrollToSection = (targetIndex) => {
      const sections = getSections()
      if (!sections.length || targetIndex < 0 || targetIndex >= sections.length) {
        return
      }

      const targetEl = sections[targetIndex]
      if (targetEl) {
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    }

    // ── KEYBOARD NAVIGATION ONLY ─────────────────────────────────────────────
    const handleKeyDown = (e) => {
      // If modal drawer is open or user is typing in form inputs, do nothing
      if (document.body.style.overflow === 'hidden') return
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return

      const currentIndex = getCurrentSectionIndex()

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
        e.preventDefault()
        scrollToSection(currentIndex + 1)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
        e.preventDefault()
        scrollToSection(currentIndex - 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
}

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

/**
 * useScrollSnap Hook
 * 
 * 30% Intent-Based Section Swapping Engine:
 * - Detects light scroll gestures (30% threshold / gentle flick) in both UP and DOWN directions.
 * - Automatically advances smoothly to the next or previous full-height section.
 * - Prevents jitter, skips, and erratic scrolling with an animation lock.
 * - Respects detail modal state (disables auto-jump when viewing project details).
 * - Full support for Mouse Wheel, Touch Gestures, and Keyboard Navigation.
 */
export function useScrollSnap() {
  useEffect(() => {
    let currentIndex = 0
    let isAnimating = false
    let touchStartY = 0

    const getSections = () => Array.from(document.querySelectorAll('section'))

    // Sync initial index based on current scroll position
    const updateCurrentIndexFromScroll = () => {
      const sections = getSections()
      if (!sections.length) return

      const scrollY = window.scrollY || document.documentElement.scrollTop
      let closestIdx = 0
      let minDiff = Infinity

      sections.forEach((sec, idx) => {
        const diff = Math.abs(sec.offsetTop - scrollY)
        if (diff < minDiff) {
          minDiff = diff
          closestIdx = idx
        }
      })

      currentIndex = closestIdx
    }

    updateCurrentIndexFromScroll()

    // Smooth programmatic transition to a target section index
    const goToSection = (targetIndex) => {
      const sections = getSections()
      if (!sections.length || targetIndex < 0 || targetIndex >= sections.length) {
        return
      }

      isAnimating = true
      currentIndex = targetIndex

      const targetTop = sections[targetIndex].offsetTop

      gsap.to(window, {
        scrollTo: { y: targetTop, autoKill: false },
        duration: 0.7,
        ease: 'power2.out',
        overwrite: 'auto',
        onComplete: () => {
          // Cooldown to prevent multi-triggering
          setTimeout(() => {
            isAnimating = false
          }, 120)
        },
      })
    }

    // ── 1. MOUSE WHEEL GESTURE (30% Threshold Detection) ───────────────────
    const handleWheel = (e) => {
      // If modal drawer is open (body overflow is hidden), allow natural modal inner scroll
      if (document.body.style.overflow === 'hidden') return

      // If already transitioning, block raw scroll to ensure clean snap
      if (isAnimating) {
        e.preventDefault()
        return
      }

      // Check for light scroll intent (deltaY threshold >= 25px ~ 30% flick)
      const threshold = 25
      if (Math.abs(e.deltaY) >= threshold) {
        e.preventDefault()
        const sections = getSections()
        const direction = e.deltaY > 0 ? 1 : -1
        const targetIndex = currentIndex + direction

        if (targetIndex >= 0 && targetIndex < sections.length) {
          goToSection(targetIndex)
        }
      }
    }

    // ── 2. MOBILE TOUCH SWIPE GESTURES ─────────────────────────────────────
    const handleTouchStart = (e) => {
      if (document.body.style.overflow === 'hidden') return
      touchStartY = e.touches[0].clientY
    }

    const handleTouchEnd = (e) => {
      if (document.body.style.overflow === 'hidden' || isAnimating) return

      const touchEndY = e.changedTouches[0].clientY
      const diffY = touchStartY - touchEndY

      // 30px swipe threshold on mobile
      if (Math.abs(diffY) > 35) {
        const sections = getSections()
        const direction = diffY > 0 ? 1 : -1
        const targetIndex = currentIndex + direction

        if (targetIndex >= 0 && targetIndex < sections.length) {
          goToSection(targetIndex)
        }
      }
    }

    // ── 3. KEYBOARD NAVIGATION ─────────────────────────────────────────────
    const handleKeyDown = (e) => {
      if (document.body.style.overflow === 'hidden') return
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
        e.preventDefault()
        goToSection(currentIndex + 1)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
        e.preventDefault()
        goToSection(currentIndex - 1)
      }
    }

    // Attach passive: false wheel listener for instant interception
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', updateCurrentIndexFromScroll)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', updateCurrentIndexFromScroll)
    }
  }, [])
}

import { useEffect, useRef } from 'react'

// Track active open modal count globally across components
let activeModalCount = 0

/**
 * useModalHistory Hook
 * 
 * Solves:
 * 1. Mobile back button: Intercepts browser/device back navigation on mobile
 *    to close the active modal instead of leaving/exiting the webpage.
 * 2. Automatic Navbar & ChatBot hiding: Toggles `data-modal-open="true"` on `document.body`
 *    so Header and ChatBot automatically hide when any modal is open, preventing
 *    navbar from overlapping the close button.
 * 3. Body scroll locking across iOS, Android, and desktop.
 * 4. Keyboard ESC listener for desktop accessibility.
 * 
 * Supports stacked/nested modals (e.g. project details drawer -> photo lightbox).
 *
 * @param {boolean} isOpen - Whether the modal is currently open
 * @param {Function} onClose - Callback invoked to close the modal
 * @param {string} modalId - Semantic identifier for this modal
 */
export function useModalHistory(isOpen, onClose, modalId = 'modal') {
  const isPushedRef = useRef(false)
  const isClosingViaPopstateRef = useRef(false)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!isOpen) return

    activeModalCount++
    document.body.setAttribute('data-modal-open', 'true')
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    const mainEl = document.querySelector('main')
    if (mainEl) mainEl.style.overflowY = 'hidden'

    // Push browser history state so back button triggers popstate instead of navigating away
    const stateObj = { portfolioModal: modalId, depth: activeModalCount, timestamp: Date.now() }
    window.history.pushState(stateObj, '')
    isPushedRef.current = true
    isClosingViaPopstateRef.current = false

    const handlePopState = (e) => {
      if (isPushedRef.current) {
        isPushedRef.current = false
        isClosingViaPopstateRef.current = true
        if (typeof onCloseRef.current === 'function') {
          onCloseRef.current()
        }
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (typeof onCloseRef.current === 'function') {
          onCloseRef.current()
        }
      }
    }

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('keydown', handleKeyDown)

      activeModalCount = Math.max(0, activeModalCount - 1)
      if (activeModalCount === 0) {
        document.body.removeAttribute('data-modal-open')
        document.body.style.overflow = ''
        document.documentElement.style.overflow = ''
        if (mainEl) mainEl.style.overflowY = ''
      }

      // If closed through UI interaction (Close button, ESC key, or backdrop tap)
      // and NOT via the browser popstate, pop the history entry we pushed
      // so history remains clean and consistent
      if (isPushedRef.current && !isClosingViaPopstateRef.current) {
        isPushedRef.current = false
        window.history.back()
      }
    }
  }, [isOpen, modalId])
}

export default useModalHistory

import { useEffect, useRef } from 'react'

/**
 * Global stack of active modal descriptors:
 * Each item: {
 *   instanceId: number,
 *   modalId: string,
 *   onCloseRef: React.MutableRefObject<Function>,
 *   isPushed: boolean,
 *   isClosingViaPopstate: boolean
 * }
 */
const modalStack = []
let nextInstanceId = 1
let isGlobalListenersAttached = false

/**
 * Synchronize body scroll lock and modal open indicators
 */
function syncBodyState() {
  if (typeof document === 'undefined') return
  const count = modalStack.length
  const mainEl = document.querySelector('main')

  if (count > 0) {
    document.body.setAttribute('data-modal-open', 'true')
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    if (mainEl) mainEl.style.overflowY = 'hidden'
  } else {
    document.body.removeAttribute('data-modal-open')
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
    if (mainEl) mainEl.style.overflowY = ''
  }
}

/**
 * Global PopState listener:
 * Handles browser/device Back navigation for stacked modals.
 */
function handleGlobalPopState(e) {
  if (modalStack.length === 0) return

  const targetState = e.state
  const currentTop = modalStack[modalStack.length - 1]

  // Case 1: Programmatic back when a child modal is closed via UI.
  // The state popped back to the parent modal's state (or initial state).
  if (targetState && targetState.instanceId === currentTop.instanceId) {
    // Current top modal matches the browser history state. Do not close it.
    return
  }

  // Case 2: User pressed the device/browser back button.
  // Close only the topmost active modal.
  currentTop.isClosingViaPopstate = true
  if (typeof currentTop.onCloseRef.current === 'function') {
    currentTop.onCloseRef.current()
  }
}

/**
 * Global Keyboard Escape listener:
 * Ensures ESC key only closes the topmost modal in the stack.
 */
function handleGlobalKeyDown(e) {
  if (e.key !== 'Escape') return
  if (modalStack.length === 0) return

  // Prevent event from propagating to other escape handlers
  e.preventDefault()
  if (typeof e.stopImmediatePropagation === 'function') {
    e.stopImmediatePropagation()
  } else if (typeof e.stopPropagation === 'function') {
    e.stopPropagation()
  }

  // Only close the topmost modal
  const currentTop = modalStack[modalStack.length - 1]
  if (typeof currentTop.onCloseRef.current === 'function') {
    currentTop.onCloseRef.current()
  }
}

/**
 * Ensures global window event listeners are active when any modal is open
 */
function attachGlobalListenersIfNeeded() {
  if (typeof window === 'undefined' || isGlobalListenersAttached) return
  window.addEventListener('popstate', handleGlobalPopState)
  window.addEventListener('keydown', handleGlobalKeyDown)
  isGlobalListenersAttached = true
}

/**
 * Removes global window event listeners when all modals are closed
 */
function detachGlobalListenersIfEmpty() {
  if (typeof window === 'undefined' || !isGlobalListenersAttached) return
  if (modalStack.length === 0) {
    window.removeEventListener('popstate', handleGlobalPopState)
    window.removeEventListener('keydown', handleGlobalKeyDown)
    isGlobalListenersAttached = false
  }
}

/**
 * useModalHistory Hook
 * 
 * Supports single and nested/stacked modals (e.g. Project Details Drawer -> Image Lightbox).
 * 
 * Solves:
 * 1. Stacked modal back navigation: Intercepts browser/device back navigation to close
 *    only the topmost modal (e.g. closes image lightbox without closing project modal).
 * 2. Stacked modal ESC key: Pressing ESC closes only the topmost modal.
 * 3. UI Close safety: Closing a child modal via UI does not accidentally trigger parent modal closing.
 * 4. Automatic Navbar & ChatBot hiding: Toggles `data-modal-open="true"` on `document.body`.
 * 5. Body scroll locking across iOS, Android, and desktop.
 *
 * @param {boolean} isOpen - Whether the modal is currently open
 * @param {Function} onClose - Callback invoked to close the modal
 * @param {string} modalId - Semantic identifier for this modal
 */
export function useModalHistory(isOpen, onClose, modalId = 'modal') {
  const instanceIdRef = useRef(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!isOpen) return

    // Generate unique ID for this modal opening session
    const instanceId = nextInstanceId++
    instanceIdRef.current = instanceId

    const modalEntry = {
      instanceId,
      modalId,
      onCloseRef,
      isPushed: false,
      isClosingViaPopstate: false,
    }

    // Push into stack
    modalStack.push(modalEntry)
    syncBodyState()
    attachGlobalListenersIfNeeded()

    // Push state into browser history
    if (typeof window !== 'undefined') {
      const stateObj = {
        portfolioModal: modalId,
        instanceId,
        depth: modalStack.length,
        timestamp: Date.now(),
      }
      window.history.pushState(stateObj, '')
      modalEntry.isPushed = true
    }

    return () => {
      // Find and remove this instance from modalStack
      const index = modalStack.findIndex((item) => item.instanceId === instanceId)
      let removedEntry = null
      if (index !== -1) {
        removedEntry = modalStack.splice(index, 1)[0]
      }

      syncBodyState()
      detachGlobalListenersIfEmpty()

      // If closed via UI (Close button, ESC key, or backdrop click) and NOT via popstate,
      // pop the browser history entry we pushed so history stays clean.
      if (
        removedEntry &&
        removedEntry.isPushed &&
        !removedEntry.isClosingViaPopstate &&
        typeof window !== 'undefined'
      ) {
        removedEntry.isPushed = false
        window.history.back()
      }
    }
  }, [isOpen, modalId])
}

export default useModalHistory

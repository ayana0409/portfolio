/**
 * Lightweight visitor tracking service for Portfolio.
 * 
 * Runs asynchronously via navigator.sendBeacon (or keepalive fetch).
 * Zero impact on UI performance or page load speed.
 * Completely safe for GitHub Pages deployment (zero secret keys on frontend).
 */

const DEFAULT_TRACK_ENDPOINT =
  'https://portfolio-gemini-worker.ayana0409-porfolio.workers.dev/api/track'

/**
 * Resolves the tracking API endpoint from environment variables or live fallback.
 * @returns {string}
 */
export function getTrackEndpoint() {
  if (import.meta.env.VITE_API_TRACK_URL) {
    return import.meta.env.VITE_API_TRACK_URL
  }

  if (import.meta.env.VITE_API_CHAT_URL) {
    return import.meta.env.VITE_API_CHAT_URL.replace(/\/api\/chat\/?$/, '/api/track')
  }

  return DEFAULT_TRACK_ENDPOINT
}

/**
 * Records a visitor access event to Cloudflare D1 (portfolio_access_history).
 * Deduplicates multiple pings within the same session/tab.
 * 
 * @param {object} [customData] - Optional extra metadata
 */
export function trackVisit(customData = {}) {
  // Prevent execution on server-side rendering or non-browser environments
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  // Session deduplication: track once per session path to prevent spam on rapid refresh / re-render
  const currentPath = window.location.pathname || '/'
  const sessionKey = `track_${currentPath}`
  
  try {
    const alreadyTracked = sessionStorage.getItem(sessionKey)
    if (alreadyTracked) {
      return
    }
    sessionStorage.setItem(sessionKey, String(Date.now()))
  } catch {
    // Ignore private browsing sessionStorage restrictions
  }

  const endpoint = getTrackEndpoint()
  const payload = {
    path: currentPath + (window.location.hash || ''),
    referrer: document.referrer || 'Direct',
    screen: `${window.screen?.width || window.innerWidth}x${window.screen?.height || window.innerHeight}`,
    lang: navigator.language || 'vi',
    ...customData,
  }

  const jsonPayload = JSON.stringify(payload)

  // 1. Primary method: navigator.sendBeacon (ideal for analytics, fire-and-forget)
  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    try {
      const blob = new Blob([jsonPayload], { type: 'application/json' })
      const sent = navigator.sendBeacon(endpoint, blob)
      if (sent) return
    } catch (err) {
      // Fallback to fetch if sendBeacon fails
      console.debug('sendBeacon failed, falling back to fetch', err)
    }
  }

  // 2. Secondary method: keepalive fetch
  try {
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonPayload,
      keepalive: true,
      mode: 'cors',
    }).catch(() => {
      // Silently ignore network failures to avoid any console noise
    })
  } catch {
    // Fire-and-forget guard
  }
}

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
 * Detects whether the client is an automated bot, web crawler, or headless browser.
 * @returns {boolean}
 */
export function isAutomatedBot() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return true
  }

  // 1. Standard automation flag (Selenium, Puppeteer, Playwright, Chrome DevTools Protocol)
  if (navigator.webdriver) {
    return true
  }

  const ua = (navigator.userAgent || '').toLowerCase()

  // 2. Headless Chrome explicit token
  if (ua.includes('headlesschrome') || ua.includes('phantomjs')) {
    return true
  }

  // 3. Known crawler, bot, and search engine signatures
  const botSignatures = [
    'bot', 'crawl', 'spider', 'slurp', 'bingpreview',
    'facebookexternalhit', 'whatsapp', 'telegrambot', 'twitterbot',
    'linkedinbot', 'discordbot', 'embedly', 'quora link preview',
    'outbrain', 'pinterest', 'vkshare', 'w3c_validator', 'lighthouse',
    'google-inspectiontool', 'petalbot', 'yandex', 'duckduckbot',
    'bytespider', 'ahrefs', 'semrush'
  ]
  if (botSignatures.some(sig => ua.includes(sig))) {
    return true
  }

  // 4. Headless viewport and display signatures (e.g. 0x0 outer dimensions)
  if (window.outerWidth === 0 && window.outerHeight === 0) {
    return true
  }

  // 5. Automated default 800x600 resolution without user languages
  if (
    window.screen?.width === 800 &&
    window.screen?.height === 600 &&
    (!navigator.languages || navigator.languages.length === 0)
  ) {
    return true
  }

  return false
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

  // Bot guard: immediately halt tracking if an automated bot/crawler is detected
  if (isAutomatedBot()) {
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

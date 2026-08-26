/**
 * General utility helper functions for the portfolio application.
 */

// Dynamically bundle and resolve all local images in src/assets/images
const localImages = import.meta.glob('/src/assets/images/**/*.{png,jpg,jpeg,svg,webp,gif,avif}', {
  eager: true,
  import: 'default',
})

/**
 * Resolves local image paths from JSON data to bundled Vite asset URLs.
 * Supports /assets/images/..., /images/..., or direct filenames.
 *
 * @param {string} path - Image path specified in JSON data
 * @returns {string} - The resolved asset URL
 */
export function resolveProjectImage(path) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path
  }

  // Strip leading prefixes
  const normalized = path
    .replace(/^\/src\/assets\/images\//, '')
    .replace(/^\/assets\/images\//, '')
    .replace(/^\/images\//, '')
    .replace(/^assets\/images\//, '')
    .replace(/^images\//, '')

  const targetKey = `/src/assets/images/${normalized}`

  if (localImages[targetKey]) {
    return localImages[targetKey]
  }

  // Check case-insensitive match
  const foundKey = Object.keys(localImages).find(
    (k) => k.toLowerCase() === targetKey.toLowerCase()
  )
  if (foundKey) {
    return localImages[foundKey]
  }

  return path
}

/**
 * Conditionally joins CSS class names together.
 * @param  {...any} classes 
 * @returns {string}
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

/**
 * Smoothly scrolls the window to an element by its ID or ref.
 * @param {string} elementId - The DOM element id to scroll to
 * @param {number} offset - Optional offset in pixels (e.g. for fixed headers)
 */
export function scrollToElement(elementId, offset = 0) {
  const element = document.getElementById(elementId)
  if (!element) return

  const elementPosition = element.getBoundingClientRect().top
  const offsetPosition = elementPosition + window.pageYOffset - offset

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  })
}

/**
 * Formats a date or year for display.
 * @param {Date|string|number} date 
 * @returns {number}
 */
export function getCurrentYear() {
  return new Date().getFullYear()
}

/**
 * General utility helper functions for the portfolio application.
 */

// Dynamically bundle and resolve all local images in src/assets/images
const localImages = import.meta.glob('/src/assets/images/**/*.{png,jpg,jpeg,svg,webp,gif,avif}', {
  eager: true,
  import: 'default',
})

// Dynamically bundle and resolve all local videos in src/assets (including videos/ and images/ subdirectories)
const localVideos = import.meta.glob('/src/assets/**/*.{mp4,webm,ogg,mov,m4v}', {
  eager: true,
  import: 'default',
})

/**
 * Returns appropriate MIME type for video source.
 *
 * @param {string} src - Video URL or path
 * @returns {string} - MIME type
 */
export function getVideoMimeType(src) {
  if (!src) return 'video/mp4'
  const clean = src.split('?')[0].split('#')[0].toLowerCase()
  if (clean.endsWith('.webm')) return 'video/webm'
  if (clean.endsWith('.ogg') || clean.endsWith('.ogv')) return 'video/ogg'
  if (clean.endsWith('.mov')) return 'video/quicktime'
  return 'video/mp4'
}

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
 * Resolves local or external video paths from JSON data to bundled Vite asset URLs or valid URLs.
 * Supports any location in src/assets/ (e.g. assets/images/..., assets/videos/...),
 * public/ relative paths, or direct external URLs.
 *
 * @param {string} path - Video path specified in JSON data
 * @returns {string} - The resolved asset or static URL
 */
export function resolveProjectVideo(path) {
  if (!path) return ''
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path
  }

  // Normalize path by removing leading slashes and optional 'src/' prefix
  const cleanPath = path.replace(/^\/+/, '').replace(/^src\//, '')

  // 1. Direct match: e.g. /src/assets/images/... or /src/assets/videos/...
  const targetKey1 = `/src/${cleanPath}`
  if (localVideos[targetKey1]) {
    return localVideos[targetKey1]
  }

  // 2. If path starts with 'assets/', match /src/assets/...
  const cleanWithoutAssets = cleanPath.replace(/^assets\//, '')
  const targetKey2 = `/src/assets/${cleanWithoutAssets}`
  if (localVideos[targetKey2]) {
    return localVideos[targetKey2]
  }

  // 3. Check case-insensitive match or filename ending match across all bundled local videos
  const cleanLower = cleanPath.toLowerCase()
  const foundKey = Object.keys(localVideos).find((k) => {
    const kLower = k.toLowerCase()
    return (
      kLower === targetKey1.toLowerCase() ||
      kLower === targetKey2.toLowerCase() ||
      kLower.endsWith('/' + cleanLower) ||
      kLower.endsWith('/' + cleanWithoutAssets.toLowerCase())
    )
  })
  if (foundKey) {
    return localVideos[foundKey]
  }

  // 4. Fallback to public folder path with BASE_URL
  const baseUrl = import.meta.env.BASE_URL || '/'
  const publicPath = cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath
  return baseUrl.endsWith('/') ? `${baseUrl}${publicPath}` : `${baseUrl}/${publicPath}`
}

/**
 * Checks if a given media item or URL represents a video resource.
 *
 * @param {Object|string} item - The media item object or string URL
 * @returns {boolean} - True if item is a video
 */
export function isVideoItem(item) {
  if (!item) return false
  if (typeof item === 'object' && item.type === 'video') return true
  const src = (typeof item === 'string' ? item : item.src || item.url || '').toLowerCase()
  return (
    src.includes('youtube.com') ||
    src.includes('youtu.be') ||
    src.includes('vimeo.com') ||
    src.includes('drive.google.com') ||
    /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(src) ||
    src.includes('/videos/') ||
    src.includes('/assets/videos/')
  )
}

/**
 * Parses and normalizes any video source into a unified playback descriptor.
 * Supports YouTube, Google Drive, Vimeo, and native HTML5 video formats.
 *
 * @param {string} rawSrc - Video source link or relative file path
 * @param {string} [rawPoster] - Optional custom poster image path
 * @returns {Object|null} - Unified video descriptor with embedUrl or native src
 */
export function parseVideoSource(rawSrc, rawPoster = '') {
  if (!rawSrc) return null
  const cleanSrc = rawSrc.trim()

  // 1. YouTube Match (watch URL, youtu.be shortlink, embed, or shorts)
  const ytMatch = cleanSrc.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i)
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1]
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`,
      poster: rawPoster ? resolveProjectImage(rawPoster) : `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      originalSrc: cleanSrc,
    }
  }

  // 2. Google Drive Match
  const gdriveMatch = cleanSrc.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i)
  if (gdriveMatch && gdriveMatch[1]) {
    const fileId = gdriveMatch[1]
    return {
      type: 'gdrive',
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      poster: rawPoster ? resolveProjectImage(rawPoster) : '',
      originalSrc: cleanSrc,
    }
  }

  // 3. Vimeo Match
  const vimeoMatch = cleanSrc.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)/i)
  if (vimeoMatch && (vimeoMatch[3] || vimeoMatch[1])) {
    const videoId = vimeoMatch[3] || vimeoMatch[1]
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1`,
      poster: rawPoster ? resolveProjectImage(rawPoster) : '',
      originalSrc: cleanSrc,
    }
  }

  // 4. Native HTML5 Video (Local asset or direct file URL)
  return {
    type: 'native',
    src: resolveProjectVideo(cleanSrc),
    poster: rawPoster ? resolveProjectImage(rawPoster) : '',
    originalSrc: cleanSrc,
  }
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

/**
 * Resolves static document URLs (PDFs, transcripts, master CV) with Vite BASE_URL.
 * Supports external URLs (https://, http://) or public relative paths (/docs/...).
 *
 * @param {string} path - Document path or external URL
 * @returns {string} - Fully qualified or base-prefixed URL
 */
export function resolveDocumentUrl(path) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  // Normalize leading slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  const baseUrl = import.meta.env.BASE_URL || '/'

  // Ensure single slash joining
  return baseUrl.endsWith('/') ? `${baseUrl}${cleanPath}` : `${baseUrl}/${cleanPath}`
}

/**
 * Resolves document download URL. If a Google Drive file link is provided
 * (https://drive.google.com/file/d/FILE_ID/...), transforms it to a direct download link.
 *
 * @param {string} path - Document path or Google Drive URL
 * @returns {string} - Direct download URL or resolved URL
 */
export function resolveDocumentDownloadUrl(path) {
  if (!path) return ''

  // If path is a Google Drive file link, extract file ID for direct download
  const driveMatch = path.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`
  }

  return resolveDocumentUrl(path)
}



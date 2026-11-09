import React, { useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { resolveProjectImage, resolveProjectVideo, parseVideoSource, isVideoItem, getVideoMimeType } from '../../../utils/helpers'
import useModalHistory from '../../../hooks/useModalHistory'
import { typography } from '../../../config/typography'

/**
 * Normalizes project links into a standardized list supporting both
 * Array format and Key-Value Object format with multilingual labels.
 *
 * @param {Array|Object} links - Raw links definition from portfolioData.json
 * @param {string} currentLang - Current active language ('vi' | 'en')
 * @returns {Array} List of normalized link objects { label, url, type }
 */
function normalizeProjectLinks(links, currentLang) {
  if (!links) return []

  // Case 1: Array of link objects
  // Example: [{ label: { vi: "...", en: "..." }, url: "...", type: "demo" }]
  if (Array.isArray(links)) {
    return links
      .filter((item) => item && (item.url || item.href))
      .map((item) => {
        const url = item.url || item.href
        let label = ''
        if (typeof item.label === 'object' && item.label !== null) {
          label = item.label[currentLang] || item.label.vi || item.label.en || ''
        } else if (typeof item.label === 'string') {
          label = item.label
        } else if (item.title) {
          label = item.title[currentLang] || item.title.vi || item.title.en || 'LINK'
        } else {
          label = 'OPEN LINK'
        }

        const isGithub = url.includes('github.com')
        const type = item.type || (isGithub ? 'github' : 'demo')
        return { label, url, type }
      })
  }

  // Case 2: Object format with keys
  // Example: { demo: "https...", demo2: { label: { vi: "...", en: "..." }, url: "..." } }
  if (typeof links === 'object' && links !== null) {
    return Object.entries(links)
      .filter(([, val]) => Boolean(val))
      .map(([key, val]) => {
        let url = ''
        let label = ''
        let type = 'default'

        if (typeof val === 'string') {
          url = val
          const keyLower = key.toLowerCase()

          if (keyLower === 'demo') {
            label = currentLang === 'vi' ? 'TRẢI NGHIỆM DEMO ↗' : 'LIVE DEMO ↗'
            type = 'demo'
          } else if (keyLower === 'demo2' || keyLower === 'admindemo' || keyLower === 'demomanager') {
            label = currentLang === 'vi' ? 'ADMIN PORTAL DEMO ↗' : 'ADMIN PORTAL DEMO ↗'
            type = 'demo-alt'
          } else if (keyLower.startsWith('demo')) {
            label = `${key.toUpperCase()} ↗`
            type = 'demo-alt'
          } else if (keyLower === 'customerweb') {
            label = 'CUSTOMER WEB REPO'
            type = 'repo-cyan'
          } else if (keyLower === 'adminportal') {
            label = 'ADMIN PORTAL REPO'
            type = 'repo-purple'
          } else if (keyLower === 'websocket') {
            label = 'WEBSOCKET REPO'
            type = 'repo-purple'
          } else if (keyLower === 'backend' || keyLower === 'api') {
            label = 'API REPO'
            type = 'repo-blue'
          } else if (keyLower === 'frontend' || keyLower === 'fe') {
            label = 'FE REPO'
            type = 'repo-blue'
          } else if (keyLower === 'source') {
            label = 'GITHUB SOURCE'
            type = 'repo-blue'
          } else {
            label = key.replace(/([A-Z])/g, ' $1').toUpperCase()
            type = url.includes('github.com') ? 'repo-blue' : 'demo'
          }
        } else if (typeof val === 'object' && val !== null) {
          url = val.url || val.href || ''
          if (typeof val.label === 'object' && val.label !== null) {
            label = val.label[currentLang] || val.label.vi || val.label.en || key
          } else if (typeof val.label === 'string') {
            label = val.label
          } else {
            label = key.replace(/([A-Z])/g, ' $1').toUpperCase()
          }

          const isGithub = url.includes('github.com')
          type = val.type || (isGithub ? 'repo-blue' : 'demo')
        }

        return { key, label, url, type }
      })
      .filter((item) => Boolean(item.url))
  }

  return []
}

/**
 * Returns distinct styling classes and icons based on link type
 */
function getLinkButtonStyles(type) {
  switch (type) {
    case 'demo':
      return {
        className:
          'border border-white bg-white text-black hover:bg-transparent hover:text-white font-mono font-bold tracking-widest uppercase transition-all duration-200 active:scale-95 rounded-none',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        ),
      }
    case 'demo-alt':
      return {
        className:
          'border border-zinc-400 bg-zinc-900 text-white hover:bg-white hover:text-black font-mono font-bold tracking-widest uppercase transition-all duration-200 active:scale-95 rounded-none',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
        ),
      }
    case 'repo-cyan':
    case 'repo-purple':
    case 'repo-blue':
    case 'github':
    default:
      return {
        className:
          'border border-zinc-700 bg-black hover:bg-white hover:text-black text-white font-mono font-bold tracking-widest uppercase transition-all duration-200 active:scale-95 rounded-none',
        icon: (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        ),
      }
  }
}

/**
 * InfoTemplate / Unified Project Detail Component
 * 
 * Renders the project details strictly following the exact field sequence in `portfolioData.json`:
 * 1. Type Badge, ID & Order
 * 2. Title
 * 3. Cover Image (Full width preview with click-to-zoom)
 * 4. Technologies (Tech stack pills)
 * 5. Summary (Executive Brief / Callout quotation)
 * 6. Description (Architecture & System solution with multi-line support)
 * 7. Features (Key capabilities bullet list)
 * 8. Gallery (Photo Showcase & Screenshots with Viewport-Centered Lightbox Portal)
 * 9. Links (Universal Dynamic Link Buttons)
 *
 * @param {Object} props.project - The project data object from portfolioData.json
 */
export default function InfoTemplate({ project }) {
  const { i18n } = useTranslation('portfolio')
  const currentLang = i18n.language === 'en' ? 'en' : 'vi'
  const [activeLightboxItem, setActiveLightboxItem] = useState(null)
  const [isClosingLightbox, setIsClosingLightbox] = useState(false)

  // Open & Close Lightbox with smooth zoom-in and zoom-out transitions
  const handleOpenLightbox = (mediaData) => {
    setIsClosingLightbox(false)
    setActiveLightboxItem(mediaData)
  }

  const handleCloseLightbox = useCallback(() => {
    if (isClosingLightbox || !activeLightboxItem) return
    setIsClosingLightbox(true)
    setTimeout(() => {
      setActiveLightboxItem(null)
      setIsClosingLightbox(false)
    }, 220)
  }, [isClosingLightbox, activeLightboxItem])

  // Retrieve bilingual text
  const title = project.title?.[currentLang] || project.title?.vi || ''
  const summary = project.summary?.[currentLang] || project.summary?.vi || ''
  const description = project.description?.[currentLang] || project.description?.vi || ''
  const features = project.features?.[currentLang] || project.features?.vi || []
  const gallery = project.gallery || []
  const videos = project.videos || []
  const coverUrl = resolveProjectImage(project.coverImage)

  // Determine display order of media sections based on their order in portfolioData.json
  const projectKeys = Object.keys(project || {})
  const galleryIndex = projectKeys.indexOf('gallery')
  const videosIndex = projectKeys.indexOf('videos')
  const isVideosFirst = videosIndex !== -1 && (galleryIndex === -1 || videosIndex < galleryIndex)

  // Universal dynamic links normalization
  const normalizedLinks = normalizeProjectLinks(project.links, currentLang)

  // Intercept mobile back button to close lightbox instead of navigating away
  useModalHistory(Boolean(activeLightboxItem), handleCloseLightbox, 'lightbox')


  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in text-zinc-100 pb-4">
      {/* ─── 1. Header: Type Badge, ID & Order ───────────────────────────────── */}
      <div className="space-y-2 border-b border-zinc-800 pb-3 sm:pb-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 rounded-none text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase bg-white text-black">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
              TYPE: {project.type?.toUpperCase()}
            </span>
            {project.order && (
              <span className="text-[11px] sm:text-xs font-mono text-zinc-400">
                ORDER: #{project.order}
              </span>
            )}
          </div>

          <span className="text-[11px] sm:text-xs font-mono text-zinc-400 uppercase tracking-wider">
            ID: #{project.id}
          </span>
        </div>

        {/* ─── 2. Title ──────────────────────────────────────────────────────── */}
        <h2 className={typography.projects.drawer.title}>
          {title}
        </h2>
      </div>

      {/* ─── 3. Cover Image ─────────────────────────────────────────────────── */}
      {coverUrl && (
        <div
          onClick={() =>
            handleOpenLightbox({
              id: 'cover',
              mediaType: 'image',
              resolvedSrc: coverUrl,
              caption: `${title} - Cover Banner`,
            })
          }
          className="relative w-full aspect-[16/9] rounded-none sm:rounded-sm overflow-hidden border border-zinc-800 shadow-2xl group bg-zinc-950 cursor-pointer"
        >
          <img
            src={coverUrl}
            alt={title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter grayscale group-hover:grayscale-0"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-2.5 sm:bottom-3 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-zinc-300 pointer-events-none">
            <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-none bg-black/90 backdrop-blur-sm border border-white/20 text-white font-mono tracking-widest text-[9px] uppercase font-bold">
              COVER IMAGE
            </span>
            <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-none bg-black/90 backdrop-blur-sm border border-zinc-700 text-white font-semibold flex items-center gap-1 uppercase tracking-wider">
              <span>BẤM ĐỂ PHÓNG TO</span>
              <span>↗</span>
            </span>
          </div>
        </div>
      )}

      {/* ─── 4. Technologies (Tech Stack Pills) ───────────────────────────────── */}
      {project.technologies && project.technologies.length > 0 && (
        <div className="space-y-1.5 sm:space-y-2 pt-1">
          <h3 className={typography.projects.drawer.sectionHeading}>
            {currentLang === 'vi' ? 'Công nghệ sử dụng' : 'Technologies'}
          </h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono px-2.5 sm:px-3 py-1 rounded-none
                  bg-zinc-950 text-zinc-200
                  border border-zinc-800 hover:border-white transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ─── 5. Summary (Executive Brief) ─────────────────────────────────────── */}
      {summary && (
        <div className="p-3.5 sm:p-4 rounded-none bg-zinc-950 border border-zinc-800 shadow-inner">
          <p className={`${typography.projects.drawer.summary} whitespace-pre-line`}>
            "{summary}"
          </p>
        </div>
      )}

      {/* ─── 6. Description (Architecture & System Workflow) ─────────────────── */}
      {description && (
        <div className="space-y-2">
          <h3 className={`flex items-center gap-2 ${typography.projects.drawer.sectionHeading}`}>
            <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>{currentLang === 'vi' ? 'Kiến trúc & Giải pháp Chi tiết' : 'Architecture & Solution'}</span>
          </h3>
          <div className={`${typography.projects.drawer.featureDescription} whitespace-pre-line space-y-2`}>
            {description}
          </div>
        </div>
      )}

      {/* ─── 7. Features (Key Capabilities) ──────────────────────────────────── */}
      {features && features.length > 0 && (
        <div className="space-y-2 sm:space-y-2.5 pt-1">
          <h3 className={`flex items-center gap-2 ${typography.projects.drawer.sectionHeading}`}>
            <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{currentLang === 'vi' ? 'Tính năng & Năng lực Nổi bật' : 'Key Features'}</span>
          </h3>
          <ul className="space-y-2 text-xs text-zinc-300">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5 bg-zinc-950 p-2.5 sm:p-3 rounded-none border border-zinc-800">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                <span className={typography.projects.drawer.featureDescription}>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ─── Video Showcase Section Renderer ───────────────────────────────── */}
      {(() => {
        const renderVideoSection = () =>
          videos && videos.length > 0 ? (
            <div key="videos-section" className="space-y-3 pt-2">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <h3 className={`flex items-center gap-2 ${typography.projects.drawer.sectionHeading}`}>
                  <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{currentLang === 'vi' ? 'Video Demo & Trải nghiệm' : 'Video Demos & Showcase'}</span>
                </h3>
                <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                  {videos.length} {videos.length === 1 ? 'VIDEO' : 'VIDEOS'} (BẤM ĐỂ XEM)
                </span>
              </div>

              {/* Responsive Video Grid: 1 col on mobile, 2 col on tablet/desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {videos.map((vid, idx) => {
                  const caption = vid.caption?.[currentLang] || vid.caption?.vi || ''
                  const videoData = parseVideoSource(vid.src, vid.poster)
                  return (
                    <div
                      key={vid.id || idx}
                      onClick={() => handleOpenLightbox({ ...vid, mediaType: 'video', caption, videoData })}
                      className="group relative cursor-pointer overflow-hidden rounded-none sm:rounded-sm
                        border border-zinc-800 bg-zinc-950 aspect-video
                        hover:border-white transition-all duration-300 shadow-md"
                    >
                      {/* Poster Thumbnail or Native Video Preview */}
                      {videoData?.poster ? (
                        <img
                          src={videoData.poster}
                          alt={caption || `Video ${idx + 1}`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter grayscale group-hover:grayscale-0"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : videoData?.type === 'native' && videoData.src ? (
                        <video
                          src={`${videoData.src}#t=0.001`}
                          preload="metadata"
                          muted
                          playsInline
                          className="w-full h-full object-cover object-center filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                          <span className="font-mono text-xs text-zinc-500">VIDEO #{idx + 1}</span>
                        </div>
                      )}

                      {/* Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-2.5 sm:p-3 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-300">
                          <span className="px-1.5 py-0.5 rounded-none bg-black/90 border border-zinc-800">
                            #{idx + 1}
                          </span>
                          <span className="px-2 py-0.5 rounded-none bg-black/90 border border-zinc-800 text-zinc-300 opacity-80 group-hover:opacity-100 transition-opacity flex items-center gap-1 uppercase tracking-wider text-[9px] text-white">
                            <span>PLAY</span>
                            <span className="text-white">▶</span>
                          </span>
                        </div>

                        {/* Centered Play Button Indicator */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/80 border border-white/40 group-hover:border-white group-hover:scale-110 group-hover:bg-white group-hover:text-black text-white flex items-center justify-center transition-all duration-300 shadow-xl backdrop-blur-sm">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current translate-x-0.5" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>

                        {caption && (
                          <p className="text-xs font-medium text-zinc-200 line-clamp-2 leading-tight bg-black/90 p-2 rounded-none backdrop-blur-sm border border-zinc-800 shadow relative z-10">
                            {caption}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : null

        const renderGallerySection = () =>
          gallery && gallery.length > 0 ? (
            <div key="gallery-section" className="space-y-3 pt-2">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <h3 className={`flex items-center gap-2 ${typography.projects.drawer.sectionHeading}`}>
                  <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{currentLang === 'vi' ? 'Bộ sưu tập ảnh & Giao diện' : 'Gallery & Screenshots'}</span>
                </h3>
                <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                  {gallery.length} PHOTOS (BẤM ĐỂ PHÓNG TO)
                </span>
              </div>

              {/* Responsive Gallery Grid: 1 col on mobile, 2 col on tablet/desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {gallery.map((img, idx) => {
                  const caption = img.caption?.[currentLang] || img.caption?.vi || ''
                  const isVid = isVideoItem(img)
                  const videoData = isVid ? parseVideoSource(img.src, img.poster) : null
                  const resolvedSrc = isVid ? (videoData?.poster || '') : resolveProjectImage(img.src)

                  return (
                    <div
                      key={img.id || idx}
                      onClick={() =>
                        handleOpenLightbox(
                          isVid
                            ? { ...img, mediaType: 'video', caption, videoData }
                            : { ...img, mediaType: 'image', caption, resolvedSrc }
                        )
                      }
                      className="group relative cursor-pointer overflow-hidden rounded-none sm:rounded-sm
                        border border-zinc-800 bg-zinc-950 aspect-video
                        hover:border-white transition-all duration-300 shadow-md"
                    >
                      {resolvedSrc ? (
                        <img
                          src={resolvedSrc}
                          alt={caption || `Gallery ${idx + 1}`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter grayscale group-hover:grayscale-0"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : isVid && videoData?.type === 'native' && videoData.src ? (
                        <video
                          src={videoData.src}
                          preload="metadata"
                          muted
                          playsInline
                          className="w-full h-full object-cover object-center filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                        />
                      ) : null}

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-2.5 sm:p-3 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-300">
                          <span className="px-1.5 py-0.5 rounded-none bg-black/90 border border-zinc-800">
                            #{idx + 1}
                          </span>
                          <span className="px-2 py-0.5 rounded-none bg-black/90 border border-zinc-800 text-zinc-300 opacity-70 group-hover:opacity-100 transition-opacity flex items-center gap-1 uppercase tracking-wider text-[9px]">
                            <span>{isVid ? 'PLAY' : 'ZOOM'}</span>
                            <span>{isVid ? '▶' : '🔍'}</span>
                          </span>
                        </div>

                        {isVid && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-10 h-10 rounded-full bg-black/80 border border-white/40 group-hover:border-white group-hover:scale-110 group-hover:bg-white group-hover:text-black text-white flex items-center justify-center transition-all duration-300 shadow-xl backdrop-blur-sm">
                              <svg className="w-4 h-4 fill-current translate-x-0.5" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        )}

                        {caption && (
                          <p className="text-xs font-medium text-zinc-200 line-clamp-2 leading-tight bg-black/90 p-2 rounded-none backdrop-blur-sm border border-zinc-800 shadow relative z-10">
                            {caption}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : null

        return isVideosFirst ? (
          <React.Fragment key="media-sections">
            {renderVideoSection()}
            {renderGallerySection()}
          </React.Fragment>
        ) : (
          <React.Fragment key="media-sections">
            {renderGallerySection()}
            {renderVideoSection()}
          </React.Fragment>
        )
      })()}

      {/* ─── 10. Links (Universal Dynamic Multi-Demo & Repos) ─────────────────── */}
      {normalizedLinks.length > 0 && (
        <div className="pt-4 sm:pt-5 flex flex-wrap items-center gap-2 sm:gap-3 border-t border-zinc-800">
          {normalizedLinks.map((linkItem, idx) => {
            const { className, icon } = getLinkButtonStyles(linkItem.type)
            return (
              <a
                key={idx}
                href={linkItem.url}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-none text-xs font-mono font-bold tracking-widest uppercase transition-all ${className}`}
              >
                {icon}
                <span>{linkItem.label}</span>
              </a>
            )
          })}
        </div>
      )}

      {/* ─── Lightbox Portal: Viewport-Centered Fullscreen Zoom / Video Player ────────────────── */}
      {activeLightboxItem &&
        createPortal(
          <div
            onClick={(e) => {
              e.stopPropagation()
              handleCloseLightbox()
            }}
            className={`fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/95 md:bg-black/92 md:backdrop-blur-lg ${
              isClosingLightbox ? 'animate-fade-out pointer-events-none' : 'animate-fade-in'
            }`}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={`relative max-w-5xl w-full bg-zinc-950 border border-zinc-800 rounded-none sm:rounded-sm p-3 sm:p-5 md:p-6 shadow-2xl text-white space-y-3 sm:space-y-4 gpu-accelerated ${
                isClosingLightbox ? 'animate-zoom-out' : 'animate-zoom-in'
              }`}
            >
              {/* Modal Top Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 sm:pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span className="text-[11px] sm:text-xs font-mono font-bold text-white uppercase tracking-widest">
                    {activeLightboxItem.id || (activeLightboxItem.mediaType === 'video' ? 'Video Player' : 'Photo Preview')}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCloseLightbox()
                  }}
                  className="px-3 py-1 sm:py-1.5 rounded-none bg-zinc-900 hover:bg-white hover:text-black text-zinc-200 text-xs font-mono font-bold tracking-widest uppercase transition-all cursor-pointer flex items-center gap-1.5 border border-zinc-700 active:scale-95"
                >
                  <span>✕</span>
                  <span>ĐÓNG</span>
                </button>
              </div>

              {/* Large Media Container (Image or Video Player) */}
              <div className="w-full max-h-[65vh] sm:max-h-[75vh] rounded-none overflow-hidden bg-black border border-zinc-800 flex items-center justify-center p-1 sm:p-2">
                {activeLightboxItem.mediaType === 'video' || activeLightboxItem.videoData ? (
                  activeLightboxItem.videoData?.type === 'native' ? (
                    <video
                      key={activeLightboxItem.videoData.src}
                      src={activeLightboxItem.videoData.src}
                      controls
                      autoPlay
                      playsInline
                      preload="auto"
                      width="1280"
                      height="720"
                      poster={activeLightboxItem.videoData.poster || undefined}
                      className="w-full max-h-[60vh] sm:max-h-[70vh] rounded-none object-contain shadow-2xl"
                    >
                      <source
                        src={activeLightboxItem.videoData.src}
                        type={getVideoMimeType(activeLightboxItem.videoData.src)}
                      />
                      Your browser does not support HTML5 video playback.
                    </video>
                  ) : activeLightboxItem.videoData?.embedUrl ? (
                    <div className="w-full aspect-video max-h-[60vh] sm:max-h-[70vh]">
                      <iframe
                        src={activeLightboxItem.videoData.embedUrl}
                        title={activeLightboxItem.caption || 'Video Player'}
                        className="w-full h-full border-0 rounded-none shadow-2xl"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <span className="font-mono text-xs text-zinc-500 py-12">
                      Video source not available
                    </span>
                  )
                ) : activeLightboxItem.resolvedSrc ? (
                  <img
                    src={activeLightboxItem.resolvedSrc}
                    alt={activeLightboxItem.caption || 'Preview'}
                    className="max-w-full max-h-[60vh] sm:max-h-[70vh] object-contain shadow-2xl"
                  />
                ) : (
                  <span className="font-mono text-xs text-zinc-500 py-12">
                    {activeLightboxItem.caption || 'No Image Available'}
                  </span>
                )}
              </div>

              {/* Caption */}
              {activeLightboxItem.caption && (
                <div className="p-2.5 sm:p-3 rounded-none bg-black border border-zinc-800 text-center">
                  <p className="text-xs sm:text-sm text-zinc-200 font-sans">
                    {activeLightboxItem.caption}
                  </p>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}

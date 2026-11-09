import React, { useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { resolveProjectImage, resolveProjectVideo, parseVideoSource, isVideoItem, getVideoMimeType } from '../../../utils/helpers'
import useModalHistory from '../../../hooks/useModalHistory'

/**
 * GalleryTemplate Component
 * 
 * Template for projects with `type: "gallery"`.
 * Focuses on visual presentation, photo & video gallery preview with captions,
 * lightbox modal support with smooth enter/exit animations, responsive media grid, and UI architecture.
 *
 * @param {Object} props.project - The project data object from portfolioData.json
 */
export default function GalleryTemplate({ project }) {
  const { t, i18n } = useTranslation('portfolio')
  const currentLang = i18n.language === 'en' ? 'en' : 'vi'
  const [activeMedia, setActiveMedia] = useState(null)
  const [isClosingMedia, setIsClosingMedia] = useState(false)

  // Open & Close Lightbox with smooth zoom-in and zoom-out transitions
  const handleOpenMedia = (mediaData) => {
    setIsClosingMedia(false)
    setActiveMedia(mediaData)
  }

  const handleCloseMedia = useCallback(() => {
    if (isClosingMedia || !activeMedia) return
    setIsClosingMedia(true)
    setTimeout(() => {
      setActiveMedia(null)
      setIsClosingMedia(false)
    }, 220)
  }, [isClosingMedia, activeMedia])

  // Intercept mobile back button to close lightbox
  useModalHistory(Boolean(activeMedia), handleCloseMedia, 'gallery-lightbox')

  // Retrieve bilingual text
  const title = project.title?.[currentLang] || project.title?.vi || ''
  const summary = project.summary?.[currentLang] || project.summary?.vi || ''
  const description = project.description?.[currentLang] || project.description?.vi || ''
  const gallery = project.gallery || []
  const videos = project.videos || []

  // Determine media sections display order based on key definition sequence in portfolioData.json
  const projectKeys = Object.keys(project || {})
  const galleryIndex = projectKeys.indexOf('gallery')
  const videosIndex = projectKeys.indexOf('videos')
  const isVideosFirst = videosIndex !== -1 && (galleryIndex === -1 || videosIndex < galleryIndex)

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in text-zinc-100 pb-4">
      {/* ─── Header: Type badge & Title ──────────────────────────────────────── */}
      <div className="space-y-2 border-b border-zinc-800 pb-3 sm:pb-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 rounded-none text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest bg-white text-black">
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
            TYPE: {project.type?.toUpperCase()}
          </span>
          <span className="text-[11px] sm:text-xs font-mono text-zinc-400">
            ID: #{project.id}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-snug pt-1">
          {title}
        </h2>
      </div>

      {/* ─── Summary Callout ─────────────────────────────────────────────────── */}
      {summary && (
        <div className="p-3.5 sm:p-4 rounded-none bg-zinc-950 border border-zinc-800 shadow-inner">
          <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed italic whitespace-pre-line">
            "{summary}"
          </p>
        </div>
      )}

      {/* ─── Video & Photo Gallery Showcase Grids (Ordered by portfolioData.json sequence) ── */}
      {(() => {
        const renderVideoSection = () =>
          videos && videos.length > 0 ? (
            <div key="videos-section" className="space-y-3 pt-1">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <h3 className="text-xs font-mono font-bold tracking-widest text-white uppercase flex items-center gap-2">
                  <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{currentLang === 'vi' ? 'Bộ sưu tập Video' : 'Video Gallery'}</span>
                </h3>
                <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                  {videos.length} {videos.length === 1 ? 'VIDEO' : 'VIDEOS'} (BẤM ĐỂ XEM)
                </span>
              </div>

              {/* Responsive Video Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {videos.map((vid, idx) => {
                  const caption = vid.caption?.[currentLang] || vid.caption?.vi || ''
                  const videoData = parseVideoSource(vid.src, vid.poster)
                  return (
                    <div
                      key={vid.id || idx}
                      onClick={() => handleOpenMedia({ ...vid, mediaType: 'video', caption, videoData })}
                      className="group relative cursor-pointer overflow-hidden rounded-none sm:rounded-sm
                        border border-zinc-800 bg-zinc-950 aspect-video
                        hover:border-white transition-all duration-300 shadow-md"
                    >
                      {videoData?.poster ? (
                        <img
                          src={videoData.poster}
                          alt={caption || `Video ${idx + 1}`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter grayscale group-hover:grayscale-0"
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

                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-11 h-11 rounded-full bg-black/80 border border-white/40 group-hover:border-white group-hover:scale-110 group-hover:bg-white group-hover:text-black text-white flex items-center justify-center transition-all duration-300 shadow-xl backdrop-blur-sm">
                            <svg className="w-5 h-5 fill-current translate-x-0.5" viewBox="0 0 24 24">
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
            <div key="gallery-section" className="space-y-3 pt-1">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <h3 className="text-xs font-mono font-bold tracking-widest text-white uppercase flex items-center gap-2">
                  <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{currentLang === 'vi' ? 'Bộ sưu tập ảnh' : 'Photo Gallery'}</span>
                </h3>
                <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                  {gallery.length} PHOTOS
                </span>
              </div>

              {/* Responsive Gallery Grid */}
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
                        handleOpenMedia(
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

      {/* ─── Description / Highlights ────────────────────────────────────────── */}
      {description && (
        <div className="space-y-1.5">
          <h3 className="text-xs font-mono font-bold tracking-widest text-white uppercase flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            <span>{currentLang === 'vi' ? 'Lưu trữ & Tối ưu' : 'Storage & Optimization'}</span>
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans whitespace-pre-line">
            {description}
          </p>
        </div>
      )}

      {/* ─── Tech Stack ───────────────────────────────────────────────────────── */}
      {project.technologies && project.technologies.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <h3 className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase">
            {currentLang === 'vi' ? 'Công nghệ' : 'Tech Stack'}
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

      {/* ─── Action Links ─────────────────────────────────────────────────────── */}
      <div className="pt-4 sm:pt-5 flex flex-wrap items-center gap-2 sm:gap-3 border-t border-zinc-800">
        {project.links?.demo && (
          <a
            href={project.links.demo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none text-xs font-mono font-bold tracking-widest uppercase
              border border-white bg-white text-black hover:bg-transparent hover:text-white transition-all active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{t('ui.buttons.viewProject', 'Live Gallery Demo')}</span>
          </a>
        )}

        {project.links?.source && (
          <a
            href={project.links.source}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none text-xs font-mono font-bold tracking-widest uppercase
              border border-zinc-700 bg-black hover:bg-white hover:text-black text-white transition-all active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>{t('ui.buttons.viewSource', 'GitHub Source')}</span>
          </a>
        )}
      </div>

      {/* ─── Lightbox Modal Preview (Teleported to document.body) ─────────────── */}
      {activeMedia &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            onClick={(e) => {
              e.stopPropagation()
              handleCloseMedia()
            }}
            className={`fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/95 md:bg-black/92 md:backdrop-blur-lg ${
              isClosingMedia ? 'animate-fade-out pointer-events-none' : 'animate-fade-in'
            }`}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={`relative max-w-4xl w-full bg-zinc-950 border border-zinc-800 rounded-none sm:rounded-sm p-4 sm:p-6 shadow-2xl text-white space-y-3 sm:space-y-4 gpu-accelerated ${
                isClosingMedia ? 'animate-zoom-out' : 'animate-zoom-in'
              }`}
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs font-mono font-bold tracking-widest text-white uppercase">
                  {activeMedia.id || (activeMedia.mediaType === 'video' ? 'Video Player' : 'Photo Details')}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCloseMedia()
                  }}
                  className="px-2.5 py-1 rounded-none bg-zinc-900 hover:bg-white hover:text-black text-zinc-300 text-xs font-mono font-bold tracking-widest uppercase transition-all cursor-pointer flex items-center gap-1 border border-zinc-700 active:scale-95"
                >
                  ✕ ĐÓNG
                </button>
              </div>

              {/* Large Media Container (Image or Video Player) */}
              <div className="w-full max-h-[65vh] sm:max-h-[75vh] rounded-none overflow-hidden bg-black border border-zinc-800 flex items-center justify-center p-1 sm:p-2">
                {activeMedia.mediaType === 'video' || activeMedia.videoData ? (
                  activeMedia.videoData?.type === 'native' ? (
                    <video
                      key={activeMedia.videoData.src}
                      src={activeMedia.videoData.src}
                      controls
                      autoPlay
                      playsInline
                      preload="auto"
                      width="1280"
                      height="720"
                      poster={activeMedia.videoData.poster || undefined}
                      className="w-full max-h-[60vh] sm:max-h-[70vh] rounded-none object-contain shadow-2xl"
                    >
                      <source
                        src={activeMedia.videoData.src}
                        type={getVideoMimeType(activeMedia.videoData.src)}
                      />
                      Your browser does not support HTML5 video playback.
                    </video>
                  ) : activeMedia.videoData?.embedUrl ? (
                    <div className="w-full aspect-video max-h-[60vh] sm:max-h-[70vh]">
                      <iframe
                        src={activeMedia.videoData.embedUrl}
                        title={activeMedia.caption || 'Video Player'}
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
                ) : activeMedia.resolvedSrc ? (
                  <img
                    src={activeMedia.resolvedSrc}
                    alt={activeMedia.caption || 'Preview'}
                    className="max-w-full max-h-[60vh] sm:max-h-[70vh] object-contain shadow-2xl"
                  />
                ) : (
                  <span className="font-mono text-xs text-zinc-500 py-12">
                    {activeMedia.caption || 'No Image Available'}
                  </span>
                )}
              </div>

              {activeMedia.caption && (
                <div className="p-2.5 sm:p-3 rounded-none bg-black border border-zinc-800 text-center">
                  <p className="text-xs sm:text-sm text-zinc-200 font-sans">
                    {activeMedia.caption}
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

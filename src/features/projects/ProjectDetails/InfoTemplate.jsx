import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { resolveProjectImage } from '../../../utils/helpers'

/**
 * InfoTemplate / Unified Project Detail Component
 * 
 * Renders the project details strictly following the exact field sequence in `portfolioData.json`:
 * 1. Type Badge, ID & Order
 * 2. Title
 * 3. Cover Image (Full width preview with click-to-zoom)
 * 4. Technologies (Tech stack pills)
 * 5. Summary (Executive Brief / Callout quotation)
 * 6. Description (Architecture & System solution)
 * 7. Features (Key capabilities bullet list)
 * 8. Gallery (Photo Showcase & Screenshots with Viewport-Centered Lightbox Portal)
 * 9. Links (Demo, Backend API, Frontend, GitHub Source)
 *
 * @param {Object} props.project - The project data object from portfolioData.json
 */
export default function InfoTemplate({ project }) {
  const { i18n } = useTranslation('portfolio')
  const currentLang = i18n.language === 'en' ? 'en' : 'vi'
  const [activeLightboxImg, setActiveLightboxImg] = useState(null)

  // Retrieve bilingual text
  const title = project.title?.[currentLang] || project.title?.vi || ''
  const summary = project.summary?.[currentLang] || project.summary?.vi || ''
  const description = project.description?.[currentLang] || project.description?.vi || ''
  const features = project.features?.[currentLang] || project.features?.vi || []
  const gallery = project.gallery || []
  const coverUrl = resolveProjectImage(project.coverImage)

  // Handle ESC key for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeLightboxImg) {
        e.stopPropagation()
        setActiveLightboxImg(null)
      }
    }
    if (activeLightboxImg) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeLightboxImg])

  return (
    <div className="space-y-6 animate-fade-in text-slate-100 pb-4">
      {/* ─── 1. Header: Type Badge, ID & Order ───────────────────────────────── */}
      <div className="space-y-2 border-b border-slate-800 pb-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-mono font-semibold uppercase ${
                project.type === 'gallery'
                  ? 'bg-purple-950/80 text-purple-300 border border-purple-800/80'
                  : 'bg-blue-950/80 text-blue-300 border border-blue-800/80'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              TYPE: {project.type?.toUpperCase()}
            </span>
            {project.order && (
              <span className="text-xs font-mono text-slate-500">
                ORDER: #{project.order}
              </span>
            )}
          </div>

          <span className="text-xs font-mono text-slate-400">
            ID: #{project.id}
          </span>
        </div>

        {/* ─── 2. Title ──────────────────────────────────────────────────────── */}
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-snug pt-1">
          {title}
        </h2>
      </div>

      {/* ─── 3. Cover Image ─────────────────────────────────────────────────── */}
      {coverUrl && (
        <div
          onClick={() =>
            setActiveLightboxImg({
              id: 'cover',
              resolvedSrc: coverUrl,
              caption: `${title} - Cover Banner`,
            })
          }
          className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group bg-slate-900 cursor-pointer"
        >
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-slate-300 pointer-events-none">
            <span className="px-2.5 py-1 rounded bg-slate-950/80 backdrop-blur-sm border border-slate-800 text-blue-400 font-semibold shadow">
              COVER IMAGE
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-950/80 backdrop-blur-sm border border-slate-800 text-slate-300 font-semibold shadow flex items-center gap-1">
              <span>BẤM ĐỂ PHÓNG TO</span>
              <span>↗</span>
            </span>
          </div>
        </div>
      )}

      {/* ─── 4. Technologies (Tech Stack Pills) ───────────────────────────────── */}
      {project.technologies && project.technologies.length > 0 && (
        <div className="space-y-2 pt-1">
          <h3 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
            {currentLang === 'vi' ? 'Công nghệ sử dụng' : 'Technologies'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono px-3 py-1 rounded-md
                  bg-slate-900 text-slate-200
                  border border-slate-700 hover:border-blue-500/50 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ─── 5. Summary (Executive Brief) ─────────────────────────────────────── */}
      {summary && (
        <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-900/60 shadow-inner">
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed italic">
            "{summary}"
          </p>
        </div>
      )}

      {/* ─── 6. Description (Architecture & System Workflow) ─────────────────── */}
      {description && (
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold tracking-wider text-blue-400 uppercase flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>{currentLang === 'vi' ? 'Kiến trúc & Giải pháp Chi tiết' : 'Architecture & Solution'}</span>
          </h3>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
            {description}
          </p>
        </div>
      )}

      {/* ─── 7. Features (Key Capabilities) ──────────────────────────────────── */}
      {features && features.length > 0 && (
        <div className="space-y-2.5 pt-1">
          <h3 className="text-xs font-mono font-bold tracking-wider text-blue-400 uppercase flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{currentLang === 'vi' ? 'Tính năng & Năng lực Nổi bật' : 'Key Features'}</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                <span className="leading-relaxed font-sans">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ─── 8. Gallery (Photo Showcase & Screenshots) ─────────────────────────── */}
      {gallery && gallery.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-mono font-bold tracking-wider text-blue-400 uppercase flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{currentLang === 'vi' ? 'Bộ sưu tập ảnh & Giao diện' : 'Gallery & Screenshots'}</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              {gallery.length} PHOTOS (CLICK ĐỂ PHÓNG TO)
            </span>
          </div>

          {/* Responsive Gallery Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {gallery.map((img, idx) => {
              const caption = img.caption?.[currentLang] || img.caption?.vi || ''
              const resolvedSrc = resolveProjectImage(img.src)
              return (
                <div
                  key={img.id || idx}
                  onClick={() => setActiveLightboxImg({ ...img, caption, resolvedSrc })}
                  className="group relative cursor-pointer overflow-hidden rounded-xl
                    border border-slate-800 bg-slate-900 aspect-video
                    hover:border-blue-500/60 transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]"
                >
                  {resolvedSrc ? (
                    <img
                      src={resolvedSrc}
                      alt={caption || `Gallery ${idx + 1}`}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : null}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent p-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[10px] font-mono text-blue-400">
                      <span className="px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-800">
                        #{idx + 1}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-slate-300 opacity-70 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <span>ZOOM</span>
                        <span>🔍</span>
                      </span>
                    </div>
                    {caption && (
                      <p className="text-xs font-medium text-slate-200 line-clamp-2 leading-tight bg-slate-950/85 p-2 rounded backdrop-blur-sm border border-slate-800/80 shadow">
                        {caption}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ─── 9. Links (Action Buttons) ────────────────────────────────────────── */}
      <div className="pt-5 flex flex-wrap items-center gap-3 border-t border-slate-800">
        {project.links?.demo && (
          <a
            href={project.links.demo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-semibold
              bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/50
              active:scale-95 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span>TRẢI NGHIỆM DEMO ↗</span>
          </a>
        )}

        {project.links?.backend && (
          <a
            href={project.links.backend}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-semibold
              bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50
              active:scale-95 transition-all"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>API REPO</span>
          </a>
        )}

        {project.links?.frontend && (
          <a
            href={project.links.frontend}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-semibold
              border border-slate-700 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white
              hover:border-blue-500/50 transition-all"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>FE REPO</span>
          </a>
        )}

        {project.links?.websocket && (
          <a
            href={project.links.websocket}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-semibold
              border border-purple-800/80 bg-purple-950/50 hover:bg-purple-900/80 text-purple-200 hover:text-white
              hover:border-purple-500/60 transition-all shadow-md"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>WEBSOCKET REPO</span>
          </a>
        )}

        {project.links?.source && !project.links?.backend && !project.links?.frontend && (
          <a
            href={project.links.source}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-semibold
              bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 active:scale-95 transition-all"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GITHUB SOURCE</span>
          </a>
        )}
      </div>

      {/* ─── Lightbox Portal: Viewport-Centered Fullscreen Zoom ────────────────── */}
      {activeLightboxImg &&
        createPortal(
          <div
            onClick={() => setActiveLightboxImg(null)}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 bg-black/92 backdrop-blur-lg animate-fade-in"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full bg-slate-900/95 border border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-2xl text-white space-y-4 animate-fade-in-up"
            >
              {/* Modal Top Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-xs font-mono font-semibold text-blue-400 uppercase tracking-wider">
                    {activeLightboxImg.id || 'Photo Preview'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveLightboxImg(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 border border-slate-700"
                >
                  <span>✕</span>
                  <span>ĐÓNG</span>
                </button>
              </div>

              {/* Large Image Container */}
              <div className="w-full max-h-[75vh] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-2">
                {activeLightboxImg.resolvedSrc ? (
                  <img
                    src={activeLightboxImg.resolvedSrc}
                    alt={activeLightboxImg.caption || 'Preview'}
                    className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
                  />
                ) : (
                  <span className="font-mono text-xs text-slate-500 py-12">
                    {activeLightboxImg.caption || 'No Image Available'}
                  </span>
                )}
              </div>

              {/* Caption */}
              {activeLightboxImg.caption && (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
                  <p className="text-xs sm:text-sm text-slate-200 font-sans">
                    {activeLightboxImg.caption}
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

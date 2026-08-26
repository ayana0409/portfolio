import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * GalleryTemplate Component
 * 
 * Template for projects with `type: "gallery"`.
 * Focuses on visual presentation, photo gallery preview with captions,
 * lightbox modal support, responsive image grid, and UI architecture.
 *
 * @param {Object} props.project - The project data object from portfolioData.json
 */
export default function GalleryTemplate({ project }) {
  const { t, i18n } = useTranslation('portfolio')
  const currentLang = i18n.language === 'en' ? 'en' : 'vi'
  const [activeImage, setActiveImage] = useState(null)

  // Retrieve bilingual text
  const title = project.title?.[currentLang] || project.title?.vi || ''
  const summary = project.summary?.[currentLang] || project.summary?.vi || ''
  const description = project.description?.[currentLang] || project.description?.vi || ''
  const gallery = project.gallery || []

  return (
    <div className="space-y-5 animate-fade-in">
      {/* ─── Header: Type badge & Title ──────────────────────────────────────── */}
      <div className="space-y-2 border-b border-brand-border/60 dark:border-brand-border-dark/60 pb-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400 animate-pulse" />
            type: {project.type}
          </span>
          <span className="text-[11px] font-mono text-brand-muted dark:text-brand-muted-dark">
            ID: #{project.id}
          </span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-brand-text dark:text-brand-text-dark leading-snug">
          {title}
        </h2>
      </div>

      {/* ─── Summary Callout ─────────────────────────────────────────────────── */}
      <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
        <p className="text-xs md:text-sm text-brand-text/90 dark:text-slate-200 leading-relaxed italic">
          "{summary}"
        </p>
      </div>

      {/* ─── Photo Gallery Showcase Grid ─────────────────────────────────────── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-semibold tracking-wider text-brand-accent dark:text-brand-accent-dark uppercase flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {currentLang === 'vi' ? 'Bộ sưu tập ảnh' : 'Photo Gallery'}
          </h3>
          <span className="text-[10px] font-mono text-brand-muted dark:text-brand-muted-dark">
            {gallery.length} photos
          </span>
        </div>

        {/* Gallery Image Thumbnails / Mockup Cards */}
        <div className="grid grid-cols-3 gap-2">
          {gallery.map((img, idx) => {
            const caption = img.caption?.[currentLang] || img.caption?.vi || ''
            return (
              <div
                key={img.id || idx}
                onClick={() => setActiveImage({ ...img, caption })}
                className="group relative cursor-pointer overflow-hidden rounded-lg
                  border border-brand-border dark:border-brand-border-dark
                  bg-slate-100 dark:bg-slate-800 aspect-video
                  hover:border-brand-accent dark:hover:border-brand-accent-dark
                  transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-blue-900/60 p-2 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[9px] font-mono text-blue-400">
                    <span>#{idx + 1}</span>
                    <svg className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                  <p className="text-[9px] font-medium text-slate-200 line-clamp-2 leading-tight">
                    {caption}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── Description / Cloud Storage Highlights ──────────────────────────── */}
      <div className="space-y-1.5">
        <h3 className="text-xs font-mono font-semibold tracking-wider text-brand-accent dark:text-brand-accent-dark uppercase flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          {currentLang === 'vi' ? 'Lưu trữ & Tối ưu' : 'Storage & Optimization'}
        </h3>
        <p className="text-xs md:text-sm text-brand-muted dark:text-brand-muted-dark leading-relaxed">
          {description}
        </p>
      </div>

      {/* ─── Tech Stack ───────────────────────────────────────────────────────── */}
      <div className="space-y-1.5 pt-1">
        <h3 className="text-xs font-mono font-semibold tracking-wider text-brand-muted dark:text-brand-muted-dark uppercase">
          {currentLang === 'vi' ? 'Công nghệ' : 'Tech Stack'}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {project.technologies?.map((tech) => (
            <span
              key={tech}
              className="text-[11px] font-mono px-2 py-0.5 rounded-md
                bg-slate-100 dark:bg-slate-800/80
                text-slate-700 dark:text-slate-300
                border border-slate-200 dark:border-slate-700"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* ─── Action Links ─────────────────────────────────────────────────────── */}
      <div className="pt-3 flex flex-wrap items-center gap-3 border-t border-brand-border/60 dark:border-brand-border-dark/60">
        {project.links?.demo && (
          <a
            href={project.links.demo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
              bg-brand-accent dark:bg-brand-accent-dark text-white
              hover:opacity-90 active:scale-95 transition-all shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {t('ui.buttons.viewProject', 'Live Gallery Demo')}
          </a>
        )}

        {project.links?.source && (
          <a
            href={project.links.source}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
              border border-brand-border dark:border-brand-border-dark
              hover:bg-brand-border/40 dark:hover:bg-brand-border-dark/40
              text-brand-text dark:text-brand-text-dark transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            {t('ui.buttons.viewSource', 'GitHub Source')}
          </a>
        )}
      </div>

      {/* ─── Lightbox Modal Preview ─────────────────────────────────────────── */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-white space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-blue-400">Photo Details</span>
              <button
                onClick={() => setActiveImage(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video w-full rounded-xl bg-gradient-to-tr from-slate-950 via-slate-800 to-blue-900 flex items-center justify-center p-6 text-center border border-slate-700">
              <span className="font-mono text-sm text-blue-300">
                [ Preview: {activeImage.id} ]
              </span>
            </div>
            <p className="text-sm text-slate-300 italic">
              "{activeImage.caption}"
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

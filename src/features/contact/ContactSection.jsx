import React from 'react'
import { useTranslation } from 'react-i18next'
import portfolioData from '../../data/portfolioData.json'
import { useGSAPFadeUp } from '../../hooks/useGSAPAnimations'
import { typography } from '../../config/typography'
import Footer from '../../components/common/Footer'

/**
 * ContactSection Component
 * 
 * Strictly 100% fullscreen height (`h-screen` / `100dvh`) with snap-start alignment
 * and seamless integrated bottom footer bar.
 */
export default function ContactSection() {
  const { t, i18n } = useTranslation('portfolio')
  const currentLang = i18n.language === 'en' ? 'en' : 'vi'
  const sectionRef = useGSAPFadeUp({ delay: 0.2, stagger: 0.15 })

  const email = portfolioData.contact?.email || 'duongdoanthuan@example.com'
  const githubUrl = portfolioData.contact?.github || 'https://github.com/ayana0409'
  const linkedinUrl = portfolioData.contact?.linkedin || 'https://www.linkedin.com/in/thuanduongdev/'

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-screen min-h-[100dvh] md:h-[100dvh] w-full overflow-hidden flex flex-col justify-between items-center pt-20 pb-6 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-[1800px] mx-auto select-none"
    >
      {/* Main Content Area */}
      <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 my-auto relative z-10 w-full py-2">
        {/* Section Pill */}
        <div className={`inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-zinc-900/90 border border-white/20 ${typography.contact.sectionBadge}`} data-animate>
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>05 / GET IN TOUCH</span>
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-2 sm:space-y-3" data-animate>
          <h2 className={typography.contact.sectionTitle}>
            {t('contact.title', 'Liên hệ & Hợp tác')}
          </h2>
          <p className={typography.contact.sectionSubtitle}>
            {currentLang === 'vi'
              ? 'TÔI LUÔN SẴN SÀNG TRAO ĐỔI VỀ CÁC DỰ ÁN BACKEND .NET, KIẾN TRÚC HỆ THỐNG VÀ MICROSERVICES.'
              : 'ALWAYS OPEN TO DISCUSSING C# / .NET BACKEND ARCHITECTURE, SCALABLE MICROSERVICES, OR COLLABORATION.'}
          </p>
        </div>

        {/* Contact Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-xl sm:max-w-2xl lg:max-w-5xl xl:max-w-6xl mx-auto pt-2 w-full" data-animate>
          {/* Email Card (Optical Lens) */}
          <a
            href={`mailto:${email}`}
            data-lens-card="true"
            className="optical-lens-card p-4 sm:p-6 md:p-7 rounded-none sm:rounded-sm hover:border-white shadow-2xl transition-all duration-300 flex flex-col items-center gap-2.5 sm:gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-none bg-zinc-950/60 text-white border border-white/20 group-hover:border-white group-hover:bg-white group-hover:text-black flex items-center justify-center transition-all duration-200 backdrop-blur-sm">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-center w-full px-2">
              <span className={typography.contact.cardLabel}>
                Email
              </span>
              <span className={typography.contact.cardValue}>
                {email}
              </span>
            </div>
          </a>

          {/* GitHub Card (Optical Lens) */}
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            data-lens-card="true"
            className="optical-lens-card p-4 sm:p-6 md:p-7 rounded-none sm:rounded-sm hover:border-white shadow-2xl transition-all duration-300 flex flex-col items-center gap-2.5 sm:gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-none bg-zinc-950/60 text-white border border-white/20 group-hover:border-white group-hover:bg-white group-hover:text-black flex items-center justify-center transition-all duration-200 backdrop-blur-sm">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </div>
            <div className="text-center w-full px-2">
              <span className={typography.contact.cardLabel}>
                GitHub Profile
              </span>
              <span className={typography.contact.cardValue}>
                @ayana0409
              </span>
            </div>
          </a>

          {/* LinkedIn Card (Optical Lens) */}
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noreferrer"
            data-lens-card="true"
            className="optical-lens-card p-4 sm:p-6 md:p-7 rounded-none sm:rounded-sm hover:border-white shadow-2xl transition-all duration-300 flex flex-col items-center gap-2.5 sm:gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-none bg-zinc-950/60 text-white border border-white/20 group-hover:border-white group-hover:bg-white group-hover:text-black flex items-center justify-center transition-all duration-200 backdrop-blur-sm">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.75a1.65 1.65 0 0 0-1.66 1.66 1.66 1.66 0 0 0 1.66 1.66 1.66 1.66 0 0 0 1.66-1.66 1.66 1.66 0 0 0-1.66-1.66Z" />
              </svg>
            </div>
            <div className="text-center w-full px-2">
              <span className={typography.contact.cardLabel}>
                LinkedIn Profile
              </span>
              <span className={typography.contact.cardValue}>
                @thuanduongdev
              </span>
            </div>
          </a>
        </div>
      </div>

      {/* Integrated Bottom Footer Bar */}
      <Footer />
    </section>
  )
}

/** @type {import('tailwindcss').Config} */
export default {
  // Strategy: 'class' - toggle dark mode by adding/removing the `dark` class
  // on the <html> element. This enables user-controlled dark mode switching.
  darkMode: 'class',

  // Scan all relevant source files for class names
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {
      // --- Color Palette: "Slate & Blue" ---
      // Defined here so we can reference them as design tokens throughout the app.
      // Tailwind's default slate/blue scale is used; these aliases make intent clear.
      colors: {
        // Light Mode semantic tokens
        'brand-bg':         '#f8fafc', // slate-50  - main background
        'brand-card':       '#ffffff', // white     - card / book page background
        'brand-text':       '#0f172a', // slate-900 - primary text
        'brand-muted':      '#64748b', // slate-500 - secondary / muted text
        'brand-accent':     '#2563eb', // blue-600  - accent / primary brand
        'brand-border':     '#e2e8f0', // slate-200 - borders / dividers

        // Dark Mode semantic tokens (SpaceX High-Contrast Minimal)
        'brand-bg-dark':    '#000000', // pure black
        'brand-card-dark':  '#09090b', // zinc-950 - technical surface
        'brand-text-dark':  '#ffffff', // crisp white
        'brand-muted-dark': '#a1a1aa', // zinc-400 - high-contrast silver
        'brand-accent-dark':'#ffffff', // pure white accent
        'brand-border-dark':'#27272a', // zinc-800 - crisp hairline borders
      },

      // --- Typography ---
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      // --- Animation / Keyframes ---
      // Utility animations for micro-interactions (GSAP handles heavy animations)
      keyframes: {
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'spin-slow': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out both',
        'fade-in':    'fade-in 0.4s ease-out both',
        'spin-slow':  'spin-slow 8s linear infinite',
      },

      // --- Box Shadow ---
      boxShadow: {
        // High-contrast clean highlight
        'brand-glow': '0 0 24px 2px rgba(255, 255, 255, 0.12)',
        // 3D book page depth shadow for the flipbook
        'page-flip':  '4px 0 12px rgba(0,0,0,0.5), -4px 0 12px rgba(0,0,0,0.3)',
      },

      // --- Z-Index ---
      // Named layers for the GSAP paper tear transition effect (Section 4.2 of spec)
      zIndex: {
        'tear-back':   '-1', // next section underneath current page
        'tear-top':    '20', // top half of current page flying up
        'tear-bottom': '20', // bottom half of current page flying down
        'overlay':     '50', // navbar, modals, drawers
      },
    },
  },

  plugins: [],
}

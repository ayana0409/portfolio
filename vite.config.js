import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for the portfolio project
// Configured for GitHub Pages deployment under a sub-path if needed
export default defineConfig({
  plugins: [react()],
  // base: '/portfolio/', // Uncomment and adjust for GitHub Pages deployment
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for the portfolio project
// Configured for GitHub Pages deployment under '/Portfolio/' repository path
export default defineConfig({
  plugins: [react()],
  base: '/Portfolio/',
})


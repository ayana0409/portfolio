import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for the portfolio project
// Base path matches lowercase GitHub repository name ('portfolio')
export default defineConfig({
  plugins: [react()],
  base: '/portfolio/',
})


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for the portfolio project
// Base path matches GitHub repository name ('Portfolio')
export default defineConfig({
  plugins: [react()],
  base: '/Portfolio/',
})


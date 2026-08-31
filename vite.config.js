import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for the portfolio project
// Relative base './' ensures assets load correctly regardless of path casing (/portfolio/ or /Portfolio/)
export default defineConfig({
  plugins: [react()],
  base: './',
})


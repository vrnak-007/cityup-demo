import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative base so the build works from any path: Vercel root,
  // GitHub Pages subpath, and hash routing — without rewrites.
  base: './',
  build: {
    rollupOptions: {
      output: {
        // Split the heavy mapping / charting libs out of the main bundle.
        manualChunks: {
          maplibre: ['maplibre-gl'],
          recharts: ['recharts'],
        },
      },
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['plotly.js-dist-min'],
  },
  server: {
    proxy: {
      '/upload': 'http://localhost:8000',
      '/download-rse': 'http://localhost:8000',
      '/simulate': 'http://localhost:8000',
    }
  }
})

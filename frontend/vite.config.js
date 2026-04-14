import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['plotly.js-dist-min'],
  },
  server: {
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:8000',
    }
  }
})

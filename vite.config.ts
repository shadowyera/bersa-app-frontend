import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  server: {
    proxy: {
      // Todas las llamadas /api/* van al backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,

        // Importante para cookies + SSE
        ws: false,
      },
    },
  },
})
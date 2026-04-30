import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/v1': {
        target: 'http://192.168.1.44:3000',
        changeOrigin: true,
      },
      '/public': {
        target: 'http://192.168.1.44:3000',
        changeOrigin: true,
      }
    }
  }
})

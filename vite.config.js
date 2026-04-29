import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/your-places/',
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/your-places/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/your-places\/api/, '/api'),
      },
    }
  }
})

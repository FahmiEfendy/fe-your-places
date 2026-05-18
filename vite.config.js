import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: '/your-places/',
    plugins: [
      react(),
      {
        name: 'html-transform',
        enforce: 'pre',
        transformIndexHtml(html) {
          const apiKey = env.VITE_GOOGLE_API_KEY || '';
          return html.replace(/%VITE_GOOGLE_API_KEY%/g, apiKey);
        }
      }
    ],
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
  }
})


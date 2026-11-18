import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Support flexible base path for GitHub Pages deployment:
// - Local development defaults to '/'
// - GitHub Pages project deployment can be configured via environment variable (e.g. VITE_BASE_PATH='/Digital-Learning-Hub/')
const rawBase = process.env.VITE_BASE_PATH || process.env.BASE_PATH || '/'
const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // Safe development proxy restricted specifically to the official YouTube oEmbed endpoint
      '/api/youtube-oembed': {
        target: 'https://www.youtube.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/youtube-oembed/, '/oembed'),
      },
    },
  },
})

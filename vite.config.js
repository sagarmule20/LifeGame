import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  define: {
    'import.meta.env.VITE_BUILD_VERSION': JSON.stringify(Date.now().toString()),
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'Life Game',
        short_name: 'LifeGame',
        description: 'A gamified life tracker — earn €5 per task',
        theme_color: '#131F24',
        background_color: '#131F24',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Force new service worker to activate immediately
        skipWaiting: true,
        clientsClaim: true,
        // Don't precache index.html — always fetch fresh
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/],
        // Cache-first for assets (hashed filenames), network-first for navigation
        runtimeCaching: [
          {
            urlPattern: /\.(?:js|css|woff2)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-assets',
              expiration: { maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
        ],
      },
    }),
  ],
})

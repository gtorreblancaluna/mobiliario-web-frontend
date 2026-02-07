import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      devOptions: {
        enabled: true // Esto permite que el Service Worker funcione en localhost
      },
      registerType: 'autoUpdate', // Actualiza la app automáticamente cuando hay cambios
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'maskable-icon.png'],
      manifest: {
        name: 'Mobiliario Gaby',
        short_name: 'MobGaby',
        description: 'Sistema de gestión de mobiliario y eventos',
        theme_color: '#4ade80', // El verde de tu logo
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Importante para que Android no corte tu logo
          }
        ],
        screenshots: [
          {
            src: 'screenshot-mobile.png', // Debes poner esta imagen en /public
            sizes: '1080x1920',
            type: 'image/png',
            form_factor: 'narrow', // Indica que es para móvil
            label: 'Pantalla principal del sistema'
          },
          {
            src: 'screenshot-desktop.png', // Debes poner esta imagen en /public
            sizes: '1920x1080',
            type: 'image/png',
            form_factor: 'wide', // Indica que es para escritorio
            label: 'Panel de administración'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})

import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // Ruta del sitio en GitHub Pages. Puede sobrescribirse sin tocar el código:
  //   VITE_BASE=/NumLab/ npm run build
  base: process.env.VITE_BASE ?? '/Numlab-prod/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

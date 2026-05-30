import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  tailwindcss(),

  ],
  resolve: {
    alias: [
      {
        find: /^es-toolkit\/compat\/(.+)$/,
        replacement: fileURLToPath(new URL('./src/vendor/esToolkitCompat/$1.js', import.meta.url)),
      },
    ],
  },
})

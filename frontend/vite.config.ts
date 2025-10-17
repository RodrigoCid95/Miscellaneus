import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: path.join(__dirname, 'index.html'),
        server: path.join(__dirname, 'index-server.html'),
      },
    },
  },
  plugins: [react()],
})

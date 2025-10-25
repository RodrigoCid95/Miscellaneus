import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

const dists = {
  "dev:app": "../app/www",
  "build:app": "../app/www",
  "dev:server": "../server/www",
  "build:server": "../server/www",
}

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    build: {
      emptyOutDir: true,
      outDir: dists[process.env.npm_lifecycle_event] || 'dist',
      rollupOptions: {
        input: {
          index: path.join(__dirname, 'index.html'),
          server: path.join(__dirname, 'index-server.html'),
        },
      },
    },
    plugins: [react()],
  }
})

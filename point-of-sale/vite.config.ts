import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  base: 'point-of-sale',
  build: {
    rollupOptions: {
      input: {
        main: './src/main.tsx',
      },
      output: {
        entryFileNames: 'app.js'
      }
    },
    outDir: './../server/public/point-of-sale',
    emptyOutDir: true,
    minify: false,
    sourcemap: false
  },
  plugins: [react()],
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/admin',
  build: {
    rollupOptions: {
      input: {
        main: './src/main.tsx',
      },
      output: {
        entryFileNames: 'app.js'
      }
    },
    outDir: './../server/public/admin',
    emptyOutDir: true,
    minify: false,
    sourcemap: false
  },
  plugins: [react()],
})

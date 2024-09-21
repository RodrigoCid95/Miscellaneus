import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: './../server/public/admin',
    emptyOutDir: true,
    minify: false,
    sourcemap: false
  },
  plugins: [react()],
})

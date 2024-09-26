import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        login:'./src/Login.tsx',
        admin: './src/Admin.tsx',
        checkout: './src/Checkout.tsx'
      },
      output: {
        dir: './../server/public',
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/chunks/[name].[hash].js',
      },
    },
    outDir: './../server/public',
    emptyOutDir: true,
    minify: false,
    sourcemap: false
  },
  plugins: [react()],
})

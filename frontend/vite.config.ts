import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  build: {
    minify: false
  },
  plugins: [vue()],
  server: {
    proxy: {
      '/produtos': 'http://localhost:3000',
    },
  },
})

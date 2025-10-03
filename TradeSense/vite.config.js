import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const isVercel = process.env.VERCEL === '1'

export default defineConfig({
  plugins: [vue()],
  base: isVercel ? '/' : '/TradeSense/',
})
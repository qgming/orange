import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  server: {
    proxy: {
      '/bilibili': {
        target: 'https://api.bilibili.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bilibili/, '')
      },
      '/zhihu': {
        target: 'https://www.zhihu.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/zhihu/, '')
      },
      '/weibo': {
        target: 'https://weibo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/weibo/, '')
      },
      '/tencent': {
        target: 'https://v.qq.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tencent/, '')
      },
      '/douban': {
        target: 'https://api.douban.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/douban/, '')
      },
      '/api': {
        target: 'https://api.vvhan.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})

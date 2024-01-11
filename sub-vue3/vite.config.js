// 参考于： https://juejin.cn/post/7078467067887747080
// https://juejin.cn/post/7054009091961651237
// https://github.com/tengmaoqing/vite-plugin-qiankun

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'
import { resolve } from 'path'
import { name } from './package.json'
// const useDevMode = true

export default ({ mode }) => {
  const __DEV__ = mode === 'development'

  return defineConfig({
    alias: {
      '@': resolve('src')
    },

    plugins: [
      vue(),
      qiankun(name, {
        useDevMode: true
      })],
    server: {
      port: 3333,
      origin: '//localhost:3333'
    },
    // base: 'http://127.0.0.1:5001/',
    base: __DEV__ ? '/' : 'http://127.0.0.1:3333/'
  })
}

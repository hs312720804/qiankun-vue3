import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const name = 'huangshan_test_qiankun'
const baseUrl = '' 

// https://vitejs.dev/config/
module.exports = defineConfig({
  plugins: [vue()],
  publicPath: baseUrl,
  configureWebpack: {
    output: {
      library: `${name}-[name]`,
      // libraryTarget: 'umd',
      libraryTarget: 'window',
      jsonpFunction: `webpackJsonp_${name}`,
    }
  },
  devServer: {
    port: process.env.VUE_APP_PORT, // 在.env中VUE_APP_PORT=7788，与父应用的配置一致
    headers: {
      'Access-Control-Allow-Origin': '*' // 主应用获取子应用时跨域响应头
    }
  },
  build: {
    target: 'esnext',
    lib: {
      name,
      entry: 'src/mian.js',
      formats: ['umd']
    }
  }
})


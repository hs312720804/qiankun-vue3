import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun';
// import { resolve  } from 'path';
import { name } from './package.json'
// const useDevMode = true

export default ({ mode }) => {
  const __DEV__ = mode === 'development'

  console.log(__DEV__)
  return defineConfig({
    // alias: {
    //   '@': resolve('src'),
    // },
    server: {
      port: 5501,
      origin: '//localhost:5501'
    },
    base: '/',
    // base: __DEV__ ? '/' : '//localhost:5501',
    plugins: [ vue(),
      qiankun(name, {
        useDevMode: false
    })],
  })
}

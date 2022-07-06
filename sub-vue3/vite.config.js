// 参考于： https://juejin.cn/post/7078467067887747080
// https://github.com/tengmaoqing/vite-plugin-qiankun

// -------------------------------------------------------------
// qiankun与Vite
// 会遇到以下两个需要解决的问题：

//   开发模式：在开发环境下，如果我们使用 vite 来构建 vue3 子应用，
//  基于 vite的构建机制，会在子应的 html 的入口文件的 script 标签上携带 type=module。
//  而我们知道qiankun父应用引入子应用，本质上是将html做为入口文件，并通过 import-html-entry 这个库去加载子应用所需要的资源列表Js、css，
//  然后通过 eval 直接执行。
// 而基于 vite 构建的 js 中 import、export 并没有被转码，会导致直接报错（不允许在非 type=module 的 script 里面使用 import）

//  生产模式：生产模式下，因为没有诸如webpack中支持运行时publicPath,也就是__webpack_public_path__，
// 换句话说就是 vite 不支持运行时 publicPath，其主要作用是用来解决微应用动态载入的脚本、样式、图片等地址不正确的问题。

// 原文链接：https://blog.csdn.net/u013655559/article/details/122551984


// vite-plugin-qiankun 优点：
// 保留 vite 构建 es 模块的优势
// 一键配置，不影响已有的 vite 配置
// 支持 vite 开发环境

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun';
import { resolve  } from 'path';
import { name } from './package.json'
// const useDevMode = true
// const BACKEND = import.meta.BACKEND || '172.20.151.12:9080' // 开发环境
// const BACKEND = process.env.BACKEND || '172.20.151.211:80' // 对内测试环境
const BACKEND = process.env.BACKEND || '172.20.151.197:9080' // 对接环境

const PORT = import.meta.PORT || '5001'
const HOST = import.meta.HOST || '127.0.0.1'

export default ({ mode }) => {
  const __DEV__ = mode === 'development'


  return defineConfig({
    define: {
      // 'process.env': {
      //   'VITE_APP_PROJECT_ID': '11',
      //   'VITE_APP_PROJECT_CODE': 'filem_admin',
      //   'VITE_APP_PROJECT_NAME': '静态资源管理',
      //   'VITE_APP_API_PREFIX': 'violet-api',
      // }
    },
    plugins: [
      vue(),
      qiankun(name, {
        useDevMode: false // useDevMode = true 则不使用热更新插件，useDevMode = false 则能使用热更新
    })],
    resolve: {
      alias: [
        { find: '@', replacement: resolve(__dirname, 'src') }
      ]
    },
    server: {
      host: HOST,
      port: Number(PORT),
      // origin: '//127.0.0.1:5001',
      proxy: {
        '/violet-api': {
          target: 'http://'+ BACKEND,
          rewrite: path => path.replace(/^\/violet-api/, '/')
        }
      }
    },
    base: __DEV__ ? '/' : 'http://127.0.0.1:5001/',
  })
}
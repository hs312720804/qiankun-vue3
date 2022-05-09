// 参考于： https://juejin.cn/post/7078467067887747080
// https://github.com/tengmaoqing/vite-plugin-qiankun

// import { UserConfig } from 'vite'
// import reactRefresh from '@vitejs/plugin-vue'

// import vue from '@vitejs/plugin-vue'
// import qiankun from 'vite-plugin-qiankun'
// import path from 'path'

// // useDevMode 开启时与热更新插件冲突
// const useDevMode = true

// // https://vitejs.dev/config/
// const baseConfig = {
//   plugins: [
//     // ...(
//     //   useDevMode ? [] : [
//     //     vue()
//     //   ]
//     // ),
//     vue(),
//     qiankun('sub-vue3', {
//       useDevMode
//     })
//   ],
//   server: {
//     fsServe: {
//       root: path.join(process.cwd(), '../../')
//     },
//     port: 5001,
//     cors: true,
//   },
// }


// export default ({ mode }) => {
//   baseConfig.base = 'http://127.0.0.1:5001/';
//   if (mode === 'development') {
//     baseConfig.base = '/';
//   }
//   return baseConfig;
// };

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
    
    plugins: [ 
      vue(),
      qiankun(name, {
        useDevMode: true
    })],
    server: {
      port: 5001,
      origin: '//localhost:5001'
    },
    // base: 'http://127.0.0.1:5001/',
    base: __DEV__ ? '/' : 'http://127.0.0.1:5001/',
  })
}
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
import { resolve  } from 'path';
import { name } from './package.json'
// const useDevMode = true

const BACKEND = process.env.BACKEND || '172.20.151.12:9080'
// const BACKEND = process.env.BACKEND || '172.20.151.197:9080'
const PORT = process.env.PORT || '5001'
const HOST = process.env.HOST || '127.0.0.1'

export default ({ mode }) => {
  const __DEV__ = mode === 'development'

  return defineConfig({
    define: {
      'process.env': {
        'VUE_APP_PROJECT_ID': '11',
        'VUE_APP_PROJECT_CODE': 'filem_admin',
        'VUE_APP_PROJECT_NAME': '静态资源管理',
        'VUE_APP_API_PREFIX': 'violet-api',
      }
    },
    plugins: [ 
      vue(),
      qiankun(name, {
        useDevMode: true
    })],
    
    // alias: {
    //   '@': resolve('src'),
    // },
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
    // base: 'http://127.0.0.1:5001/',
    base: __DEV__ ? '/' : 'http://127.0.0.1:5001/',
  })
}
import { createApp } from 'vue'
import App from './App.vue'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import router from '@/router/index.ts'
// import { store } from '@/store'
import { createPinia } from 'pinia'

import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'

// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/assets/global.styl'

import adminToolkitPlus from '@ccprivate/admin-toolkit-plus'
import '../node_modules/@ccprivate/admin-toolkit-plus/dist/style.css'

let app = null

// 导出相应的生命周期
renderWithQiankun({
  mount (props) {
    // storeTest(props);/
    render(props)
    // app.config.globalProperties.$setGlobalState = props.setGlobalState;
  },
  bootstrap () {
    console.log('%c ', 'color: green;', 'sub-vite2-vue3 app bootstraped')
  },
  unmount (props) {
    app.unmount()
    app._container.innerHTML = ''
    app = null
    // router = null;
  }
})

function render (props = {}) {
  const { container, mainState } = props

  app = createApp(App) // 初始化vue实例

  // 全局属性
  app.config.globalProperties.$mainState = mainState
  // 统一注册 element-plus Icon图标
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  // 为安装此插件后创建的每个store添加一个名为 `secret` 的属性
  // 这可能在不同的文件中
  function SecretPiniaPlugin () {
    return { secret: 'the cake is a lie' }
  }
  // 创建实例，安装插件，挂载
  app.use(createPinia().use((SecretPiniaPlugin))).use(router).use(ElementPlus, { zIndex: 3000 }).use(adminToolkitPlus)
  // app.use(router);
  app.mount(container ? container.querySelector('#app') : '#app')
}

// 因为 es 模块加载与 qiankun 的实现方式有些冲突，
// 所以使用本插件实现的 qiankun 微应用里面没有运行在 js 沙盒中。
// 所以在不可避免需要设置 window 上的属性时，尽量显示的操作 js 沙盒，否则可能会对其它子应用产生副作用。

// qiankun 官方是以 window.__POWERED_BY_QIANKUN__ 来判断当前是否为 qiankun 环境下，
// 而该插件引用之后是通过 qiankunWindow.__POWERED_BY_QIANKUN__来判断

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({})
}

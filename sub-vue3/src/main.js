import { createApp } from "vue";
import App from './App.vue'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import router from '@/router'
import { store } from '@/store'

import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'

// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/assets/global.styl'

import adminToolkitPlus from '@ccprivate/admin-toolkit-plus'
import '../node_modules/@ccprivate/admin-toolkit-plus/dist/style.css'

// import constants from '@/utils/consts.js'

// let router = null;
let app = null;

// 导出相应的生命周期
renderWithQiankun({
  mount(props) {
    // storeTest(props);/
    render(props);
    // app.config.globalProperties.$setGlobalState = props.setGlobalState;
  },
  bootstrap() {
    console.log("%c ", "color: green;", "sub-vite2-vue3 app bootstraped");
  },
  unmount(props) {
    app.unmount();
    app._container.innerHTML = "";
    app = null;
    // router = null;
  },
});

function render(props = {}) {
  const { container, mainState } = props;
// router = createRouter({
  //   history: createWebHistory(!qiankunWindow.__POWERED_BY_QIANKUN__ ? "/sub-vite2-vue3" : "/"),
  //   routes
  // });
  
  app = createApp(App); // 初始化vue实例

  // 全局属性
  app.config.globalProperties.$mainState = mainState
  // 统一注册 element-plus Icon图标
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  // 创建实例，安装插件，挂载
  app.use(store).use(router).use(ElementPlus, { zIndex: 3000 }).use(adminToolkitPlus)
  // app.use(router);
  app.mount(container ? container.querySelector("#app") : "#app");
}



// qiankun 官方是以 window.__POWERED_BY_QIANKUN__ 来判断当前是否为 qiankun 环境下，
// 而该插件引用之后是通过 qiankunWindow.__POWERED_BY_QIANKUN__来判断
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({});
}

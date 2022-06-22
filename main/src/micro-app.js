import store from './store'
import fetch from './services/fetch.js'


const mainState = {}
Object.defineProperties(mainState, {
  fetch: {
    get () {
      return fetch
    }
  }
})

const microApps = [
  {
    name: 'sub-vue',
    entry: '//localhost:8081/',
    activeRule: '/sub-vue',
    // container: '#subapp-viewport', // 子应用挂载的div
    props: {
      routerBase: '/sub-vue' // 下发路由给子应用，子应用根据该值去定义qiankun环境下的路由
    }
  },
  {
    name: 'sub-vue3',
    entry: '//localhost:5001',
    activeRule: '/sub-vue3',
    // container: '#subapp-viewport', // 子应用挂载的div
    props: {
      routerBase: '/sub-vue3', // 下发路由给子应用，子应用根据该值去定义qiankun环境下的路由
    }
  }
]

const apps = microApps.map(item => {
  return {
    ...item,
    container: '#subapp-viewport', // 子应用挂载的div
    props: {
      routerBase: item.activeRule, // 下发基础路由
      getGlobalState: store.getGlobalState, // 下发getGlobalState方法
      mainState
    },
  }
})

export default apps
  
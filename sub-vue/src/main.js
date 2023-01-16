import Vue from 'vue'
import App from './App.vue'
// import globalRegister from './store/global-register'
import { store as commonStore } from 'common'
import store from './store/index'

Vue.config.productionTip = false
let instance = null

function render () {
  // const { container } = props
  instance = new Vue({
    render: h => h(App),
    store,
  }).$mount('#app')
}
if (!window.__POWERED_BY_QIANKUN__) {

  // 这里是子应用独立运行的环境，实现子应用的登录逻辑
  render()
}
/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap () {
  console.log('[vue] vue app bootstraped')
}


/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */

export async function mount (props) {
  commonStore.globalRegister(store, props)
  render(props)
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
 export async function unmount () {
  instance.$destroy()
  instance.$el.innerHTML = ''
  instance = null
}

/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
export async function update(props) {
  console.log('update props', props);
}
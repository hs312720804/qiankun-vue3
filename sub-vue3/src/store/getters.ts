// import Vue from 'vue'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import { getCurrentInstance } from 'vue'

const getters = {
  httpHeaders: (state: any) => {
    const instance = getCurrentInstance()
    const mainState = instance?.appContext.config.globalProperties.$mainState
    const isPro = qiankunWindow.__POWERED_BY_QIANKUN__
    
    return isPro ? mainState.store.getters.httpHeaders : state.dev.httpHeaders
  }
}
export default getters

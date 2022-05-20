// import Vue from 'vue'
const getters = {
  httpHeaders: state => {
    const isPro = window.__POWERED_BY_QIANKUN__
    return isPro ? Vue.prototype.$mainState.store.getters.httpHeaders : state.dev.httpHeaders
  }
}
export default getters

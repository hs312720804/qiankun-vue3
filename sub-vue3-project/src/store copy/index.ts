// import Vue from 'vue'
import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
// import permission, { PermissionModuleState } from './modules/permission'
import dev from './modules/dev.js'
import getters from './getters'

// https://github.com/softvar/secure-ls
// const ls = new SecureLS({ encodingType: 'aes', encryptionSecret: 'dmlvbGV0LXNlY3JldC1rZXk=' }) // 使用 aes 对 持久化的 store 进行加密

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootState {
  app: AppModuleState
}

export const key: InjectionKey<Store<RootState>> = Symbol()

export const storeOptions = {
  modules: {
    dev
  },
  getters,
}
// vue2：
// Vue.use(Vuex)   
// new Vuex.Store

// vue3：
export const store = createStore(storeOptions)

export function useStore () {
  return baseUseStore(key) as typeof store
}


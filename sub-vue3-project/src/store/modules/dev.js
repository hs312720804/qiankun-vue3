// 存放开发环境下的变量
import Storage from '@/utils/storage'
export default {
  namespaced: true,
  state: {
    isRelogin: false,
    loginError: '',
    access: {},
    httpHeaders: {
      AccessToken: (Storage.$get('user') || {}).access_token || '',
      Authorization: 'Basic Y2xpZW50OmFkbWlu',
      ProductId: import.meta.env.VITE_APP_PROJECT_ID
    }
  },
  mutations: {
    reLogin (state, loginError) {
      state.isRelogin = true
      state.loginError = loginError
    },
    setAccess: (state, payload) => {
      const buttons = payload.buttons || []
      const access = {}
      buttons.forEach(element => {
        access[element] = true
      })
      state.access = access
    }
  }
}

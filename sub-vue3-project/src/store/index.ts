
import { defineStore } from 'pinia'// 存放开发环境下的变量
import Storage from '@/utils/storage'



export const useStore = defineStore({
  id: 'myStore',
  state: () => ({
    httpHeaders: {
      AccessToken: (Storage.$get('user') || {}).access_token || '',
      Authorization: 'Basic Y2xpZW50OmFkbWlu',
      ProductId: import.meta.env.VITE_APP_PROJECT_ID
    }
  }),
  actions: {
    editAuthorization() {
      
    },
    
  }
})





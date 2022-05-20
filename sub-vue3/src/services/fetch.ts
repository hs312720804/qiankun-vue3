import qs from 'qs'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElLoading, ElNotification } from 'element-plus'
import { store } from '@/store'
import Storage from '@/utils/storage'
// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'
interface Res<T> { code: number | string; success: boolean; data: T; msg: string; }

type IfetchArg = {
  isJSON?: boolean
  /** 是否清空token */
  emptyToken?: boolean
  /** 操作成功时的信息，为空时不会显示任何弹窗提示 */
  successMessage?: string
  /** 操作失败时的信息，会覆盖接口返回的错误信息 */
  errorMessage?: string
} & AxiosRequestConfig

let loadingInstance: ELLoadingInstance | undefined
const instance = axios.create({
  timeout: 50000
})
/**
 * fetchApi 只在开发者模式下生效，上线后只会从qiankun的主应用中获取fetch方法，由主应用统一控制所有的接口请求
 * 正常开发中请不要修改此方法，如果开发过程中要修改到此方法请联系saas平台前端负责人
 * @param {*} param
 * @returns
 */
console.log('process===', process)
function fetchApi<ResponseData> ({
  method = 'get',
  url,
  data = undefined,
  params = undefined,
  headers = {},
  isJSON = true,
  emptyToken = false,
  successMessage = '',
  errorMessage = ''
}: IfetchArg) {
  // NProgress.start()
  if (!loadingInstance) {
    loadingInstance = ElLoading.service({ target: document.querySelector('.el-main') as HTMLElement })
  }

  // 处理数据防篡改
  // 待写...
  
  const option: AxiosRequestConfig = {
    method,
    // url: `violet-api/${url}`,
    url: `/${process.env.VUE_APP_API_PREFIX}${url}`,
    data: (isJSON || data instanceof FormData)
      ? data
      : typeof data === 'string'
        ? data
        : qs.stringify(data),
    params
  }

  let token = ''
  if (emptyToken) {
    token = ''
  } else {
    const user = Storage.$get('user')
    if (user) {
      token = user.access_token
    }
  }
  // const app = this.app
  option.headers = {
    ...store.state.dev.httpHeaders,
    AccessToken: token || '',
    ...headers
  }
  return instance(option)
    .then(function ({ data }: AxiosResponse<Res<ResponseData>>) {

      // NProgress.done()
      if (loadingInstance) {
        loadingInstance.close()
      }
      loadingInstance = undefined

      if (data.success || data.code === 1000 || data.code === '1000' || data.code === 200) {
        // return data.data || data
        return data
      } else {
        // eslint-disable-next-line no-throw-literal
        throw {
          code: data.code,
          message: data.msg
        }
      }
      
      
    })
    .then(result => {
      if (successMessage) {
        ElNotification({
          title: '操作成功',
          type: 'success',
          message: successMessage
        })
      }
      return result
    })
    .catch(e => {
      // NProgress.done()
      if (loadingInstance) {
        loadingInstance.close()
      }
      loadingInstance = undefined
      if ('response' in e && e.response.data.code === '403') {
        option.headers = {
          Authorization: ''
        }
      }
      ElNotification({
        title: '操作失败',
        type: 'error',
        message: errorMessage || e.message
      })
    })
}

export default function fetch () {
  let _fetch = fetchApi
  // 根据不同的环境(只有被qiankun主应用引用时才会有$mainState)切换 fetch 方法
  // if (window.__POWERED_BY_QIANKUN__) {
  //   _fetch = Vue.prototype.$mainState.fetch
  // }
  return _fetch(...arguments).catch(error => {
    ElNotification({
      title: `操作失败（Code = ${error.code}）`,
      type: 'error',
      message: error.message
    })
    return Promise.reject(error)
  })
}
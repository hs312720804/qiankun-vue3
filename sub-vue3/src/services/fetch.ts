import qs from 'qs'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
// import NProgress from 'nprogress'
import { ElLoading, ElNotification } from 'element-plus'
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

export default function fetch<ResponseData> ({
  method = 'get',
  url,
  data = undefined,
  params = undefined,
  isJSON = true,
  emptyToken = false,
  successMessage = '',
  errorMessage = ''
}: IfetchArg) {
  // NProgress.start()
  // debugger
  if (!loadingInstance) {
    // debugger
    loadingInstance = ElLoading.service({ target: document.querySelector('.el-main') as HTMLElement })
  }

  // 处理数据防篡改
  // 待写...
  
  const option: AxiosRequestConfig = {
    method,
    url: `violet-api/${url}`,
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
    // if (store.getters.token) {
    //   token = store.getters.token
    // }
  }
  // const app = this.app
  option.headers = {
    Authorization: token || ''
  }
  return axios(option)
    .then(function ({ data }: AxiosResponse<Res<ResponseData>>) {
      // const data = xxx.data
      // NProgress.done()
      if (loadingInstance) {
        loadingInstance.close()
      }
      loadingInstance = undefined
      if (data.success || data.code === '1000' || data.code === 200) {
        if (data.data) {
          return data.data
        } else {
          return data
        }
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

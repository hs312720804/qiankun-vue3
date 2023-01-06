/**
 * 当前文件存放的是开发模式下需要用的方法，请不要在当前文件中存放其他无关的方法
 * 若涉及到开发模式方法修改的请联系saas平台前端负责人
 * Copyright (c) 2021 coocaa
 */
 import fetch from './fetch'
 import { ElMessage } from 'element-plus'

 export function loginService (data: any) {
   return fetch({
     method: 'post',
     url: 'auth/oauth/token',
     data,
     isJSON: false
   }).then(({ data }: any) => {
     return data
   })
 }
 // sunflower
 export function getMenusService (params : any) {
   return fetch({
     method: 'get',
     url: 'auth/menu/tenantMenus',
     headers: {
       ver: 1 // 为了兼容旧系统，新系统需要添加ver属性，值 = any
     },
     params
   }).then(({ data }: any) => {
     return data
   })
 }
//  export function getMenusDetail (params: any) {
//    return fetch({
//      method: 'get',
//      url: 'auth/menu/detail',
//      params
//    })
//  }
 
class BaseListFetchParamsError extends Error {
  code: number
  constructor (msg: string) {
    super(msg)
    this.code = -1
    this.name = 'BaseListFetchParamsError'
  }
}
 
export function genApiService (apiJson: any = {}, fetchConfig = {}) {
  const serviceMap:serviceMapType = {}
  Object.keys(apiJson).forEach(key => {
    const [url, method] = apiJson[key]
    serviceMap[key] = ({ data, params, ...config } = {}) => fetch({ ...fetchConfig, ...config, url, method, data, params }).then(({ data }:any) => data)
  })

  return (apiKey:string) => {
    const service = serviceMap[apiKey]
    if (!service) {
      const errMsg = `缺少 ${apiKey} 服务，请在管理后台配置对应的服务`
      ElMessage.error(errMsg)
      return () => Promise.reject(new BaseListFetchParamsError(errMsg))
    }
    return service
  }
 }
 
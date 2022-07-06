class BaseListFetchParamsError extends Error {
  code: number
  constructor (msg: string) {
    super(msg)
    this.code = -1
    this.name = 'BaseListFetchParamsError'
  }
}

interface BaseListFetchType {
  apiJson: apiType
  apiKey: string
  params: string
  fetchMethod: any
  data?: any
  isJSON?: boolean
}

export function baseListFetch ({ apiJson = {}, apiKey, data, params, isJSON, fetchMethod }: BaseListFetchType) {
  const apis = apiJson[apiKey]
  if (!apis) {
    return Promise.reject(new BaseListFetchParamsError(`缺少 ${apiKey} 服务，请在管理后台配置对应的服务`))
  }
  const [url, method] = apis
  return fetchMethod({
    url, method, data, params, isJSON
  })
}

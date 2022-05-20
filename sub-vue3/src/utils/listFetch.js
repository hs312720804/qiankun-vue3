class BaseListFetchParamsError extends Error {
  constructor (msg) {
    super(msg)
    this.code = -1
    this.name = 'BaseListFetchParamsError'
  }
}
export function baseListFetch ({ apiJson = {}, apiKey, data, params, isJSON, fetchMethod }) {
  const apis = apiJson[apiKey]
  if (!apis) {
    return Promise.reject(new BaseListFetchParamsError(`缺少 ${apiKey} 服务，请在管理后台配置对应的服务`))
  }
  const [url, method] = apis
  return fetchMethod({
    url, method, data, params, isJSON
  })
}

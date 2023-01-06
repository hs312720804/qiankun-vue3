// 状态保持方法，在当前子应用下应尽量少使用localStorage来存储变量
// 所有需要全局存储的状态（如：用户的token）应该从主应用中获取，目前该方法只是用在开发模式下存储用户Token
class Storage {
  constructor (name, localStorage) {
    this.prefix = name + '/'
    this.storage = localStorage
    this._cache = {}
  }

  _parseKey (name) {
    return this.prefix + name
  }

  $set (key, value) {
    key = this._parseKey(key)
    value = JSON.stringify(value)
    this._cache[key] = JSON.parse(value)
    this.storage.setItem(key, value)
  }

  $get (key) {
    key = this._parseKey(key)
    // eslint-disable-next-line no-prototype-builtins
    if (!this._cache.hasOwnProperty(key)) {
      this._cache[key] = JSON.parse(this.storage.getItem(key))
    }
    return this._cache[key]
  }

  $remove (key) {
    key = this._parseKey(key)
    delete this._cache[key]
    return this.storage.removeItem(key)
  }

  $keys () {
    return Object.keys(this.storage)
      .filter((item) => {
        return item.indexOf(this.prefix) > -1
      })
      .map((item) => {
        return item.replace(this.prefix, '')
      })
  }
}
export default new Storage(`${import.meta.env.VITE_APP_PROJECT_CODE}/dev`, window.localStorage)

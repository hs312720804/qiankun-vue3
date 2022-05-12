const files = require.context('.', true, /\.vue/)
const modules = {}
files.keys().forEach((key) => {
  modules[key.replace(/(^\.\/|\.vue$)/g, '')] = files(key).default
})
export default modules

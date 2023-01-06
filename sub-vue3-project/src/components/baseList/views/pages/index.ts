// const files = require.context('.', true, /\.vue/)
// const modules = {}
// files.keys().forEach((key) => {
//   modules[key.replace(/(^\.\/|\.vue$)/g, '')] = files(key).default
// })
// export default modules
const modules: { [key: string]: any; } = {}
const files = import.meta.glob('./*.vue')

for (const path in files) {
  files[path]().then(mod => {
    const matched = path.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      modules[matched[1]] = mod.default
    }
  })
}
export default modules

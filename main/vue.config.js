// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
  devServer: {
    public: '127.0.0.1:8066',
    port: '8066',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  transpileDependencies: ['common']

}

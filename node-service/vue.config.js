// 详细配置请参考https://cli.vuejs.org/zh/config/#vue-config-js
const outputDir = process.env.VUE_APP_CONTEXT_PATH.substring(1, process.env.VUE_APP_CONTEXT_PATH.length - 1)
module.exports = {
  publicPath: process.env.VUE_APP_CONTEXT_PATH,
  outputDir: outputDir === '/' ? 'dist' : outputDir,
  assetsDir: 'static',
  lintOnSave: 'error',
  devServer: {
    host: '0.0.0.0',
    port: 10086,
    proxy: {
      [process.env.VUE_APP_API_PREFIX]: {
        target: 'http://localhost:10010',
        changeOrigin: true,
        pathRewrite: {
          [`^${[process.env.VUE_APP_API_PREFIX]}`]: ''
        }
      }
    }
  }
}

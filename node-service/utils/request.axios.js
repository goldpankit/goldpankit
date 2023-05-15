const axios = require('axios')

// 默认配置
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8'
const axiosInstance = axios.create({
  baseURL: 'http://192.168.124.3:10088',
  // 请求超时时间
  timeout: 300000
})

// 新建请求拦截器
axiosInstance.interceptors.request.use(config => {
  return config
}, function (error) {
  return Promise.reject(error)
})

// 新建响应拦截器
axiosInstance.interceptors.response.use((response) => {
  return response.data
}, function (error) {
  if (error.code == null) {
    return Promise.reject(new Error('服务器繁忙，请稍后再试'))
  }
  if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
    return Promise.reject(new Error('服务器响应超时，请稍后再试'))
  }
  return Promise.reject(error)
})

module.exports = axiosInstance

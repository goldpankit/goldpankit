import axios from 'axios'
import {trim} from "./util";
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_LOCAL_API_PREFIX,
  timeout: 600000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

// 添加请求拦截器
axiosInstance.interceptors.request.use(function (config) {
  // 补充国际化语言
  config.headers['x-lang'] = window.localStorage.getItem('lang')
  // 参数去空格
  if (config.trim === true) {
    if (config.data != null) {
      config.data = trim(config.data)
    }
    if (config.params != null) {
      config.params = trim(config.params)
    }
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axiosInstance.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  if (response.data.success) {
    return response.data.data
  }
  return Promise.reject(response.data)
}, function (error) {
  if (error.response.status === 500) {
    return Promise.reject(new Error('服务繁忙或者出现了错误，请先检查KIT启动状态，如KIT状态正常请在KIT群中联系管理员！'))
  }
  // 对响应错误做点什么
  return Promise.reject(error)
})

export default axiosInstance

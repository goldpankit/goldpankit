import request from "../utils/request";

// 获取项目有效期
export function fetchEndTime (spaceName) {
  return request.get(`/usr/order/code/${spaceName}/endTime`, {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}

// 创建购买源码订单
export function createCodeOrder (data) {
  return request.post('/usr/order/code/create', data, {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}

// 创建购买技术支持订单
export function createEpibolyOrder (data) {
  return request.post('/usr/order/epiboly/create', data, {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}

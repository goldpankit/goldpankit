import request from "../utils/request";

// 向AI提问
export function askAi (data) {
  return request.post('/usr/ai/ask', data,{
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}
// 查询日期会话
export function fetchDateSessions (data) {
  return request.post('/usr/ai/date/sessions', data,{
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}
// 查询会话消息
export function fetchSessionMessages (data) {
  return request.post('/usr/ai/session/messages', data,{
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}


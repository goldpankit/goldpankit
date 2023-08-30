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
// 查询自定义会话
export function fetchDefinedSessions (data) {
  return request.post('/usr/ai/sessions', data,{
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}
// 查询会话消息
export function fetchSessionMessages (data) {
  return request.post('/usr/ai/session/messages', data,{
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}
// 创建会话
export function createSession () {
  return request.get('/usr/ai/session/create', {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}
// 删除会话
export function deleteSession (id) {
  return request.get(`/usr/ai/session/delete/${id}`, {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}
// 删除日期会话消息
export function clearDateSessionMessages (data) {
  return request.post('/usr/ai/date/session/clear', data, {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}


import request from "../utils/request";

// 向AI提问
export function askAi (data) {
  return request.post('/usr/ai/ask', data,{
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}


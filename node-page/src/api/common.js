import request from "../utils/request";

// 上传图片
export function uploadImage (data) {
  return request.post('/upload/image', data, {
    baseURL: import.meta.env.VITE_REMOTE_API_PREFIX
  })
}

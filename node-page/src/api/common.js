import request from "../utils/request";

// 上传图片
export function uploadImage (data) {
  return request.post('/upload/image', data)
}
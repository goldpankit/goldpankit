import request from "../utils/request";

// 获取运行时根目录
export function fetchRuntimeRoot () {
  return request.get('/local/file/runtime/root')
}

// 获取指定目录下的文件
export function fetchFiles (target) {
  return request.get(`/local/file/list?target=${target}`)
}

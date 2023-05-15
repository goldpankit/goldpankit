import request from "../utils/request";

export function create (data) {
  return request.post('/service/space/create', data)
}

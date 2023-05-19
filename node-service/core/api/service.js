const request = require('../../utils/request.axios')

module.exports = {
    // 初始化
    initialize (id) {
        return request.get(`/service/initialize/${id}`)
    },
    // 安装代码
    install (data) {
        return request.post('/service/compile', data)
    },
    // 推送服务
    push (data) {
        return request.post('/service/push', data)
    },
}

const request = require('../../utils/request.axios')

module.exports = {
    // 查询服务简要信息
    fetchProfile (data) {
        return request.post('/service/profile', data)
    },
    // 安装代码
    install (data) {
        return request.post('/service/install', data)
    },
    // 编译代码
    compile (data) {
        return request.post('/service/compile', data)
    },
    // 编译builds
    compileBuilds (data) {
        return request.post('/service/compile/builds', data)
    },
    // 发布版本
    publish (data) {
        return request.post('/usr/service/version/publish', data)
    }
}

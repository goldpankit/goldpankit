const request = require('../../utils/request.axios')

module.exports = {
    // 查询插件简要信息
    fetchProfile (data) {
        return request.post('/plugin/profile', data)
    },
    // 发布版本
    publish (data) {
        return request.post('/usr/plugin/version/publish', data)
    }
}

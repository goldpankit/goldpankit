const request = require('../../utils/request.axios')

module.exports = {
    // 删除服务
    delete (data) {
        return request.post('/usr/plugin/delete', data)
    }
}

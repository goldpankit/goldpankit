const request = require('../../utils/request.axios')

module.exports = {
    // 删除服务
    deleteService (data) {
        return request.post('/usr/service/delete', data)
    }
}

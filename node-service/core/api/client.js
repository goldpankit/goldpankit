const request = require('../../utils/request.axios')

module.exports = {
    // 查询服务简要信息
    getLatestVersion () {
        return request.get('/client/node/latest')
    }
}

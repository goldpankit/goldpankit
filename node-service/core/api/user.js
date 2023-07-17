const request = require('../../utils/request.axios')

module.exports = {
    // 退出登录
    logout () {
        return request.get('/usr/logout')
    }
}

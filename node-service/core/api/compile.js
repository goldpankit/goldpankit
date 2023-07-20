const request = require('../../utils/request.axios')

module.exports = {
    // 实时编译
    compile (data) {
        return request.post('/compile/realtime', data)
    }
}

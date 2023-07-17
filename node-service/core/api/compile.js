const request = require('../../utils/request.axios')

module.exports = {
    install (data) {
        return request.post('/compile', data)
    },
    // 实时编译
    compile (data) {
        return request.post('/compile/realtime', data)
    },
    fetchInstallOptions (templateCode) {
        return request.get(`/compile/${templateCode}/options`)
    }
}

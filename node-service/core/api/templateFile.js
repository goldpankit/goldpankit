const request = require('../../utils/request.axios')

module.exports = {
    create (data) {
        return request.post('/template/file/push', data)
    }
}

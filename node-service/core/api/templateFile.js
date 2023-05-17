const request = require('../utils/request')

module.exports = {
    create (data) {
        return request.post('/template/file/push', data)
    }
}

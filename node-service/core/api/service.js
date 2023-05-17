const request = require('../../utils/request.axios')

module.exports = {
    initialize (id) {
        return request.get(`/service/initialize/${id}`)
    }
}

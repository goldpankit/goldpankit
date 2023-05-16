const request = require('../utils/request.define')
request.post('/service/create').proxy()

module.exports = request.router

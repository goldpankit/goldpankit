const request = require('../utils/request.define')
request.post('/service/space/create').proxy()
request.get('/service/space/:spaceId').proxy()

module.exports = request.router

const request = require('../utils/request.define')
request.post('/service/space/create').proxy()
request.get('/service/space/:spaceId').proxy()
request.get('/service/space/search').proxy()

module.exports = request.router
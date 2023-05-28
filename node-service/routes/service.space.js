const request = require('../utils/request.define')
request.post('/service/space/create').proxy()
request.get('/service/space/:spaceName').proxy()
request.post('/service/space/search').proxy()

module.exports = request.router

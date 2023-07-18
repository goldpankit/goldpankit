const request = require('../utils/request.define')
request.post('/usr/space/create').proxy()
request.get('/space/:spaceName').proxy()
request.post('/space/search').proxy()

module.exports = request.router

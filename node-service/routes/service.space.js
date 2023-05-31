const request = require('../utils/request.define')
request.post('/space/create').proxy()
request.get('/space/:spaceName').proxy()
request.post('/space/search').proxy()

module.exports = request.router

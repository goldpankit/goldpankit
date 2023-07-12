const request = require('../utils/request.define')

request.post('/usr/login/password').proxy()

module.exports = request.router

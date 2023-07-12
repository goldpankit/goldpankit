const request = require('../utils/request.define')

request.post('/usr/regis/mobile').proxy()
request.post('/usr/regis/mobile/sms').proxy()

module.exports = request.router

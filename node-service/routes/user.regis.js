const request = require('../utils/request.define')

request.post('/usr/regis/mobile').proxy()
request.post('/usr/regis/mobile/otp-code').proxy()
request.post('/usr/regis/email').proxy()
request.post('/usr/regis/email/otp-code').proxy()

module.exports = request.router

const request = require('../utils/request')
const { init, build } = require('adcd')

// test api
request
  .get('/test')
  .send(() => {
    build.exec()
  })

module.exports = request.router

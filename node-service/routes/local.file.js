const request = require('../utils/request.define')
const { file } = require('kit-cli-core')

// Get runtime root folder.
request
  .get('/local/file/runtime/root')
  .data(() => {
    return file.getRuntimeRoot()
  })

// Get target folder files.
request
  .get('/local/file/list')
  .data((req) => {
    return file.getFiles(req.query.target).map(item => {
      return {
        path: item,
        isDirectory: file.isDirectory(`${req.query.target}/${item}`)
      }
    })
  })

// Create new Directory.
request
  .get('/local/directory/create')
  .data((req) => {
    file.createDirectory(req.query.path)
  })

module.exports = request.router

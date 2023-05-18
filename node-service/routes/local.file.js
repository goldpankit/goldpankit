const request = require('../utils/request.define')
const fs = require('../core/utils/fs')

// 获取运行时根目录
request
  .get('/local/file/runtime/root')
  .data(() => {
    return fs.getRuntimeRoot()
  })

// 获取本地文件列表
request
  .get('/local/file/list')
  .data((req) => {
    return fs.getFiles(req.query.target).map(item => {
      return {
        path: item,
        type: s.isDirectory(`${req.query.target}/${item}`) ? 'directory' : 'file'
      }
    })
  })

// 创建本地目录
request
  .get('/local/directory/create')
  .data((req) => {
    fs.createDirectory(req.query.path)
  })

module.exports = request.router

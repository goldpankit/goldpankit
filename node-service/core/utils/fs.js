const fs = require('fs')
const path = require('path')
const root = process.cwd()
const Const = require('../constants/constants')
module.exports = {
  getRuntimeRoot() {
    return root
  },
  getFiles (dir) {
    return fs.readdirSync(dir)
  },
  isDirectory(filepath) {
    return fs.statSync(filepath).isDirectory()
  },
  isFile(filepath) {
    return fs.statSync(filepath).isFile()
  },
  readFile(filepath) {
    return fs.readFileSync(filepath).toString()
  },
  readJSONFile(filepath) {
    return JSON.parse(fs.readFileSync(filepath).toString())
  },
  createDirectory(filepath, force = false) {
    if (force) {
      this.deleteDirectory(filepath, force)
    }
    if (!this.exists(filepath)) {
      fs.mkdirSync(filepath, {recursive: true})
    }
  },
  getDirectory(filepath) {
    if (filepath.indexOf('/') !== -1) {
      const paths = filepath.split('/')
      paths.pop()
      return paths.join('/')
    }
    return filepath
  },
  deleteDirectory(filepath, force = false) {
    if (this.exists(filepath)) {
      fs.rmdirSync(filepath, {
        recursive: force
      })
    }
  },
  deleteFile(filepath) {
    if (this.exists(filepath)) {
      fs.unlinkSync(filepath)
    }
  },
  createFile(filepath, content, force = false) {
    if (force) {
      this.deleteFile(filepath)
      // 获取文件所在目录，如果目录不存在，则创建目录
      const directory = this.getDirectory(filepath)
      if (!this.exists(directory)) {
        this.createDirectory(directory)
      }
    }
    fs.writeFileSync(filepath, content)
  },
  exists(filepath) {
    return fs.existsSync(filepath)
  },
  isEmptyDirectory(filepath) {
    return fs.readdirSync(filepath).length === 0
  },
  getFilename(filepath) {
    if (filepath.indexOf('/') === -1) {
      return filepath
    }
    return filepath.split('/').pop()
  },
  getFiletype(filepath) {
    let filetype = this.getFilename(filepath)
    if (filetype.indexOf('.') !== -1) {
      filetype = `.${filetype.split('.').pop()}`
    }
    filetype = Const.FILE_TYPE_MAP[filetype.toLowerCase()]
    if (filetype == null) {
      return 'FILE'
    }
    return filetype
  },
  toJSONFileString (json) {
    return JSON.stringify(json, null, 2)
  }
}

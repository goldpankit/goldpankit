const fs = require('fs')
const path = require('path')
const root = process.cwd()
const Const = require('../constants/constants')
module.exports = {
  getRuntimeRoot() {
    return root
  },
  // 获取文件列表
  getFiles (dir) {
    return fs.readdirSync(dir)
  },
  // 写入代码文件
  writeFiles (files, codespace) {
    let fileCount = 0
    for (const file of files) {
      const relativePath = file.filepath
      // 创建文件
      if (file.filetype !== 'DIRECTORY') {
        this.createFile(`${codespace}/${relativePath}`, file.content, true)
        fileCount++
      }
    }
    return fileCount
  },
  // 获取文件和子文件
  getFilesWithChildren (absolutePath) {
    let filePool = [];
    const files = fs.readdirSync(absolutePath);
    files.forEach(file => {
      // 忽略文件
      if (Const.IGNORE_DIRS.findIndex(f => file === f || file.startsWith(`${f}/`)) !== -1) {
        return
      }
      // 全路径
      const fullpath = path.join(absolutePath, file)
      console.log('fullpath', fullpath)
      filePool.push(fullpath);
      if (this.isDirectory(fullpath)) {
        const subfiles = this.getFilesWithChildren(fullpath);
        filePool = filePool.concat(subfiles);
      }
    })
    return filePool
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
    if (!this.exists(filepath)) {
      return null
    }
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
  rewrite (filepath, content) {
    this.createFile(filepath, content, true)
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
  getContentType(filepath) {
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

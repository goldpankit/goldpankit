const fs = require('fs')
const path = require('path')
const root = process.cwd()
const ee = require('./ellipsis-express')
const Const = require('../constants/constants')
module.exports = {
  getRuntimeRoot() {
    return root
  },
  // 获取文件列表
  getFiles (dir) {
    return fs.readdirSync(dir)
  },
  // 删除代码文件
  deleteFiles (files, codespace) {
    let fileCount = 0
    for (const file of files) {
      const relativePath = file.filepath
      // 删除文件
      if (file.filetype !== 'DIRECTORY') {
        const filepath = `${codespace}/${relativePath}`
        let content = file.content
        // 如果内容为省略号表达式，则对原始内容进行反向合并后写入文件
        if (ee.isEllipsis(content)) {
          const originContent = this.readFile(filepath)
          content = ee.revertMerge(content, originContent)
          this.createFile(filepath, content, true)
          fileCount++
          continue
        }
        this.deleteFile(filepath)
        fileCount++
      }
    }
    return fileCount
  },
  // 写入代码文件
  writeFiles (files, codespace) {
    let fileCount = 0
    for (const file of files) {
      const relativePath = file.filepath
      // 创建文件
      if (file.filetype !== 'DIRECTORY') {
        const filepath = `${codespace}/${relativePath}`
        let content = file.content
        // 二进制文件
        if (file.contentEncode === 'base64') {
          content = Buffer.from(content, 'base64')
        }
        // 如果内容为省略号表达式，则将合并后的内容写入新文件
        else if (ee.isEllipsis(content)) {
          const fileInfo = this.readFile(filepath)
          content = ee.merge(content, fileInfo.content)
        }
        this.createFile(filepath, content, true)
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
  /**
   * 读取文件
   * @param filepath
   * @returns {string}
   */
  readFile(filepath) {
    const buffer = fs.readFileSync(filepath)
    const encode = this.getContentEncode(buffer)
    return {
      encode,
      content: buffer.toString(encode)
    }
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
  /**
   * 获取文件编码，
   */
  getContentEncode (buffer) {
    if(buffer.toString('utf-8').indexOf('�') !== -1) {
      return 'base64'
    }
    return 'utf-8'
  },
  toJSONFileString (json) {
    return JSON.stringify(json, null, 2)
  }
}

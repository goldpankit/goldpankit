const fs = require('fs')
const path = require('path')
const root = process.cwd()
const ee = require('./ellipsis-express')
const Const = require('../constants/constants')
const ignore = require('ignore')
const log = require('../utils/log')
module.exports = {
  getRuntimeRoot() {
    return root
  },
  // 获取文件列表
  getFiles (dir) {
    dir = path.normalize(dir)
    return fs.readdirSync(dir)
  },
  // 删除代码文件
  deleteFiles (files, project, service) {
    log.debug(`${project.name}: preparing to delete ${files.length} files`)
    let fileCount = 0
    for (const file of files) {
      // 排除掉已删除的文件
      if (file.operaType === 'DELETED') {
        continue
      }
      const relativePath = file.filepath
      const filepath = path.join(project.codespace, relativePath)
      if (!this.exists(filepath)) {
        continue
      }
      // 删除文件
      if (file.filetype !== 'DIRECTORY') {
        let content = file.content
        // 如果内容为省略号表达式，则对原始内容进行反向合并后写入文件
        if (ee.isEllipsis(content)) {
          const originContent = this.readFile(filepath).content
          content = ee.revertMerge(content, originContent)
          this.createFile(filepath, content, true)
          fileCount++
          continue
        }
        this.deleteFile(filepath)
        fileCount++
        // 删除空目录
        let dirpath = this.getDirectory(filepath)
        while (this.isEmptyDirectory(dirpath) && project.codespace !== dirpath) {
          this.deleteDirectory(dirpath)
          dirpath = this.getDirectory(dirpath)
        }
      }
    }
    // 删除了文件 && 是卸载服务，则做出提醒
    if (fileCount > 0 && service != null) {
      log.success(`${service}: delete ${fileCount} files`)
    }
    return fileCount
  },
  /**
   * 写入代码文件
   * @param files 需要写入的文件
   * @param project 写入的项目
   * @param service 安装的服务，只有安装时才有
   * @param versionPath 安装的版本路径，如[1.0.0, 1.0.1]
   */
  writeFiles (files, project, service = null, versionPath = []) {
    log.debug(`${project.name}: preparing to process ${files.length} files.`)
    const diffFiles = []
    let fileCount = 0
    for (const file of files) {
      // 目录，不做处理
      if (file.filetype === 'DIRECTORY') {
        continue
      }
      // 获取相对路径
      const relativePath = file.filepath
      // kit.json为项目配置文件，不允许操作
      if (relativePath === Const.SERVICE_CONFIG_FILE) {
        continue
      }
      const filepath = path.join(project.codespace, relativePath)
      // 如果为已删除文件，且本地存在该文件，加入删除队列
      if (file.operaType === 'DELETED') {
        if (this.exists(filepath)) {
          const fileInfo = this.readFile(filepath)
          file.localContentEncode = fileInfo.encode
          file.localContent = fileInfo.content
          diffFiles.push(file)
        }
        continue
      }
      // 如果文件内容为空，且本地存在该文件，加入删除队列
      if (content.trim() === '') {
        if (this.exists(filepath)) {
          const fileInfo = this.readFile(filepath)
          file.localContentEncode = fileInfo.encode
          file.localContent = fileInfo.content
          // 文件操作类型调整为删除
          file.operaType = 'DELETED'
          diffFiles.push(file)
        }
        continue
      }
      // 创建文件
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
      // 如果文件不存在，则创建
      if (!this.exists(filepath)) {
        this.createFile(filepath, content, true)
        fileCount++
      }
      // 如果文件存在且内容不一致，则加入差异文件队列
      else {
        const fileInfo = this.readFile(filepath)
        file.localContentEncode = fileInfo.encode
        file.localContent = fileInfo.content
        if (file.localContent !== file.content) {
          diffFiles.push(file)
        }
      }
    }
    // 给出文件写入提醒
    if (fileCount > 0 && service != null) {
      log.success(`${service}: write ${fileCount} files to ${project.codespace} successfully.`)
    }
    return diffFiles
  },
  // 获取文件和子文件
  getFilesWithChildren (absolutePath) {
    let filePool = [];
    const files = fs.readdirSync(absolutePath);
    const ignoreInstance = ignore().add(Const.IGNORE_DIRS)
    files.forEach(file => {
      // 忽略文件
      if (ignoreInstance.ignores(file)) {
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
      log.debug(`create directory: ${filepath}`)
    }
  },
  getDirectory(filepath) {
    return path.dirname(filepath)
  },
  deleteDirectory(filepath, force = false) {
    if (this.exists(filepath)) {
      fs.rmdirSync(filepath, {
        recursive: force
      })
      log.debug(`delete directory: ${filepath}`)
    }
  },
  deleteFile(filepath) {
    if (this.exists(filepath)) {
      fs.unlinkSync(filepath)
      log.debug(`delete file: ${filepath}`)
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
    log.debug(`create file: ${filepath}`)
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
    return path.basename(filepath)
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
  },
  // 获取相对路径
  getRelativePath(path, parentPath) {
    let relativePath = this.toLinuxPath(path).replace(this.toLinuxPath(parentPath), '')
    if (relativePath.startsWith('/')) {
      relativePath = relativePath.substring(1)
    }
    return relativePath
  },
  // 转换为linux路径风格
  toLinuxPath (path) {
    return path.replace(/\\/g, '/')
  }
}

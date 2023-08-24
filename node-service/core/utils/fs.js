const fs = require('fs')
const path = require('path')
const root = process.cwd()
const diffExp = require('./diff-express')
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
  // 删除代码文件，卸载时调用
  deleteFiles (files, project, service) {
    log.debug(`${project.name}: preparing to delete ${files.length} files`)
    const diffFiles = []
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
        // 如果内容为省略号表达式
        if (diffExp.isDiffEllipsis(content)) {
          const fileInfo = this.readFile(filepath)
          let localFileContent = fileInfo.content
          content = diffExp.revertMerge(content, fileInfo.content)
          // 如果反向合并失败，则将差异表达式写入本地内容顶部
          if (diffExp.isDiffEllipsis(content)) {
            // 本地文件内容 = 表达式+本地文件内容
            localFileContent = `[AUTOMERGE]\nThe following is the logic for merging the code, \nbut we are currently unable to merge according to this logic. \nPlease manually perform the merge.\n\n${content}\n\n${fileInfo.content}`
            // 右侧内容=本地文件内容
            content = fileInfo.content
          }
          // 加入差异队列
          file.content = content
          file.localContent = localFileContent
          file.contentEncode = fileInfo.encode
          diffFiles.push(file)
          continue
        }
        // 待删除文件，填充本地内容，加入删除文件队列
        file.operaType = 'DELETED'
        file.localContent = this.readFile(filepath).content
        diffFiles.push(file)
      }
    }
    return diffFiles
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
      // 获取写入文件路径
      const filepath = path.join(project.codespace, relativePath)
      let content = file.content
      // 如果为已删除文件，且本地存在该文件，加入删除队列，此时file.content为null
      if (file.operaType === 'DELETED') {
        if (this.exists(filepath)) {
          file.localContent = this.readFile(filepath).content
          diffFiles.push(file)
        }
        continue
      }
      // 如果为二进制文件，直接覆盖写入
      if (file.contentEncode === 'base64') {
        content = Buffer.from(content, 'base64')
        this.createFile(filepath, content, true)
        fileCount++
        continue
      }
      // 如果文件内容为空，且本地存在该文件，加入删除队列
      if (content.trim() === '') {
        if (this.exists(filepath)) {
          const fileInfo = this.readFile(filepath)
          file.localContent = fileInfo.content
          // 文件操作类型调整为删除
          file.operaType = 'DELETED'
          diffFiles.push(file)
        }
        continue
      }
      // 如果文件不存在，则直接写入
      if (!this.exists(filepath)) {
        this.createFile(filepath, content, true)
        fileCount++
        continue
      }
      // 如果为差异表达式，合并内容
      const fileInfo = this.readFile(filepath)
      let localFileContent = fileInfo.content
      if (diffExp.isDiffEllipsis(content)) {
        // 合并
        content = diffExp.merge(content, localFileContent)
        // 合并失败
        if (diffExp.isDiffEllipsis(content)) {
          // 左侧内容=差异表达式+本地内容
          localFileContent = `[AUTOMERGE]\nThe following is the logic for merging the code, \nbut we are currently unable to merge according to this logic. \nPlease manually perform the merge.\n\n${content}\n\n${localFileContent}`
          // 右侧内容=本地内容
          content = fileInfo.content
        }
      }
      file.content = content
      file.localContent = localFileContent
      // 如果本地内容 != 编译后的内容，则加入差异列表
      if (file.localContent !== file.content) {
        diffFiles.push(file)
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

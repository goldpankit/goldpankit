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
  // 重命名
  rename (oldPath, newPath) {
    fs.renameSync(oldPath, newPath)
  },
  // 清空目录
  clearDir (dir) {
    this.deleteDirectory(dir, true)
    this.createDirectory(dir)
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
        // 如果内容为差异表达式
        if (diffExp.isDiffEllipsis(content)) {
          const fileInfo = this.readFile(filepath)
          let localFileContent = fileInfo.content
          const revertMergeResult = diffExp.revertMerge(content, fileInfo.content)
          content = revertMergeResult.content
          // 如果反向合并失败，则将差异表达式写入本地内容顶部
          if (!revertMergeResult.success) {
            // 本地文件内容 = 表达式+本地文件内容
            localFileContent = `[AUTOMERGE]\nThe following is the logic for merging the code, \nbut we are currently unable to merge according to this logic. \nPlease manually perform the merge.\n\n${revertMergeResult.errorExpress}\n\n${fileInfo.content}`
          }
          // 加入差异队列
          file.content = content
          file.localContent = localFileContent
          file.contentEncode = fileInfo.encode
          if (file.content !== file.localContent) {
            diffFiles.push(file)
          }
          continue
        }
        // 将文件标记为“已删除”（指的是在新的服务或插件中代码中已被删除，并不是本地已被删除）并填充本地内容，加入差异文件队列
        file.operaType = 'DELETED'
        file.localContent = ''
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
    const currentFiles = this.getFiles(project.codespace)
    const hasFile = currentFiles.filter(file => file !== Const.SERVICE_CONFIG_FILE).length > 0
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
          // 虽然在此之前已经将目录类型的文件continue了，但已删除的文件接口中未能获取filetype，导致已删除的目录未得到处理，此处临时做处理
          if (this.isDirectory(filepath)) {
            continue
          }
          file.localContent = this.readFile(filepath).content
          diffFiles.push(file)
        }
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
      // 如果文件在项目中不存在
      if (!this.exists(filepath)) {
        // - 如果项目中存在文件
        if (hasFile) {
          // - 新内容是差异表达式，则不做处理（本地没有该文件，则不用再做差异合并）
          if (diffExp.isDiffEllipsis(content)) {
            continue
          }
          // - 如果文件必须要在本地中存在才生效，则不做处理
          if (file.withoutIfNotExists === true) {
            continue
          }
          // - 新内容不是差异表达式，则加入差异队列（写入新的文件时视为差异，避免用户对新增文件无感知）
          diffFiles.push(file)
          continue
        }
        // - 项目中不存在文件，且为二进制文件，转换内容为二进制，并直接写入到项目中
        if (file.contentEncode === 'base64') {
          content = Buffer.from(content, 'base64')
          this.createFile(filepath, content, true)
          fileCount++
          continue
        }
        // - 项目中不存在文件，且为文本文件，直接写入到项目中
        this.createFile(filepath, content, true)
        fileCount++
        continue
      }
      // 如果文件存在，且为差异表达式，合并内容
      const fileInfo = this.readFile(filepath)
      let localFileContent = fileInfo.content
      if (diffExp.isDiffEllipsis(content)) {
        // 合并
        const mergeResult = diffExp.merge(content, localFileContent)
        content = mergeResult.content
        // 合并失败
        if (!mergeResult.success) {
          // 左侧内容=差异表达式+本地内容
          localFileContent = `[AUTOMERGE]\nThe following is the logic for merging the code, \nbut we are currently unable to merge according to this logic. \nPlease manually perform the merge.\n\n${mergeResult.errorExpress}\n\n${localFileContent}`
        }
      }
      file.content = content
      file.localContent = localFileContent
      // 如果文件存在，且本地内容 != 编译后的内容，则加入差异列表
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
  /**
   * 获取文件和子文件
   * @param absolutePath 绝对路径
   * @param ignoreInstance 文件忽略处理对象
   * @returns {*[]}
   */
  getFilesWithChildren (absolutePath, ignoreInstance = null) {
    let filePool = [];
    const files = fs.readdirSync(absolutePath);
    files.forEach(file => {
      const fullpath = path.join(absolutePath, file)
      const fixedIgnoreInstance = ignore().add(Const.IGNORE_FILES)
      // 忽略目录，目录需要在路径后增加'/'
      if (this.isDirectory(fullpath)) {
        if (fixedIgnoreInstance.ignores(file + '/')) {
          return
        }
        if (ignoreInstance != null && ignoreInstance.ignores(file + '/')) {
          return
        }
      }
      // 忽略文件
      if (fixedIgnoreInstance.ignores(file)) {
        return
      }
      if (ignoreInstance != null && ignoreInstance.ignores(file)) {
        return
      }
      // 全路径
      filePool.push(fullpath);
      if (this.isDirectory(fullpath)) {
        const subFiles = this.getFilesWithChildren(fullpath, ignoreInstance);
        filePool = filePool.concat(subFiles);
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
    try {
      const buffer = fs.readFileSync(filepath)
      const encode = this.getContentEncode(buffer)
      return {
        encode,
        content: buffer.toString(encode)
      }
    } catch (e) {
      console.log(`读取${filepath}文件失败`, e)
    }
  },
  readJSONFile(filepath) {
    if (!this.exists(filepath)) {
      return null
    }
    // 处理有文件但内容为空的情况
    const fileContent = fs.readFileSync(filepath).toString()
    if (fileContent.trim() === '') {
      return {}
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
  },
  /**
   * 获取忽略文件列表
   * @param codespace 代码空间
   */
  getIgnoreFileConfig (codespace) {
    // 直接读取.gitignore文件路径
    const ignoreFileConfigPath = path.join(codespace, '.gitignore')
    if (this.exists(ignoreFileConfigPath)) {
      return this.readFile(ignoreFileConfigPath).content
    }
    return ''
  }
}

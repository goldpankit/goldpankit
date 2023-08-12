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
    let currentInstallService = null
    // 当前安装的服务版本索引，例如总计版本为[1.0.0, 1.0.1]，当前版本为1.0.1，那么索引为1
    let currentInstallVersionIndex = -1
    if (service != null) {
      currentInstallService = project.services[service]
      if (currentInstallService == null) {
        currentInstallService = project.main[service]
      }
      currentInstallVersionIndex = versionPath.findIndex(v => v === currentInstallService.version)
      if (currentInstallVersionIndex === -1) {
        log.warn(`service version incorrect: ${service}@${currentInstallService.version}`)
      }
    }
    let fileCount = 0
    for (const file of files) {
      const relativePath = file.filepath
      // kit.json为项目配置文件，不允许操作
      if (relativePath === Const.SERVICE_CONFIG_FILE) {
        continue
      }
      const filepath = path.join(project.codespace, relativePath)
      // 删除文件或目录
      if (file.operaType === 'DELETED') {
        if (this.exists(filepath)) {
          if (this.isFile(filepath)) {
            this.deleteFile(filepath)
          } else {
            this.deleteDirectory(filepath, true)
          }
        }
        continue
      }
      // 创建文件
      if (file.filetype !== 'DIRECTORY') {
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
        // 如果是安装
        if (service != null) {
          /**
           * 服务安装过，则存在installService，此时找到当前服务的安装的版本
           * 如果需要被写入的文件的版本索引不在当前版本的索引之后
           * 即：文件版本索引 <= 当前已安装的版本索引，则不做文件写入动作，但如果本地没有当前文件，则还是需要做创建动作
           */
          if (currentInstallService != null) {
            if (file.versionIndex === -1) {
              log.warn(`can not found version for file ${relativePath}`)
            }
            /**
             * 两次-1的判断用于处理极端数据错误的情况
             * 1. 当前安装的版本不属于服务的版本（例如用户手动修改了版本号）
             * 2. 文件所属版本索引未找到（java服务出错）
             */
            if (currentInstallVersionIndex !== -1 && file.versionIndex !== -1 && file.versionIndex <= currentInstallVersionIndex) {
              // 如果文件不存在，则创建，否则不做创建
              if (!this.exists(filepath)) {
                this.createFile(filepath, content, true)
                fileCount++
              }
              continue
            }
          }
          this.createFile(filepath, content, true)
          fileCount++
          continue
        }
        // versionPath.findIndex(v => v === project)
        this.createFile(filepath, content, true)
        fileCount++
      }
    }
    // 安装了文件 && 是安装服务，则给出文件写入提醒
    if (fileCount > 0 && service != null) {
      log.success(`${service}: write ${fileCount} files to ${project.codespace} successfully.`)
    }
    return fileCount
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
  }
}

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
      // 删除文件
      if (file.filetype !== 'DIRECTORY') {
        let content = file.content
        // 读取本地文件（本地文件可能不存在，即使在卸载的情况，也有可能是纯删除语句反向后的纯增语句，从而让卸载产生新的文件）
        let fileInfo = null
        const fileExists = this.exists(filepath)
        if (fileExists) {
          fileInfo = this.readFile(filepath)
        }
        // 如果内容为差异表达式
        if (diffExp.isDiffEllipsis(content)) {
          // 获取本地文件的内容，如本地文件不存在，则视为空（纯增情况本地文件可能不存在）
          let localFileContent = ''
          if (fileInfo != null) {
            localFileContent = fileInfo.content
          }
          const revertMergeResult = diffExp.revertMerge(content, localFileContent)
          content = revertMergeResult.content
          // 如果反向合并失败，则将差异表达式写入本地内容顶部
          if (!revertMergeResult.success) {
            // 合并失败了，本地文件还不存在的情况，直接忽略
            if (!fileExists) {
              continue
            }
            // 本地文件内容 = 表达式+本地文件内容
            localFileContent = `[AUTOMERGE]\nThe following is the logic for merging the code, \nbut we are currently unable to merge according to this logic. \nPlease manually perform the merge.\n\n${revertMergeResult.errorExpress}\n\n${localFileContent}`
          }
          // 如果合并的结果与本地一致，直接忽略
          if (content.trim() === localFileContent.trim()) {
            continue
          }
          // 合并后的内容为空 && 本地不存在该文件，直接忽略
          if (content.trim() === '' && !fileExists) {
            continue
          }
          // 合并后的内容为空 && 本地存在该文件，则做删除
          if (content.trim() === '' && fileExists) {
            file.operaType = 'DELETED'
          }
          // 合并后的内容不为空 && 本地不存在该文件，则标记为新增
          if (content.trim() !== '' && !fileExists) {
            file.operaType = 'ADD'
          }
          // 加入差异队列
          file.content = content
          file.localContent = localFileContent
          file.contentEncode = 'utf-8'
          diffFiles.push(file)
          continue
        }
        // 本地存在在该文件，做删除处理
        if (fileExists) {
          // 将文件标记为“已删除”（指的是在新的服务或插件中代码中已被删除，并不是本地已被删除）并填充本地内容，加入差异文件队列
          file.operaType = 'DELETED'
          file.localContent = ''
          if (fileInfo != null) {
            file.localContent = fileInfo.content
          }
          diffFiles.push(file)
        }
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
    // 判断项目中是否存在文件
    const isNotEmptyProject = currentFiles.filter(file => file !== Const.PROJECT_CONFIG_FILE && file !== Const.PROJECT_DATABASE_CONFIG_FILE).length > 0
    log.debug(`${project.name}: 准备处理 ${files.length} 个文件`)
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
      if (relativePath === Const.PROJECT_CONFIG_FILE) {
        continue
      }
      // 获取写入文件路径
      const filepath = path.join(project.codespace, relativePath)
      const fileExists = this.exists(filepath)
      let content = file.content
      // 如果为已删除文件，且本地存在该文件，加入删除队列，此时file.content为null
      if (file.operaType === 'DELETED') {
        if (this.exists(filepath)) {
          /*
          如果编译的文件中存在路径相同且operaType为ADD的，则不做删除处理
          原因：假设文件使用了变量A来作为文件名，此时修改文件名使用了变量B，且变量A与变量B产生的结果是一致的，那么编译文件列表中会存在删除了该文件又新增了该文件，
          所以标记为删除文件时，需要判断是否同一路径又存在ADD的文件，如果是，那么该文件不应做删除处理。
          */
          if (files.find(f => f.filepath === relativePath)) {
            continue
          }
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
      if (!fileExists) {
        // - 如果项目中存在文件（这里的文件指的是项目其它文件，不含kit.json和kit.db.json的文件）
        if (isNotEmptyProject) {
          // - 如果文件必须要在本地中存在才生效，则不做处理
          if (file.withoutIfNotExists === true) {
            continue
          }
          // - 新内容是差异表达式（此时的差异表达式可能是“纯删”或“纯加”语句）
          if (diffExp.isDiffEllipsis(content)) {
            // 文件在项目中不存在，视为本地内容为空串
            let localFileContent = ''
            // 合并
            const mergeResult = diffExp.merge(content, localFileContent)
            content = mergeResult.content
            // 合并失败（本地不存在文件，并且还合并失败，说明content为存在定位行的差异表达式）
            if (!mergeResult.success) {
              continue
            }
            // 合并成功 && 内容为空，则不做处理（此时本地也不存在）
            if (content.trim() === '') {
              continue
            }
            // 不为空，标记为新增
            file.localContent = localFileContent
            file.content = content
            // 文件操作类型调整为新增
            file.operaType = 'ADD'
            diffFiles.push(file)
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
      // 如果文件在项目中存在 && 为差异表达式，合并内容
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
          file.content = content
          file.localContent = localFileContent
          diffFiles.push(file)
          continue
        }
        // 合并后的结果为空，且本地存在该文件，加入删除队列
        if (content.trim() === '') {
          const fileInfo = this.readFile(filepath)
          file.localContent = fileInfo.content
          // 文件操作类型调整为删除
          file.operaType = 'DELETED'
          diffFiles.push(file)
          continue
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
   * @param parentIgnoreInstance 上级文件忽略实例，用于在当前目录下没有配置.gitignore时使用
   * @returns {*[]}
   */
  getFilesWithChildren (absolutePath, parentIgnoreInstance = null) {
    /*
    创建ignore实例
    如果当前目录下没有.gitignore文件配置，则以父级的ignore实例作为当前目录的ignore实例
    */
    let ignoreInstance = parentIgnoreInstance
    const ignoreFileConfig = this.getIgnoreFileConfig(absolutePath)
    if (ignoreInstance == null || ignoreFileConfig.ignoreFileConfig != null) {
      ignoreInstance = ignore().add(ignoreFileConfig.all)
    }
    let filePool = [];
    const files = fs.readdirSync(absolutePath);
    files.forEach(file => {
      const fullpath = path.join(absolutePath, file)
      // 忽略目录，目录需要在路径后增加'/'
      if (this.isDirectory(fullpath)) {
        if (ignoreInstance.ignores(file + '/')) {
          return
        }
      }
      // 忽略文件
      if (ignoreInstance.ignores(file)) {
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
      log.error(`读取${filepath}文件失败`, e)
    }
  },
  readAddFileArray (codespace) {
    const filepath = path.join(codespace, '.kit.addfile')
    if (!this.exists(filepath)) {
      return []
    }
    return fs.readFileSync(filepath).toString().split('\n')
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
    const defaultIgnoreFileConfig = `${Const.SERVICE_CONFIG_DIRECTORY}/\n${Const.IGNORE_FILES.join('\n')}`
    // 直接读取.gitignore文件路径
    const ignoreFileConfigPath = path.join(codespace, '.gitignore')
    if (this.exists(ignoreFileConfigPath)) {
      const ignoreFileConfig = this.readFile(ignoreFileConfigPath).content
      return {
        defaultIgnoreFileConfig,
        ignoreFileConfig,
        all: `${defaultIgnoreFileConfig}\n${ignoreFileConfig}`
      }
    }
    return {
      defaultIgnoreFileConfig,
      all: defaultIgnoreFileConfig
    }
  }
}

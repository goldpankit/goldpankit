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
    log.debug(`${project.name}: preparing to delete ${files.length} files.`)
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
    log.debug(`${project.name}: prepare to process ${files.length} files.`)
    const diffFiles = []
    let writeFileCount = 0
    /*
    如果项目中不存在文件，直接写入
    */
    if (!isNotEmptyProject) {
      log.debug(`${project.name}：project is empty, and the file contents are written directly.`)
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        // 目录，不做处理
        if (file.filetype === 'DIRECTORY') {
          log.debug(`${project.name}: ${i}. ${file.filepath} is directory，ignored.`)
          log.traceFile(file, `is directory，ignored.`)
          continue
        }
        // 已删除的文件，不做处理
        if (file.operaType === 'DELETED') {
          log.debug(`${project.name}: ${i}. ${file.filepath} is 'DELETED' file，ignored.`)
          log.traceFile(file, `is 'DELETED' file，ignored.`)
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
        // 写入文件
        this.writeFileWithForce(filepath, file, () => {
          log.debug(`${project.name}: ${i}. ${file.filepath} is written.`)
          log.traceFile(file, ` is written.`)
          writeFileCount++
        })
      }
    }
    /*
    项目中存在文件（要么是升级框架，要么是插件的安装、升级、卸载）
    1. 对于删除状态的文件，如果本地存在，则视为删除，并加入差异队列；同时，如果文件中还存在相同文件的ADD操作，则忽略；
    2. 对于最新内容为空的文件，如果本地存在，则视为删除，并加入差异队列
    3. 对于最新文件，如果本地存在 && 为差异表达式，则做合并处理，并加入差异队列；否则做覆盖处理，并加入比差异队列
    4. 对于最新文件，如果本地不存在 && 为差异表达式，则直接忽略；否则做新增处理，并加入比差异队列
    */
    else {
      log.debug(`${project.name}：project is not empty, will run the diff-express processor...`)
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        // 获取文件路径
        const relativePath = file.filepath
        const filepath = path.join(project.codespace, relativePath)
        // 目录，不做处理
        if (file.filetype === 'DIRECTORY' || (this.exists(filepath) && this.isDirectory(filepath))) {
          log.debug(`${project.name}: ${i}. ${filepath} is directory，ignored.`)
          continue
        }
        // kit.json为项目配置文件，不允许操作
        if (relativePath === Const.PROJECT_CONFIG_FILE) {
          continue
        }
        // 获取文件信息
        const fileExists = this.exists(filepath)
        let localFile = null
        if (fileExists) {
          localFile = this.readFile(filepath)
        }
        // 已删除的文件，如果在本地找到文件，则加入差异队列
        if (file.operaType === 'DELETED') {
          log.debug(`${project.name}：${i}. ${filepath} will be deleted.`)
          log.traceFile(file, `will be deleted.`)
          if (fileExists) {
            /*
             情况1: 一个插件版本可能对同一个文件即存在删除，又存在新增。
             例如文件使用了变量A来作为文件名，此时修改文件名使用了变量B，且变量A与变量B产生的结果是一致的，则编译文件列表中会存在删除了该文件又新增了该文件。
             此时新增文件和删除文件的顺序是不一定的，但是他们的serviceVersionId一定是一样的。此时删除动作应该被忽略
            */
            const anotherFileIndex = files.findIndex(f => f.serviceVersionId === file.serviceVersionId && f.operaType !== 'DELETED')
            if (anotherFileIndex !== -1) {
              const anotherFile = files[anotherFileIndex]
              log.debug(`${project.name}：${i}. ${filepath} exists another file operation, deletion is stopped.`)
              log.traceFile(file, `exists another file operation, deletion is stopped.`)
              log.traceFile(file, `  current file index: ${i}`)
              log.traceFile(file, `  current file version: ${file.version}`)
              log.traceFile(file, `  another file index: ${anotherFileIndex}`)
              log.traceFile(file, `  another file version: ${anotherFile.version}`)
              log.traceFile(file, `  another file opera type: ${anotherFile.operaType}`)
              continue
            }
            /*
             情况2:一个插件存在多个版本（serviceVersionId不一样），且前面的版本出现了删除，后面的版本又出现了新增或者修改（如果出现了修改，可能是数据不正确），
             那么删除动作应该被忽略。
            */
            const anotherVersionFileIndex = files.findIndex((f, index) => {
              if (index <= i) {
                return false
              }
              return f.filepath === relativePath && f.operaType !== 'DELETED' && f.serviceVersionId !== file.serviceVersionId
            })
            if (anotherVersionFileIndex !== -1) {
              const anotherVersionFile = files[anotherVersionFileIndex]
              log.debug(`${project.name}：${i}. ${filepath} exists another version file operation, deletion is stopped.`)
              log.traceFile(file, `exists another version operation, deletion is stopped.`)
              log.traceFile(file, `  current file index: ${i}`)
              log.traceFile(file, `  current file version: ${file.version}`)
              log.traceFile(file, `  another version file index: ${anotherVersionFileIndex}`)
              log.traceFile(file, `  another version file version: ${anotherVersionFile.version}`)
              log.traceFile(file, `  another version file opera type: ${anotherVersionFile.operaType}`)
              continue
            }
            // 填充本地内容并加入差异队列
            log.debug(`${project.name}：${i}. ${filepath} joined the delete-diff-queue.`)
            log.traceFile(file, `joined the delete-diff-queue.`)
            // - 已删除的文件，contentEncode可能为null，需要填充，不填充会导致合并时无法判断预览
            file.contentEncode = localFile.encode
            file.localContent = localFile.content
            diffFiles.push(file)
          }
          continue
        }
        // 如果最新内容为空，且本地存在该文件，则加入差异队列
        if (file.content == null || file.content.trim() === '') {
          if (fileExists) {
            file.localContent = localFile.content
            // 文件操作类型调整为删除
            file.operaType = 'DELETED'
            diffFiles.push(file)
          }
          continue
        }
        /*
        文件在项目中存在（冲突文件）
        1. 如果文件内容为差异表达式，则进行合并，并加入差异队列
        2. 如果文件内容不为差异表达式，则直接加入差异队列
        */
        if (fileExists) {
          // 差异表达式
          if (diffExp.isDiffEllipsis(file.content)) {
            log.debug(`${project.name}: ${i}. ${filepath} is diff-express，auto-merging...`)
            log.traceFile(file, `is diff-express，auto-merging...`)
            // 合并
            const mergeResult = diffExp.merge(file.content, localFile.content)
            // 合并成功
            if (mergeResult.success) {
              // 合并后的结果为空，加入删除队列
              if (mergeResult.content.trim() === '') {
                log.debug(`${project.name}: ${i}. ${filepath} auto-merge result is blank，joined the delete-diff-queue.`)
                log.traceFile(file, `auto-merge result is blank，joined the delete-diff-queue.`)
                file.localContent = localFile.content
                // 文件操作类型调整为删除
                file.operaType = 'DELETED'
                diffFiles.push(file)
                continue
              }
              // 合并成功 && 存在最新内容
              file.content = mergeResult.content
              file.localContent = localFile.content
              file.operaType = 'MODIFIED'
              // 本地内容 != 最新内容，则加入差异队列
              if (file.localContent !== file.content) {
                log.debug(`${project.name}: ${i}. ${filepath} auto-merge successfully，joined the diff-queue.`)
                log.traceFile(file, `auto-merge successfully，joined the diff-queue.`)
                diffFiles.push(file)
              } else {
                log.debug(`${project.name}: ${i}. ${filepath} auto-merge successfully，but the new content equals the local content，ignored.`)
                log.traceFile(file, `auto-merge successfully，but the new content equals the local content，ignored.`)
              }
            }
            // 合并失败
            else {
              log.debug(`${project.name}: ${i}. ${filepath} auto-merge failed.`)
              log.traceFile(file, `auto-merge failed.`)
              file.operaType = 'MODIFIED'
              // 最新内容=合并后的内容（虽然合并失败，但并不是全部失败，能合并的还是会自动合并，不能合并的表达式通过错误表达式字段返回，在本地内容展示）
              file.content = mergeResult.content
              // 本地内容=差异表达式+本地内容
              file.localContent = `[AUTOMERGE]\nThe following is the logic for merging the code, \nbut we are currently unable to merge according to this logic. \nPlease manually perform the merge.\n\n${mergeResult.errorExpress}\n\n${localFile.content}`
              diffFiles.push(file)
            }
          }
          // 非差异表达式
          else {
            file.localContent = localFile.content
            file.operaType = 'MODIFIED'
            // 本地内容 != 最新内容，则加入差异列表
            if (file.localContent !== file.content) {
              log.debug(`${project.name}: ${i}. ${filepath} has bean overwritten and joined the diff-queue.`)
              log.traceFile(file, `has bean overwritten and joined the diff-queue.`)
              diffFiles.push(file)
            } else {
              log.debug(`${project.name}: ${i}. ${filepath} content equals the local content，ignored.`)
              log.traceFile(file, `content equals the local content，ignored.`)
            }
          }
        }
        /*
        文件在项目中不存在（新文件）
        1. 如果文件内容为差异表达式，则忽略
        2. 如果文件内容不为差异表达式，则直接加入差异队列
        */
        else {
          // 非差异表达式，直接加入差异队列
          if (!diffExp.isDiffEllipsis(file.content)) {
            log.debug(`${project.name}: ${i}. ${filepath} is new file，joined diff-queue.`)
            log.traceFile(file, `is new file，joined diff-queue.`)
            file.operaType = 'ADD'
            diffFiles.push(file)
          } else {
            log.debug(`${project.name}: ${i}. ${filepath} is diff-express，and can't found in the local，ignored.`)
            log.traceFile(file, `is diff-express，and can't found in the local，ignored.`)
          }
        }
      }
    }
    // 给出文件写入提醒
    if (writeFileCount > 0 && service != null) {
      log.success(`${service}: write ${writeFileCount} files to ${project.codespace} successfully.`)
    }
    return diffFiles
  },
  /**
   * 强制写入文件
   * @param filepath 文件路径
   * @param file 文件对象
   */
  writeFileWithForce (filepath, file, callback) {
    if (file.contentEncode === 'base64') {
      this.createFile(filepath, Buffer.from(file.content, 'base64'), true)
      callback && callback()
      return
    }
    // - 项目中不存在文件，且为文本文件，直接写入到项目中
    this.createFile(filepath, file.content, true)
    callback && callback()
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
      log.error(`read file ${filepath} failed`, e)
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
      log.debug(`+ created directory: ${filepath}`)
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
      log.debug(`- deleted directory: ${filepath}`)
    }
  },
  deleteFile(filepath) {
    if (this.exists(filepath)) {
      fs.unlinkSync(filepath)
      log.debug(`- deleted file: ${filepath}`)
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
    log.debug(`+ created file: ${filepath}`)
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

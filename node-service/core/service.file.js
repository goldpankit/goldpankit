const Const = require('./constants/constants')
const fs = require('./utils/fs')
const object = require("./utils/object");
const serviceConf = require('./service.config')
const log = require('./utils/log')
const userProject = require('./user.project')
const path = require('path')
module.exports = {
  /**
   * 写入差异文件
   * @param dto 参数
   * {
   *   projectId: null,
   *   diffFiles: []
   * }
   */
  writeDiffFiles (dto) {
    const projectId = dto.projectId
    const diffFiles = dto.diffFiles
    const project = userProject.findConfigById(projectId)
    log.debug(`${project.name}: preparing to process ${diffFiles.length} diff files.`)
    let mergeCount = 0
    let deletedCount = 0
    for (const file of diffFiles) {
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
      // 如果为已删除文件，则删除文件
      if (file.operaType === 'DELETED') {
        fs.deleteFile(filepath)
        // 删除空目录
        let dirpath = fs.getDirectory(filepath)
        while (fs.isEmptyDirectory(dirpath) && project.codespace !== dirpath) {
          fs.deleteDirectory(dirpath)
          dirpath = fs.getDirectory(dirpath)
        }
        deletedCount++
        continue
      }
      // 创建文件
      if (file.contentEncode === 'base64') {
        const content = Buffer.from(file.content, 'base64')
        fs.createFile(filepath, content, true)
      } else {
        fs.createFile(filepath, file.content, true)
      }
      mergeCount++
    }
    // 给出文件写入提醒
    log.success(`diff: merge ${mergeCount} files, deleted ${deletedCount} files.`)
  },
  /**
   * 获取文件设置
   * @param codespace 代码空间
   * @param fileRelativePath 文件相对路径
   * @returns {any}
   */
  getFileSetting (codespace, fileRelativePath) {
    const configPath = serviceConf.__getConfigPath(codespace)
    const config = fs.readJSONFile(configPath)
    const setting = JSON.parse(JSON.stringify(Const.SERVICE_FILE_CONFIG_CONTENT))
    let targetSettings = config.settings.find(file => file.path === fileRelativePath)
    if (targetSettings != null) {
      object.merge(targetSettings, setting)
    }
    // 没有设置过的文件不会产生配置文件，此时path为空，此处设定path值
    setting.path = fileRelativePath
    // 如果当前文件的编译模式为空，找出实际编译模式（为空时继承上级编译模式）
    setting._actualCompiler = setting.compiler
    if (setting.compiler == null || setting.compiler === '') {
      // 先按照路径的层级进行倒序排列，然后依次startsWith，找出最近的上级节点
      config.settings.sort((item1, item2) => {
        const item1Level = fs.toLinuxPath(item1.path).split('/').length
        const item2Level = fs.toLinuxPath(item2.path).split('/').length
        return item2Level - item1Level
      })
      for (const item of config.settings) {
        if (setting.path.startsWith(item.path) && item.compiler != null && item.compiler !== '') {
          setting._actualCompiler = item.compiler
          break
        }
      }
      // 如果没有匹配到上级设置了编译器，则使用服务编译器
      if (setting._actualCompiler == null || setting._actualCompiler === '') {
        setting._actualCompiler = config.compiler
      }
    }
    return setting
  }
}

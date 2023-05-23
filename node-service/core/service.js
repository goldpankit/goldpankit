const path = require('path')
const Const = require('./constants/constants')
const cache = require('./utils/cache')
const object = require('./utils/object')
const fs = require('./utils/fs')
const serviceApi = require("./api/service");
const userProject = require('./user.project')
module.exports = {
  // 初始化
  initialize(extConfig) {
    // 配置
    const config = JSON.parse(JSON.stringify(Const.SERVICE_CONFIG_CONTENT))
    // 配置文件
    const codespace = extConfig.codespace
    const configPath = this.__getConfigPath(codespace)
    // 合并配置
    for (const key in config) {
      config[key] = extConfig[key] || config[key]
    }
    return serviceApi.initialize(config.id)
      .then(() => {
        // 初始化服务文件
        fs.createFile(configPath, fs.toJSONFileString(config), true)
        // 添加本地服务记录
        cache.services.add({
          id: config.id,
          codespace
        })
        return Promise.resolve()
      })
      .catch(e => {
        return Promise.reject(e)
      })
  },
  // 获取服务配置信息
  getServiceConfig(serviceId) {
    const service = cache.services.get(serviceId)
    const configPath = this.__getConfigPath(service.codespace)
    return fs.readJSONFile(configPath)
  },
  // 获取服务文件树
  getFileTree(serviceId) {
    const service = cache.services.get(serviceId)
    return fs.getFileTree(service.codespace, service.codespace)
  },
  // 保存服务文件
  saveFileSetting (fileSettings) {
    const service = cache.services.get(fileSettings.serviceId)
    const configPath = this.__getConfigPath(service.codespace)
    const config = fs.readJSONFile(configPath)
    let targetFileSettings = config.settings.find(file => file.path === fileSettings.relativePath)
    if (targetFileSettings == null) {
      targetFileSettings = JSON.parse(JSON.stringify(Const.SERVICE_FILE_CONFIG_CONTENT))
      config.settings.push(targetFileSettings)
    }
    object.merge(fileSettings, targetFileSettings)
    targetFileSettings.path = fileSettings.relativePath
    fs.rewrite(configPath, fs.toJSONFileString(config))
  },
  // 保存变量
  saveVariables (dto) {
    const service = cache.services.get(dto.serviceId)
    const configPath = this.__getConfigPath(service.codespace)
    const config = fs.readJSONFile(configPath)
    config.variables = dto.variables
    fs.rewrite(configPath, fs.toJSONFileString(config))
  },
  // 推送服务
  push(serviceId) {
    const service = cache.services.get(serviceId)
    const files = fs.getFilesWithChildren(service.codespace, service.codespace).map(fullpath => {
      const filetype = fs.isDirectory(fullpath) ? 'DIRECTORY' : 'FILE'
      const relativePath = fullpath.replace(service.codespace + '/', '')
      return {
        serviceId,
        filepath: relativePath,
        filetype,
        contentType: fs.getContentType(fullpath),
        content: filetype === 'DIRECTORY' ? null : fs.readFile(fullpath),
        variables: JSON.stringify([]),
        enableExpress: ''
      }
    })
    console.log('files', files)
    return serviceApi.push({
      serviceId,
      files
    })
  },
  // 安装服务
  install (dto) {
    const projectId = dto.projectId
    const project = cache.projects.get(projectId)
    if (project == null) {
      throw new Error('Please select a project.')
    }
    return serviceApi.install({
      id: dto.framework.id,
      variables: dto.variables
    })
      .then(data => {
        // 写入配置
        const projectConfig = JSON.parse(JSON.stringify(Const.PROJECT_CONFIG_FILE_CONTENT))
        projectConfig.space = dto.space.name
        projectConfig.framework[dto.framework.name] = {
          version: dto.framework.version || "",
          variables: dto.variables
        }
        fs.createFile(userProject.getConfigPath(projectId), fs.toJSONFileString(projectConfig), true)
        // 写入文件
        fs.writeFiles(data, project.codespace)
        return Promise.resolve()
      })
      .catch(e => {
        return Promise.reject(e)
      })
  },
  // 获取文件配置目录
  __getConfigPath (codespace) {
    return `${codespace}/${Const.SERVICE_CONFIG_DIRECTORY}/${Const.SERVICE_CONFIG_FILE}`
  },
  // 获取文件设置
  __getFileSettings (codespace, fileRelativePath) {
    const configPath = this.__getConfigPath(codespace)
    const config = fs.readJSONFile(configPath)
    let fileSettings = config.settings.find(file => file.path === fileRelativePath)
    if (fileSettings == null) {
      fileSettings = JSON.parse(JSON.stringify(Const.SERVICE_FILE_CONFIG_CONTENT))
    }
    return fileSettings
  }
}

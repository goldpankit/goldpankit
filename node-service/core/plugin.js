const path = require('path')
const Const = require('./constants/constants')
const cache = require('./utils/cache')
const object = require('./utils/object')
const fs = require('./utils/fs')
const pluginApi = require("./api/plugin");
const serviceTranslator = require('./service.translator')
const serviceConf = require('./service.config')
const serviceFile = require('./service.file')
const userPluginApi = require('./api/user.plugin')
const env = require('../env').getConfig()
const ignore = require('ignore')
module.exports = {
  /**
   * 删除插件
   * dto = {
   *   space: 空间名称,
   *   service: 服务名称,
   *   plugin: 插件名称
   * }
   * @param dto
   */
  deleteService (dto) {
    return new Promise((resolve, reject) => {
      userPluginApi.delete({
        spaceName: dto.space,
        serviceName: dto.service,
        pluginName: dto.plugin
      })
        .then(() => {
          cache.plugins.remove(dto.space, dto.service, dto.plugin)
          resolve()
        })
        .catch(e => {
          reject(e)
        })
    })
  },
  // 获取所有本地插件
  getLocalPlugins () {
    return cache.plugins.getAll()
  },
  // 初始化
  initialize(extConfig) {
    // 获取配置文件路径
    const codespace = extConfig.codespace
    // 读取配置结构
    const config = JSON.parse(JSON.stringify(Const.SERVICE_CONFIG_CONTENT))
    config.translator.output = Const.TRANSLATOR.DEFAULT_OUTPUT_PATH
    const configPath = this.__getConfigPath(codespace)
    // 合并配置
    object.merge(extConfig, config)
    // 如果目标目录本身是一个服务，则直接用原来服务的配置信息，调整名称即可
    if (fs.exists(configPath)) {
      const currentConfig = fs.readJSONFile(configPath)
      object.merge(currentConfig, config)
    }
    // 保留服务名称
    config.name = extConfig.name
    // 初始化服务文件
    fs.createFile(configPath, fs.toJSONFileString(config), true)
    // 添加本地服务记录
    cache.plugins.save({
      space: extConfig.space,
      service: extConfig.service,
      name: extConfig.name,
      repository: extConfig.repository == null ? '' : extConfig.repository,
      codespace: extConfig.codespace
    })
  },
  // 获取插件简要信息
  getProfile(spaceName, serviceName, pluginName) {
    // 读取本地服务配置
    const pluginConfig = cache.plugins.get(spaceName, serviceName, pluginName)
    // 远程获取服务简介
    return pluginApi.fetchProfile({ space: spaceName, service: serviceName, plugin: pluginName })
      .then(data => {
        return {
          ...data,
          // 补充本地配置信息
          local: pluginConfig == null ? null : {
            ...pluginConfig
          }
        }
      })
      .catch(e => {
        return Promise.reject(e)
      })
  },
  // 获取服务配置信息
  getPluginConfig(dto) {
    return serviceConf.getServiceConfig(dto)
  },
  // 保存服务配置信息
  savePluginConfig(dto) {
    const pluginConfig =  this.getPluginConfig({ space: dto.space, service: dto.service, plugin: dto.plugin })
    // 读取配置结构
    const newConfig = JSON.parse(JSON.stringify(Const.SERVICE_CONFIG_CONTENT))
    // 合并配置
    object
      .merge(pluginConfig, newConfig)
      .merge(dto, newConfig)
    // 写入配置文件
    const configPath = this.__getConfigPath(pluginConfig.codespace)
    fs.rewrite(configPath, fs.toJSONFileString(newConfig))
    // 保存服务repository
    if (dto.repository !== undefined) {
      cache.plugins.save({
        space: dto.space,
        service: dto.service,
        name: dto.plugin,
        repository: dto.repository
      })
    }
  },
  // 获取服务文件树
  getFileTree(space, service, plugin) {
    console.log(space, service, plugin)
    const pluginConfig = this.getPluginConfig({ space, service, plugin })
    // 获取文件真实存放的路径
    let fileStoragePath = pluginConfig.codespace
    if (pluginConfig.translator.settings.length > 0) {
      fileStoragePath = path.join(fileStoragePath, pluginConfig.translator.output)
      if (!fs.exists(fileStoragePath)) {
        serviceTranslator.translate({ space, service, plugin })
        return this.__getFileTree(fileStoragePath, fileStoragePath, pluginConfig.codespace)
      }
    }
    return this.__getFileTree(fileStoragePath, fileStoragePath, pluginConfig.codespace)
  },
  // 保存服务文件
  saveFileSetting (fileSettings) {
    const pluginConfig = cache.plugins.get(fileSettings.space, fileSettings.service, fileSettings.plugin)
    const configPath = this.__getConfigPath(pluginConfig.codespace)
    const config = fs.readJSONFile(configPath)
    // 读取配置结构
    let settings = JSON.parse(JSON.stringify(Const.SERVICE_FILE_CONFIG_CONTENT))
    object.merge(fileSettings, settings)
    // 修改path为relativePath
    settings.path = fileSettings.relativePath
    // 如果不存在配置信息，则将新文件配置添加到settings中
    let targetFileSettings = config.settings.find(file => file.path === fileSettings.relativePath)
    if (targetFileSettings == null) {
      config.settings.push(settings)
    }
    // 如果存在文件配置，则使用Object.assign将最新配置写入原配置对象引用中，以实现增加配置项
    else {
      Object.assign(targetFileSettings, settings)
    }
    fs.rewrite(configPath, fs.toJSONFileString(config))
  },
  // 保存变量
  saveVariables (dto) {
    const plugin = cache.plugins.get(dto.space, dto.service, dto.plugin)
    const configPath = this.__getConfigPath(plugin.codespace)
    const config = fs.readJSONFile(configPath)
    config.variables = dto.variables
    fs.rewrite(configPath, fs.toJSONFileString(config))
  },
  // 发布服务版本
  publish(dto) {
    // 获取服务文件
    const pluginConfig = this.getPluginConfig({ space: dto.space, service: dto.service, plugin: dto.plugin })
    let fileStoragePath = pluginConfig.codespace
    // 如果存在翻译器，自动翻译，且服务代码空间指定为翻译代码空间
    if (pluginConfig.translator.settings.length > 0) {
      fileStoragePath = path.join(fileStoragePath, Const.TRANSLATOR.DEFAULT_OUTPUT_PATH)
      serviceTranslator.translate({ space: dto.space, service: dto.service, plugin: dto.plugin })
    }
    // 获取文件
    let files = fs.getFilesWithChildren(fileStoragePath, fileStoragePath)
    // 验证文件数量
    if (files.length > env.limitFiles) {
      return Promise.reject(`The number of files exceeds the limit of ${env.limitFiles}.`)
    }
    files = files.map(fullpath => {
      const filetype = fs.isDirectory(fullpath) ? 'DIRECTORY' : 'FILE'
      const relativePath = fs.getRelativePath(fullpath, fileStoragePath)
      const fileSetting = this.getFileSetting(pluginConfig.codespace, relativePath)
      const fileInfo = filetype === 'DIRECTORY' ? { encode: null, content: null } : fs.readFile(fullpath)
      return {
        filepath: relativePath,
        filetype,
        contentEncode: fileInfo.encode,
        content: fileInfo.content,
        compiler: fileSetting.compiler,
        variables: JSON.stringify(fileSetting.variables),
        enableExpress: fileSetting.enableExpress
      }
    })
    // 执行发布
    const publishParams = {
      space: dto.space,
      service: dto.service,
      plugin: dto.plugin,
      version: pluginConfig.version,
      withPrivate: pluginConfig.private,
      receivable: pluginConfig.receivable,
      prices: pluginConfig.prices,
      compiler: pluginConfig.compiler,
      supportedDatabases: pluginConfig.supportedDatabases.join(','),
      repository: pluginConfig.repository,
      builds: JSON.stringify(pluginConfig.builds),
      unbuilds: JSON.stringify(pluginConfig.unbuilds),
      variables: JSON.stringify(pluginConfig.variables),
      publishDescription: dto.publishDescription,
      introduce: pluginConfig.introduce,
      description: pluginConfig.readme,
      files
    }
    return pluginApi.publish(publishParams)
  },
  // 获取文件设置
  getFileSetting (codespace, fileRelativePath) {
    return serviceFile.getFileSetting(codespace, fileRelativePath)
  },
  // 获取文件配置目录
  __getConfigPath (codespace) {
    return serviceConf.__getConfigPath(codespace)
  },
  /**
   * 获取文件树
   * @param directoryPath 当前查询的目录路径
   * @param fileStoragePath 真实服务代码空间路径（存在翻译器时真实代码空间不是codespace）
   * @param codespace 服务代码空间路径
   */
  __getFileTree (directoryPath, fileStoragePath, codespace) {
    let filePool = []
    const files = fs.getFiles(directoryPath)
    const ignoreInstance = ignore().add(Const.IGNORE_DIRS)
    files.forEach(file => {
      // 忽略文件
      if (ignoreInstance.ignores(file)) {
        return
      }
      const fullpath = path.join(directoryPath, file)
      // 获取文件配置
      const relativePath = fs.getRelativePath(fullpath, fileStoragePath)
      const fileSettings = this.getFileSetting(codespace, relativePath)
      // 构建文件对象
      const isDirectory = fs.isDirectory(fullpath)
      const fileObject = {
        label: file,
        type: isDirectory ? 'DIRECTORY' : 'FILE',
        path: fullpath,
        relativePath,
        compiler: fileSettings.compiler,
        enableExpress: fileSettings.enableExpress,
        variables: fileSettings.variables,
        children: isDirectory ? [] : undefined
      }
      filePool.push(fileObject);
      if (fileObject.type === 'DIRECTORY') {
        fileObject.children = this.__getFileTree(fullpath, fileStoragePath, codespace);
      }
    });
    return filePool
  }
}

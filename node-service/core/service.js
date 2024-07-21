const path = require('path')
const Const = require('./constants/constants')
const cache = require('./utils/cache')
const object = require('./utils/object')
const fs = require('./utils/fs')
const serviceApi = require("./api/service");
const serviceTranslator = require('./service.translator')
const serviceConf = require('./service.config')
const serviceFile = require('./service.file')
const userServiceApi = require('./api/user.service')
const env = require('../env').getConfig()
const ignore = require('ignore')
module.exports = {
  /**
   * 删除服务
   * dto = {
   *   space: 空间名称,
   *   service: 服务名称
   * }
   * @param dto
   */
  deleteService (dto) {
    return new Promise((resolve, reject) => {
      userServiceApi.deleteService({
        id: dto.id
      })
        .then(() => {
          // 删除插件
          if (dto.plugin != null) {
            cache.plugins.remove(dto.space, dto.service, dto.plugin)
          }
          // 删除服务
          else {
            cache.services.remove(dto.space, dto.service)
          }
          resolve()
        })
        .catch(e => {
          reject(e)
        })
    })
  },
  // 获取所有本地服务
  getLocalServices () {
    return [...cache.plugins.getAll(), ...cache.services.getAll()]
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
    cache.services.save({
      space: extConfig.space,
      name: extConfig.name,
      repository: extConfig.repository == null ? '' : extConfig.repository,
      codespace: extConfig.codespace
    })
  },
  // 获取服务简要信息
  getProfile(spaceName, serviceName) {
    // 读取本地服务配置
    const serviceConfig = cache.services.get(spaceName, serviceName)
    // 远程获取服务简介
    return serviceApi.fetchProfile({ spaceName, serviceName })
      .then(data => {
        return {
          ...data,
          // 补充本地配置信息
          local: serviceConfig == null ? null : {
            ...serviceConfig
          }
        }
      })
      .catch(e => {
        return Promise.reject(e)
      })
  },
  // 获取服务配置信息
  getServiceConfig(dto) {
    return serviceConf.getServiceConfig(dto)
  },
  // 保存服务配置信息
  saveServiceConfig(dto) {
    const serviceConfig =  this.getServiceConfig({ space: dto.space, service: dto.service })
    // 读取配置结构
    const newConfig = JSON.parse(JSON.stringify(Const.SERVICE_CONFIG_CONTENT))
    // 合并配置
    object
      .merge(serviceConfig, newConfig)
      .merge(dto, newConfig)
    // 写入配置文件
    const configPath = this.__getConfigPath(serviceConfig.codespace)
    fs.rewrite(configPath, fs.toJSONFileString(newConfig))
    // 保存服务repository
    if (dto.repository !== undefined) {
      cache.services.save({
        space: dto.space,
        name: dto.service,
        repository: dto.repository
      })
    }
  },
  // 获取服务文件树
  getFileTree(space, service) {
    const serviceConfig = this.getServiceConfig({ space, service})
    // 获取文件真实存放的路径
    let fileStoragePath = serviceConfig.codespace
    if (serviceConfig.translator.filepath != null && serviceConfig.translator.filepath !== '') {
      fileStoragePath = path.join(fileStoragePath, serviceConfig.translator.output)
      if (!fs.exists(fileStoragePath)) {
        serviceTranslator.translate({ space, service })
        return this.__getFileTree(fileStoragePath, fileStoragePath, serviceConfig.codespace)
      }
    }
    return this.__getFileTree(fileStoragePath, fileStoragePath, serviceConfig.codespace)
  },
  // 保存服务文件
  saveFileSetting (fileSettings) {
    const serviceConfig = cache.services.get(fileSettings.space, fileSettings.service)
    const configPath = this.__getConfigPath(serviceConfig.codespace)
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
    const service = cache.services.get(dto.space, dto.service)
    const configPath = this.__getConfigPath(service.codespace)
    const config = fs.readJSONFile(configPath)
    config.variables = dto.variables
    fs.rewrite(configPath, fs.toJSONFileString(config))
  },
  // 发布服务版本
  publish(dto) {
    // 获取服务文件
    const serviceConfig = this.getServiceConfig({ space: dto.space, service: dto.service, plugin: dto.plugin })
    let fileStoragePath = serviceConfig.codespace
    // 如果存在翻译器，自动翻译，且服务代码空间指定为翻译代码空间
    if (serviceConfig.translator.filepath != null && serviceConfig.translator.filepath !== '') {
      fileStoragePath = path.join(fileStoragePath, Const.TRANSLATOR.DEFAULT_OUTPUT_PATH)
      serviceTranslator.translate({ space: dto.space, service: dto.service, plugin: dto.plugin })
    }
    // 获取文件
    let files = fs.getFilesWithChildren(fileStoragePath)
    // 验证文件数量
    if (files.length > env.limitFiles) {
      return Promise.reject(`The number of files exceeds the limit of ${env.limitFiles}.`)
    }
    files = files.map(fullpath => {
      const filetype = fs.isDirectory(fullpath) ? 'DIRECTORY' : 'FILE'
      const relativePath = fs.getRelativePath(fullpath, fileStoragePath)
      const fileSetting = this.getFileSetting(serviceConfig.codespace, relativePath)
      const fileInfo = filetype === 'DIRECTORY' ? { encode: null, content: null } : fs.readFile(fullpath)
      return {
        filepath: relativePath,
        filetype,
        contentEncode: fileInfo.encode,
        content: fileInfo.content,
        compiler: fileSetting.compiler,
        variables: JSON.stringify(fileSetting.variables),
        withoutIfNotExists: fileSetting.withoutIfNotExists,
        enableExpress: fileSetting.enableExpress
      }
    })
    // 执行发布
    const publishParams = {
      space: dto.space,
      service: dto.service,
      plugin: dto.plugin,
      label: serviceConfig.label,
      version: serviceConfig.version,
      minServiceVersion: serviceConfig.minServiceVersion,
      withPrivate: serviceConfig.private,
      receivable: serviceConfig.receivable,
      prices: serviceConfig.prices,
      compiler: serviceConfig.compiler,
      supportedDatabases: serviceConfig.supportedDatabases.join(','),
      repository: serviceConfig.repository,
      builds: JSON.stringify(serviceConfig.builds),
      unbuilds: JSON.stringify(serviceConfig.unbuilds),
      variables: JSON.stringify(serviceConfig.variables),
      publishDescription: dto.publishDescription,
      introduce: serviceConfig.introduce,
      description: serviceConfig.readme,
      files
    }
    return serviceApi.publish(publishParams)
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
   * @param parentIgnoreInstance 上级文件忽略实例，用于在当前目录下没有配置.gitignore时使用
   */
  __getFileTree (directoryPath, fileStoragePath, codespace, parentIgnoreInstance = null) {
    let filePool = []
    const files = fs.getFiles(directoryPath)
    /*
    创建ignore实例
    如果当前目录下没有.gitignore文件配置，则以父级的ignore实例作为当前目录的ignore实例
    */
    const ignoreFileConfig = fs.getIgnoreFileConfig(directoryPath)
    let ignoreInstance = parentIgnoreInstance
    if (ignoreInstance == null || ignoreFileConfig.trim() !== '') {
      ignoreInstance = ignore().add(ignoreFileConfig)
    }
    files.forEach(file => {
      const fullpath = path.join(directoryPath, file)
      // 忽略目录，目录需要在路径后增加'/'
      if (fs.isDirectory(fullpath)) {
        if (ignoreInstance.ignores(file + '/')) {
          return
        }
      }
      // 忽略文件
      if (ignoreInstance.ignores(file)) {
        return
      }
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
        fileObject.children = this.__getFileTree(fullpath, fileStoragePath, codespace, ignoreInstance);
      }
    });
    return filePool
  },
  // 获取服务配置
  __getServiceConfig (codespace) {
    return serviceConf.__getServiceConfig(codespace)
  }
}

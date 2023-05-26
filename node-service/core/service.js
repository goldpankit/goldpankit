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
        cache.services.save({
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
    return this.__getFileTree(service.codespace, service.codespace)
  },
  // 保存服务文件
  saveFileSetting (fileSettings) {
    const service = cache.services.get(fileSettings.serviceId)
    const configPath = this.__getConfigPath(service.codespace)
    const config = fs.readJSONFile(configPath)
    // 获取默认配置结构并装载新配置信息（此时settings是最新的文件配置结构和最新的文件配置信息）
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
    const service = cache.services.get(dto.serviceId)
    const configPath = this.__getConfigPath(service.codespace)
    const config = fs.readJSONFile(configPath)
    config.variables = dto.variables
    fs.rewrite(configPath, fs.toJSONFileString(config))
  },
  // 推送服务
  push(serviceId) {
    // 获取服务文件
    const service = cache.services.get(serviceId)
    const files = fs.getFilesWithChildren(service.codespace, service.codespace).map(fullpath => {
      const filetype = fs.isDirectory(fullpath) ? 'DIRECTORY' : 'FILE'
      const relativePath = fullpath.replace(service.codespace + '/', '')
      const fileSetting = this.__getFileSettings(service.codespace, relativePath)
      return {
        serviceId,
        filepath: relativePath,
        filetype,
        contentType: fs.getContentType(fullpath),
        content: filetype === 'DIRECTORY' ? null : fs.readFile(fullpath),
        compiler: fileSetting.compiler,
        variables: JSON.stringify(fileSetting.variables),
        enableExpress: fileSetting.enableExpress
      }
    })
    // 获取服务变量
    const serviceConfig = this.getServiceConfig(serviceId)
    const variables = serviceConfig.variables
    return serviceApi.push({
      serviceId,
      files,
      variables
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
      id: dto.service.id,
      variables: dto.variables
    })
      .then(data => {
        // 写入文件
        fs.writeFiles(data, project.codespace)
        // 获取项目配置
        const configPath = userProject.getConfigPath(projectId)
        let projectConfig = fs.readJSONFile(configPath)
        if (projectConfig == null) {
          projectConfig = JSON.parse(JSON.stringify(Const.PROJECT_CONFIG_FILE_CONTENT))
        }
        // 写入项目配置文件
        if (dto.service.type === 'framework') {
          projectConfig.space = dto.space.name
          projectConfig.framework[dto.service.name] = {
            version: dto.service.version || "",
            variables: this.__getSimpleVariables(dto.variables)
          }
        } else {
          projectConfig.services[dto.service.name] = {
            version: dto.service.version || "",
            variables: this.__getSimpleVariables(dto.variables)
          }
        }
        fs.createFile(userProject.getConfigPath(projectId), fs.toJSONFileString(projectConfig), true)
        return Promise.resolve()
      })
      .catch(e => {
        return Promise.reject(e)
      })
  },
  // 编译服务代码
  compile(dto) {
    // 获取项目信息
    const project = cache.projects.get(dto.projectId)
    if (project == null) {
      throw new Error('Please select a project.')
    }
    // 获取服务信息
    const service = this.getServiceConfig(dto.serviceId)
    return serviceApi.compile({
      defaultCompiler: service.compiler,
      variables: service.variables.map(item => {
        return {
          ...item,
          value: item.defaultValue
        }
      }),
      files: this.__getFileConfigList(dto.serviceId)
    })
      .then(data => {
        // 写入文件
        fs.writeFiles(data, project.codespace)
        return Promise.resolve()
      })
      .catch(e => {
        return Promise.reject(e)
      })
  },
  // 简化变量
  __getSimpleVariables (variables) {
    const vars = {}
    for (const v of variables) {
      vars[v.name] = v.value
    }
    return vars
  },
  // 获取文件配置目录
  __getConfigPath (codespace) {
    return `${codespace}/${Const.SERVICE_CONFIG_DIRECTORY}/${Const.SERVICE_CONFIG_FILE}`
  },
  // 获取文件配置列表
  __getFileConfigList (serviceId) {
    const service = cache.services.get(serviceId)
    const fullpaths = fs.getFilesWithChildren(service.codespace)
    const configs = []
    for (const fullpath of fullpaths) {
      // 获取文件配置
      const relativePath = fullpath.replace(service.codespace + '/', '')
      const fileSettings = this.__getFileSettings(service.codespace, relativePath)
      // 构建文件对象
      const isDirectory = fs.isDirectory(fullpath)
      configs.push({
        filepath: relativePath,
        content: fs.readFile(fullpath),
        enableExpress: fileSettings.enableExpress,
        compiler: fileSettings.compiler,
        filetype: isDirectory ? 'directory' : 'file',
        variables: JSON.stringify(fileSettings.variables)
      })
    }
    return configs
  },
  // 获取文件树
  __getFileTree (absolutePath, codespace) {
    let filePool = []
    const files = fs.getFiles(absolutePath)
    files.forEach(file => {
      const fullpath = path.join(absolutePath, file)
      // 忽略文件
      if (Const.IGNORE_DIRS.findIndex(f => file === f || file.startsWith(`${f}/`)) !== -1) {
        return
      }
      // 获取文件配置
      const relativePath = fullpath.replace(codespace + '/', '')
      const fileSettings = this.__getFileSettings(codespace, relativePath)
      // 构建文件对象
      const isDirectory = fs.isDirectory(fullpath)
      const fileObject = {
        label: file,
        type: isDirectory ? 'directory' : 'file',
        contentType: isDirectory ? undefined : fs.getContentType(fullpath),
        path: fullpath,
        relativePath,
        compiler: fileSettings.compiler,
        enableExpress: fileSettings.enableExpress,
        variables: fileSettings.variables,
        children: isDirectory ? [] : undefined
      }
      filePool.push(fileObject);
      if (fileObject.type === 'directory') {
        fileObject.children = this.__getFileTree(fullpath, codespace);
      }
    });
    return filePool
  },
  // 获取文件设置
  __getFileSettings (codespace, fileRelativePath) {
    const configPath = this.__getConfigPath(codespace)
    const config = fs.readJSONFile(configPath)
    const settings = JSON.parse(JSON.stringify(Const.SERVICE_FILE_CONFIG_CONTENT))
    let targetSettings = config.settings.find(file => file.path === fileRelativePath)
    if (targetSettings != null) {
      object.merge(targetSettings, settings)
    }
    return settings
  }
}

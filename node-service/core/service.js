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
    // 读取配置结构
    const config = JSON.parse(JSON.stringify(Const.SERVICE_CONFIG_CONTENT))
    // 获取配置文件路径
    const codespace = extConfig.codespace
    const configPath = this.__getConfigPath(codespace)
    // 合并配置
    for (const key in config) {
      config[key] = extConfig[key] || config[key]
    }
    // 合并当前服务配置
    if (fs.exists(configPath)) {
      const currentConfig = fs.readJSONFile(configPath)
      config.variables = currentConfig.variables
      config.translator = currentConfig.translator
      config.settings = currentConfig.settings
    }
    // 初始化服务文件
    fs.createFile(configPath, fs.toJSONFileString(config), true)
    // 添加本地服务记录
    cache.services.save({
      space: config.space,
      name: config.name,
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
    if (dto.space != null && dto.service != null) {
      const service = cache.services.get(dto.space, dto.service)
      return this.__getServiceConfig(service.codespace)
    }
    if (dto.codespace != null) {
      return this.__getServiceConfig(dto.codespace)
    }
    return null
  },
  // 获取服务文件树
  getFileTree(space, service) {
    const serviceConfig = cache.services.get(space, service)
    return this.__getFileTree(serviceConfig.codespace, serviceConfig.codespace)
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
  publish(serviceId) {
    // // 获取服务文件
    // const service = cache.services.get(serviceId)
    // const files = fs.getFilesWithChildren(service.codespace, service.codespace).map(fullpath => {
    //   const filetype = fs.isDirectory(fullpath) ? 'DIRECTORY' : 'FILE'
    //   const relativePath = fullpath.replace(service.codespace + '/', '')
    //   const fileSetting = this.__getFileSettings(service.codespace, relativePath)
    //   return {
    //     serviceId,
    //     filepath: relativePath,
    //     filetype,
    //     contentType: fs.getContentType(fullpath),
    //     content: filetype === 'DIRECTORY' ? null : fs.readFile(fullpath),
    //     compiler: fileSetting.compiler,
    //     variables: JSON.stringify(fileSetting.variables),
    //     enableExpress: fileSetting.enableExpress
    //   }
    // })
    // // 获取服务变量
    // const serviceConfig = this.getServiceConfig(serviceId)
    // const variables = serviceConfig.variables
    // return serviceApi.push({
    //   serviceId,
    //   files,
    //   variables
    // })
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
    console.log('dto', dto)
    const serviceConfig = this.getServiceConfig({ space: dto.space, service: dto.service })
    return serviceApi.compile({
      defaultCompiler: serviceConfig.compiler,
      variables: serviceConfig.variables.map(item => {
        return {
          ...item,
          value: item.defaultValue
        }
      }),
      files: this.__getFileConfigList(dto.space, dto.service)
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
  __getFileConfigList (space, service) {
    const serviceConfig = cache.services.get(space, service)
    const fullpaths = fs.getFilesWithChildren(serviceConfig.codespace)
    const configs = []
    for (const fullpath of fullpaths) {
      // 获取文件配置
      const relativePath = fullpath.replace(serviceConfig.codespace + '/', '')
      const fileSettings = this.__getFileSettings(serviceConfig.codespace, relativePath)
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
  },
  // 获取服务配置
  __getServiceConfig (codespace) {
    const configPath = this.__getConfigPath(codespace)
    return fs.readJSONFile(configPath)
  }
}

// 安装服务
const service = require('./service')
const cache = require("./utils/cache");
const serviceApi = require("./api/service");
const fs = require("./utils/fs");
const Const = require("./constants/constants");
const userProject = require("./user.project");
const object = require("./utils/object");
const serviceBuild = require("./service.build");
const mysql = require("./utils/db/mysql");

class Kit {
  constructor() {
  }
  /**
   * 安装服务
   * @param dto = {
   *   projectId: '', // 当前选择的项目ID
   *   database: '', // 当前选择的数据库名称
   *   space: '',
   *   service: '',
   *   version: '',
   *   variables: []
   * }
   * @returns {Promise<void>}
   */
  install (dto) {
    const projectId = dto.projectId
    // 获取项目配置
    const project = cache.projects.get(projectId)
    if (project == null) {
      throw new Error('Please select a project.')
    }
    // 获取数据库信息
    const database = project.databases.find(db => db.name === dto.database)
    // 组装变量
    const variables = this.#getVariables(database, dto.variables)
    console.log('variables', dto.variables)
    return Promise.all(variables)
      .then(vars => {
        console.log('vars', vars)
        return serviceApi.install({
          space: dto.space,
          service: dto.service,
          version: dto.version,
          variables: vars
        })
      })
      .then(data => {
        // 写入文件
        fs.writeFiles(data.files, project.codespace)
        // 获取配置格式
        const config = JSON.parse(JSON.stringify(Const.PROJECT_CONFIG_FILE_CONTENT))
        // 获取项目配置
        const configPath = userProject.getConfigPath(projectId)
        let projectConfig = fs.readJSONFile(configPath)
        if (projectConfig != null) {
          object.merge(projectConfig, config)
        }
        // 写入项目配置文件
        if (data.version.serviceType === 'MAIN') {
          config.space = dto.space
          config.main[dto.service] = {
            version: dto.version,
            variables: this.#getSimpleVariables(dto.variables)
          }
        } else {
          config.services[dto.service] = {
            version: dto.version,
            variables: this.#getSimpleVariables(dto.variables)
          }
        }
        fs.createFile(userProject.getConfigPath(projectId), fs.toJSONFileString(config), true)
        // 执行命令
        const builds = data.version.builds == null || data.version.builds === '' ? [] : JSON.parse(data.version.builds)
        if (builds.length > 0) {
          serviceBuild.build(project, database, builds)
        }
        return Promise.resolve()
      })
      .catch(e => {
        return Promise.reject(e)
      })
  }
  /**
   * 卸载服务
   * @param dto = {
   *   projectId: '', // 当前选择的项目ID
   *   database: '', // 当前选择的数据库名称
   *   space: '',
   *   service: '',
   *   version: '',
   *   variables: []
   * }
   * @returns {Promise<void>}
   */
  uninstall (dto) {
    const projectId = dto.projectId
    const project = cache.projects.get(projectId)
    if (project == null) {
      throw new Error('Please select a project.')
    }
    // 获取数据库信息
    const database = project.databases.find(db => db.name === dto.database)
    // 组装变量
    const variables = this.#getVariables(database, dto.variables)
    return Promise.all(variables)
      .then(vars => {
        return serviceApi.install({
          space: dto.space,
          service: dto.service,
          version: dto.version,
          variables: vars
        })
      })
      .then(data => {
        // 删除文件
        fs.deleteFiles(data.files, project.codespace)
        // 获取项目配置
        const configPath = userProject.getConfigPath(projectId)
        let projectConfig = fs.readJSONFile(configPath)
        // 删除项目配置中服务的配置
        delete projectConfig.services[dto.service]
        // 重新写入项目配置文件中
        fs.createFile(userProject.getConfigPath(projectId), fs.toJSONFileString(projectConfig), true)
        return Promise.resolve()
      })
      .catch(e => {
        return Promise.reject(e)
      })
  }
  /**
   * 编译服务代码
   * @param dto = {
   *   projectId: '', // 当前选择的项目ID
   *   database: '', // 当前选择的数据库名称
   *   space: '',
   *   service: '',
   *   variables: []
   * }
   * @returns {Promise<void>}
   */
  compile(dto) {
    // 获取项目信息
    const project = cache.projects.get(dto.projectId)
    if (project == null) {
      throw new Error('Please select a project.')
    }
    // 获取服务信息
    const serviceConfig = service.getServiceConfig({ space: dto.space, service: dto.service })
    // 获取数据库信息
    const database = project.databases.find(db => db.name === dto.database)
    // 组装变量
    const variables = this.#getVariables(database, serviceConfig.variables, 'defaultValue')
    return Promise.all(variables)
      .then(vars => {
        return serviceApi.compile({
          defaultCompiler: serviceConfig.compiler,
          variables: vars,
          files: this.#getFileConfigList(dto.space, dto.service)
        })
      })
      .then(data => {
        // 写入文件
        fs.writeFiles(data, project.codespace)
        // 执行命令
        if (serviceConfig.builds.length > 0) {
          serviceBuild.build(project, database, serviceConfig.builds)
        }
        return Promise.resolve()
      })
      .catch(e => {
        return Promise.reject(e)
      })
  }

  // 简化变量
  #getSimpleVariables (variables) {
    const vars = {}
    for (const v of variables) {
      vars[v.name] = v.value
    }
    return vars
  }

  // 获取文件配置列表
  #getFileConfigList (space, serviceName) {
    const serviceConfig = cache.services.get(space, serviceName)
    const fullpaths = fs.getFilesWithChildren(serviceConfig.codespace)
    const configs = []
    for (const fullpath of fullpaths) {
      // 获取文件配置
      const relativePath = fullpath.replace(serviceConfig.codespace + '/', '')
      const fileSettings = service.getFileSetting(serviceConfig.codespace, relativePath)
      // 构建文件对象
      const isDirectory = fs.isDirectory(fullpath)
      configs.push({
        filepath: relativePath,
        content: isDirectory ? null : fs.readFile(fullpath),
        enableExpress: fileSettings.enableExpress,
        compiler: fileSettings.compiler,
        filetype: isDirectory ? 'DIRECTORY' : 'FILE',
        variables: JSON.stringify(fileSettings.variables)
      })
    }
    return configs
  }

  // 获取安装/编译变量
  #getVariables (database, variables, valueKey='value') {
    return variables.map(item => {
      return new Promise((resolve, reject) => {
        // 输入类型为表，则查询出表信息
        if (item.inputType === 'table') {
          mysql.getTable({
            host: database.host,
            port: database.port,
            user: database.username,
            password: database.password,
            database: database.schema
          }, item[valueKey])
            .then(table => {
              resolve({
                ...item,
                value: JSON.stringify(table)
              })
            })
            .catch(e => {
              reject(e)
            })
          return
        }
        resolve({
          ...item,
          value: item[valueKey]
        })
      })
    })
  }
}

module.exports = new Kit()

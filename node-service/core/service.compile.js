// 安装服务
const response = require('./constants/response')
const service = require('./service')
const serviceApi = require("./api/service");
const fs = require("./utils/fs");
const Const = require("./constants/constants");
const projectService = require("./project");
const projectDatabase = require("./project.database");
const object = require("./utils/object");
const serviceBuild = require("./service.build");
const mysql = require("./utils/db/mysql");
const serviceTranslator = require('./service.translator')
const path = require('path')
const ignore = require("ignore");
const env = require('../env').getConfig()
const log = require('./utils/log')

class Kit {
  constructor() {
  }
  /**
   * 安装服务或插件
   * @param dto = {
   *   projectId: '', // 当前选择的项目ID
   *   database: '', // 当前选择的数据库名称
   *   space: '',
   *   service: '',
   *   plugin: '',
   *   version: '',
   *   variables: []
   * }
   * @returns {Promise<void>}
   */
  install (dto) {
    const isPlugin = dto.plugin != null
    return new Promise((resolve, reject) => {
      // 验证安装
      const checkResult = this.#checkInstall(dto.projectId, dto.space, dto.service, dto.plugin != null)
      if (checkResult != null) {
        reject(checkResult)
        return
      }
      dto.operaType = 'INSTALL'
      this.#install(dto)
        .then(({ data, project, service, database, variables}) => {
          // 如果项目代码目录不存在，则创建
          if (!fs.exists(project.codespace)) {
            log.debug(`the project code space '${project.codespace}' does not exist and will be created automatically.`)
            fs.createDirectory(project.codespace)
            log.debug(`project code space '${project.codespace}' is created.`)
          }
          // 写入文件
          const diffFiles = fs.writeFiles(data.files, project, service, data.versionPath)
          // 写入配置
          // 获取配置格式
          const config = JSON.parse(JSON.stringify(Const.PROJECT_CONFIG_FILE_CONTENT))
          // 获取项目配置
          let projectConfig = projectService.getProjectConfigById(project.id)
          if (projectConfig != null) {
            object.merge(projectConfig, config)
          }
          // 安装的是服务
          if (!isPlugin) {
            config.name = project.name
            config.space = dto.space
            config.service[dto.service] = {
              version: dto.version,
              variables: this.#getSimpleMainServiceVariables(dto.variables)
            }
            /**
             * 兼容2.0.0之前的services（插件配置列表）
             * 如果是2.0.0之前使用的项目，配置文件中的services用于存放插件配置，而新配置plugins目前为空
             * 此时将services赋值给plugins
             */
            if (projectConfig != null && projectConfig.services != null) {
              config.plugins = projectConfig.services
            }
            log.debug(`sync preset plugins to the project config...`)
            // 补充预置插件安装信息到到plugins中
            for (const presetPlugin of data.presetPlugins) {
              if (config.plugins[presetPlugin.name] == null) {
                log.debug(`  added ${presetPlugin.name}.`)
              } else {
                log.debug(`  updated ${presetPlugin.name}.`)
              }
              config.plugins[presetPlugin.name] = {
                version: presetPlugin.version,
                variables: this.#getSimpleMainServiceVariables(presetPlugin.variables).map(variable => {
                  variable.value = this.#getPresetPluginVariableValue(variable)
                  return variable
                })
              }
            }
            /*
             同步预置插件，预置插件为项目所有已安装的插件（除了带有查询模型和表变量的插件），如果预置插件在项目已安装插件中已不存在，则需要删除配置文件中对该插件的配置
             例如：已安装redis缓存，在做插件升级时，把redis去掉了，并选择了本地缓存插件，则需要删除配置文件中的redis配置
            */
            for (const localPluginName in config.plugins) {
              // 如果已安装的插件不是预置插件，则跳过
              if (!this.#isPresetPlugin(config.plugins[localPluginName])) {
                continue
              }
              // 如果已安装的插件可能是预置插件，则验证在预置插件中是否存在，不存在则删除
              if (data.presetPlugins.find(plugin => plugin.name === localPluginName) == null) {
                log.debug(`  deleted ${localPluginName}.`)
                delete config.plugins[localPluginName]
              }
            }
          }
          // 安装的是插件
          else {
            /**
             * 兼容2.0.0之前的main（服务配置）
             * 如果是2.0.0之前使用的项目，配置文件中的main用于存放服务配置，而新配置service目前为空
             * 此时需要将main赋值给service，services赋值给plugins
             */
            if (projectConfig != null && projectConfig.main != null) {
              config.service = projectConfig.main
            }
            if (projectConfig != null && projectConfig.services != null) {
              config.plugins = projectConfig.services
            }
            config.plugins[dto.plugin] = {
              version: dto.version,
              variables: this.#getSimpleMainServiceVariables(dto.variables)
            }
          }
          log.debug(`write kit.json...`)
          fs.createFile(projectService.getConfigPath(project.id), fs.toJSONFileString(config), true)
          // 写入数据库配置文件
          const dbConfig = projectDatabase.getProjectDatabaseConfigByIdWithDefaultBlankArray(project.id)
          // - 从变量中获取数据库参数
          const databaseVariable = dto.variables.find(v=>v.inputType === 'datasource')
          if (databaseVariable != null && databaseVariable.value != null && databaseVariable.value !== '') {
            // 从全局数据库中找到数据库信息
            const db = projectDatabase.getDatabase(project.id, databaseVariable.value)
            if (db != null) {
              // 如果数据库信息不存在，则添加
              if (dbConfig.find(item => item.id === db.id) == null) {
                dbConfig.push(db)
              }
            }
          }
          log.debug(`write kit.db.json...`)
          fs.createFile(projectDatabase.getDatabaseConfigPath(project.id), fs.toJSONFileString(dbConfig), true)

          // 获取服务的构建详情（也可能是插件的构建详情）
          const builds = data.version.builds == null || data.version.builds === '' ? [] : JSON.parse(data.version.builds)
          const getBuildsDetailsPromises = [serviceBuild
            .getBuildDetails('INSTALL', project, builds, diffFiles, data.version.compiler, variables)]
          // 获取预置插件的构建详情
          for (const presetPlugin of data.presetPlugins) {
            getBuildsDetailsPromises.push(serviceBuild
              .getBuildDetails('INSTALL', project, JSON.parse(presetPlugin.builds), diffFiles, presetPlugin.compiler, presetPlugin.variables))
          }
          // 获取构建详情并返回
          Promise.all(getBuildsDetailsPromises)
            .then(buildsList => {
              // 将服务构建(插件构建)和预置插件构建合并到一个数组中
              const builds = buildsList.flat().map((build, index) => {
                return {
                  ...build,
                  index
                }
              })
              // 返回构建信息
              const result = {
                projectId: project.id,
                dataSourceId: database == null ? null : database.id,
                builds
              }
              resolve({
                diff: {
                  projectId: project.id,
                  diffFiles
                },
                build: result
              })
            })
            .catch(e => {
              reject(e)
            })
        })
        .catch(e => {
          log.error('install throw an exception', e)
          reject(e)
        })
    })
  }
  /**
   * 卸载插件
   */
  uninstall (dto) {
    return new Promise((resolve, reject) => {
      dto.operaType = 'UNINSTALL'
      // 获取项目配置
      const project = projectService.findDetailById(dto.projectId)
      const configPath = projectService.getConfigPath(project.id)
      const projectConfig = fs.readJSONFile(configPath)
      const plugins = projectConfig.services || projectConfig.plugins
      const installedService = plugins[dto.plugin]
      if (installedService == null || installedService.version == null) {
        reject(response.UNINSTALL.PLUGIN_NOT_EXISTS)
        return
      }
      dto.version = installedService.version
      this.#install(dto)
        .then(({ data, project, database, variables}) => {
          // 获取构建详情并返回
          const unbuilds = data.version.unbuilds == null || data.version.unbuilds === '' ? [] : JSON.parse(data.version.unbuilds)
          serviceBuild.getBuildDetails('UNINSTALL', project, unbuilds, data.files, data.version.compiler, variables)
            .then(builds => {
              builds = builds.map((build, index) => {
                return {
                  ...build,
                  index
                }
              })
              // 删除文件
              const diffFiles = fs.deleteFiles(data.files, project)
              // 删除项目配置中服务的配置
              const plugins = projectConfig.services || projectConfig.plugins
              delete plugins[dto.plugin]
              // 重新写入项目配置文件中
              fs.createFile(projectService.getConfigPath(project.id), fs.toJSONFileString(projectConfig), true)
              // 返回构建信息
              const result = {
                projectId: project.id,
                dataSourceId: database == null ? null : database.id,
                builds
              }
              resolve({
                diff: {
                  projectId: project.id,
                  diffFiles
                },
                build: result
              })
            })
            .catch(e => {
              log.error('get builds throw an exception.', e)
              reject(e)
            })
        })
        .catch(e => {
          log.error('uninstall throw an exception.', e)
          reject(e)
        })
    })
  }
  /**
   * 编译服务代码
   */
  compile(dto) {
    return new Promise((resolve, reject) => {
      const checkResult = this.#checkInstall(dto.projectId, dto.space, dto.service, dto.plugin != null)
      if (checkResult != null) {
        reject(checkResult)
        return
      }
      this.#compile(dto)
        .then(data => {
          try {
            // 写入文件
            const diffFiles = fs.writeFiles(data.files, data.project)
            // 获取服务的构建详情（也可能是插件的构建详情）
            const getBuildsDetailsPromises = [serviceBuild
              .getBuildDetails('COMPILE', data.project, data.serviceConfig.builds, diffFiles, data.serviceConfig.compiler, data.variables)]
            // 获取预置插件的构建详情
            for (const presetPlugin of data.presetPlugins) {
              getBuildsDetailsPromises.push(serviceBuild
                .getBuildDetails('COMPILE', data.project, JSON.parse(presetPlugin.builds), diffFiles, presetPlugin.compiler, presetPlugin.variables))
            }
            Promise.all(getBuildsDetailsPromises)
              .then(buildsList => {
                // 将服务构建(插件构建)和预置插件构建合并到一个数组中
                const builds = buildsList.flat().map((build, index) => {
                  return {
                    ...build,
                    index
                  }
                })
                // 返回构建信息
                const result = {
                  projectId: data.project.id,
                  dataSourceId: data.database == null ? null : data.database.id,
                  builds
                }
                resolve({
                  diff: {
                    projectId: data.project.id,
                    diffFiles
                  },
                  build: result
                })
              })
              .catch(e => {
                reject(e)
              })
          } catch (e) {
            log.error('compiled successfully, but write files throw an exception.', e)
            reject(e)
          }
        })
        .catch(e => {
          log.error('compile throw an exception.', e)
          reject(e)
        })
    })
  }

  /**
   * 清空编译代码
   */
  cleanCompile(dto) {
    return new Promise((resolve, reject) => {
      this.#compile(dto)
        .then(data => {
          // 获取服务的构建详情（也可能是插件的构建详情）
          const getBuildsDetailsPromises = [serviceBuild
            .getBuildDetails('CLEAN_COMPILE', data.project, data.serviceConfig.unbuilds, data.files, data.serviceConfig.compiler, data.variables)]
          // 获取预置插件的构建详情
          for (const presetPlugin of data.presetPlugins) {
            getBuildsDetailsPromises.push(serviceBuild
              .getBuildDetails('CLEAN_COMPILE', data.project, JSON.parse(presetPlugin.unbuilds), data.files, presetPlugin.compiler, presetPlugin.variables))
          }
          // 获取构建详情并返回
          Promise.all(getBuildsDetailsPromises)
            .then(buildsList => {
              // 将服务构建(插件构建)和预置插件构建合并到一个数组中
              const builds = buildsList.flat().map((build, index) => {
                return {
                  ...build,
                  index
                }
              })
              // 删除文件
              const diffFiles = fs.deleteFiles(data.files, data.project)
              // 返回构建信息
              const result = {
                projectId: data.project.id,
                dataSourceId: data.database == null ? null : data.database.id,
                builds
              }
              resolve({
                diff: {
                  projectId: data.project.id,
                  diffFiles
                },
                build: result
              })
            })
            .catch(e => {
              reject(e)
            })
        })
        .catch(e => {
          log.error('compile throw an exception.', e)
          reject(e)
        })
    })
  }

  /**
   * 检查安装
   * @param projectId 安装的目标项目ID
   * @param space 需安装的服务空间名称
   * @param service 需安装的服务名称
   * @param isPlugin 安装的是否为插件
   */
  #checkInstall (projectId, space, service, isPlugin) {
    const project = projectService.findDetailById(projectId)
    // 插件
    if (isPlugin) {
      // 项目中必须已安装服务
      const projectService = project.service == null ? {} : project.service
      if (projectService[service] == null) {
        return '当前所选项目中没有该插件对应的服务，请安装服务后重试！'
      }
      return
    }
    // 服务
    if (project == null) {
      return response.INSTALL.MISSING_PROJECT
    }
    // - 允许没有安装过任何服务
    const serviceObject = project.main || project.service
    if (serviceObject === undefined) {
      return
    }
    // - 验证当前项目是否安装了别的主服务，如果是，则做出提醒
    if (project.space !== space || (serviceObject != null && serviceObject[service] == null)) {
      return response.INSTALL.PROJECT_NOT_ALLOWED
    }
  }

  /**
   * 编译服务
   * @param dto = {
   *   projectId: '', // 当前选择的项目ID
   *   database: '', // 当前选择的数据库名称
   *   space: '',
   *   service: '',
   *   plugin: '', // 如果存在，则为编译插件
   *   variables: []
   * }
   */
  #compile(dto) {
    return new Promise((resolve, reject) => {
      try {
        // 获取项目信息
        const project = projectService.findDetailById(dto.projectId)
        if (project == null) {
          reject(new Error('请选择代码编译后输出的目标项目！'))
          return
        }
        // 获取项目安装的服务
        let projectInstallService = null
        if (project.service != null) {
          projectInstallService = project.service[dto.service]
        }
        // 获取项目已安装的插件
        let installedPlugins = []
        if (project.plugins != null) {
          for (const pluginName in project.plugins) {
            installedPlugins.push({ name: pluginName })
          }
        }
        // 获取服务信息
        const serviceConfig = service.getServiceConfig({space: dto.space, service: dto.service, plugin: dto.plugin})
        // 如果存在翻译器，则先进行翻译
        if (serviceConfig.translator != null) {
          serviceTranslator.translate({
            space: dto.space,
            service: dto.service,
            plugin: dto.plugin
          })
        }
        // 获取文件列表
        const files = this.#getFileConfigList(dto.space, dto.service, dto.plugin)
        if (files.length > env.limitFiles) {
          return reject(`编译失败，代码文件不能超过${env.limitFiles}个！`)
        }
        // 获取数据库信息
        const database = projectDatabase.getDatabase(project.id, dto.database)
        // 组装变量
        const variables = this.#getVariables(project, database, dto.variables)
        Promise.all(variables)
          .then(vars => {
            serviceApi.compile({
              space: dto.space,
              service: dto.service,
              // 服务的主版本号，用于自动编译预置插件时根据主版本号查询最新的预置插件版本（v2.11.0增加）
              majorVersion: serviceConfig.version.split('.')[0],
              projectServiceVersion: projectInstallService == null ? null : projectInstallService.version,
              minServiceVersion: serviceConfig.minServiceVersion,
              defaultCompiler: serviceConfig.compiler,
              // 服务预置的插件，用于编译时自动编译预置插件（只有编译服务时才传递）（v2.11.0增加）
              presetPlugins: dto.plugin == null ? serviceConfig.presetPlugins : [],
              // 已安装的插件，用于获取框架插件安装情况（v2.11.0增加）
              installedPlugins,
              variables: vars,
              files
            })
              .then(data => {
                resolve({
                  files: data.files,
                  presetPlugins: data.presetPlugins,
                  project,
                  database,
                  serviceConfig,
                  variables: vars,
                })
              })
              .catch(e => {
                reject(e)
              })
          })
          .catch(e => {
            reject(e)
          })
      } catch (e) {
        reject(e)
      }
    })
  }

  /**
   * 安装服务
   * @param dto = {
   *   projectId: '', // 当前选择的项目ID
   *   database: '', // 当前选择的数据库名称
   *   space: '',
   *   service: '',
   *   plugin: '', // 如果存在则为安装插件
   *   version: '',
   *   variables: []
   * }
   * @returns {Promise<void>}
   */
  #install (dto) {
    try {
      const projectId = dto.projectId
      const project = projectService.findDetailById(projectId)
      const isPlugin = dto.plugin != null
      if (project == null) {
        return Promise.reject(response.INSTALL.MISSING_PROJECT)
      }
      // 获取项目安装的服务配置
      let projectInstallService = null
      // - 首次安装时，项目中没有服务配置
      if (project.service != null) {
        if (project.service[dto.service] == null) {
          return Promise.reject(response.INSTALL.PROJECT_NOT_ALLOWED)
        }
        projectInstallService = project.service[dto.service]
      }
      if (isPlugin) {
        log.debug(`ready to install plugin: ${dto.plugin}`)
      } else {
        log.debug(`ready to install service: ${dto.service}`)
      }
      // 获取数据库信息
      const database = projectDatabase.getDatabase(projectId, dto.database)
      // 组装变量
      const variables = this.#getVariables(project, database, dto.variables, dto.plugin != null)
      let serviceVars = null
      // 获取预置插件
      const presetPlugins = dto.plugin == null ? dto.plugins : []
      // 获取项目已安装的插件
      let installedPlugins = []
      if (project.plugins != null) {
        for (const pluginName in project.plugins) {
          installedPlugins.push({ name: pluginName })
        }
      }
      /*
       重置已安装插件
       服务：已安装插件 = 预置插件
       插件：已安装插件 = 项目已安装的插件
      */
      installedPlugins = isPlugin ? installedPlugins : presetPlugins
      // debug
      if (!isPlugin) {
        log.debug(`service preset plugins：${JSON.stringify(presetPlugins, null, 2)}`)
        log.debug(`project installed plugins：${JSON.stringify(installedPlugins, null, 2)}`)
      } else {
        log.debug(`project installed plugins：${JSON.stringify(installedPlugins, null, 2)}`)
      }
      return Promise.all(variables)
        .then(vars => {
          serviceVars = vars
          // 执行安装
          return serviceApi.install({
            space: dto.space,
            // 安装的服务或者插件
            service: dto.service,
            plugin: dto.plugin,
            version: dto.version,
            // 项目使用的服务版本，安装服务时应该为null
            projectServiceVersion: projectInstallService == null ? null : projectInstallService.version,
            // 服务预置的插件，用于编译时自动编译预置插件（只有编译服务时才传递）（v2.11.0增加）
            plugins: presetPlugins,
            /*
             已安装的插件，用于获取框架插件安装情况（v2.11.0增加）
             服务：如果是安装服务，则已安装插件为预置插件
             插件：如果是安装插件，则已安装插件为服务中已安装的插件
            */
            installedPlugins,
            operaType: dto.operaType,
            variables: vars
          })
        })
        .then(data => {
          return Promise.resolve({
            data,
            service: dto.plugin == null ? dto.service : dto.plugin,
            project,
            database,
            variables: serviceVars
          })
        })
        .catch(e => {
          return Promise.reject(e)
        })
    } catch (e) {
      return Promise.reject(e)
    }
  }

  /**
   * 判断插件是否可以是预置插件
   *
   * @param pluginConfig 插件配置
   */
  #isPresetPlugin (pluginConfig) {
    if (pluginConfig == null) {
      return false
    }
    const variables = pluginConfig.variables == null ? [] : pluginConfig.variables
    for (const variable of variables) {
      if (variable.inputType === 'table') {
        return false
      }
      if (variable.inputType === 'query_model') {
        return false
      }
    }
    return true
  }

  // 获取主服务简化变量
  #getSimpleMainServiceVariables (variables) {
    return variables.map(v => {
      return {
        name: v.name,
        // 用于在初始化工作台时，获取到数据库变量，从而初始化选中项目数据库
        inputType: v.inputType,
        value: this.#getInstallVariableValue(v)
      }
    })
  }

  // 获取简化变量
  #getInstallVariableValue (variable) {
      // 变量组
      if (variable.type === 'group') {
        const installVariables = {}
        variable.children.forEach(v => {
          installVariables[v.name] = this.#getInstallVariableValue(v)
        })
        return installVariables
      }
      /**
       * 表和查询模型
       * 表和查询模型需要记录字段变量的内容，以实现初始化，存储结构为
       * {
       *   value: 选中的表或模型,
       *   settings: {
       *     字段变量组1如查询字段queryFields: [选中的字段和字段变量值信息],
       *     字段变量组2如列表字段tableFields: [选中的字段和字段变量值信息]
       *   }
       * }
       */
      if (variable.inputType === 'table' || variable.inputType === 'query_model') {
        const settings = {}
        if (variable.children != null && variable.children.length > 0) {
          variable.children.map(group => {
            settings[group.name] = group.value.map(selectedField => {
              return {
                ...selectedField,
                // 清空非必要字段
                // - type无需保存
                type: undefined,
                // - 字段会有origin，表示原始字段信息
                origin: undefined,
                // - 模型中的字段会有table，不能清空，否则无法标记出字段属于哪张表
                // table: undefined,
                // - visible用于在SQL窗口中控制是否展示，此处需要优化，这个字段压根就不应该传过来，会导致字段中存在visible变量时被清空
                visible: undefined
              }
            })
          })
        }
        return {
          value: variable.value,
          settings
        }
      }
      return variable.value
  }

  // 获取预置插件的简化变量值（预置插件的变量值是完整的变量数据，因为是从后端返回的，后端需要完整的变量数据）
  #getPresetPluginVariableValue (variable) {
    // 数据库，直接返回库ID
    if (variable.inputType === 'datasource') {
      return variable.value == null ? null : variable.value.id
    }
    return variable.value
  }

  // 获取文件配置列表
  #getFileConfigList (space, serviceName, plugin) {
    const serviceConfig = service.getServiceConfig({ space: space, service: serviceName, plugin: plugin})
    // 获取文件真实存放的路径
    let fileStoragePath = serviceConfig.codespace
    if ((serviceConfig.translator.filepath != null && serviceConfig.translator.filepath !== '') ||
      (serviceConfig.translator.content != null && serviceConfig.translator.content !== '')) {
      fileStoragePath = path.join(fileStoragePath, serviceConfig.translator.output)
      if (!fs.exists(fileStoragePath)) {
        fs.createDirectory(fileStoragePath, true)
      }
    }
    const fullpaths = fs.getFilesWithChildren(fileStoragePath)
    const configs = []
    for (const fullpath of fullpaths) {
      // 获取文件配置
      const relativePath = fs.getRelativePath(fullpath, fileStoragePath)
      const fileSettings = service.getFileSetting(serviceConfig.codespace, relativePath)
      // 构建文件对象
      const isDirectory = fs.isDirectory(fullpath)
      const fileInfo = isDirectory ? { encode: null, content: null } : fs.readFile(fullpath)
      configs.push({
        filepath: relativePath,
        content: fileInfo.content,
        contentEncode: fileInfo.encode,
        enableExpress: fileSettings.enableExpress,
        withoutIfNotExists: fileSettings.withoutIfNotExists,
        compiler: fileSettings.compiler,
        filetype: isDirectory ? 'DIRECTORY' : 'FILE',
        variables: JSON.stringify(fileSettings.variables)
      })
    }
    return configs
  }

  // 获取安装/编译变量
  #getVariables (project, database, variables, withMainServiceVariables = true) {
    // 补充服务变量
    if (withMainServiceVariables) {
      const projectConfig = fs.readJSONFile(projectService.__getConfigPath(project.codespace))
      // 获取安装的服务配置
      let service = null
      if (projectConfig != null) {
        service = projectConfig.service || projectConfig.main
      }
      if (service != null) {
        let serviceName = null
        for (const name in service) {
          serviceName = name
          break
        }
        // 将项目主服务的变量添加到最前
        const serviceVariables = service[serviceName].variables.reverse()
        for (const variable of serviceVariables) {
          // group,table和query_model安装存储的变量结构与生成时所需的结构不一样，暂不做支持
          if (variable.type === 'group' || variable.inputType === 'table' || variable.inputType === 'query_model') {
            continue
          }
          variables.unshift(variable)
        }
      }
    }
    // 扩展变量
    const extVariables = []
    return variables.map(variable => {
      return new Promise(async (resolve, reject) => {
        try {
          // 如果类型为数据源，则查询出库信息
          if (variable.inputType === 'datasource') {
            const databaseId = variable.value === undefined ?  variable.defaultValue : variable.value
            const database = projectDatabase.getDatabase(project.id, databaseId)
            resolve({
              ...variable,
              value: database
            })
            return
          }
          // 输入类型为表，则查询出表信息
          if (variable.inputType === 'table') {
            const tableName = variable.value === undefined ? variable.defaultValue : variable.value
            if (database == null || tableName == null || tableName === '') {
              resolve({
                ...variable,
                value: null
              })
              return
            }
            mysql.getTable({
              host: database.host,
              port: database.port,
              user: database.username,
              password: database.password,
              database: database.schema
            }, variable.value === undefined ? variable.defaultValue : variable.value)
              .then(value => {
                console.log('value', value)
                // 补充动态字段，children为字段变量组
                if (variable.children != null && variable.children.length > 0) {
                  this.#paddingFieldVariablesWithResolve(project, database, variable, value, null, null, null, resolve, reject)
                  return
                }
                resolve({
                  ...variable,
                  value
                })
              })
              .catch(e => {
                reject(e)
              })
            return
          }
          // 如果类型为查询模型，则查询出模型信息
          if (variable.inputType === 'query_model') {
            // 获取模型ID，如果为编译代码，value为undefined
            const modelId = variable.value === undefined ? variable.defaultValue : variable.value
            if (modelId == null || modelId === '') {
              resolve({
                ...variable,
                value: null
              })
              return
            }
            // 从数据库中获取模型对象
            const model = database.models.find(m => m.id === modelId)
            if (model == null) {
              return reject(`「${variable.label}」参数错误，找不到查询模型！`)
            }
            if (model.tables == null) {
              log.error(`missing field 'tables', please check the query model on the 'kit.db.json' for Model ID = '${modelId}'.`)
              return reject(`「${variable.label}」参数错误，模型缺少关联表！`)
            }
            // 获取数据库表（没有时会连接数据库）
            let tables = database.tables
            if (tables == null) {
              tables = await mysql.getTables({
                host: database.host,
                port: database.port,
                user: database.username,
                password: database.password,
                database: database.schema
              }, true)
              database.tables = tables
            }
            /*
            补充模型中的tables信息
            模型中的表信息结构为{id, name, alias, type, fields, x, y}，其中fields的结构为[{ name, alias, visible? }]，在编译代码时需要完整的字段信息，所以需要补充字段信息
            */
            model.tables = model.tables.map(simpleTable => {
              // 在数据库表中未找到模型中的表
              const tableDetail = tables.find(t => t.name === simpleTable.name)
              if (tableDetail == null) {
                return null
              }
              return {
                id: simpleTable.id,
                type: simpleTable.type,
                name: tableDetail.name,
                alias: simpleTable.alias,
                comment: tableDetail.comment,
                fields: tableDetail.fields.map(fieldDetail => {
                  // 从模型中获取当前字段（获取不到时，说明数据库中当前表新增了字段）
                  const simpleField = simpleTable.fields.find(f => f.name === fieldDetail.name)
                  return {
                    ...fieldDetail,
                    // 标记为非虚拟字段（此字段暂不可缺少）
                    isVirtual: false,
                    // 为字段补充别名，默认为（表别名_字段名）
                    alias: simpleField == null ? `${simpleTable.alias}_${fieldDetail.name}` : simpleField.alias
                  }
                })
              }
            })
            // 如果模型中存在数据库不存在的表，作出提示
            if (model.tables.filter(t => t == null).length > 0) {
              return reject(`「${variable.label}」参数所使用的「${model.name}」模型中包含了已被移除的数据库表，请确认模型是否正确！`)
            }
            // 找到主表
            const mainTable = model.tables.find(t => t.type === 'MAIN')
            if (mainTable == null) {
              return reject(`「${variable.label}」参数所使用的「${model.name}」模型中缺少主表，请确认模型是否正确！`)
            }
            // 找到所有的子表
            const subTables = model.tables.filter(t => t.type !== 'MAIN')
            // 补充并修复join信息（即补充join的表信息和字段信息，修复join的table和targetTable，让targetTable始终为被关联的表）
            const joins = this.#getPaddingAndRepairedJoins(model, mainTable, model.joins)
            const value = {
              name: model.name,
              comment: model.comment,
              mainTable,
              subTables,
              // join关联
              joins,
              // SQL语句
              statement: this.#getQueryModelStatement(variable, model, mainTable, joins)
            }
            // 处理字段变量
            if (variable.children != null && variable.children.length > 0) {
              this.#paddingFieldVariablesWithResolve(project, database, variable, value, model, mainTable, joins, resolve, reject)
              return
            }
            resolve({
              ...variable,
              value
            })
            return
          }
          // 如果为服务变量组，则修改子变量值
          if (variable.type === 'group') {
            Promise.all(this.#getVariables(project, database, variable.children, false))
              .then(vars => {
                resolve({
                  ...variable,
                  children: vars
                })
              })
              .catch(e => {
                reject(e)
              })
            return
          }
          // 如果输入类型为select，扩展出Settings选项设置变量
          if (variable.inputType === 'select') {
            const value = variable.value === undefined ? variable.defaultValue : variable.value
            extVariables.push({
              name: `${variable.name}Settings`,
              type: 'ext', // 标记为扩展变量
              value: value.settings
            })
            // select的存储结构为{value: null, settings: {}}，所以value最终为value.value
            resolve({
              ...variable,
              value: value.value
            })
            return
          }
          // 其他
          resolve({
            ...variable,
            value: variable.value === undefined ? variable.defaultValue : variable.value
          })
        } catch (e) {
          reject(e)
        }
      })
    }).concat(extVariables)
  }

  /**
   * 获取补充并修复后的joins关系
   * 补充：补充join的table和targetTable为具体的表信息；补充on中的table、targetTable、field、targetField为具体的表或字段信息
   * 修复：使得join.targetTable一直为被关联的表，且targetTable在已修复的joins中不可重复（注意这里的重复指的是table.id不重复，使得可以关联多张相同的表）
   * e.g A.a1 => B.b1, B.b2 => C.c1，此时应得到joins为[{ table:A, targetTable:B }, {table: B, targetTable: C}]，可的语句为JOIN B, JOIN C
   * @returns {*}
   */
  #getPaddingAndRepairedJoins (model, mainTable, joins) {
    // 已修复的join
    let repairedJoins = []
    /*
    如果joins中没有主表，则视为没有关联关系
    e.g 存在主表M1，子表S1和S2，S1和S2建立了关联关系，但并没有与M1建立关联关系，此时不产生SQL语句。因为SQL语句展示的是当前表的关联关系
    */
    if (!joins.find(join => join.table === mainTable.id || join.targetTable === mainTable.id)) {
      return []
    }
    for (const join of joins) {
      // 此处只需复制join的引用，需要保留join内部对象的引用，避免表和字段发生变化时未能及时修改join中的信息
      const copyJoin = { ...join }
      copyJoin.table = model.tables.find(t => t.id === join.table)
      copyJoin.targetTable = model.tables.find(t => t.id === join.targetTable)
      // 主表关联了子表，不做处理
      if (copyJoin.table.id === mainTable.id) {
        repairedJoins.push(copyJoin)
        continue
      }
      // 子表关联了主表，则targetTable为主表，则将table作为targetTable（此时table为子表）
      if (copyJoin.targetTable.id === mainTable.id) {
        const targetTable = copyJoin.table
        copyJoin.table = copyJoin.targetTable
        copyJoin.targetTable = targetTable
        repairedJoins.push(copyJoin)
        continue
      }
      // 子表关联了子表，则判断已修复的joins中，是否存在当前targetTable，如果存在，则将table作为targetTable
      const existJoin = repairedJoins.find(join => join.targetTable.id === copyJoin.targetTable.id)
      if (existJoin) {
        const targetTable = copyJoin.table
        copyJoin.table = copyJoin.targetTable
        copyJoin.targetTable = targetTable
      }
      repairedJoins.push(copyJoin)
    }
    // 为join中的on补充表和字段信息
    repairedJoins = repairedJoins.map(join => {
      join.ons = join.ons.map(on => {
        // 找到on的关联表和被关联表
        const onTable = model.tables.find(t => t.id === on.table)
        const onTargetTable = model.tables.find(t => t.id === on.targetTable)
        if (onTable == null || onTargetTable == null) {
          return null
        }
        // 找到on的关联字段和被关联字段
        const field = onTable.fields.find(f => f.name === on.field)
        const targetField = onTargetTable.fields.find(f => f.name === on.targetField)
        if (field == null || targetField == null) {
          return null
        }
        // 添加字段信息
        return {
          ...on,
          table: onTable,
          targetTable: onTargetTable,
          field,
          targetField
        }
      })
      // 过滤掉无效的on
      join.ons = join.ons.filter(on => on != null)
      // 如果没有有效的on，则返回null
      if (join.ons.length === 0) {
        return null
      }
      return join
    })
    // 过滤掉无效的join
    repairedJoins = repairedJoins.filter(join => join != null)
    return repairedJoins
  }

  /**
   * 处理字段变量
   * 输入类型为select的字段变量处理
   *   输入类型为select的字段变量，得到的value格式为{value: null, settings: {}}
   *   所以需要修改字段值为value.value，并且为字段增加xxxSettings为value.settings
   * e.g
   * 根变量：table 表
   *   字段变量组: 查询条件 queryFields
   *     变量1: 输入类型 inputType（输入类型为select）
   * 查询条件选择某个字段，那么这个字段会有inputType，数据结构如下
   * {
   *   name: 'table',
   *   defaultValue: '已选的表名',
   *   children: [ // 字段变量组
   *     {
   *       name: 'queryFields',
   *       defaultValue: [ // 已选的字段
   *         // 调整前
   *         { ... 已选字段信息1, inputType: { value: 'input', settings: {maxlength: 10} }},
   *         // 调整后
   *         { ... 已选字段信息1, inputType: 'input', inputTypeSettings: {maxlength: 10} }
   *       ]
   *     }
   *   ]
   * }
   */
  #paddingFieldVariablesWithResolve (project, database, variable, value, model, mainTable, joins, resolve, reject) {
    const groupPromises = []
    if (variable.children != null && variable.children.length > 0) {
      for (const group of variable.children) {
        let selectedFields = group.value === undefined ? group.defaultValue : group.value
        // 如果查询模型不为空，说明是为模型补充动态变量组信息，此处用于过滤掉不存在的字段
        if (model != null) {
          selectedFields = selectedFields
            .map(selectedField => {
              // 获取到字段所在的表信息
              const fieldTable = model.tables.find(t => t.id === selectedField.table.id)
              // 获取在数据库中对应的字段信息
              const dbField = fieldTable.fields.find(f => f.name === selectedField.name)
              // 如果表中该字段已被移除，则不做处理
              if (dbField == null) {
                return null
              }
              // 字段的表一定存在于主表或joins表中，如果不存在，说明join已失效，那么对应的字段也需要失效
              if (
                fieldTable.id !== mainTable.id && // 不是主表
                joins.find(join => join.table.id === fieldTable.id || join.targetTable.id === fieldTable.id) == null // 也不是joins中的表
              ) {
                return null
              }
              // 在使用配置文件中的参数时，字段中是不含有type属性的，此处需要补充。
              // 此处还存在引用问题，不可修改selectedField的引用（字段均不要修改引用）
              selectedField.type = dbField.type
              return selectedField
            })
            .filter(field => field != null)
        }
        // 否则是为表补充动态变量组信息，此处用于过滤掉不存在的字段
        else {
          const tableFields = value.fields
          // 过滤掉已被删除的字段
          selectedFields = selectedFields
            .map(selectedField => {
              // 获取数据库表中对应的字段
              const dbField = tableFields.find(f => f.name === selectedField.name)
              if (dbField == null) {
                return null
              }
              // 在使用配置文件中的参数时，字段中是不含有type属性的，此处需要补充。
              // 此处还存在引用问题，不可修改selectedField的引用（字段均不要修改引用）
              selectedField.type = dbField.type
              return selectedField
            })
            .filter(field => field != null)
        }
        value[group.name] = selectedFields
        // group.children为字段变量组中的变量设定（例如查询条件queryFields中的字段定义）
        groupPromises.push(Promise.all(this.#getVariables(project, database, group.children, false))
          .then(vars => {
            group.children = vars
            return Promise.resolve(group)
          })
          .catch(e => {
            return Promise.reject(e)
          })
        )
      }
    }
    Promise.all(groupPromises)
      .then(groups => {
        for (const group of groups) {
          /**
           * 输入类型为select的字段变量处理
           *   输入类型为select的字段变量，得到的value格式为{value: null, settings: {}}
           *   所以需要修改字段值为value.value，并且为字段增加xxxSettings为value.settings
           */
          for (const groupVariable of group.children) {
            if (groupVariable.inputType !== 'select') {
              continue
            }
            for (const field of value[group.name]) {
              const varValue = field[groupVariable.name]
              field[groupVariable.name] = varValue.value
              field[`${groupVariable.name}Settings`] = varValue.settings
            }
          }
          /**
           * 补充字段信息
           * 所有字段增加sql，表示字段的sql语句
           * 对于虚拟字段，补充聚合信息
           */
          if (model != null) {
            const tables = [value.mainTable, ...value.subTables]
            for (const field of value[group.name]) {
              /**
               * 非虚拟字段
               */
              if (!field.isVirtual) {
                let aliasSql = ` AS \`${field.alias}\``
                if (field.name === field.alias) {
                  aliasSql = ''
                }
                field.statements = `\`${field.name}\`${aliasSql}`
                continue
              }
              /**
               * 为字段补充SQL语句
               * 拿到聚合信息。。。。
               */
              const agg = model.aggregates.find(agg => agg.field === field.name)
              if (agg != null) {
                const targetTable = tables.find(t => t.id === agg.targetTable)
                const targetField = targetTable.fields.find(f => f.name === agg.targetField)
                // 补充聚合信息
                field.aggregate = {
                  table: targetTable,
                  field: targetField,
                  function: agg.function
                }
                // 补充字段SQL
                field.statements = this.#getAggregateSQL(field, field.aggregate, model.joins)
              }
            }
          }
          resolve({
            ...variable,
            value
          })
        }
      })
      .catch(e => {
        reject(e)
      })
  }

  /**
   * 获取模型语句
   * @param variable 模型变量
   * @param model 模型信息
   * @param mainTable 主表
   * @param joins join关系列表
   */
  #getQueryModelStatement (variable, model, mainTable, joins) {
    let tableAlias = ` \`${mainTable.alias}\``
    if (mainTable.alias === mainTable.name) {
      tableAlias = ''
    }
    const statement = {
      from: `FROM \`${mainTable.name}\`${tableAlias}`,
      joins: this.#getJoinSQL(mainTable, joins, ''),
    }
    // 虚拟表from语句为空
    if (mainTable.isVirtual) {
      statement.from = null
    }
    // 动态添加字段变量组语句，例如queryFields，则可以通过queryModel.statement.queryFields来获得字段语句列表
    if (variable.children != null && variable.children.length > 0) {
      for (const group of variable.children) {
        statement[group.name] = []
        // 获取变量组已选中的字段
        const selectedFields = group.value === undefined ? group.defaultValue : group.value
        for (let i = 0; i < selectedFields.length; i++) {
          const field = selectedFields[i]
          // 非虚拟字段
          if (!field.isVirtual) {
            // 获取到字段所在的表信息
            const fieldTable = model.tables.find(t => t.id === field.table.id)
            // 如果表中该字段已被移除，则不做处理
            if (fieldTable.fields.find(f => f.name === field.name) == null) {
              continue
            }
            // 字段的表一定存在于主表或joins表中，如果不存在，说明join已失效，那么对应的字段也需要失效
            if (
              fieldTable.id !== mainTable.id && // 不是主表
              joins.find(join => join.table.id === fieldTable.id || join.targetTable.id === fieldTable.id) == null // 也不是joins中的表
            ) {
              continue
            }
            // 生成字段别名
            let aliasSql = ` AS \`${field.alias}\``
            if (field.name === field.alias) {
              aliasSql = ''
            }
            let sql = `\`${field.table.alias}\`.\`${field.name}\`${aliasSql}`
            if (i < selectedFields.length - 1) {
              sql += ','
            }
            statement[group.name].push(sql)
            continue
          }
          // 虚拟字段
          let agg = model.aggregates.find(agg => agg.field === field.name)
          // - 没有聚合信息
          if (agg == null) {
            let sql = `\`${field.table.alias}\`.\`${field.name}\` AS \`${field.alias}\``
            if (i < selectedFields.length - 1) {
              sql += ','
            }
            statement[group.name].push(sql)
            continue
          }
          // - 存在聚合信息
          const targetTable = model.tables.find(t => t.id === agg.targetTable)
          const targetField = targetTable.fields.find(f => f.name === agg.targetField)
          agg = {
            table: targetTable,
            field: targetField,
            function: agg.function
          }
          const lines = this.#getAggregateSQL(field, agg, joins)
          if (i < selectedFields.length - 1) {
            lines[lines.length - 1] += ','
          }
          statement[group.name] = statement[group.name].concat(lines)
        }
      }
    }
    return statement
  }

  /**
   * 获取聚合语句
   * @param field 聚合字段（虚拟字段）
   * @param aggregate 聚合信息
   * @param joins 模型joins
   * @returns {*[]}
   */
  #getAggregateSQL (field, aggregate, joins) {
    let sqlLines = []
    sqlLines.push('(')
    sqlLines.push(`  SELECT`)
    sqlLines.push(`    ${aggregate.function}(\`${aggregate.table.alias}\`.\`${aggregate.field.name}\`)`)
    sqlLines.push(`  FROM \`${aggregate.table.name}\` \`${aggregate.table.alias}\``)
    sqlLines = sqlLines.concat(this.#getJoinSQL(aggregate.table, joins, '  '))
    sqlLines.push(`) AS \`${field.alias}\``)
    return sqlLines
  }

  /**
   * 获取表的join语句
   * @param table 主表
   * @param joins 模型joins
   * @param indent 缩进
   * @returns {*[]}
   */
  #getJoinSQL (table, joins, indent) {
    const joinLines = []
    const copyJoins = JSON.parse(JSON.stringify(joins))
    for (const join of joins) {
      let joinTableAlias = ` \`${join.targetTable.alias}\``
      if (join.targetTable.alias === join.targetTable.name) {
        joinTableAlias = ''
      }
      joinLines.push(`${indent}${join.joinType} \`${join.targetTable.name}\`${joinTableAlias}`)
      for (let i = 0; i < join.ons.length; i++) {
        const on = join.ons[i]
        let relationText = i === 0 ? 'ON ': `${on.relation} `
        joinLines.push(`  ${indent}${relationText}\`${on.table.alias}\`.\`${on.field.name}\` = \`${on.targetTable.alias}\`.\`${on.targetField.name}\``)
      }
    }
    return joinLines
  }
}

module.exports = new Kit()

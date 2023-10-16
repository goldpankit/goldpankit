// 安装服务
const response = require('./constants/response')
const service = require('./service')
const cache = require("./utils/cache");
const serviceApi = require("./api/service");
const fs = require("./utils/fs");
const Const = require("./constants/constants");
const userProject = require("./user.project");
const object = require("./utils/object");
const serviceBuild = require("./service.build");
const mysql = require("./utils/db/mysql");
const serviceTranslator = require('./service.translator')
const path = require('path')
const env = require('../env').getConfig()

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
          // 写入文件
          const diffFiles = fs.writeFiles(data.files, project, service, data.versionPath)
          // 写入配置
          // 获取配置格式
          const config = JSON.parse(JSON.stringify(Const.PROJECT_CONFIG_FILE_CONTENT))
          // 获取项目配置
          const configPath = userProject.getConfigPath(project.id)
          let projectConfig = fs.readJSONFile(configPath)
          if (projectConfig != null) {
            object.merge(projectConfig, config)
          }
          // 安装的是服务
          if (dto.plugin == null) {
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
          fs.createFile(userProject.getConfigPath(project.id), fs.toJSONFileString(config), true)
          // 获取构建详情并返回
          const builds = data.version.builds == null || data.version.builds === '' ? [] : JSON.parse(data.version.builds)
          serviceBuild.getBuildDetails(project, builds, diffFiles, data.version.compiler, variables)
            .then(builds => {
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
          console.log(e)
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
      const project = userProject.findDetailById(dto.projectId)
      const configPath = userProject.getConfigPath(project.id)
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
          serviceBuild.getBuildDetails(project, unbuilds, null, data.version.compiler, variables)
            .then(builds => {
              // 删除文件
              const diffFiles = fs.deleteFiles(data.files, project)
              // 删除项目配置中服务的配置
              const plugins = projectConfig.services || projectConfig.plugins
              delete plugins[dto.plugin]
              // 重新写入项目配置文件中
              fs.createFile(userProject.getConfigPath(project.id), fs.toJSONFileString(projectConfig), true)
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
              console.log(e)
              reject(e)
            })
        })
        .catch(e => {
          console.log(e)
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
            // 获取构建详情并返回
            serviceBuild.getBuildDetails(data.project, data.serviceConfig.builds, diffFiles, data.serviceConfig.compiler, data.variables)
              .then(builds => {
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
            console.log(e)
            reject(e)
          }
        })
        .catch(e => {
          console.log(e)
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
          // 获取构建详情并返回
          serviceBuild.getBuildDetails(data.project, data.serviceConfig.unbuilds, null, data.serviceConfig.compiler, data.variables)
            .then(builds => {
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
          console.log('clean compile throw an exception', e)
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
    // 插件，不做验证
    if (isPlugin) {
      return
    }
    // 查询项目
    const project = userProject.findDetailById(projectId)
    if (project == null) {
      return response.INSTALL.MISSING_PROJECT
    }
    // 没有安装过任何项目
    const serviceObject = project.main || project.service
    if (serviceObject === undefined) {
      return
    }
    // 验证当前项目是否安装了别的主服务，如果是，则做出提醒
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
   *   variables: []
   * }
   */
  #compile(dto) {
    return new Promise((resolve, reject) => {
      try {
        // 获取文件列表
        const files = this.#getFileConfigList(dto.space, dto.service, dto.plugin)
        if (files.length > env.limitFiles) {
          return reject(`The number of files exceeds the limit of ${env.limitFiles}.`)
        }
        // 获取项目信息
        const project = userProject.findDetailById(dto.projectId)
        if (project == null) {
          reject(new Error('Please select a project.'))
          return
        }
        // 获取服务信息
        const serviceConfig = service.getServiceConfig({space: dto.space, service: dto.service, plugin: dto.plugin})
        // 如果存在翻译器，则先进行翻译
        if (serviceConfig.translator.settings.length > 0) {
          serviceTranslator.translate({space: dto.space, service: dto.service, plugin: dto.plugin})
        }
        // 获取数据库信息
        const database = cache.datasources.get(dto.database)
        // 组装变量
        const variables = this.#getVariables(project, database, dto.variables)
        Promise.all(variables)
          .then(vars => {
            serviceApi.compile({
              defaultCompiler: serviceConfig.compiler,
              variables: vars,
              files
            })
              .then(data => {
                resolve({
                  files: data,
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
   *   version: '',
   *   variables: []
   * }
   * @returns {Promise<void>}
   */
  #install (dto) {
    try {
      const projectId = dto.projectId
      const project = userProject.findDetailById(projectId)
      if (project == null) {
        return Promise.reject(response.INSTALL.MISSING_PROJECT)
      }
      // 获取数据库信息
      const database = cache.datasources.get(dto.database)
      // 组装变量
      const variables = this.#getVariables(project, database, dto.variables, dto.plugin != null)
      let serviceVars = null
      return Promise.all(variables)
        .then(vars => {
          serviceVars = vars
          // 执行安装
          return serviceApi.install({
            space: dto.space,
            service: dto.service,
            plugin: dto.plugin,
            version: dto.version,
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

  // 获取主服务简化变量
  #getSimpleMainServiceVariables (variables) {
    return variables.map(v => {
      return {
        name: v.name,
        type: v.type,
        label: v.label,
        inputType: v.inputType,
        compiler: v.compiler,
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
            settings[group.name] = group.value
          })
        }
        return {
          value: variable.value,
          settings
        }
      }
      return variable.value
  }

  // 获取文件配置列表
  #getFileConfigList (space, serviceName, plugin) {
    const serviceConfig = service.getServiceConfig({ space: space, service: serviceName, plugin: plugin})
    // 获取文件真实存放的路径
    let fileStoragePath = serviceConfig.codespace
    if (serviceConfig.translator.settings.length > 0) {
      fileStoragePath = path.join(fileStoragePath, serviceConfig.translator.output)
    }
    const fullpaths = fs.getFilesWithChildren(fileStoragePath)
    const configs = []
    for (const fullpath of fullpaths) {
      // 获取文件配置
      const relativePath = fs.getRelativePath(fullpath, fileStoragePath)
      // 获取问及爱你配置，需使用service配置中的codespace
      const fileSettings = service.getFileSetting(serviceConfig.codespace, relativePath)
      // 构建文件对象
      const isDirectory = fs.isDirectory(fullpath)
      const fileInfo = isDirectory ? { encode: null, content: null } : fs.readFile(fullpath)
      configs.push({
        filepath: relativePath,
        content: fileInfo.content,
        contentEncode: fileInfo.encode,
        enableExpress: fileSettings.enableExpress,
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
      const projectConfig = fs.readJSONFile(userProject.__getConfigPath(project.codespace))
      // 获取安装的服务配置
      let service = null
      if (projectConfig != null) {
        service = projectConfig.service || projectConfig.main
      }
      if (service != null) {
        let serviceName = null
        for (const servceName in service) {
          serviceName = servceName
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
    return variables.map(item => {
      return new Promise((resolve, reject) => {
        try {
          // 如果类型为数据源，则查询出库信息
          if (item.inputType === 'datasource') {
            const dataSourceId = item.value === undefined ?  item.defaultValue : item.value
            const dataSource = cache.datasources.get(dataSourceId)
            resolve({
              ...item,
              value: dataSource
            })
            return
          }
          // 输入类型为表，则查询出表信息
          if (item.inputType === 'table') {
            const tableName = item.value === undefined ? item.defaultValue : item.value
            if (database == null || tableName == null || tableName === '') {
              resolve({
                ...item,
                value: null
              })
            }
            mysql.getTable({
              host: database.host,
              port: database.port,
              user: database.username,
              password: database.password,
              database: database.schema
            }, item.value === undefined ? item.defaultValue : item.value)
              .then(value => {
                // 补充动态字段，children为字段变量组
                if (item.children != null && item.children.length > 0) {
                  this.#paddingFieldVariablesWithResolve(project, database, item, value, null, resolve, reject)
                  return
                }
                resolve({
                  ...item,
                  value
                })
              })
              .catch(e => {
                reject(e)
              })
            return
          }
          // 如果类型为查询模型，则查询出模型信息
          if (item.inputType === 'query_model') {
            const modelId = item.value === undefined ? item.defaultValue : item.value
            if (modelId == null || modelId === '') {
              resolve({
                ...item,
                value: null
              })
              return
            }
            const model = database.models.find(m => m.id === modelId)
            if (model == null) {
              reject(`Can not found ${item.label} value.`)
              return
            }
            // 主表
            const mainTable = model.tables.find(t => t.type === 'MAIN')
            // 子表
            const subTables = model.tables.filter(t => t.type !== 'MAIN')
            // JOIN
            const joins = model.joins.map(join => {
              const table = model.tables.find(t => t.id === join.table)
              const targetTable = model.tables.find(t => t.id === join.targetTable)
              const ons = join.ons.map(on => {
                // 左字段
                const field = table.fields.find(f => f.name === on.field)
                field.table = {
                  ...table,
                  fields: undefined
                }
                // 右字段
                const targetField = targetTable.fields.find(f => f.name === on.targetField)
                targetField.table = {
                  ...targetTable,
                  fields: undefined
                }
                return {
                  ...on,
                  field,
                  targetField,
                }
              })
              return {
                ...join,
                table,
                targetTable,
                ons
              }
            })
            // 语句
            const statement = this.#getQueryModelStatement(item, model, mainTable, joins)
            const value = {
              name: model.name,
              comment: model.comment,
              mainTable,
              subTables,
              // 仅保留模型主表的join语句
              joins: joins.filter(join => join.table === mainTable),
              statement
            }
            // 处理字段变量
            if (item.children != null && item.children.length > 0) {
              this.#paddingFieldVariablesWithResolve(project, database, item, value, model, resolve, reject)
              return
            }
            resolve({
              ...item,
              value
            })
            return
          }
          // 如果为服务变量组，则修改子变量值
          if (item.type === 'group') {
            Promise.all(this.#getVariables(project, database, item.children, false))
              .then(vars => {
                resolve({
                  ...item,
                  children: vars
                })
              })
              .catch(e => {
                reject(e)
              })
            return
          }
          // 如果输入类型为select，扩展出Settings选项设置变量
          if (item.inputType === 'select') {
            const value = item.value === undefined ? item.defaultValue : item.value
            extVariables.push({
              name: `${item.name}Settings`,
              type: 'ext', // 标记为扩展变量
              value: value.settings
            })
            // select的存储结构为{value: null, settings: {}}，所以value最终为value.value
            resolve({
              ...item,
              value: value.value
            })
            return
          }
          // 其他
          resolve({
            ...item,
            value: item.value === undefined ? item.defaultValue : item.value
          })
        } catch (e) {
          reject(e)
        }
      })
    }).concat(extVariables)
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
  #paddingFieldVariablesWithResolve (project, database, variable, value, model, resolve, reject) {
    const groupPromises = []
    if (variable.children != null && variable.children.length > 0) {
      for (const group of variable.children) {
        value[group.name] = group.value === undefined ? group.defaultValue : group.value
        // group.children为字段变量组中的变量设定（例如查询条件queryFields中的字段定义）
        groupPromises.push(Promise.all(this.#getVariables(project, database, group.children, false))
          .then(vars => {
            group.children = vars
            return Promise.resolve(group)
          })
          .catch(e => {
            return Promise.reject(e)
          }))
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
          for (const v of group.children) {
            if (v.inputType !== 'select') {
              continue
            }
            for (const field of value[group.name]) {
              const varValue = field[v.name]
              field[v.name] = varValue.value
              field[`${v.name}Settings`] = varValue.settings
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
                field.statements = `${field.name} AS ${field.alias}`
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
    const statement = {
      from: `FROM \`${mainTable.name}\` \`${mainTable.alias}\``,
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
        const fields = group.value === undefined ? group.defaultValue : group.value
        for (let i = 0; i < fields.length; i++) {
          const field = fields[i]
          // 非虚拟字段
          if (!field.isVirtual) {
            let sql = `\`${field.table.alias}\`.\`${field.name}\` AS \`${field.alias}\``
            if (i < fields.length - 1) {
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
            if (i < fields.length - 1) {
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
          if (i < fields.length - 1) {
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
    const currentTableJoins = joins.filter(join => join.table.id === table.id)
    for (const join of currentTableJoins) {
      joinLines.push(`${indent}${join.joinType} \`${join.targetTable.name}\` \`${join.targetTable.alias}\``)
      for (let i = 0; i < join.ons.length; i++) {
        const on = join.ons[i]
        let relationText = i === 0 ? 'ON ': `${on.relation} `
        joinLines.push(`  ${indent}${relationText}\`${join.targetTable.alias}\`.\`${on.targetField.name}\` = \`${join.table.alias}\`.\`${on.field.name}\``)
      }
    }
    return joinLines
  }
}

module.exports = new Kit()

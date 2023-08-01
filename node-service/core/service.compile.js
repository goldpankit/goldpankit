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
const serviceTranslator = require('./service.translator')

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
    return new Promise((resolve, reject) => {
      this.#install(dto)
        .then(({ data, project, database, variables}) => {
          // 写入文件
          fs.writeFiles(data.files, project.codespace)
          // 获取配置格式
          const config = JSON.parse(JSON.stringify(Const.PROJECT_CONFIG_FILE_CONTENT))
          // 获取项目配置
          const configPath = userProject.getConfigPath(project.id)
          let projectConfig = fs.readJSONFile(configPath)
          if (projectConfig != null) {
            object.merge(projectConfig, config)
          }
          // 写入项目配置文件
          if (data.version.serviceType === 'MAIN') {
            config.space = dto.space
            config.main[dto.service] = {
              version: dto.version,
              variables: this.#getSimpleMainServiceVariables(dto.variables)
            }
          } else {
            config.services[dto.service] = {
              version: dto.version,
              variables: this.#getSimpleVariables(dto.variables)
            }
          }
          fs.createFile(userProject.getConfigPath(project.id), fs.toJSONFileString(config), true)
          // 获取构建详情并返回
          const builds = data.version.builds == null || data.version.builds === '' ? [] : JSON.parse(data.version.builds)
          serviceBuild.getBuildDetails(project, builds, data.version.compiler, variables)
            .then(builds => {
              // 返回构建信息
              const result = {
                projectId: project.id,
                databaseId: database.id,
                builds
              }
              resolve(result)
            })
            .catch(e => {
              reject(e)
            })
        })
        .catch(e => {
          reject(e)
        })
    })
  }
  /**
   * 卸载服务
   */
  uninstall (dto) {
    return new Promise((resolve, reject) => {
      this.#install(dto)
        .then(({ data, project, database, variables}) => {
          // 获取构建详情并返回
          const unbuilds = data.version.unbuilds == null || data.version.unbuilds === '' ? [] : JSON.parse(data.version.unbuilds)
          serviceBuild.getBuildDetails(project, unbuilds, data.version.compiler, variables)
            .then(builds => {
              // 删除文件
              fs.deleteFiles(data.files, project.codespace)
              // 获取项目配置
              const configPath = userProject.getConfigPath(project.id)
              let projectConfig = fs.readJSONFile(configPath)
              // 删除项目配置中服务的配置
              delete projectConfig.services[dto.service]
              // 重新写入项目配置文件中
              fs.createFile(userProject.getConfigPath(project.id), fs.toJSONFileString(projectConfig), true)
              // 返回构建信息
              const result = {
                projectId: project.id,
                databaseId: database.id,
                builds
              }
              resolve(result)
            })
            .catch(e => {
              reject(e)
            })
        })
        .catch(e => {
          reject(e)
        })
    })
  }
  /**
   * 编译服务代码
   */
  compile(dto) {
    return new Promise((resolve, reject) => {
      this.#compile(dto)
        .then(data => {
          try {
            // 写入文件
            fs.writeFiles(data.files, data.project.codespace)
            // 获取构建详情并返回
            serviceBuild.getBuildDetails(data.project, data.serviceConfig.builds, data.serviceConfig.compiler, data.variables)
              .then(builds => {
                // 返回构建信息
                const result = {
                  projectId: data.project.id,
                  databaseId: data.database.id,
                  builds
                }
                resolve(result)
              })
              .catch(e => {
                reject(e)
              })
          } catch (e) {
            reject(e)
          }
        })
        .catch(e => {
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
          serviceBuild.getBuildDetails(data.project, data.serviceConfig.unbuilds, data.serviceConfig.compiler, data.variables)
            .then(builds => {
              // 删除文件
              fs.deleteFiles(data.files, data.project.codespace)
              // 返回构建信息
              const result = {
                projectId: data.project.id,
                databaseId: data.database.id,
                builds
              }
              resolve(result)
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
        // 获取项目信息
        const project = cache.projects.get(dto.projectId)
        if (project == null) {
          reject(new Error('Please select a project.'))
          return
        }
        // 获取服务信息
        const serviceConfig = service.getServiceConfig({space: dto.space, service: dto.service})
        // 如果存在翻译器，则先进行翻译
        if (serviceConfig.translator.settings.length > 0) {
          serviceTranslator.translate({space: dto.space, service: dto.service})
        }
        // 获取数据库信息
        const database = cache.databases.get(dto.database)
        // 组装变量
        const variables = this.#getVariables(project, database, dto.variables)
        Promise.all(variables)
          .then(vars => {
            serviceApi.compile({
              defaultCompiler: serviceConfig.compiler,
              variables: vars,
              files: this.#getFileConfigList(dto.space, dto.service)
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
      const project = cache.projects.get(projectId)
      if (project == null) {
        return Promise.reject('Please select a project.')
      }
      // 获取数据库信息
      const database = cache.databases.get(dto.database)
      // 组装变量
      const variables = this.#getVariables(project, database, dto.variables)
      let serviceVars = null
      return Promise.all(variables)
        .then(vars => {
          serviceVars = vars
          return serviceApi.install({
            space: dto.space,
            service: dto.service,
            version: dto.version,
            variables: vars
          })
        })
        .then(data => {
          return Promise.resolve({
            data,
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
        scope: v.scope,
        label: v.label,
        inputType: v.inputType,
        compiler: v.compiler,
        value: v.value
      }
    })
  }

  // 获取简化变量
  #getSimpleVariables (variables) {
    const vars = {}
    for (const v of variables) {
      vars[v.name] = v.value
    }
    return vars
  }

  // 获取文件配置列表
  #getFileConfigList (space, serviceName) {
    const serviceConfig = service.getServiceConfig({ space: space, service: serviceName})
    // 获取文件真实存放的路径
    let fileStoragePath = serviceConfig.codespace
    if (serviceConfig.translator.settings.length > 0) {
      fileStoragePath = `${fileStoragePath}/${Const.TRANSLATOR.DEFAULT_OUTPUT_PATH}`
    }
    const fullpaths = fs.getFilesWithChildren(fileStoragePath)
    const configs = []
    for (const fullpath of fullpaths) {
      // 获取文件配置
      const relativePath = fullpath.replace(fileStoragePath + '/', '')
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
    // 补充主服务变量
    if (withMainServiceVariables) {
      const projectConfig = fs.readJSONFile(userProject.__getConfigPath(project.codespace))
      if (projectConfig != null && projectConfig.main != null) {
        let mainServiceName = null
        for (const servceName in projectConfig.main) {
          mainServiceName = servceName
          break
        }
        // 将项目主服务的变量添加到最前
        const mainServiceVariables = projectConfig.main[mainServiceName].variables.reverse()
        for (const variable of mainServiceVariables) {
          variables.unshift(variable)
        }
      }
    }
    // 扩展变量
    const extVariables = []
    return variables.map(item => {
      return new Promise((resolve, reject) => {
        try {
          // 如果类型为数据库，则查询出库信息
          if (item.inputType === 'database') {
            const database = cache.databases.get(item.value || item.defaultValue)
            resolve({
              ...item,
              value: database
            })
            return
          }
          // 输入类型为表，则查询出表信息
          if (item.inputType === 'table') {
            mysql.getTable({
              host: database.host,
              port: database.port,
              user: database.username,
              password: database.password,
              database: database.schema
            }, item.value || item.defaultValue)
              .then(value => {
                // 补充动态字段，children为变量信息
                if (item.children != null && item.children.length > 0) {
                  this.#paddingFieldVariablesWithResolve(project, database, item, value, resolve, reject)
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
            const modelId = item.value || item.defaultValue
            const model = database.models.find(model => model.id === modelId)
            // 主表
            const mainTable = model.tables.find(t => t.type === 'MAIN')
            // 子表
            const subTables = model.tables.filter(t => t.type !== 'MAIN')
            // join
            const joins = model.joins.map(join => {
              const targetTable = model.tables.find(t => t.id === join.targetTable)
              const ons = join.ons.map((on,index) => {
                const relationText = index === 0 ? '' : on.relation
                return `${relationText} ${mainTable.alias}.${on.field} = ${targetTable.alias}.${on.targetField}`
              })
              return `${join.joinType} ${join.targetTable} ON
  ${ons.join('\n  ')}`
            })
            // 查询字段
            const fields = []
            for (const table of model.tables) {
              for (const field of table.fields) {
                const agg = model.aggregates.find(
                  agg => agg.table.toLowerCase() === table.name.toLowerCase() &&
                    agg.field.toLowerCase() === field.name.toLowerCase()
                )
                if (agg == null) {
                  fields.push(`${table.alias}.${field.name} AS ${field.alias}`)
                } else {
                  const targetTable = model.tables.find(t => t.name.toLowerCase() === agg.targetTable.toLowerCase())
                  const targetField = targetTable.fields.find(f => f.name.toLowerCase() === agg.targetField.toLowerCase())
                    fields.push(`(
    SELECT
      ${agg.function}(${targetTable.alias}.${agg.targetField})
    FROM ${targetTable.name} ${targetTable.alias}
  ) AS ${field.alias}`)
                }
              }
            }
            const value = {
              name: model.name,
              comment: model.comment,
              mainTable,
              subTables,
              joins: model.joins.map(join => {
                const table = model.tables.find(t => t.id === join.table)
                const targetTable = model.tables.find(t => t.id === join.targetTable)
                const ons = join.ons.map(on => {
                  return {
                    ...on,
                    field: table.fields.find(f => f.name === on.field),
                    targetField: targetTable.fields.find(f => f.name === on.targetField),
                  }
                })
                return {
                  ...join,
                  table,
                  targetTable,
                  ons
                }
              }),
              aggregates: model.aggregates,
              sql: {
                fields: fields,
                joins: joins,
                where: '',
                orderBy: ''
              }
            }
            // 处理字段变量
            if (item.children != null && item.children.length > 0) {
              this.#paddingFieldVariablesWithResolve(project, database, item, value, resolve, reject)
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
            const value = item.value || item.defaultValue
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
            value: item.value || item.defaultValue
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
  #paddingFieldVariablesWithResolve (project, database, variable, value, resolve, reject) {
    const groupPromises = []
    for (const group of variable.children) {
      value[group.name] = group.value || group.defaultValue
      groupPromises.push(Promise.all(this.#getVariables(project, database, group.children, false))
        .then(vars => {
          group.children = vars
          return Promise.resolve()
        })
        .catch(e => {
          return Promise.reject(e)
        }))
      Promise.all(groupPromises)
        .then(() => {
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
          resolve({
            ...variable,
            value
          })
        })
        .catch(e => {
          reject(e)
        })
    }
  }
}

module.exports = new Kit()

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
              variables: this.#getSimpleVariables(dto.variables)
            }
          } else {
            config.services[dto.service] = {
              version: dto.version,
              variables: this.#getSimpleVariables(dto.variables)
            }
          }
          fs.createFile(userProject.getConfigPath(project.id), fs.toJSONFileString(config), true)
          // 执行命令
          const builds = data.version.builds == null || data.version.builds === '' ? [] : JSON.parse(data.version.builds)
          if (builds.length > 0) {
            serviceBuild.build(project, database, builds, variables, data.version.compiler)
          }
          resolve()
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
          // 删除文件
          fs.deleteFiles(data.files, project.codespace)
          // 获取项目配置
          const configPath = userProject.getConfigPath(project.id)
          let projectConfig = fs.readJSONFile(configPath)
          // 删除项目配置中服务的配置
          delete projectConfig.services[dto.service]
          // 重新写入项目配置文件中
          fs.createFile(userProject.getConfigPath(project.id), fs.toJSONFileString(projectConfig), true)
          // 执行命令
          const unbuilds = data.version.unbuilds == null || data.version.unbuilds === '' ? [] : JSON.parse(data.version.unbuilds)
          if (unbuilds.length > 0) {
            serviceBuild.build(project, database, unbuilds, variables, data.version.compiler)
          }
          resolve()
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
            console.log('写入文件')
            // 写入文件
            fs.writeFiles(data.files, data.project.codespace)
            // 执行命令
            if (data.serviceConfig.builds.length > 0) {
              serviceBuild.build(data.project, data.database, data.serviceConfig.builds, data.variables, data.serviceConfig.compiler)
            }
            resolve()
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
          // 删除文件
          fs.deleteFiles(data.files, data.project.codespace)
          // 执行命令
          if (data.serviceConfig.unbuilds.length > 0) {
            serviceBuild.build(data.project, data.database, data.serviceConfig.unbuilds, data.variables, data.serviceConfig.compiler)
          }
          resolve()
        })
        .catch(e => {
          console.log('e', e)
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
      try { // 获取项目信息
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
        const variables = this.#getVariables(database, dto.variables)
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
    const projectId = dto.projectId
    const project = cache.projects.get(projectId)
    if (project == null) {
      throw new Error('Please select a project.')
    }
    // 获取数据库信息
    const database = cache.databases.get(dto.database)
    // 组装变量
    const variables = this.#getVariables(database, dto.variables)
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
  #getVariables (database, variables) {
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
              .then(table => {
                resolve({
                  ...item,
                  value: table
                })
              })
              .catch(e => {
                reject(e)
              })
            return
          }
          // 如果类型为查询模型，则查询出模型信息
          if (item.inputType === 'query_model') {
            const modelName = item.value || item.defaultValue
            const model = database.models.find(model => model.name === modelName)
            // 主表
            const mainTable = model.tables.find(t => t.type === 'MAIN')
            // 子表
            const subTables = model.tables.filter(t => t.type !== 'MAIN')
            // join
            const joins = model.joins.map(join => {
              const joinTable = model.tables.find(t => t.name === join.joinTable)
              const ons = join.ons.map((on,index) => {
                const relationText = index === 0 ? '' : on.relation
                return `${relationText} ${mainTable.alias}.${on.startField} = ${joinTable.alias}.${on.endField}`
              })
              return `${join.joinType} ${join.joinTable} ON
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
            resolve({
              ...item,
              value: {
                name: model.name,
                comment: model.comment,
                mainTable,
                subTables,
                joins: model.joins,
                aggregates: model.aggregates,
                sql: {
                  fields: fields.join(',\n  '),
                  joins: joins.join('\n'),
                  where: '',
                  orderBy: ''
                }
              }
            })
            return
          }
          // 如果为服务变量组，则修改子变量值
          if (item.type === 'group' && item.scope === 'service') {
            resolve({
              ...item,
              children: item.children.map(v => {
                return {
                  ...v,
                  value: v.value || v.defaultValue
                }
              })
            })
            return
          }
          resolve({
            ...item,
            value: item.value || item.defaultValue
          })
        } catch (e) {
          reject(e)
        }
      })
    })
  }
}

module.exports = new Kit()

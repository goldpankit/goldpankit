const cache = require('./utils/cache')
const utils = require('./utils/index')
const fs = require('./utils/fs')
const Const = require("./constants/constants");
module.exports = {
  // 创建
  create (project) {
    project.id = utils.generateId()
    cache.projects.save(project)
    return project.id
  },
  // 保存项目信息
  save (config) {
    const projectConfig = cache.projects.get(config.id)
    if (projectConfig == null) {
      throw new Error('未找到项目信息')
    }
    Object.assign(projectConfig, config)
    cache.projects.save(projectConfig)
  },
  // 保存查询模型
  saveModel (projectId, databaseName, newModel) {
    console.log('projectId', projectId)
    const projectConfig = cache.projects.get(projectId)
    if (projectConfig == null) {
      throw new Error('未找到项目信息')
    }
    const database = projectConfig.databases.find(db => db.name === databaseName)
    if (database == null) {
      throw new Error(`项目下未找到「${databaseName}」数据库信息`)
    }
    if (database.models == null) {
      database.models = []
    }
    const model = database.models.find(m => m.name === newModel.name)
    if (model == null) {
      database.models.push(newModel)
    } else {
      Object.assign(model, newModel)
    }
    cache.projects.save(projectConfig)
  },
  // 查询项目配置信息
  findConfigById (id) {
    return cache.projects.get(id)
  },
  // 查询项目详细信息
  findDetailById (id) {
    // 获取项目配置
    const projectConfig = cache.projects.get(id)
    // 获取项目安装配置
    const projectInstallConfig = fs.readJSONFile(this.__getConfigPath(projectConfig.codespace))
    return {
      ...projectConfig,
      ...projectInstallConfig
    }
  },
  // 搜索
  search () {
    return cache.projects.search()
  },
  // 获取项目配置文件路径
  getConfigPath (projectId) {
    const project = cache.projects.get(projectId)
    return this.__getConfigPath(project.codespace)
  },
  // 删除项目
  deleteProject (projectId) {
    cache.projects.remove(projectId)
  },
  // 获取配置文件
  __getConfigPath (codespace) {
    return `${codespace}/${Const.PROJECT_CONFIG_FILE}`
  }
}

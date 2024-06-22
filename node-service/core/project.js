const cache = require('./utils/cache')
const utils = require('./utils/index')
const fs = require('./utils/fs')
const Const = require('./constants/constants')
const path = require('path')
const response = require('./constants/response')
module.exports = {
  /**
   * 创建
   * @param project = {
   *   name: '项目名称',
   *   codespace: '项目路径',
   *   remark: '项目备注'
   * }
   * @returns {Promise<unknown>}
   */
  create (project) {
    project.id = utils.generateId()
    cache.projects.save(project)
    return Promise.resolve(project.id)
  },
  // 保存项目信息
  save (project) {
    // 验证项目
    const projectConfig = cache.projects.get(project.id)
    if (projectConfig == null) {
      return Promise.reject(response.PROJECT.PROJECT_NOT_EXISTS)
    }
    // 验证项目名称
    const projects = cache.projects.getAll()
    const existsProject = projects.find(p => p.name.toLowerCase() === project.name.toLowerCase())
    if (existsProject != null && existsProject.id !== project.id) {
      return Promise.reject(response.PROJECT.PROJECT_NAME_EXISTS)
    }
    // 执行修改
    Object.assign(projectConfig, project)
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
    if (projectConfig == null) {
      return
    }
    // 获取项目安装配置
    const projectInstallConfig = this.getProjectConfig(projectConfig.codespace)
    return {
      ...projectConfig,
      ...projectInstallConfig
    }
  },
  // 搜索
  search () {
    return cache.projects.search()
  },
  // 根据项目路径获取项目配置
  getProjectConfig (codespace) {
    const configFilePath = this.__getConfigPath(codespace)
    if (!fs.exists(configFilePath)) {
      return null
    }
    return fs.readJSONFile(configFilePath)
  },
  // 获取项目配置
  getProjectConfigById (id) {
    const configFilePath = this.getConfigPath(id)
    if (!fs.exists(configFilePath)) {
      return null
    }
    return fs.readJSONFile(configFilePath)
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
  // 获取配置文件路径
  __getConfigPath (codespace) {
    return path.join(codespace, Const.PROJECT_CONFIG_FILE)
  }
}

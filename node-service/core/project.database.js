const utils = require('./utils/index')
const fs = require('./utils/fs')
const cache = require('./utils/cache')
const path = require('path')
const Const = require('./constants/constants')
module.exports = {
  /**
   * 创建
   * @param projectId 项目ID
   * @param database = {
   *   projectId: '项目ID',
   *   name: '数据库昵称',
   *   type: '类型',
   *   host: '',
   *   port: '',
   *   username: '',
   *   password: '',
   *   schema: '库名',
   *   models: [扩展模型]
   * }
   *
   * @returns {Promise<never>|Promise<unknown>}
   */
  create (projectId, database) {
    // 保持json结构
    delete database.id
    const newDatabase = {
      // 分配ID
      id: utils.generateId(),
      ...database
    }
    // 添加
    const databases = this.getProjectDatabaseConfigByIdWithDefaultBlankArray(projectId)
    databases.unshift(newDatabase)
    // 保存
    fs.rewrite(this.getDatabaseConfigPath(projectId), fs.toJSONFileString(databases))
    return Promise.resolve(newDatabase.id)
  },
  // 修改
  updateById (projectId, newDatabase) {
    // 验证数据
    const databases = this.getProjectDatabaseConfigByIdWithDefaultBlankArray(projectId)
    const target = databases.find(db => db.id === newDatabase.id)
    if (target == null) {
      return Promise.reject(new Error('数据库不存在，请刷新后重试！'))
    }
    // 更新
    Object.assign(target, newDatabase)
    // 保存
    fs.rewrite(this.getDatabaseConfigPath(projectId), fs.toJSONFileString(databases))
  },
  // 删除
  deleteById(projectId, databaseId) {
    // 验证数据
    const databases = this.getProjectDatabaseConfigByIdWithDefaultBlankArray(projectId)
    const targetIndex = databases.findIndex(db => db.id === databaseId)
    if (targetIndex === -1) {
      return
    }
    // 执行删除
    databases.splice(targetIndex, 1)
    // 保存
    fs.rewrite(this.getDatabaseConfigPath(projectId), fs.toJSONFileString(databases))
  },
  // 获取数据库配置
  getDatabase (projectId, databaseId) {
    const databases = this.getProjectDatabaseConfigByIdWithDefaultBlankArray(projectId)
    return databases.find(db => db.id === databaseId)
  },
  // 保存数据库配置
  saveDatabase (projectId, newDatabase) {
    const databases = this.getProjectDatabaseConfigByIdWithDefaultBlankArray(projectId)
    const target = databases.find(db => db.id === newDatabase.id)
    // 修改配置
    Object.assign(target, newDatabase)
    // 保存
    fs.rewrite(this.getDatabaseConfigPath(projectId), fs.toJSONFileString(databases))
  },
  // 获取项目数据库配置文件路径
  getDatabaseConfigPath (projectId) {
    const project = cache.projects.get(projectId)
    if (project == null) {
      return null
    }
    return path.join(project.codespace, Const.PROJECT_DATABASE_CONFIG_FILE)
  },
  // 获取项目数据库配置
  getProjectDatabaseConfigByIdWithDefaultBlankArray (projectId) {
    const configFilePath = this.getDatabaseConfigPath(projectId)
    if (configFilePath == null) {
      return []
    }
    if (!fs.exists(configFilePath)) {
      return []
    }
    return fs.readJSONFile(configFilePath)
  }
}

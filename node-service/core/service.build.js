const mysql = require('./utils/db/mysql')
const nc = require('./utils/node-command')
const serviceApi = require("./api/service");
const fs = require('./utils/fs')
const log = require('./utils/log')
const path = require('path')
const cache = require('./utils/cache')
module.exports = {
  build (dto) {
    const builds = dto.builds
    const project = cache.projects.get(dto.projectId)
    const database = cache.datasources.get(dto.dataSourceId)
    return new Promise(async (resolve, reject) => {
      if (builds == null || builds.length === 0) {
        resolve()
        return
      }
      try {
        // 获取所有MYSQL脚本，整合在一起执行
        const sqlContent = builds.filter(b => b.type === 'MySQL').map(b => b.content).join('\n')
        if (sqlContent != null && sqlContent !== '') {
          await mysql.exec({
            host: database.host,
            port: database.port,
            user: database.username,
            password: database.password,
            database: database.schema
          }, sqlContent)
        }
        // 获取所有Node脚本，整合在一起执行
        const nodeContent = builds.filter(b => b.type === 'Node').map(b => b.content).join('\n')
        if (nodeContent != null && nodeContent !== '') {
          await nc.exec(project.codespace, nodeContent)
        }
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },
  /**
   * 获取build列表
   * @param project 项目
   * @param builds 构建列表
   * @param diffFiles 安装&编译/卸载&清除编译的结果文件
   * @param compiler 编译器
   * @param vars 变量
   * @returns {Promise<unknown>}
   */
  getBuildDetails(project, builds, diffFiles, compiler, vars) {
    return new Promise((resolve, reject) => {
      if (builds.length === 0) {
        resolve(builds)
        return
      }
      // 编译builds
      serviceApi.compileBuilds({
        compiler: compiler,
        variables: vars,
        contents: builds.map(item => item.content)
      })
        .then(contents => {
          const buildDetails = []
          for (let i = 0; i < contents.length; i++) {
            builds[i].content = contents[i]
          }
          for (const build of builds) {
            let content = build.content
            if (build.contentType === 'file') {
              const buildFilePath = path.join(project.codespace, build.content)
              // 编译和安装的情况：从安装或变异的文件中查找构建文件
              if (diffFiles != null && diffFiles.length > 0) {
                const targetFile = diffFiles.find(file => file.filepath === build.content.substring(1))
                if (targetFile != null) {
                  content = targetFile.content
                }
              }
              // 卸载和清除编译的情况：从项目代码中查找文件
              else if (fs.exists(buildFilePath)) {
                content = fs.readFile(buildFilePath).content
              } else {
                content = ''
              }
            }
            if (content.trim() !== '') {
              buildDetails.push({
                ...build,
                content
              })
            }
          }
          resolve(buildDetails)
        })
        .catch(e => {
          console.log(e)
          reject(e)
        })
    })
  }
}

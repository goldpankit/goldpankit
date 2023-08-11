const mysql = require('./utils/db/mysql')
const nc = require('./utils/node-command')
const serviceApi = require("./api/service");
const fs = require('./utils/fs')
const cache = require('./utils/cache')
module.exports = {
  build (dto) {
    const builds = dto.builds
    const project = cache.projects.get(dto.projectId)
    const database = cache.datasources.get(dto.dataSourceId)
    return new Promise((resolve, reject) => {
      if (builds == null || builds.length === 0) {
        resolve()
        return
      }
      Promise.all(builds.map(build => {
        // 执行MySQL脚本
        if (build.type === 'MySQL') {
          return mysql.exec({
            host: database.host,
            port: database.port,
            user: database.username,
            password: database.password,
            database: database.schema
          }, build.content)
        }
        // 执行Node命令
        if (build.type === 'Node') {
          return nc.exec(project.codespace, build.content)
        }
        return Promise.resolve()
      }))
        .then(() => {
          resolve()
        })
        .catch(e => {
          console.log('build failed', e)
          reject(e)
        })
    })
  },
  // 获取build列表
  getBuildDetails(project, builds, compiler, vars) {
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
            console.log('build', build)
            let content = build.content
            if (build.contentType === 'file') {
              content = fs.readFile(`${project.codespace}${build.content}`).content
            }
            buildDetails.push({
              ...build,
              content
            })
          }
          resolve(buildDetails)
        })
        .catch(e => {
          reject(e)
        })
    })
  }
}

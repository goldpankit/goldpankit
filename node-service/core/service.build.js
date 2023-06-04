const mysql = require('./utils/db/mysql')
const nc = require('./utils/node-command')
module.exports = {
  build (project, database, builds) {
    if (builds == null || builds.length === 0) {
      return
    }
    for (const build of builds) {
      // 执行MySQL脚本
      if (build.type === 'MySQL') {
        mysql.exec({
          host: database.host,
          port: database.port,
          user: database.username,
          password: database.password,
          database: database.schema
        }, build.content)
          .catch(e => {
            console.log('execute mysql script error', e)
          })
        continue
      }
      // 执行Node命令
      if (build.type === 'Node') {
        nc.exec(project.codespace, build.content)
          .catch(e => {
            console.log('execute node commands error', e)
          })
      }
    }
  }
}

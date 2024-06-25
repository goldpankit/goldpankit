import Vuex from 'vuex'
import { getToken } from '@/api/user.token'
import { getLoginInfo, logout } from '@/api/user.login'
import { getBalance } from '@/api/user'
import { fetchDatabases } from '@/api/project.database';
import {fetchTables} from "@/api/database.util";
// 获取本地项目
let currentProject = null
const currentProjectStr = window.localStorage.getItem('CURRENT_PROJECT')
if (currentProjectStr != null) {
  currentProject = JSON.parse(currentProjectStr)
}
// 获取本地项目
let currentProjectDetail = null
const currentProjectDetailStr = window.localStorage.getItem('CURRENT_PROJECT_DETAIL')
if (currentProjectDetailStr != null) {
  currentProjectDetail = JSON.parse(currentProjectDetailStr)
}
// 从本地获取已选数据库
let currentDatabase = window.localStorage.getItem('CURRENT_DATABASE')
export default new Vuex.Store({
  state: {
    globalLoading: {
      databases: false,
      tables: false
    },
    // 用户信息
    userInfo: null,
    // 本地数据库集合
    databases: [],
    // 当前数据库表集合
    tables: [],
    // 当前模型集合
    models: [],
    // 当前项目
    currentProject,
    currentProjectDetail,
    // 当前数据库
    currentDatabase,
    // 帮助中心，服务于当前查看的帮助内容
    help: {
      code: null
    },
    // 安装 & 编译信息，服务于自动构建提醒
    installData: null
  },
  mutations: {
    setHelpCode (state, value) {
      state.help.code = value
    },
    setUserInfo (state, value) {
      if (state.userInfo == null || value == null) {
        state.userInfo = value
      } else {
        Object.assign(state.userInfo, value)
      }
    },
    setDatabases (state, value) {
      state.databases = value
    },
    // 设置当前表集合
    setTables (state, value) {
      state.tables = value
      /*
        根据存储模型中的结构更新内存模型数据（表集合会影响模型内容，例如修改了表，那么存储模型中不存在的表和字段在内存模型中则应该作出对应修改或移除）
        内存模型：指的是模型数据存储在js运行内存中，对模型修改时，内存模型会实时更新
        存储模型：指的是模型数据存储在项目kit.db.json文件中，文件中的模型数据可能和表不统一
      */
      if (state.currentDatabaseDetail != null && state.currentDatabaseDetail.models != null) {
        state.models = state.currentDatabaseDetail.models.map(model => {
          // 是否展示SQL预览窗口：用于模型设计器页面控制SQL预览窗口的打开和关闭
          model.__visibleSQLPreviewWindow = false
          // 默认选择关联线类型为join：用于模型设计器页面判断关联线的类型
          model.__lineType = 'join'
          // 同步表信息（会从模型中移除数据库不存在的表）
          model.tables = model.tables.map(table => {
            const dbTable = state.tables.find(tb => tb.name.toLowerCase() === table.name.toLowerCase())
            // 表不存在
            if (dbTable == null) {
              return null
            }
            // 同步字段信息
            const dbFields = dbTable.fields
            const fields = dbFields.map(dbField => {
              // 字段在存储模型结构中可能不存在（数据库表新增了字段A，则在存储模型中字段A不存在，此时字段A应该被体现出来，且需增加显示状态为true，别名按照规则生成）
              const modelField = table.fields.find(field => field.name === dbField.name)
              const field =  {
                ...dbField,
                // 增加显示状态
                visible: modelField == null ? true : modelField.visible === true,
                // 增加别名
                alias: modelField == null ? `${table.alias}_${dbField.name}` : modelField.alias
              }
              // 该情况为kit.db.json中直接删除了别名，此时别名应当按照规则重新生成
              if (field.alias == null) {
                field.alias = `${table.alias}_${dbField.name}`
              }
              return field
            })
            return {
              ...table,
              fields
            }
          })
          model.tables = model.tables.filter(t => t != null)
          // 删除了主表（并不是只在kit.db.json中删除了主表，而是在数据库中主表被删除）
          if (model.tables.find(t => t.type === 'MAIN') == null) {
            model.tables = []
            model.joins = []
            model.aggregates = []
          }
          // join处理（移除掉无效的join）
          model.joins.map(join => {
            const table = model.tables.find(table => table.id === join.table)
            const targetTable = model.tables.find(table => table.id === join.targetTable)
            // 如果join的表在模型中不存在，则删除该join
            if (table == null || targetTable == null) {
              return null
            }
            // 如果join的所有on不成立（on的相关字段不存在），则删除该join
            const ons = join.ons.map(on => {
              const field = table.fields.find(field => field.name === on.field)
              const targetField = targetTable.fields.find(field => field.name === on.targetField)
              if (field == null || targetField == null) {
                return null
              }
            })
            if (ons.filter(on => on != null).length === 0) {
              return null
            }
            return join
          })
          // // 聚合函数处理（移除掉无效的聚合）
          // model.aggregates.map(agg => {
          // })
          // model.aggregates = model.aggregates.filter(agg => agg != null)
          return model
        })
      }
    },
    setModels (state, value) {
      state.models = value
    },
    setCurrentProject(state, project) {
      state.currentProject = project
      window.localStorage.removeItem('CURRENT_PROJECT')
      if (project != null) {
        window.localStorage.setItem('CURRENT_PROJECT', JSON.stringify(project))
      }
    },
    setCurrentProjectDetail(state, project) {
      state.currentProjectDetail = project
      window.localStorage.removeItem('CURRENT_PROJECT_DETAIL')
      if (project != null) {
        window.localStorage.setItem('CURRENT_PROJECT_DETAIL', JSON.stringify(project))
      }
    },
    setCurrentDatabase (state, database) {
      state.currentDatabase = database
      window.localStorage.removeItem('CURRENT_DATABASE')
      if (database != null) {
        window.localStorage.setItem('CURRENT_DATABASE', database)
      }
    },
    // 设置数据库详细信息，数据库发生了变化，那么对应的模型集合也应当一起更改，但这里更改的是基本信息
    setCurrentDatabaseDetail (state, database) {
      state.currentDatabaseDetail = database
      window.localStorage.removeItem('CURRENT_DATABASE_DETAIL')
      if (database != null) {
        // 构建新的对象，删除数据模型，避免模型中存在循环引用（table=>fields=>table）无法被JSON序列化
        let newDatabase = { ...database }
        delete newDatabase.models
        window.localStorage.setItem('CURRENT_DATABASE_DETAIL', JSON.stringify(newDatabase))
      }
    },
    setInstallData (state, value) {
      if (state.installData == null) {
        state.installData = value
        return
      }
      Object.assign(state.installData, value)
    }
  },
  actions: {
    // 刷新余额
    refreshBalance ({commit}) {
      getBalance()
        .then(balance => {
          commit('setUserInfo', { balance })
        })
        .catch(() => {})
    },
    // 退出登录
    logout ({commit}) {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            commit('setUserInfo', null)
            resolve()
          })
          .catch(e => {
            reject()
          })
      })
    },
    // 初始化登录令牌
    initToken ({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        getToken()
          .then(data => {
            if (data != null) {
              document.cookie = `x-kit-token=${data.value};`
              getLoginInfo()
                .then(userInfo => {
                  if (userInfo != null) {
                    commit('setUserInfo', userInfo)
                  } else {
                    dispatch('logout')
                  }
                  resolve()
                })
                .catch(e => {
                  reject(e)
                })
            }
          })
          .catch(e => {
            reject(e)
          })
      })
    },
    // 获取本地数据库列表
    fetchDatabases ({ state, commit }) {
      return new Promise((resolve, reject) => {
        state.globalLoading.databases = true
        setTimeout(() => {
          if (state.currentProject == null || state.currentProject === '') {
            commit('setDatabases', [])
            resolve([])
            return
          }
          fetchDatabases(state.currentProject)
            .then(data => {
              commit('setDatabases', data)
              resolve(data)
            })
            .catch(e => {
              console.log('获取项目数据库失败', e)
              reject(e)
            })
            .finally(() => {
              state.globalLoading.databases = false
            })
        }, 300)
      })
    },
    // 获取数据库表
    fetchTables ({ state, commit }) {
      return new Promise((resolve, reject) => {
        if (state.currentDatabaseDetail == null) {
          commit('setTables', [])
          return resolve([])
        }
        state.globalLoading.tables = true
        fetchTables({
          host: state.currentDatabaseDetail.host,
          port: state.currentDatabaseDetail.port,
          user: state.currentDatabaseDetail.username,
          password: state.currentDatabaseDetail.password,
          database: state.currentDatabaseDetail.schema
        })
          .then(tables => {
            commit('setTables', tables)
            resolve(tables)
          })
          .catch(e => {
            console.log('获取数据库表失败', e)
            reject(e)
          })
          .finally(() => {
            state.globalLoading.tables = false
          })
      })
    }
  },
  getters: {
    getCurrentDatabaseDetail (state) {
      return state.databases.find(db => db.id === state.currentDatabase)
    }
  }
})

import Vuex from 'vuex'
import {getToken} from "../api/user.token";
import {getLoginInfo, logout} from "../api/user.login";
import {getBalance} from "../api/user";
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
let currentDatabaseDetail = null
const currentDatabaseDetailStr = window.localStorage.getItem('CURRENT_DATABASE_DETAIL')
if (currentDatabaseDetailStr != null) {
  currentDatabaseDetail = JSON.parse(currentDatabaseDetailStr)
}
export default new Vuex.Store({
  state: {
    // 用户信息
    userInfo: null,
    // 当前项目
    currentProject,
    currentProjectDetail,
    // 当前数据库
    currentDatabase,
    currentDatabaseDetail,
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
      if (state.userInfo != null && state.userInfo.avatar == null) {
        state.userInfo.avatar = '/images/avatar/default.png'
      }
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
      window.localStorage.setItem('CURRENT_DATABASE', database)
    },
    setCurrentDatabaseDetail (state, database) {
      state.currentDatabaseDetail = database
      window.localStorage.removeItem('CURRENT_DATABASE_DETAIL')
      if (database != null) {
        window.localStorage.setItem('CURRENT_DATABASE_DETAIL', JSON.stringify(database))
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
    }
  },
  getters: {}
})

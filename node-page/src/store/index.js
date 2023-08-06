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
// 从本地获取已选数据库
let currentDatabase = window.localStorage.getItem('CURRENT_DATABASE')
export default new Vuex.Store({
  state: {
    // 用户信息
    userInfo: null,
    // 当前项目ID
    currentProject,
    // 当前数据库ID
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
      if (state.userInfo != null && state.userInfo.avatar == null) {
        state.userInfo.avatar = '/images/avatar/default.png'
      }
    },
    setCurrentProject(state, project) {
      state.currentProject = project
      window.localStorage.setItem('CURRENT_PROJECT', JSON.stringify(project))
    },
    setCurrentDatabase (state, database) {
      state.currentDatabase = database
      window.localStorage.setItem('CURRENT_DATABASE', database)
    },
    setInstallData (state, value) {
      state.installData = value
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

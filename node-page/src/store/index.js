import Vuex from 'vuex'
import {getToken} from "../api/user.token";
import {getLoginInfo, logout} from "../api/user.login";
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
    userInfo: null,
    currentProject,
    currentDatabase,
    help: {
      code: null
    }
  },
  mutations: {
    setHelpCode (state, value) {
      state.help.code = value
    },
    setUserInfo (state, value) {
      if (state.userInfo == null || value == null) {
        state.userInfo = value
        return
      }
      Object.assign(value, state.userInfo)
    },
    setCurrentProject(state, project) {
      state.currentProject = project
      window.localStorage.setItem('CURRENT_PROJECT', JSON.stringify(project))
    },
    setCurrentDatabase (state, database) {
      state.currentDatabase = database
      window.localStorage.setItem('CURRENT_DATABASE', database)
    }
  },
  actions: {
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
              })
              .catch(e => {
                console.log('get user info throw an error', e)
              })
          }
        })
        .catch(e => {
          console.log('get token throw an error', e)
        })
    }
  },
  getters: {}
})

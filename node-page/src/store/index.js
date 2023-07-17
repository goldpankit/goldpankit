import Vuex from 'vuex'
import {getToken} from "../api/user.token";
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
    // 初始化登录令牌
    initToken () {
      getToken()
        .then(data => {
          if (data != null) {
            document.cookie = `x-kit-token=${data.value};`
          }
        })
    }
  },
  getters: {}
})

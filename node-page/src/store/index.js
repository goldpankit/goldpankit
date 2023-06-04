import Vuex from 'vuex'
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
    currentDatabase
  },
  mutations: {
    setCurrentProject(state, project) {
      state.currentProject = project
      window.localStorage.setItem('CURRENT_PROJECT', JSON.stringify(project))
    },
    setCurrentDatabase (state, database) {
      state.currentDatabase = database
      window.localStorage.setItem('CURRENT_DATABASE', database)
    }
  },
  actions: {},
  getters: {}
})

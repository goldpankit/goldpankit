import Vuex from 'vuex'
let currentProject = null
const currentProjectStr = window.localStorage.getItem('CURRENT_PROJECT')
if (currentProjectStr != null) {
  currentProject = JSON.parse(currentProjectStr)
}
export default new Vuex.Store({
  state: {
    currentProject
  },
  mutations: {
    setCurrentProject(state, project) {
      state.currentProject = project
      window.localStorage.setItem('CURRENT_PROJECT', JSON.stringify(project))
    }
  },
  actions: {},
  getters: {}
})

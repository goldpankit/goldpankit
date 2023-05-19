import Vuex from 'vuex'

export default new Vuex.Store({
  state: {
    currentProject: null
  },
  mutations: {
    setCurrentProject(state, project) {
      state.currentProject = project
    }
  },
  actions: {},
  getters: {}
})

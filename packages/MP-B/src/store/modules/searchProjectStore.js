const state = {
  searchProjectList: [],
}

const mutations = {
  setSearchProjectList(state, value) {
    state.searchProjectList = value || []
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}

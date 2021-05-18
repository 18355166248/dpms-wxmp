const state = {
  searchProjectList: [],
  searchChargeList:[]
}

const mutations = {
  setSearchProjectList(state, value) {
    state.searchProjectList = value || []
  },
  setSearchChargeList(state, value) {
    state.searchChargeList = value || []
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}

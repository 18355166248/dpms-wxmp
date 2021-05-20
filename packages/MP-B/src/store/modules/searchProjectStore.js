const state = {
  searchProjectList: [],
  searchChargeList: [],
  searchMerchandiseList:[]
}

const mutations = {
  setSearchProjectList(state, value) {
    state.searchProjectList = value || []
  },
  setSearchChargeList(state, value) {
    state.searchChargeList = value || []
  },
  setSearchMerchandiseList(state, value) {
    state.searchMerchandiseList = value || []
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}

const state = {
  overdueList: [],
  overdueAmount: 0,
}

const mutations = {
  setOverdueList(state, value) {
    state.overdueList = value || []
  },
  setOverdueAmount(state, value) {
    state.overdueAmount = value || 0
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}

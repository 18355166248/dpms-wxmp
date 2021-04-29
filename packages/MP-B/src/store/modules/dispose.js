const state = {
  disposeList: [],
  receivableAmount:0,
}

const mutations = {
  setDisposeList(state, value) {
    state.disposeList = value || []
  },
  setReceivableAmount(state, value) {
    state.receivableAmount = value
  }
}

export default {
  namespaced: true,
  state,
  mutations,
}

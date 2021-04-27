const state = {
  disposeList: [],
}

const mutations = {
  setDisposeList(state, value) {
    state.disposeList = value || []
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}

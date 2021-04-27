const state = {
  patientDetail: {},
}

const mutations = {
  setPatientDetail(state, value) {
    state.patientDetail = value || {}
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}

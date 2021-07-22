const state = {
  patientDetail: {},
  memberDetail: {},
}

const mutations = {
  setPatientDetail(state, value) {
    state.patientDetail = value || {}
  },
  setMemberDetail(state, value) {
    state.memberDetail = value || {}
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}

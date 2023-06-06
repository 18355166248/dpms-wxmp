const state = {
  medicalRecordObj: null,
}

const mutations = {
  setMedicalRecordObj(state, value) {
    state.medicalRecordObj = value || null
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}

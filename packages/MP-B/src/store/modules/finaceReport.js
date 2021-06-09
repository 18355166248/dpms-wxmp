const state = {
  patientInfo: '',
  billOrderNo: '',
  parentChargeType: { parentChargeTypeIds: '', parentChargeTypeNames: '' },
  doctor: { doctorIds: '', doctorNames: '' },
  consultant: { consultantIds: '', consultantNames: '' },
}

const mutations = {
  setPatientInfo(state, value) {
    state.patientInfo = value || []
  },
  setBillOrderNo(state, value) {
    state.billOrderNo = value
  },
  setParentChargeType(state, value) {
    state.parentChargeType = value
  },
  setDoctor(state, value) {
    state.doctor = value
  },
  setConsultant(state, value) {
    state.consultant = value
  },
  clearState(state) {
    state.patientInfo = ''
    state.billOrderNo = ''
    state.parentChargeType = {
      parentChargeTypeIds: '',
      parentChargeTypeNames: '',
    }
    state.doctor = { doctorIds: '', doctorNames: '' }
    state.consultant = { consultantIds: '', consultantNames: '' }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}

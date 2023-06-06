const state = {
  patientInfo: '',
  billOrderNo: '',
  parentChargeType: { parentChargeTypeIds: '', parentChargeTypeNames: '' },
  doctor: { doctorIds: '', doctorNames: '' },
  consultant: { consultantIds: '', consultantNames: '' },
  billTypeArr: { billTypeIds: '', billTypeNames: '' },
  billSettlementArr: { billSettlementIds: '', billSettlementNames: '' },
  cashierStaff: { cashierStaffIds: '', cashierStaffNames: '' },
  payTradeTypeArr: { payTradeTypeIds: '', payTradeTypeNames: '' },
  payOrderStatusArr: { payOrderStatusIds: '', payOrderStatusNames: '' },
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
  setBillTypeArr(state, value) {
    state.billTypeArr = value
  },
  setBillSettlementArr(state, value) {
    state.billSettlementArr = value
  },
  setCashierStaff(state, value) {
    state.cashierStaff = value
  },
  setPayTradeTypeArr(state, value) {
    state.payTradeTypeArr = value
  },
  setPayOrderStatusArr(state, value) {
    state.payOrderStatusArr = value
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
    state.billTypeArr = { billTypeIds: '', billTypeNames: '' }
    state.billSettlementArr = { billSettlementIds: '', billSettlementNames: '' }
    state.cashierStaff = { cashierStaffIds: '', cashierStaffNames: '' }
    state.payTradeTypeArr = { payTradeTypeIds: '', payTradeTypeNames: '' }
    state.payOrderStatusArr = { payOrderStatusIds: '', payOrderStatusNames: '' }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}

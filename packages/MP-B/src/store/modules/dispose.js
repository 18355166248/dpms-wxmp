const state = {
  //收银台维护的处置列表
  disposeList: [],
  //选择处置收费项目维护的处置列表
  selectedDisposeList: [],
  receivableAmount: 0,
  realMainOrderDiscount: 100,
  realDiscountPromotionAmount: 0,
  // 员工下拉列表
  staffList: [],
  //收银台员工列表
  checkStandStaffList: {},
}

const mutations = {
  setDisposeList(state, value) {
    state.disposeList = value || []
  },
  setSelectedDisposeList(state, value) {
    state.selectedDisposeList = value || []
  },
  setReceivableAmount(state, value) {
    state.receivableAmount = value
  },
  setRealMainOrderDiscount(state, value) {
    state.realMainOrderDiscount = value
  },
  setRealDiscountPromotionAmount(state, value) {
    state.realDiscountPromotionAmount = value
  },
  setStaffList(state, value) {
    state.staffList = value || []
  },
  setCheckStandStaffList(state, value) {
    state.checkStandStaffList = value || {}
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}

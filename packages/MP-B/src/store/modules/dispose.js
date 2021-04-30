const state = {
  disposeList: [],
  receivableAmount:0,
  realMainOrderDiscount:100,
  realDiscountPromotionAmount:0,
}

const mutations = {
  setDisposeList(state, value) {
    state.disposeList = value || []
  },
  setReceivableAmount(state, value) {
    state.receivableAmount = value
  },
  setRealMainOrderDiscount(state, value) {
    state.realMainOrderDiscount = value
  },
  setRealDiscountPromotionAmount(state, value) {
    state.realDiscountPromotionAmount = value
  }
}

export default {
  namespaced: true,
  state,
  mutations,
}

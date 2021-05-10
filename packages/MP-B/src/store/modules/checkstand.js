const state = {
  chargeType: 1,
  billType: 2,
  itemType: 12,
}
const typeDic = {
  1: {
    billType: 2,
    itemType: 12,
  },
}
const mutations = {
  setChargeType(state, value) {
    state.chargeType = value || 1
    state.billType = typeDic[value].billType
    state.itemType = typeDic[value].itemType
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}

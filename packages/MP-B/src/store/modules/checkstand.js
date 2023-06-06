// ORDINARY_BILL(1, '普通收费', ''),
//   // 简易收费
//   SIMPLE_CHARGING(2, '普通收费', ''),
//   PET_CARD_BILL(3, '储值卡交易', ''),
//   COUPON_BILL(4, '卡券交易', ''),
//   EXCLUSIVE_CARD_BILL(5, '专享卡交易', ''),
//   // 处置收费
//   DISPOSAL_BILL(6, '普通收费', '');
//   明细收费1
const state = {
  chargeType: 1,
  billType: 2,
}
const typeDic = {
  1: {
    billType: 2,
  },
  2: {
    billType: 1,
  },
  3: {
    billType: 6,
  },
}
const mutations = {
  setChargeType(state, value) {
    state.chargeType = value || 1
    state.billType = typeDic[value].billType
  },
  setBillType(state, value) {
    state.billType = value
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}

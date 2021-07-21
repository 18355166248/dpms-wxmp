const state = {
  applyGoods: [],
  goodList: [],
}

const mutations = {
  setGoodList(state, data = []) {
    state.goodList = JSON.parse(JSON.stringify(data))
  },
  setApplyGoods(state, data) {
    state.applyGoods = data
  },
  /**
   *
   * @param {*} state
   * @param {Object} data {merchandiseId, commonName, brandName, specificationsStr, availableNum, inventoryUnitStr}
   */
  selectGood(state, data) {
    let _arr = JSON.parse(JSON.stringify(state.applyGoods))
    let index = state.applyGoods.findIndex(
      (e) => e.merchandiseId == data.merchandiseId,
    )
    if (index < 0) {
      _arr.push({ ...data, receiveNum: 1 })
    } else {
      _arr.splice(index, 1)
    }
    state.applyGoods = _arr
  },
  updateGood(state, data) {
    let _arr = JSON.parse(JSON.stringify(state.goodList))
    let index = state.goodList.findIndex(
      (e) => e.merchandiseId == data.merchandiseId,
    )
    _arr.splice(index, 1, data)
    state.goodList = _arr
  },
  deleteGood(state, data) {
    let _arr = JSON.parse(JSON.stringify(state.goodList))
    let index = state.goodList.findIndex(
      (e) => e.merchandiseId == data.merchandiseId,
    )
    _arr.splice(index, 1)
    state.goodList = _arr
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}

import billAPI from '@/APIS/bill/bill.api'
const state = {
  patientDetail: {},
  memberDetail: {},
  mainDiscountLimit: 100,
}

const mutations = {
  setPatientDetail(state, value) {
    state.patientDetail = value || {}
  },
  setMemberDetail(state, value) {
    state.memberDetail = value || {}
  },
  setMainDiscountLimit(state, value) {
    state.mainDiscountLimit = value
  },
}
const actions = {
  getMainDiscountLimit({ commit }, params) {
    return new Promise((resolve, reject) => {
      billAPI
        .getMainDiscountConfig(params)
        .then((res) => {
          if (res?.code === 0) {
            commit('setMainDiscountLimit', res?.data)
            resolve(res?.data)
          } else {
            reject(res)
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}

const state = {
  isPhoneXCeil: '', // 判断设备信息 (苹果x以上手机)
}

const mutations = {
  setIsPhoneXCeil(state, value) {
    state.isPhoneXCeil = value
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}

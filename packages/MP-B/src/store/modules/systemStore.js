const state = {
  systemScreen: '', // 判断设备信息: screen189 (苹果x以上手机)
}

const mutations = {
  setSystemScreen(state, value) {
    state.systemScreen = value
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}

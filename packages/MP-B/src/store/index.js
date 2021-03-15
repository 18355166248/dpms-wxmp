import Vue from 'vue'
import Vuex from 'vuex'
import workbenchStore from './modules/workbenchStore'
import systemStore from './modules/systemStore'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    workbenchStore,
    systemStore,
  },
})

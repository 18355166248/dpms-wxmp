import Vue from 'vue'
import Vuex from 'vuex'
import workbenchStore from './modules/workbenchStore'
import systemStore from './modules/systemStore'
import searchProjectStore from './modules/searchProjectStore'
import patient from './modules/patient'
import dispose from './modules/dispose'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    workbenchStore,
    systemStore,
    searchProjectStore,
    patient,
    dispose,
  },
})

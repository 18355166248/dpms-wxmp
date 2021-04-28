import Vue from 'vue'
import Vuex from 'vuex'
import workbenchStore from './modules/workbenchStore'
import systemStore from './modules/systemStore'
//搜索项目
import searchProjectStore from './modules/searchProjectStore'
//患者详情数据
import patient from './modules/patient'
//选择的处置项目
import dispose from './modules/dispose'
//欠费列表
import overdue from './modules/overdue'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    workbenchStore,
    systemStore,
    searchProjectStore,
    patient,
    dispose,
    overdue,
  },
})

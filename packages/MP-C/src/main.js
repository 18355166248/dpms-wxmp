import Vue from 'vue'
import App from './App'
import { toastUtil, flyUtil, commonUtil } from 'mpcommon'
import store from './store'

Vue.config.productionTip = false

Vue.prototype.$utils = { ...commonUtil, ...toastUtil, ...flyUtil }

App.mpType = 'app'

const app = new Vue({
  ...App,
  store,
})
app.$mount()

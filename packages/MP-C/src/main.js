import Vue from 'vue'
import App from './App'
import { toastUtil, flyUtil, commonUtil } from 'mpcommon'

Vue.config.productionTip = false

Vue.prototype = Object.assign(Vue.prototype, commonUtil, toastUtil, { flyUtil })

App.mpType = 'app'

const app = new Vue({
  ...App,
})
app.$mount()

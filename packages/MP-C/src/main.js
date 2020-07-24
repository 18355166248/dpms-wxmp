import Vue from 'vue'
import App from './App'
import { toastUtil } from 'mpcommon'

Vue.config.productionTip = false

Vue.prototype = Object.assign(Vue.prototype, toastUtil)

App.mpType = 'app'

const app = new Vue({
  ...App,
})
app.$mount()

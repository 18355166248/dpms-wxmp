import Vue from 'vue'
import App from './App'
import store from './store'
import { toastUtil, flyUtil, commonUtil, utils } from 'mpcommon'

Vue.config.productionTip = false

Vue.prototype.$utils = { ...commonUtil, ...toastUtil, ...flyUtil, ...utils }
Vue.prototype.$store = store

Vue.prototype.$systemInfo = uni.getSystemInfoSync()

// 公共样式配置
Vue.prototype.$commonCss = {
  commonColor: '#5cbb89',
  borderColor: 'rgba(0, 0, 0, 0.25)',
}

App.mpType = 'app'

const app = new Vue({
  ...App,
  store,
})
app.$mount()
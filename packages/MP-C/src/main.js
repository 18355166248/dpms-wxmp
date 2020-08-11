import Vue from 'vue'
import App from './App'
import { toastUtil, flyUtil, commonUtil } from 'mpcommon'
import store from './store'

Vue.config.productionTip = false

Vue.prototype.$utils = { ...commonUtil, ...toastUtil, ...flyUtil }

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

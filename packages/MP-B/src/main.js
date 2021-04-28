import Vue from 'vue'
import App from './App'
import store from './store'
import uma from './uma'
import { toastUtil, flyUtil, commonUtil, utils } from 'mpcommon'
import '@/styles/common.scss'
import './utils/filter'
import './utils/globalMixin'

import uView from 'uview-ui'
Vue.use(uView)

Vue.config.productionTip = false
Vue.use(uma)

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

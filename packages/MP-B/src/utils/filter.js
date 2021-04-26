import Vue from 'vue'
import { numberUtils } from './utils'

const filters = {
  thousandFormatter: numberUtils.thousandFormatter,
}
Object.keys(filters).forEach((k) => {
  Vue.filter(k, filters[k])
})

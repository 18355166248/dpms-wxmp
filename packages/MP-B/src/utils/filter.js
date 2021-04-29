import Vue from 'vue'
import { numberUtils } from './utils'
import moment from 'moment'
const filters = {
  //金额千分位带小数点 金额前加￥或者$符号
  thousandFormatter: numberUtils.thousandFormatter,
  //日期格式化
  filterDate(value, format = 'YYYY-MM-DD') {
    return value ? moment(value).format(format) : ''
  },
  //时间格式化
  filterTime(value, format = 'YYYY-MM-DD HH:mm:ss') {
    return value !== '-' ? moment(value).format(format) : '-'
  },
}
Object.keys(filters).forEach((k) => {
  Vue.filter(k, filters[k])
})

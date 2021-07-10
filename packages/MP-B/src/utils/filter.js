import Vue from 'vue'
import { numberUtils, getWeek } from './utils'
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
  filterWeek: getWeek,
  // 字符串截取一定长度,...拼接
  filterText(value, length = 0) {
    if (!length || value.length <= length) {
      return value
    } else {
      return value.slice(0, length) + '...'
    }
  },
}
Object.keys(filters).forEach((k) => {
  Vue.filter(k, filters[k])
})

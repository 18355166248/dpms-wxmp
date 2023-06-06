import Vue from 'vue'
import { numberUtils, getWeek } from './utils'
import moment from 'moment'
import Big from 'big.js'

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
  inventoryToThousand(price = 0, isQuantity = false, currencySymbol = '￥') {
    if (isNaN(price)) return price

    let priceString = String(price)
    const [intVal, floatVal] = priceString.split('.')
    const formattedInt = `${currencySymbol}${intVal.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ',',
    )}`

    // 如果是数量直接返回整数部分
    if (isQuantity) return formattedInt

    // 没有小数位添加'.00'并直接返回
    if (!floatVal) return `${formattedInt}.00`

    // 有小数位，根据小数位多少决定保留2位还是4位
    const formattedFloat = floatVal.replace(/(0+)$/g, '')
    const floatLen = formattedFloat.length > 2 ? 4 : 2

    // toFixed第二个参数3表示：从零开始四舍五入，ref: http://mikemcl.github.io/big.js/#dp
    const fixedPrice = Big(priceString).toFixed(floatLen, 3).valueOf()

    let [, fixedFloat] = String(fixedPrice).split('.')

    if (fixedFloat?.length === 1 || fixedFloat?.length === 3) {
      fixedFloat = `${fixedFloat}0`
    }

    return `${formattedInt}.${fixedFloat}`
  },
}
Object.keys(filters).forEach((k) => {
  Vue.filter(k, filters[k])
})

import { getStorage, STORAGE_KEY } from './storage'
import uma from 'umtrack-wx'
const Big = require('big.js')

/**
 * @desc 移除对象中有空值的属性 空值包含 undefined null
 * @param object
 */
export function omitUndefinedAndNullValue(object) {
  const keys = Object.keys(object)

  const definedMap = {}

  keys.forEach((key) => {
    const value = object[key]

    if (value === undefined || value === null) {
      return
    }

    const regEmoji = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi

    let regValue = value

    if (typeof regValue !== 'string') {
      regValue = String(regValue)
    }

    if (regEmoji.test(regValue)) {
      definedMap[key] = regValue.replace(regEmoji, '')
    } else {
      definedMap[key] = value
    }
  })

  return definedMap
}

/**
 * 自定义28位长度openid，4个固定字符+（机构号+员工号）+不定数量字符
 */
export function setCustomOpenId() {
  const medicalInstitutionId = getStorage(STORAGE_KEY.MEDICALINSTITUTION)
    ?.medicalInstitutionId
  const staffId = getStorage(STORAGE_KEY.STAFF)?.staffId
  if (medicalInstitutionId && staffId) {
    let openid = `${medicalInstitutionId}${staffId}`
    const prefix = 'DPMS' //不能修改
    let suffix =
      openid.length > 24
        ? ''
        : 'XNeUTeBcdWGMeHJGWEcGAMus'.substr(0, 24 - openid.length) //不能修改
    openid = `${prefix}${openid}${suffix}`
    uma.setOpenid(openid)
  }
}

export const numberUtils = {
  thousandFormatter(value, places = 2, sysmbol = '￥') {
    const zero = ``
    if (isNaN(value) || value === '') return zero

    if (value && value != null) {
      value = `${value}`
      let left = value.split('.')[0] // 小数点左边部分
      let right = value.split('.')[1] // 小数点右边
      // 保留places位小数点，当长度没有到places时，用0补足。
      right = right
        ? right.length >= places
          ? '.' + right.substr(0, places)
          : '.' + right + '0'.repeat(places - right.length)
        : '.' + '0'.repeat(places)
      var temp = left
        .split('')
        .reverse()
        .join('')
        .match(/(\d{1,3})/g) // 分割反向转为字符串然后最多3个，最少1个，将匹配的值放进数组返回
      return (
        (Number(value) < 0 ? '-' : '') +
        sysmbol +
        temp.join(',').split('').reverse().join('') +
        right
      ) // 补齐正负号和货币符号，数组转为字符串，通过逗号分隔，再分割（包含逗号也分割）反向转为字符串变回原来的顺序
    } else if (value === 0) {
      return `${sysmbol}0.00`
    } else {
      return zero
    }
  },
}

export function BigCalculate(value1, method, value2) {
  if (!value1) value1 = 0
  if (!value2) value2 = 0
  if (typeof value1 !== 'number') value1 = 0
  if (typeof value2 !== 'number') value2 = 0
  if (method === '+') {
    return Number(Big(value1).plus(Number(value2)))
  } else if (method === '-') {
    return Number(Big(value1).minus(Number(value2)))
  } else if (method === '*') {
    return Number(Big(value1).times(Number(value2)))
  } else if (method === '/') {
    return Number(Big(value1).div(Number(value2)))
  }
}

export function changeTwoDecimal(params, precision = 2) {
  if (typeof params !== 'number') params = Number(params)
  if (params < 0.01) params = 0.01 // 计算金额精度最小值为0.01
  return Number(params.toFixed(precision))
}

import { getStorage, setStorage, STORAGE_KEY } from './storage'
import uma from 'umtrack-wx'
import moment from 'moment'
import statisticsAPI from '../APIS/statistics.api'
import qs from 'qs'

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

    const regEmoji = /(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55]/gi

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
    if (!value && places === 0) return `${sysmbol}${value}`
    const zero = ``
    if (isNaN(value) || value === '') return zero

    if (value && value != null) {
      value = `${value}`
      let left = value.split('.')[0] // 小数点左边部分
      let right = value.split('.')[1] // 小数点右边
      // 保留places位小数点，当长度没有到places时，用0补足。
      right = right
        ? right.length > places
          ? '.' + right.substr(0, places)
          : '.' + right + '0'.repeat(places - right.length)
        : places > 0
        ? '.' + '0'.repeat(places)
        : ''
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
  if (params < 0.01 && params > 0) params = 0.01 // 计算金额精度最小值为0.01
  return Number(params.toFixed(precision))
}

// 根据时间戳返回周一～周日，星期几
export function getWeek(date) {
  // 参数时间戳
  let week = moment(date).day()
  switch (week) {
    case 1:
      return '周一'
    case 2:
      return '周二'
    case 3:
      return '周三'
    case 4:
      return '周四'
    case 5:
      return '周五'
    case 6:
      return '周六'
    case 0:
      return '周日'
  }
}

/**
 * 查看从企微启动的机构id和当前是否一致
 * @param {*} params 页面的onLoad参数
 */
export function checkQwInstitution() {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]

  const { isqywx, qwMedicalInstitutionId } = currentPage.options
  const systemInfo = uni.getSystemInfoSync()
  const isWxWork = systemInfo?.environment === 'wxwork'
  if (isqywx || isWxWork) {
    statisticsAPI.log({
      route: currentPage.route,
      options: currentPage.options,
    })
    const fullPath = `/${currentPage.route}?${qs.stringify(
      currentPage.options,
    )}`
    setStorage(STORAGE_KEY.QW_ENTRY_FULL_PATH, fullPath)
    if (qwMedicalInstitutionId) {
      const medicalInstitution = getStorage(STORAGE_KEY.MEDICALINSTITUTION)
      const mId = Number(qwMedicalInstitutionId)
      if (mId !== medicalInstitution?.medicalInstitutionId) {
        uni.redirectTo({ url: '/pages/login/qyLogin' })
      }
    }
  }
}

// 有效期 （根据 用券日期 不同做不用的处理）
export function getValidity(record) {
  let str = '-'
  if (
    record.effectiveDays &&
    record.effectiveDays !== -1 &&
    record.effectiveTimeType === 1
  ) {
    str = `领用当日起，${record.effectiveDays}天内可用`
  } else if (
    record.effectiveBeginTime &&
    record.effectiveEndTime &&
    record.effectiveTimeType === 3
  ) {
    const begin = moment(record.effectiveBeginTime).format('YYYY-MM-DD')
    const end = moment(record.effectiveEndTime).format('YYYY-MM-DD')
    str = `${begin}~${end}`
  }
  return str
}

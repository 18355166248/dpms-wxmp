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

export function setStorage(key, value) {
  uni.setStorageSync(key, value)
}

export function getStorage(key) {
  return uni.getStorageSync(key)
}

export function removeStorage(key) {
  uni.removeStorageSync(key)
}

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

    definedMap[key] = value
  })

  return definedMap
}

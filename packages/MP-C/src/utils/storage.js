// 定义store的key常量
const STORAGE_KEY = {
  // 访问token
  ACCESS_TOKEN: 'access_token',
  // 机构信息
  MEDICALINSTITUTION: 'medicalInstitution',
  // 用户信息
  STAFF: 'staff',
  // 枚举值
  ENUMS: 'enums',
  // openid
  OPENID: 'openid',
}

export { STORAGE_KEY }

export function setStorage(key, value) {
  uni.setStorageSync(key, value)
}

export function getStorage(key) {
  return uni.getStorageSync(key)
}

export function removeStorage(key) {
  uni.removeStorageSync(key)
}

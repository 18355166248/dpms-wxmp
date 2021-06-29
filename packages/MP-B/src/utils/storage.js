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
  // 登录时会员和用户名
  LOGIN_INFO: 'loginInfo',
  // 预约视图设置
  APPTSETTING: 'apptSetting',
  //scrm菜单
  MENU: 'menu',
  ENV: 'env',
  // 企微侧边栏进入的第一个页面
  QW_ENTRY_FULL_PATH: 'qwEntryFullPath',
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

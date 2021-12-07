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
  // 登录类型  1 微信一键登录  2  账号密码登录   （默认为 账号密码登录）
  LOGIN_TYPE: 'loginType',
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

// 通过机构区分缓存信息
export function setStorage_MI(key, value) {
  const medicalInstitution = getStorage(STORAGE_KEY.MEDICALINSTITUTION)
  key = key + '_' + (medicalInstitution?.medicalInstitutionId || '')
  console.log('setStorage_MI', key)
  return setStorage(key, value)
}

export function getStorage_MI(key) {
  const medicalInstitution = getStorage(STORAGE_KEY.MEDICALINSTITUTION)
  key = key + '_' + (medicalInstitution?.medicalInstitutionId || '')
  console.log('getStorage_MI', key)
  return getStorage(key)
}

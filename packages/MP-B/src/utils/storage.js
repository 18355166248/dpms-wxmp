// 定义store的key常量
const STORAGE_KEY = {
  // 访问token
  TOKEN: 'token',
  // 用户openId
  OPEN_ID: 'openId',
  // 用户小程序信息
  USER_INFO: 'USER_INFO',
}

/** 微信本地store */
class Storage {
  // 设置本地缓存key，data
  static setStorageData(key, data) {
    wx.setStorageSync(key, data)
  }

  // 获取本地缓存的key
  static getStorageData(key) {
    return wx.getStorageSync(key)
  }

  // 删除本地缓存的key
  static removeStorageData(key) {
    wx.removeStorageSync(key)
  }
}

// 导出store api
export default Storage
export { STORAGE_KEY }

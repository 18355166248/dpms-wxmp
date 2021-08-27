import httper from './http'
import scrmHttper from './httpScrm'
import { getStorage, STORAGE_KEY } from '@/utils/storage'
const systemAPI = {
  // 获取全局枚举值
  getDataDict(params) {
    return httper.get('system/enums', params)
  },

  //获得scrm权限
  menuAll(params) {
    return scrmHttper.get('scrm/system/menu-all', params)
  },

  // 登录时获取机构列表
  getInstitutionListScrm(params) {
    const loginType = Number(getStorage(STORAGE_KEY.LOGIN_TYPE) || 2)
    if (loginType === 1) {
      return new Promise((resolve, reject) => {
        wx.login({
          success: ({ code }) => {
            resolve(code)
          },
          fail(...args) {
            uni.showToast({
              icon: 'none',
              title: '登录失败',
            })
            reject(args)
          },
        })
      })
        .then((code) => {
          return scrmHttper.get('/scrm/auth/check-wx-code', { code })
        })
        .then((res) => {
          if (res.data.checkStatus === 1) {
            return Promise.resolve({
              data: res.data.medicalInstitutionItems,
            })
          } else if (res.data.checkStatus === 2) {
            wx.navigateTo({
              url: '/pages/login/wxLogin',
            })
          } else {
            uni.showToast({
              icon: 'none',
              title: '无可登录机构',
            })
          }
        })
    } else {
      return scrmHttper.get('scrm/institution/hierarchies', params)
    }
  },

  // 登录时获取机构列表
  getInstitutionList(params) {
    return httper.get(
      'institution/medical-institution/detail-child-member-code',
      params,
    )
  },

  // 根据用户名获取当前可登录机构
  getLoginInstitutionList(params) {
    return httper.get('institution/staff/detail-login', params)
  },

  //获取登陆信息
  getLoginInfo(params) {
    return scrmHttper.post('scrm/auth/medical-Info', params)
  },

  //微信一键登录-获取机构
  getCheckWxCode(params) {
    return scrmHttper.get('/scrm/auth/check-wx-code', params)
  },

  //微信一键登录-登录
  getLoginWxCode(params) {
    return scrmHttper.get('/scrm/auth/login-wx-code', params)
  },

  // 获取oss参数
  getOssParam(params) {
    return httper.get('institution/oss/param', params)
  },

  // 通过key获取url
  getOssUrl(params) {
    return httper.get('institution/oss/url', params)
  },

  // 获取常用功能列表
  getCommonFunsList(params) {
    return scrmHttper.get('/scrm/system/mina-menus', params)
  },
  // /api/common/staff/configs
  getCommonFunsConfig(params) {
    return scrmHttper.get('/common/staff/configs', params)
  },
  updateSelectMenus(data) {
    return scrmHttper.put('/common/staff/configs', data, {
      headers: {
        'content-type': 'application/json',
      },
    })
  },
}

export default systemAPI

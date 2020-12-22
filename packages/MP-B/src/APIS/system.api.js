import httper from './http'
import scrmHttper from './httpScrm'

const systemAPI = {
  // 获取全局枚举值
  getDataDict(params) {
    return httper.get('system/enums', params)
  },

  //获得scrm权限
  menuAll() {
    return scrmHttper.get('system/menu-all', params)
  },

  // 登录时获取机构列表
  getInstitutionListScrm(params) {
    return scrmHttper.get('scrm/institution/hierarchies', params)
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

  // 获取oss参数
  getOssParam(params) {
    return httper.get('institution/oss/param', params)
  },

  // 通过key获取url
  getOssUrl(params) {
    return httper.get('institution/oss/url', params)
  },
}

export default systemAPI

import httper from './http'

const systemAPI = {
  // 获取全局枚举值
  getDataDict(params) {
    return httper.get('system/enums', params)
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
}

export default systemAPI

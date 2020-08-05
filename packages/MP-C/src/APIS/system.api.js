import httper from './http'

export default {
  getAccessToken() {
    return httper.get('institution-customer/token')
  },
  getInstitution(param) {
    return httper.get('institution-customer/institution-info', param)
  },
  // 获取全局枚举值
  getDataDict(params) {
    return httper.get('system/enums', params, { isNoNeedAuth: true })
  },
}

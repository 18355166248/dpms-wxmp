import httper from '../http'

export default {
  wxLogin(data) {
    return httper.post('institution-customer/login/by-wechat', data)
  },
  phoneLogin(data) {
    return httper.post('institution-customer/login/by-phone', data)
  },
  getOpenid(param) {
    return httper.get('institution-customer/open-id', param)
  },
  getVerifyCode(param) {
    return httper.get('institution-customer/verify-code', param)
  },
}
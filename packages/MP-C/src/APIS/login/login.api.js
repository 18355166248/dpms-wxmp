import httper from '../http'

export default {
  wxLogin(data) {
    return httper.post('institution-customer/login/by-wechat', data)
  },
  phoneLogin(data) {
    return httper.post('institution-customer/login/by-phone', data)
  }
}
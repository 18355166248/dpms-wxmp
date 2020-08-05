import httper from './http'

export default {
  getAccessToken() {
    return httper.get('institution-customer/token')
  },
  getInstitution(param) {
    return httper.get('institution-customer/institution-info', param)
  },
}

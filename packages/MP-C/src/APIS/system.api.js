import httper from './http'

export default {
  getAccessToken() {
    return httper.get('institution-customer/token')
  }
}
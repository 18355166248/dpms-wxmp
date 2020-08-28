import httper from '../http'

export default {
  getCoupons(data) {
    return httper.get('institution-customer/coupon/mini-apps/select-member-coupon', data)
  }
}
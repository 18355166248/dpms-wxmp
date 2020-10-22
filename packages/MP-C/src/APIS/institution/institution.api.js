import httper from '../http'

const institutionAPI = {
  getInstitutionInfo(data) {
    return httper.get('institution-customer/home-page/institution-info', data)
  },
  getProjList(data) {
    return httper.get('institution-customer/home-page/item/list', data)
  },
  getStoreList(data) {
    return httper.get(
      '/institution-customer/home-page/appointment/institution/select/list',
      data,
    )
  },
  getFilterStoreList(data) {
    return httper.get(
      '/institution-customer/home-page/institution/list/all',
      data,
    )
  },
  getInnerProjList(data) {
    return httper.get(
      '/institution-customer/home-page/appointment/item/select/list',
      data,
    )
  },
  getInnerDocList(data) {
    return httper.get(
      '/institution-customer/home-page/appointment/doctor/select/list',
      data,
    )
  },
  getProjDetail(data) {
    return httper.get('/institution-customer/home-page/item/detail', data)
  },
  getDocDetail(data) {
    return httper.get('/institution-customer/home-page/doctor/detail', data)
  },
  checkPorjCanAptmt(data) {
    return httper.get(
      '/institution-customer/home-page/item/appointment/check',
      data,
    )
  },
  checkDocCanAptmt(data) {
    return httper.get(
      '/institution-customer/home-page/doctor/appointment/check',
      data,
    )
  },
  getNotice(data) {
    return httper.get('/institution-customer/home-page/announcement', data)
  },
  getCouponCenterList(data) {
    return httper.get(
      '/institution-customer/coupon/mini-apps/select-coupon',
      data,
    )
  },
  drawCoupon(data) {
    return httper.post(
      '/institution-customer/coupon/mini-apps/receive-coupon',
      data,
    )
  },
}

export default institutionAPI

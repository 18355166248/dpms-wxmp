import httper from '../http'

export default {
  getDoctorList(data) {
    return httper.get('institution-customer/home-page/appointment/doctor/select/list', {
      size: 1000, current: 1, ...data,
    })
  },
  getItemList(data) {
    return httper.get('institution-customer/home-page/appointment/item/select/list', {
      size: 1000, current: 1, ...data,
    })
  },
}
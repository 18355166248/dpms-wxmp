import httper from '../http'

export default {
  getDoctorList(data) {
    return httper.get(
      'institution-customer/home-page/appointment/doctor/select/list',
      {
        size: 1000,
        current: 1,
        ...data,
      },
    )
  },
  getItemList(data) {
    return httper.get(
      'institution-customer/home-page/appointment/item/select/list',
      {
        size: 1000,
        current: 1,
        ...data,
      },
    )
  },
  // 获取人员列表
  getPersonnelList(data) {
    return httper.get('institution-customer/personnel/list', data)
  },
  // 获取门店信息
  getShopDetail(data) {
    return httper.post('institution-customer/shop/detail', data)
  },
  // 新建预约
  creatAppt(data) {
    return httper.post('institution-customer/online-appointment/create', data)
  },
  // 获取医生可预约时间
  getTime(data) {
    return httper.get(
      'institution-customer/online-appointment/get-available-schedule-time',
      data,
    )
  },
  // 修改预约
  updateAppt(data) {
    return httper.post('institution-customer/online-appointment/update', data)
  },
}

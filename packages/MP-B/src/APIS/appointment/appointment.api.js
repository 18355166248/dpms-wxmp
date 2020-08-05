import httper from '../http'

const appointmentAPI = {
  // 预约项目
  getAppointmentItemList(params) {
    return httper.get('appointment/settings/appointment-item/list', params)
  },
  // 预约校验
  getAppointmentVerify(data) {
    return httper.post('appointment/appointment/verify', data)
  },
  createAppointment(data) {
    return httper.post('appointment/appointment/create', data)
  },
  updateAppointment(data) {
    return httper.post('appointment/appointment/update', data)
  },
  // 获取预约详情
  getAppointmentDetail(params) {
    return httper.get('appointment/appointment/detail', params)
  },
  getAppointmentViewListFromStaff(params) {
    return httper.get(
      'appointment/appointment-view/list/staff-position',
      params,
    )
  },
}

export default appointmentAPI

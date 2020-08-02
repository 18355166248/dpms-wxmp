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
}

export default appointmentAPI

import httper from '../http'

const appointmentAPI = {
  // 预约项目
  getAppointmentItemList(params) {
    return httper.get('appointment/settings/appointment-item/list', params)
  },
}

export default appointmentAPI

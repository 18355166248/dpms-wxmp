import httper from '../http'

export default {
  getInstitutionInfo(data) {
    return httper.get('institution-customer/home-page/institution-info', data)
  },
  getAppointmentList(param) {
    return httper.get(
      'institution-customer/online-appointment/select-online-appointment-list',
      param,
    )
  },
  getAppointmentDetail(param) {
    return httper.get(
      'institution-customer/online-appointment/detail-online-appointment',
      param,
    )
  },
  deleteAppointment(param) {
    return httper.get('institution-customer/online-appointment/cancel', param)
  },
}

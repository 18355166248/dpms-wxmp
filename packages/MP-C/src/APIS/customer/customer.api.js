import httper from '../http'

export default {
  getCustomerList(param) {
    return httper.get('institution-customer/personnel/list', param)
  },
  sentSms(param) {
    return httper.get('institution-customer/personnel/send-sms', param)
  },
  getPersonCount(param) {
    return httper.get('institution-customer/personnel/count', param)
  },
  getAppointCount(param) {
    return httper.get(
      'institution-customer/online-appointment/select-online-appointment-info',
      param,
    )
  },
  logOut(param) {
    return httper.get('institution-customer/logout', param)
  },
  userDetail(param) {
    return httper.get('institution-customer/user/mini-apps/detail', param)
  },
  getMemberDetails(param) {
    return httper.get(
      'institution-customer/user/mini-apps/select/member-details',
      param,
    )
  },
  needVerify(param) {
    return httper.get(
      'institution-customer/personnel/check/if-need-verify',
      param,
    )
  },
  creatCustomer(data) {
    return httper.post('institution-customer/personnel/create', data)
  },
  deleteCustomer(data) {
    return httper.post('institution-customer/personnel/delete', data)
  },
  updateCustomer(data) {
    return httper.post('institution-customer/personnel/update', data)
  },
}

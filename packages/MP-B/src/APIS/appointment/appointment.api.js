import httper from '../http'

const appointmentAPI = {
  // 预约项目
  getAppointmentItemList(params) {
    return httper.get('appointment/settings/appointment-item/list', params)
  },
  // 预约校验
  getAppointmentVerify(data) {
    return httper.post('appointment/appointment/mini-apps/verify', data)
  },
  //新建预约
  createAppointment(data) {
    return httper.post('appointment/appointment/mini-apps/create', data)
  },
  //预约更新
  updateAppointment(data) {
    return httper.post('appointment/appointment/mini-apps/update', data)
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
  // 预约状态修改
  updateAppointmentStatus(data) {
    return httper.post('appointment/appointment/update/status', data)
  },
  // 获取预约视图总部/大区时 诊所选择的值
  getLastAccessMedicalInstitution(params) {
    return httper.get(
      'appointment/appointment/select-last-access-medical-institution',
      params,
    )
  },
  // 预约视图总部/大区时 更改诊所时, 传给后端
  updateAccessMedicalInstitution(data) {
    return httper.post(
      'appointment/appointment/chang-staff-access-record',
      data,
    )
  },
  //获得block事件
  getApptBlockListByStaff(params) {
    return httper.get(
      'appointment/block-event/mini-apps/select-block-event-by-business-ids',
      params,
    )
  },
  //获取预约视图设置
  getSetting() {
    return httper.get('appointment/appointment-view/setting/detail')
  },
  //确认预约
  confirmAppointmentStatus(params) {
    return httper.get('appointment/appointment/confirm_appointment', params)
  },
  //取消确认
  confirmBackToAppointment(data) {
    return httper.post(
      'appointment/appointment/update/status/cancel-confirm',
      data,
      {
        headers: {
          'content-type': 'application/json',
        },
      },
    )
  },
}

export default appointmentAPI

import httper from '../http'

const authAPI = {
  getPatientList(data) {
    return httper.get('patient/patient/page', data)
  },
  getPatientTags(data) {
    return httper.get('patient/patient/list/patient-tags', data)
  },
  details(data) {
    return httper.get('institution/current/details', data)
  },
  // 诊室
  getConsultationRoomList(params) {
    return httper.get('institution/institution-consulting-room/list', params)
  },
  // 获取员工信息 positions => 医生:2 --- 洁牙师:3 --- 咨询师:4 --- 助理:5 --- 护士:6
  // workStatus: STAFF_STATUS_ENUM.STAFF_STATUS_AT_WORK_NAME.value
  getStaffMapThroughPosition(params) {
    return httper.get('institution/staff/group/position', params)
  },
  // 预约项目
  getAppointmentItemList(httpInstance, params) {
    return httpInstance.get(
      'appointment/settings/appointment-item/list',
      params,
    )
  },
}

export default authAPI

import httper from '../http'

const authAPI = {
  getPatientList(data) {
    return httper.get('patient/patient/page', data)
  },
  //获取患者类型列表
  getPatientTypeList(data) {
    return httper.get('patient/settings/type/list/regular', data)
  },
  //获取用户画像列表
  getPatientTags(data) {
    return httper.get('patient/patient/list/patient-tags', data)
  },
  //检查患者是否在scrm系统中
  getPatientInScrm(data) {
    return httper.get('patient/patient/check/patient-in-scrm', data)
  },
  //新建患者
  createPatient(data) {
    return httper.post('patient/patient/create/with/patient-contact', data)
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
}

export default authAPI

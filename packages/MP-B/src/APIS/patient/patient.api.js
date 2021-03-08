import httper from '../http'
import scrmHttper from '../httpScrm'

const patientAPI = {
  getPatientList(data) {
    return httper.get('patient/patient/mini-apps/page', data, {
      headers: {
        'content-type': 'application/json',
      },
    })
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
  // 诊室
  getConsultationRoomList(params) {
    return httper.get('institution/institution-consulting-room/list', params)
  },
  // 获取员工信息 positions => 医生:2 --- 洁牙师:3 --- 咨询师:4 --- 助理:5 --- 护士:6
  // workStatus: STAFF_STATUS_ENUM.STAFF_STATUS_AT_WORK_NAME.value
  getStaffMapThroughPosition(params) {
    return httper.get('institution/staff/group/position', params)
  },
  // 获取患者信息
  getPatientDetail(data) {
    return httper.get('patient/patient/mini-apps/detail', data)
  },
  // 更新患者信息
  updatePatient(data) {
    return httper.post('patient/patient/update/with/patient-contact', data)
  },
  // 查询患者的预约记录
  getApptList(data) {
    return httper.get('appointment/appointment/list-patient', data)
  },
  //获取患者类型列表
  getPatientMedicalRecordNo(data) {
    return httper.get('/patient/serial/medical-record/serial', data)
  },
  //查询病例模板
  getMedicalTemplateTypes(data) {
    return httper.get(
      'patient/settings/medical-record/template-type/select',
      data,
    )
  },
  //查询病例模板内容
  getMedicalTemplates(data) {
    return httper.get('/patient/settings/medical-record/template/select', data)
  },
  //添加标签
  addTag(data) {
    return scrmHttper.post('/scrm/tag/add', data)
  },
}

export default patientAPI

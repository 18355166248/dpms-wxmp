import httper from '../http'

const diagnosisAPI = {
  // 今日工作
  getTodayWorkStatistics(data) {
    return httper.get('diagnosis/register-stat/today-work', data)
  },
  // 今日就诊-前台 列表
  getTodayReceptionistList(data) {
    return httper.get('diagnosis/register/page-receptionist', data)
  },

  // 今日就诊-医生 列表
  getTodayDoctorList(data) {
    return httper.get('diagnosis/register/page-doctor', data)
  },

  // 今日就诊-咨询
  getTodayConsultant(data) {
    return httper.get('diagnosis/register/page-consultant', data)
  },

  // 取消挂号
  cancleTodayWorkRegister(data) {
    return httper.post('diagnosis/register/update-status', data)
  },
  // 新建挂号
  createNewRegister(data) {
    return httper.post('diagnosis/register/create', data)
  },
  // 挂号
  createRegister(data) {
    return httper.post('diagnosis/register/create-with-appointment', data)
  },
  // 修改患者状态
  updateRegisterStatus(data) {
    return httper.post('diagnosis/register/update-status', data)
  },
  // 查询就诊记录
  getRegisterList(data) {
    return httper.get('diagnosis/register/list-patient', data)
  },
  // 获取影像相关的枚举
  getImageEnums(data) {
    return httper.get(
      'diagnosis/mini-apps/teeth-image/get-all-image-enums',
      data,
    )
  },
  // 影像上传
  saveImageInfo(data) {
    return httper.post('diagnosis/mini-apps/teeth-image/upload', data)
  },
  // 获取影像列表
  getImageList(data) {
    return httper.get('diagnosis/mini-apps/teeth-image/list', data)
  },
  // 分页查询电子病历列表
  getMedicalRecordList(data) {
    return httper.get('diagnosis/mini-apps/medical-record/page', data)
  },
  // 查询电子病历详情
  getMedicalRecordDetail(data) {
    return httper.get('diagnosis/mini-apps/medical-record/detail', data)
  },
  // 删除电子病历
  deleteMedicalRecord(data) {
    return httper.get('diagnosis/mini-apps/medical-record/delete', data)
  },
  // 新建病历
  createMedicalRecord(data) {
    return httper.post('diagnosis/mini-apps/medical-record/create', data)
  },
  // 编辑病历
  updateMedicalRecord(data) {
    return httper.post('diagnosis/mini-apps/medical-record/update', data)
  },
  // 获取历史病例
  getMedicalHistories(data) {
    return httper.get('diagnosis/medical-record/list/history', data)
  },
  //获取强弱流程
  getWeakFlow(data) {
    return httper.get('diagnosis/medical-record-config/detail', data)
  },
}

export default diagnosisAPI

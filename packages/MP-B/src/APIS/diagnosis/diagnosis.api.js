import httper from '../http'

const diagnosisAPI = {
  // 获取当前登录员工在病历审批中的角色
  getRole(data) {
    return httper.get('diagnosis/medical-records/approve-configs/role', data)
  },
  //病历审批
  medicalRecords(data) {
    return httper.post(`diagnosis/medical-records/approve`, data)
  },
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
    return httper.get('diagnosis/teeth-image/list', data)
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
  //回退预约
  registerUpdateStatus(data) {
    return httper.post('diagnosis/register/update-status/back', data)
  },
  //更新今日工作状态
  updateRegisterStatusForward(data) {
    return httper.post('diagnosis/register/update-status/forward', data)
  },
  //影像医嘱项目
  getSettingsItem(data) {
    return httper.get(
      'diagnosis/settings/diagnosis_settings_image_item/list-search',
      data,
    )
  },
  //删除影像
  deleteImageItem(data) {
    return httper.post('diagnosis/teeth-image/delete', data)
  },
  //修改影像
  updateImageItem(data) {
    return httper.post('diagnosis/teeth-image/update', data)
  },
  // 批量删除影像
  batchDeleteImages(data) {
    return httper.post('diagnosis/teeth-image/delete/batch', data)
  },
  // 批量update影像
  batchUpdateImageItem(data) {
    return httper.post('diagnosis/teeth-image/update/batch', data)
  },
  // 获得主诉列表
  getMainComplaint(data) {
    return httper.get('diagnosis/patient-main-complaint/list', data)
  },
  getTreatmentTypes(params) {
    return httper.get('diagnosis/treatment-type/list', params)
  },
  // 获取挂号次数
  getRegisterCount(params) {
    return httper.get('diagnosis/register/list-patient/count', params)
  },
}

export default diagnosisAPI
